/**
 * @file backendApi.js
 * @description Frontend API client interfacing with the BloodLink AI FastAPI backend.
 * Provides endpoints for Gemini-powered natural language query parsing, chat assistance,
 * and Supabase-backed blood requests and inventory synchronization.
 */

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

/**
 * Parses unstructured emergency text query using Google Gemini on the backend.
 *
 * @async
 * @function parseEmergencyQueryWithGemini
 * @param {string} queryText - Unformatted emergency situation description.
 * @returns {Promise<{ blood_group: string|null, location: string|null, urgency_level: string|null, patient_notes: string|null, raw_query: string }>}
 */
export async function parseEmergencyQueryWithGemini(queryText) {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/ai/parse-request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: queryText }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Server returned ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error connecting to FastAPI backend parser:', error);
    throw error;
  }
}

/**
 * Sends a message to the Gemini medical assistant chat endpoint.
 *
 * @async
 * @function sendGeminiChatMessage
 * @param {string} message - User question.
 * @param {'general'|'emergency'|'donor'|'medical'} [context='general'] - Persona role.
 * @returns {Promise<{ response: string, context: string }>}
 */
export async function sendGeminiChatMessage(message, context = 'general') {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, context }),
    });

    if (!response.ok) {
      throw new Error(`Chat API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in backend chat API:', error);
    throw error;
  }
}

/**
 * Submits a new emergency blood requisition to the backend (persisted via Supabase).
 *
 * @async
 * @function submitEmergencyRequisition
 * @param {Object} requestData - Patient and hospital request payload.
 * @returns {Promise<Object>} Created requisition record with tracking ID.
 */
export async function submitEmergencyRequisition(requestData) {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`Request submission failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting requisition to backend:', error);
    throw error;
  }
}

/**
 * Retrieves active blood requests from the backend.
 *
 * @async
 * @function getActiveRequestsFromBackend
 * @returns {Promise<Array<Object>>}
 */
export async function getActiveRequestsFromBackend() {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/requests`);
    if (!response.ok) throw new Error('Failed to fetch requests');
    return await response.json();
  } catch (error) {
    console.error('Error fetching active requests:', error);
    return [];
  }
}

/**
 * Retrieves regional inventory stock levels from the backend.
 *
 * @async
 * @function getInventoryFromBackend
 * @returns {Promise<Array<Object>>}
 */
export async function getInventoryFromBackend() {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/inventory`);
    if (!response.ok) throw new Error('Failed to fetch inventory');
    return await response.json();
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return [];
  }
}
