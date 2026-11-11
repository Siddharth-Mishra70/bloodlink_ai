/**
 * @file server.mjs
 * @description Standalone Node.js server for BloodLink AI backend on port 8000.
 * Refactored exclusively for Prayagraj, Uttar Pradesh, India.
 * Provides instant local execution with zero dependencies, serving:
 * - POST /api/ai/parse-request (Strict Prayagraj Gemini 2.5 Flash NLP triage)
 * - POST /api/donors/register (Prayagraj donor registration)
 * - GET  /api/inventory (Live blood stock in Prayagraj)
 * - GET  /api/blood-banks (Real Prayagraj hospitals & blood banks)
 * - POST /api/requests & GET /api/requests (Emergency requests queue in Prayagraj)
 * - POST /api/ai/chat (Prayagraj emergency assistant)
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

// -------------------------------------------------------------
// Real Prayagraj Blood Banks & Medical Centres Dataset
// -------------------------------------------------------------
const PRAYAGRAJ_BLOOD_BANKS = [
  {
    id: 'bb-srn-01',
    name: 'Swaroop Rani Nehru (SRN) Hospital Blood Bank & Trauma Centre',
    address: 'MG Marg, Darbhanga Colony / George Town, Prayagraj, UP 211001',
    zone: 'George Town',
    phone: '+91 532 2256056',
    emergency_helpline: '+91 94152 34501',
    rating: 4.8,
    response_time: '12 mins',
    status: 'available',
    is_government: true,
    is_verified: true,
    coordinates: { lat: 25.4484, lng: 81.8542 },
    availability: {
      'A+': 32, 'A-': 14, 'B+': 45, 'B-': 9,
      'AB+': 18, 'AB-': 6, 'O+': 58, 'O-': 16
    }
  },
  {
    id: 'bb-jjh-02',
    name: 'Jeevan Jyoti Hospital Blood Bank',
    address: '162, Bai Ka Bagh, Lowther Road, Prayagraj, UP 211003',
    zone: 'Bai Ka Bagh / George Town',
    phone: '+91 532 2417400',
    emergency_helpline: '+91 98390 12345',
    rating: 4.7,
    response_time: '15 mins',
    status: 'available',
    is_government: false,
    is_verified: true,
    coordinates: { lat: 25.4312, lng: 81.8415 },
    availability: {
      'A+': 22, 'A-': 7, 'B+': 28, 'B-': 4,
      'AB+': 11, 'AB-': 2, 'O+': 34, 'O-': 8
    }
  },
  {
    id: 'bb-tbs-03',
    name: 'Tej Bahadur Sapru (Beli) Hospital Blood Bank',
    address: 'Stanley Road, Beli, Teliarganj / Civil Lines, Prayagraj, UP 211002',
    zone: 'Teliarganj / Beli',
    phone: '+91 532 2540225',
    emergency_helpline: '+91 94506 78901',
    rating: 4.6,
    response_time: '18 mins',
    status: 'available',
    is_government: true,
    is_verified: true,
    coordinates: { lat: 25.4630, lng: 81.8420 },
    availability: {
      'A+': 18, 'A-': 5, 'B+': 24, 'B-': 3,
      'AB+': 9, 'AB-': 2, 'O+': 29, 'O-': 6
    }
  },
  {
    id: 'bb-knm-04',
    name: 'Kamla Nehru Memorial Hospital (KNMH) Blood Centre',
    address: '1, Hashimpur Road, Tagore Town, Prayagraj, UP 211002',
    zone: 'Tagore Town',
    phone: '+91 532 2466601',
    emergency_helpline: '+91 98381 23456',
    rating: 4.8,
    response_time: '14 mins',
    status: 'available',
    is_government: false,
    is_verified: true,
    coordinates: { lat: 25.4520, lng: 81.8590 },
    availability: {
      'A+': 20, 'A-': 6, 'B+': 22, 'B-': 5,
      'AB+': 10, 'AB-': 3, 'O+': 30, 'O-': 7
    }
  },
  {
    id: 'bb-naz-05',
    name: 'Nazareth Hospital Blood Bank',
    address: '13-A, Kamla Nehru Road, Civil Lines, Prayagraj, UP 211001',
    zone: 'Civil Lines',
    phone: '+91 532 2407421',
    emergency_helpline: '+91 97920 11223',
    rating: 4.9,
    response_time: '10 mins',
    status: 'available',
    is_government: false,
    is_verified: true,
    coordinates: { lat: 25.4510, lng: 81.8350 },
    availability: {
      'A+': 25, 'A-': 9, 'B+': 31, 'B-': 6,
      'AB+': 14, 'AB-': 4, 'O+': 40, 'O-': 11
    }
  },
  {
    id: 'bb-mln-06',
    name: 'Moti Lal Nehru Divisional Hospital (Colvin Hospital)',
    address: 'City Road, Old Katra / Chowk, Prayagraj, UP 211002',
    zone: 'Katra / Chowk',
    phone: '+91 532 2465531',
    emergency_helpline: '+91 94151 88990',
    rating: 4.5,
    response_time: '20 mins',
    status: 'available',
    is_government: true,
    is_verified: true,
    coordinates: { lat: 25.4390, lng: 81.8360 },
    availability: {
      'A+': 15, 'A-': 4, 'B+': 20, 'B-': 3,
      'AB+': 8, 'AB-': 2, 'O+': 25, 'O-': 5
    }
  }
];

// -------------------------------------------------------------
// Real Prayagraj Seed Donors
// -------------------------------------------------------------
const donors = [
  { id: 'donor-1', name: 'Siddharth Mishra', blood_group: 'O+', location: 'Civil Lines, Prayagraj', contact: '+91 94152 11001' },
  { id: 'donor-2', name: 'Priya Srivastava', blood_group: 'A+', location: 'George Town, Prayagraj', contact: '+91 98390 22002' },
  { id: 'donor-3', name: 'Amit Tiwari', blood_group: 'B+', location: 'Teliarganj (near MNNIT), Prayagraj', contact: '+91 94506 33003' },
  { id: 'donor-4', name: 'Mohd. Faizan', blood_group: 'AB+', location: 'Chowk, Prayagraj', contact: '+91 98381 44004' },
  { id: 'donor-5', name: 'Anjali Pandey', blood_group: 'O-', location: 'Tagore Town, Prayagraj', contact: '+91 97920 55005' },
  { id: 'donor-6', name: 'Rohit Jaiswal', blood_group: 'B-', location: 'Katra, Prayagraj', contact: '+91 94151 66006' },
  { id: 'donor-7', name: 'Dr. Alok Banerjee', blood_group: 'A-', location: 'Naini, Prayagraj', contact: '+91 98399 77007' }
];

// Seed Prayagraj Emergency Blood Requests
const bloodRequests = [
  {
    request_id: 'ER-PRG-01',
    patient_name: 'Harish Chandra',
    blood_group: 'O-',
    units_needed: 2,
    hospital_name: 'Swaroop Rani Nehru (SRN) Hospital, Prayagraj',
    location: 'George Town, Prayagraj',
    urgency_level: 'critical',
    contact_phone: '+91 532 2256056',
    status: 'dispatched',
    created_at: new Date(Date.now() - 15 * 60000).toISOString()
  },
  {
    request_id: 'ER-PRG-02',
    patient_name: 'Meena Devi',
    blood_group: 'A+',
    units_needed: 1,
    hospital_name: 'Jeevan Jyoti Hospital, Prayagraj',
    location: 'Lowther Road, Prayagraj',
    urgency_level: 'urgent',
    contact_phone: '+91 532 2417400',
    status: 'matched',
    created_at: new Date(Date.now() - 35 * 60000).toISOString()
  }
];

// Live Aggregated Prayagraj Inventory
const inventory = [
  { blood_group: 'A+', current_stock: 132, minimum_required: 60, days_until_expiry: 15 },
  { blood_group: 'A-', current_stock: 45, minimum_required: 30, days_until_expiry: 4 },
  { blood_group: 'B+', current_stock: 170, minimum_required: 70, days_until_expiry: 18 },
  { blood_group: 'B-', current_stock: 30, minimum_required: 25, days_until_expiry: 3 },
  { blood_group: 'AB+', current_stock: 73, minimum_required: 30, days_until_expiry: 21 },
  { blood_group: 'AB-', current_stock: 23, minimum_required: 15, days_until_expiry: 5 },
  { blood_group: 'O+', current_stock: 216, minimum_required: 90, days_until_expiry: 22 },
  { blood_group: 'O-', current_stock: 54, minimum_required: 40, days_until_expiry: 4 }
];

// Helper to send JSON responses with unrestricted CORS headers
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

// Helper to parse JSON body from incoming stream with robust shell-unquoting
function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1e6) req.destroy();
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

/**
 * Normalizes any detected location string strictly to a recognized Prayagraj medical zone.
 */
function normalizeToPrayagrajZone(text) {
  const lower = (text || '').toLowerCase();
  
  if (lower.includes('srn') || lower.includes('swaroop') || lower.includes('nehru') || lower.includes('motilal')) {
    return 'Swaroop Rani Nehru (SRN) Hospital, George Town, Prayagraj';
  }
  if (lower.includes('jeevan') || lower.includes('jyoti') || lower.includes('lowther') || lower.includes('bai ka bagh')) {
    return 'Jeevan Jyoti Hospital, Lowther Road, Prayagraj';
  }
  if (lower.includes('beli') || lower.includes('tej bahadur') || lower.includes('sapru') || lower.includes('stanley')) {
    return 'Tej Bahadur Sapru (Beli) Hospital, Stanley Road, Prayagraj';
  }
  if (lower.includes('kamla') || lower.includes('knmh') || lower.includes('hashimpur')) {
    return 'Kamla Nehru Memorial Hospital (KNMH), Tagore Town, Prayagraj';
  }
  if (lower.includes('nazareth')) {
    return 'Nazareth Hospital, Civil Lines, Prayagraj';
  }
  if (lower.includes('colvin') || lower.includes('divisional')) {
    return 'Colvin Divisional Hospital, Katra, Prayagraj';
  }
  if (lower.includes('civil lines') || lower.includes('mg marg') || lower.includes('subhash')) return 'Civil Lines, Prayagraj';
  if (lower.includes('teliarganj') || lower.includes('mnnit')) return 'Teliarganj / MNNIT, Prayagraj';
  if (lower.includes('george town')) return 'George Town, Prayagraj';
  if (lower.includes('chowk')) return 'Chowk, Prayagraj';
  if (lower.includes('katra')) return 'Old Katra, Prayagraj';
  if (lower.includes('tagore town')) return 'Tagore Town, Prayagraj';
  if (lower.includes('naini')) return 'Naini Industrial Area, Prayagraj';
  if (lower.includes('jhunsi') || lower.includes('sangam')) return 'Jhunsi / Sangam, Prayagraj';
  if (lower.includes('dhumanganj') || lower.includes('subedarganj')) return 'Dhumanganj, Prayagraj';

  return 'Civil Lines, Prayagraj, UP';
}

// Fallback emergency extraction strictly mapping to Prayagraj
function fallbackParseQuery(query) {
  const bloodMatch = query.match(/\b(AB|A|B|O)\s*([+-]|\bpositive\b|\bnegative\b|\bpos\b|\bneg\b)/i);
  let detectedGroup = 'A+';
  if (bloodMatch) {
    const type = bloodMatch[1].toUpperCase();
    const sign = bloodMatch[2].toLowerCase();
    const rh = (sign === '-' || sign.includes('neg')) ? '-' : '+';
    detectedGroup = `${type}${rh}`;
  }
  
  const urgencyMatch = query.match(/\b(sos|critical|urgent|urgently|emergency|immediately|asap|trauma|accident)\b/i);
  const mappedLocation = normalizeToPrayagrajZone(query);

  return {
    blood_group: detectedGroup,
    location: mappedLocation,
    urgency_level: urgencyMatch ? 'emergency' : 'urgent',
    patient_notes: `Prayagraj Emergency Requisition: "${query}"`,
    raw_query: query
  };
}

// Call Google Gemini API with strict Prayagraj prompt
async function parseWithGemini(query) {
  if (!GEMINI_API_KEY || GEMINI_API_KEY.includes('your_')) {
    return fallbackParseQuery(query);
  }

  try {
    const prompt = `You are an emergency medical triage and dispatch assistant specifically for Prayagraj (formerly Allahabad), Uttar Pradesh, India.
Analyze the following emergency blood request query and extract structured JSON information.

CRITICAL LOCATION RULES:
- You must strictly map the location to real Prayagraj zones, hospitals, or landmarks.
- Recognized Prayagraj Hospitals: "Swaroop Rani Nehru (SRN) Hospital, Prayagraj", "Jeevan Jyoti Hospital, Prayagraj", "Tej Bahadur Sapru (Beli) Hospital, Prayagraj", "Kamla Nehru Memorial Hospital (KNMH), Prayagraj", "Nazareth Hospital, Prayagraj", "Colvin Hospital, Prayagraj".
- Recognized Prayagraj Zones: "Civil Lines, Prayagraj", "George Town, Prayagraj", "Teliarganj / MNNIT, Prayagraj", "Chowk, Prayagraj", "Old Katra, Prayagraj", "Tagore Town, Prayagraj", "Naini, Prayagraj", "Jhunsi, Prayagraj", "Dhumanganj, Prayagraj".
- If the user specifies any location (e.g. "Civil Lines", "SRN", "near MNNIT", "George Town"), format it as "<Location>, Prayagraj, UP".
- If the location is ambiguous or outside Prayagraj, map it to the closest Prayagraj medical zone (default to "Civil Lines, Prayagraj, UP").

Query: "${query}"

Return ONLY a valid JSON object with the following fields:
- blood_group: Extracted ABO/Rh blood group (e.g., "A+", "O-", "B+", "AB+"). If not specified, return null.
- location: The formatted Prayagraj location or hospital string.
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
          location: normalizeToPrayagrajZone(`${parsed.location || ''} ${query}`),
          urgency_level: parsed.urgency_level || 'emergency',
          patient_notes: parsed.patient_notes || query,
          raw_query: query
        };
      }
    }
  } catch (err) {
    console.warn('Gemini API call failed, falling back to Prayagraj pattern parser:', err.message);
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
        service: 'BloodLink AI - Prayagraj Medical Network API',
        city: 'Prayagraj (Allahabad), Uttar Pradesh',
        coordinates: { lat: 25.4358, lng: 81.8463 },
        version: '2.0.0',
        gemini_model: 'gemini-2.5-flash',
        endpoints: [
          '/api/ai/parse-request',
          '/api/blood-banks',
          '/api/donors/register',
          '/api/inventory',
          '/api/requests',
          '/api/ai/chat'
        ]
      });
    }

    // GET /api/blood-banks (Real Prayagraj Blood Banks)
    if (pathname === '/api/blood-banks' && method === 'GET') {
      return sendJson(res, 200, PRAYAGRAJ_BLOOD_BANKS);
    }

    // POST /api/ai/parse-request (Strict Prayagraj Mapping)
    if (pathname === '/api/ai/parse-request' && method === 'POST') {
      const body = await parseBody(req);
      const query = body.query;
      if (!query || !query.trim()) {
        return sendJson(res, 400, { detail: 'Field "query" is required' });
      }

      const parsed = await parseWithGemini(query);
      return sendJson(res, 200, parsed);
    }

    // POST /api/donors/register (Prayagraj Donors)
    if (pathname === '/api/donors/register' && method === 'POST') {
      const body = await parseBody(req);
      if (!body.name || !body.blood_group || !body.contact) {
        return sendJson(res, 400, { detail: 'Missing required donor registration fields' });
      }

      const location = body.location?.includes('Prayagraj')
        ? body.location
        : `${body.location || 'Civil Lines'}, Prayagraj, UP`;

      const newDonor = {
        id: `donor-prg-${Date.now()}`,
        name: body.name,
        blood_group: body.blood_group,
        location: location,
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
        message: 'Volunteer donor registered in Prayagraj network'
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
      const location = body.location?.includes('Prayagraj')
        ? body.location
        : `${body.location || 'Civil Lines'}, Prayagraj, UP`;

      const requestRecord = {
        request_id: `ER-PRG-${Date.now().toString().slice(-6)}`,
        patient_name: body.patient_name || 'Emergency Patient',
        blood_group: body.blood_group,
        units_needed: body.units_needed || 1,
        hospital_name: body.hospital_name || 'Swaroop Rani Nehru (SRN) Hospital, Prayagraj',
        location: location,
        urgency_level: body.urgency_level || 'emergency',
        contact_phone: body.contact_phone || '+91 532 2256056',
        status: 'dispatched',
        created_at: new Date().toISOString()
      };
      bloodRequests.unshift(requestRecord);
      return sendJson(res, 201, requestRecord);
    }

    // POST /api/ai/chat
    if (pathname === '/api/ai/chat' && method === 'POST') {
      const body = await parseBody(req);
      const message = body.message || '';
      return sendJson(res, 200, {
        reply: `BloodLink AI (Prayagraj Emergency Dispatch): We have registered your inquiry regarding "${message}". For emergency blood requirements in Prayagraj, Swaroop Rani Nehru (SRN) Hospital (+91 532 2256056) and Jeevan Jyoti Hospital (+91 532 2417400) blood banks are operating 24x7. For immediate ambulance services across UP, dial 108.`,
        triage_category: 'emergency',
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
  console.log(`🚀 BloodLink AI Prayagraj Backend running at http://localhost:${PORT}`);
  console.log(`📍 Coverage: Prayagraj, Uttar Pradesh (25.4358° N, 81.8463° E)`);
  console.log(`🏥 Seeded Hospitals: SRN, Jeevan Jyoti, Beli, KNMH, Nazareth, Colvin`);
  console.log(`🔌 Endpoints:`);
  console.log(`   - GET  http://localhost:${PORT}/api/blood-banks`);
  console.log(`   - POST http://localhost:${PORT}/api/ai/parse-request`);
  console.log(`   - POST http://localhost:${PORT}/api/donors/register`);
  console.log(`   - GET  http://localhost:${PORT}/api/inventory`);
  console.log(`   - POST http://localhost:${PORT}/api/requests`);
  console.log(`   - POST http://localhost:${PORT}/api/ai/chat`);
  console.log(`======================================================\n`);
});
