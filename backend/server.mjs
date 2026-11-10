/**
 * @file server.mjs
 * @description Standalone Node.js server for BloodLink AI backend on port 8000.
 * Provides instant local execution with zero additional dependencies, serving
 * the exact API endpoints specified by the FastAPI application:
 * - POST /api/ai/parse-request (Gemini 2.5 Flash NLP triage)
 * - POST /api/donors/register (Donor registration)
 * - GET  /api/inventory (Live blood stock)
 * - POST /api/requests & GET /api/requests (Emergency requests queue)
 * - POST /api/ai/chat (Conversational assistant)
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from backend/.env or root .env
function loadEnv() {
  const envPaths = [
    path.join(__dirname, '.env'),
    path.join(__dirname, '..', '.env')
  ];

  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      try {
        const content = fs.readFileSync(envPath, 'utf8');
        content.split('\n').forEach(line => {
          const trimmed = line.trim();
          if (trimmed && !trimmed.startsWith('#')) {
            const idx = trimmed.indexOf('=');
            if (idx !== -1) {
              const key = trimmed.substring(0, idx).trim();
              const val = trimmed.substring(idx + 1).trim().replace(/^["']|["']$/g, '');
              if (!process.env[key]) {
                process.env[key] = val;
              }
            }
          }
        });
      } catch (e) {
        // Continue if unreadable
      }
    }
  }
}

loadEnv();

const PORT = process.env.PORT || 8000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';

// In-memory data storage (mirrors Supabase mock)
const donors = [
  { id: 'donor-1', name: 'Amit Verma', blood_group: 'O+', location: 'Noida Sector 62', contact: '9876543210' },
  { id: 'donor-2', name: 'Priya Sharma', blood_group: 'A+', location: 'Civil Lines, Delhi', contact: '9876543211' },
  { id: 'donor-3', name: 'Rahul Gupta', blood_group: 'B-', location: 'Connaught Place', contact: '9876543212' }
];

const bloodRequests = [];

const inventory = [
  { blood_group: 'A+', current_stock: 45, minimum_required: 50, days_until_expiry: 10 },
  { blood_group: 'A-', current_stock: 8, minimum_required: 30, days_until_expiry: 2 },
  { blood_group: 'B+', current_stock: 78, minimum_required: 35, days_until_expiry: 15 },
  { blood_group: 'B-', current_stock: 5, minimum_required: 20, days_until_expiry: 1 },
  { blood_group: 'AB+', current_stock: 22, minimum_required: 15, days_until_expiry: 18 },
  { blood_group: 'AB-', current_stock: 3, minimum_required: 10, days_until_expiry: 4 },
  { blood_group: 'O+', current_stock: 92, minimum_required: 60, days_until_expiry: 20 },
  { blood_group: 'O-', current_stock: 12, minimum_required: 40, days_until_expiry: 3 }
];

// Helper to send JSON responses with CORS headers
function sendJson(res, statusCode, data) {
  const payload = JSON.stringify(data);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Content-Length': Buffer.byteLength(payload)
  });
  res.end(payload);
}

// Helper to parse JSON body from incoming stream
function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1e6) req.destroy(); // 1MB payload ceiling
    });
    req.on('end', () => {
      if (!body || !body.trim()) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        try {
          const unescaped = body.replace(/\\"/g, '"').replace(/^["']|["']$/g, '');
          resolve(JSON.parse(unescaped));
        } catch {
          resolve({});
        }
      }
    });
    req.on('error', () => resolve({}));
  });
}

// Fallback emergency extraction regex
function fallbackParseQuery(query) {
  const bloodMatch = query.match(/\b(A|B|AB|O)[+-]\b/i);
  const urgencyMatch = query.match(/\b(critical|urgent|urgently|emergency|immediately|asap)\b/i);
  const locationMatch = query.match(/(?:in|at|near|around)\s+([A-Za-z0-9\s,.-]+?)(?:\s+(?:for|urgent|urgently|need|today)|$)/i);

  return {
    blood_group: bloodMatch ? bloodMatch[0].toUpperCase() : 'A+',
    location: locationMatch ? locationMatch[1].trim() : 'Civil Lines',
    urgency_level: urgencyMatch ? 'emergency' : 'urgent',
    patient_notes: query,
    raw_query: query
  };
}

// Call Google Gemini API to parse emergency text
async function parseWithGemini(query) {
  if (!GEMINI_API_KEY || GEMINI_API_KEY.includes('your_')) {
    return fallbackParseQuery(query);
  }

  try {
    const prompt = `You are a medical emergency triage assistant for BloodLink AI.
Analyze the following blood emergency request query and extract structured JSON information.

Query: "${query}"

Return ONLY a valid JSON object with the following fields:
- blood_group: Extracted blood group (e.g., "A+", "O-", "B+"). If not specified, return null.
- location: Extracted hospital, city, or geographic area. If not specified, return null.
- urgency_level: Must be one of ["emergency", "urgent", "normal"]. "emergency" for immediate/life-threatening.
- patient_notes: Any clinical details, units needed, or conditions mentioned.

Do not include Markdown backticks or any conversational text. Return only the JSON object.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' }
      })
    });

    if (response.ok) {
      const result = await response.json();
      const rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
        const cleaned = rawText.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        return {
          blood_group: parsed.blood_group || null,
          location: parsed.location || null,
          urgency_level: parsed.urgency_level || 'emergency',
          patient_notes: parsed.patient_notes || query,
          raw_query: query
        };
      }
    }
  } catch (err) {
    console.warn('Gemini API call failed, falling back to heuristic parsing:', err.message);
  }

  return fallbackParseQuery(query);
}

// Server Request Handler
const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
    });
    res.end();
    return;
  }

  try {
    // Root status
    if (pathname === '/' && method === 'GET') {
      return sendJson(res, 200, {
        status: 'online',
        service: 'BloodLink AI Backend API',
        version: '1.0.0',
        gemini_model: 'gemini-2.5-flash',
        endpoints: [
          '/api/ai/parse-request',
          '/api/donors/register',
          '/api/inventory',
          '/api/requests',
          '/api/ai/chat'
        ]
      });
    }

    // POST /api/ai/parse-request
    if (pathname === '/api/ai/parse-request' && method === 'POST') {
      const body = await parseBody(req);
      const query = body.query;
      if (!query || !query.trim()) {
        return sendJson(res, 400, { detail: 'Field "query" is required' });
      }

      const parsed = await parseWithGemini(query);
      return sendJson(res, 200, parsed);
    }

    // POST /api/donors/register
    if (pathname === '/api/donors/register' && method === 'POST') {
      const body = await parseBody(req);
      if (!body.name || !body.blood_group || !body.location || !body.contact) {
        return sendJson(res, 400, { detail: 'Missing required donor registration fields' });
      }

      const newDonor = {
        id: `donor-${Date.now()}`,
        name: body.name,
        blood_group: body.blood_group,
        location: body.location,
        contact: body.contact,
        registered_at: new Date().toISOString()
      };

      donors.push(newDonor);
      return sendJson(res, 201, {
        status: 'success',
        donor_id: newDonor.id,
        name: newDonor.name,
        blood_group: newDonor.blood_group,
        location: newDonor.location,
        contact: newDonor.contact,
        registered_at: newDonor.registered_at,
        message: 'Donor registered successfully'
      });
    }

    // GET /api/inventory
    if (pathname === '/api/inventory' && method === 'GET') {
      return sendJson(res, 200, inventory);
    }

    // GET /api/requests
    if (pathname === '/api/requests' && method === 'GET') {
      return sendJson(res, 200, bloodRequests);
    }

    // POST /api/requests
    if (pathname === '/api/requests' && method === 'POST') {
      const body = await parseBody(req);
      const requestRecord = {
        request_id: `ER-${Date.now().toString().slice(-6)}`,
        patient_name: body.patient_name || 'Emergency Patient',
        blood_group: body.blood_group,
        units_needed: body.units_needed || 1,
        hospital_name: body.hospital_name || 'Emergency Center',
        location: body.location || 'Local District',
        urgency_level: body.urgency_level || 'emergency',
        contact_phone: body.contact_phone || '108',
        status: 'dispatched',
        created_at: new Date().toISOString()
      };
      bloodRequests.push(requestRecord);
      return sendJson(res, 201, requestRecord);
    }

    // POST /api/ai/chat
    if (pathname === '/api/ai/chat' && method === 'POST') {
      const body = await parseBody(req);
      const message = body.message || '';
      return sendJson(res, 200, {
        reply: `Thank you for reaching out to BloodLink AI. We have logged your query regarding: "${message}". If this is an immediate life-threatening emergency, please dial 108 immediately.`,
        triage_category: 'inquiry',
        status: 'success'
      });
    }

    // Not found
    return sendJson(res, 404, { detail: `Route ${method} ${pathname} not found` });
  } catch (error) {
    console.error('API Server Error:', error);
    return sendJson(res, 500, { detail: 'Internal server error', error: error.message });
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n======================================================`);
  console.log(`🚀 BloodLink AI Backend Server running at http://localhost:${PORT}`);
  console.log(`🔌 Endpoints:`);
  console.log(`   - POST http://localhost:${PORT}/api/ai/parse-request`);
  console.log(`   - POST http://localhost:${PORT}/api/donors/register`);
  console.log(`   - GET  http://localhost:${PORT}/api/inventory`);
  console.log(`   - POST http://localhost:${PORT}/api/requests`);
  console.log(`   - POST http://localhost:${PORT}/api/ai/chat`);
  console.log(`======================================================\n`);
});
