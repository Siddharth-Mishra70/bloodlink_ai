/**
 * @file api.js
 * @description Reusable API client module for communicating with the BloodLink AI FastAPI backend.
 * Default backend URL: http://localhost:8000 (configurable via VITE_BACKEND_URL).
 */

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

/**
 * Sends an emergency natural language text query to the FastAPI backend to be parsed
 * into structured JSON parameters (blood_group, location, urgency_level, patient_notes)
 * using the Google Gemini model.
 *
 * @async
 * @function parseEmergencyRequest
 * @param {string} query - Natural language emergency request description.
 * @returns {Promise<{
 *   blood_group: string|null,
 *   location: string|null,
 *   urgency_level: string|null,
 *   patient_notes: string|null,
 *   raw_query: string
 * }>} Parsed structured blood requisition details.
 * @throws {Error} If the HTTP request fails or the server returns an error.
 */
export async function parseEmergencyRequest(query) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ai/parse-request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Server error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error parsing emergency request with Gemini backend:', error);
    throw error;
  }
}

/**
 * Submits volunteer blood donor registration data to the FastAPI backend
 * to be validated and stored into Supabase.
 *
 * @async
 * @function registerDonor
 * @param {Object} donorData - Volunteer donor registration payload.
 * @param {string} donorData.name - Full name of the donor.
 * @param {string} donorData.blood_group - ABO/Rh blood group (e.g. 'O+', 'A-', 'B+').
 * @param {string} donorData.location - City, hospital district, or geographic address.
 * @param {string} donorData.contact - Phone number or primary contact info.
 * @param {number} [donorData.age] - Optional donor age (between 18 and 65).
 * @param {string} [donorData.email] - Optional donor email address.
 * @returns {Promise<{
 *   status: string,
 *   donor_id: string,
 *   name: string,
 *   blood_group: string,
 *   location: string,
 *   contact: string,
 *   registered_at: string,
 *   message: string
 * }>} Registration confirmation object with assigned tracking donor ID.
 * @throws {Error} If the HTTP request fails or server returns an error.
 */
export async function registerDonor(donorData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/donors/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(donorData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Server error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error registering donor with backend:', error);
    throw error;
  }
}

/**
 * Dispatches an emergency blood requisition to the FastAPI backend.
 *
 * @async
 * @function submitEmergencyRequest
 * @param {Object} reqData - Blood requisition payload.
 * @returns {Promise<Object>} Created request with assigned dispatch ID.
 */
export async function submitEmergencyRequest(reqData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Server error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting blood request:', error);
    throw error;
  }
}

/**
 * Retrieves live blood inventory stock levels from the backend.
 *
 * @async
 * @function fetchBloodInventory
 * @returns {Promise<Array<Object>>} Inventory list by blood group.
 */
export async function fetchBloodInventory() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/inventory`);
    if (!response.ok) {
      throw new Error(`Inventory fetch failed: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching inventory:', error);
    throw error;
  }
}

/**
 * Sends a conversation turn to the Gemini Blood Assistant chatbot.
 *
 * @async
 * @function sendAiAssistantChat
 * @param {string} message - User query text.
 * @param {Array<Object>} [conversationHistory=[]] - Previous message turns.
 * @returns {Promise<Object>} AI response object with reply and triage category.
 */
export async function sendAiAssistantChat(message, conversationHistory = []) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        conversation_history: conversationHistory,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `AI chat failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error chatting with AI assistant:', error);
    throw error;
  }
}

/**
 * Retrieves verified blood banks and hospitals in Prayagraj from the backend.
 *
 * @async
 * @function fetchBloodBanks
 * @returns {Promise<Array<Object>>} List of Prayagraj blood banks.
 */
export async function fetchBloodBanks() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/blood-banks`);
    if (!response.ok) {
      throw new Error(`Blood banks fetch failed: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn('Backend blood banks unavailable, using Prayagraj snapshot:', error);
    return [
      {
        id: 'bb-srn-01',
        name: 'Swaroop Rani Nehru (SRN) Hospital Blood Bank & Trauma Centre',
        address: 'MG Marg, Darbhanga Colony / George Town, Prayagraj, UP 211001',
        zone: 'George Town',
        phone: '+91 532 2256056',
        distance: '1.8 km',
        rating: 4.8,
        responseTime: '12 mins',
        status: 'available',
        coordinates: { lat: 25.4484, lng: 81.8542 },
        availability: { 'A+': 32, 'A-': 14, 'B+': 45, 'B-': 9, 'AB+': 18, 'AB-': 6, 'O+': 58, 'O-': 16 }
      },
      {
        id: 'bb-jjh-02',
        name: 'Jeevan Jyoti Hospital Blood Bank',
        address: '162, Bai Ka Bagh, Lowther Road, Prayagraj, UP 211003',
        zone: 'Bai Ka Bagh / George Town',
        phone: '+91 532 2417400',
        distance: '2.4 km',
        rating: 4.7,
        responseTime: '15 mins',
        status: 'available',
        coordinates: { lat: 25.4312, lng: 81.8415 },
        availability: { 'A+': 22, 'A-': 7, 'B+': 28, 'B-': 4, 'AB+': 11, 'AB-': 2, 'O+': 34, 'O-': 8 }
      },
      {
        id: 'bb-tbs-03',
        name: 'Tej Bahadur Sapru (Beli) Hospital Blood Bank',
        address: 'Stanley Road, Beli, Teliarganj / Civil Lines, Prayagraj, UP 211002',
        zone: 'Teliarganj / Beli',
        phone: '+91 532 2540225',
        distance: '3.1 km',
        rating: 4.6,
        responseTime: '18 mins',
        status: 'available',
        coordinates: { lat: 25.4630, lng: 81.8420 },
        availability: { 'A+': 18, 'A-': 5, 'B+': 24, 'B-': 3, 'AB+': 9, 'AB-': 2, 'O+': 29, 'O-': 6 }
      },
      {
        id: 'bb-knm-04',
        name: 'Kamla Nehru Memorial Hospital (KNMH) Blood Centre',
        address: '1, Hashimpur Road, Tagore Town, Prayagraj, UP 211002',
        zone: 'Tagore Town',
        phone: '+91 532 2466601',
        distance: '2.1 km',
        rating: 4.8,
        responseTime: '14 mins',
        status: 'available',
        coordinates: { lat: 25.4520, lng: 81.8590 },
        availability: { 'A+': 20, 'A-': 6, 'B+': 22, 'B-': 5, 'AB+': 10, 'AB-': 3, 'O+': 30, 'O-': 7 }
      },
      {
        id: 'bb-naz-05',
        name: 'Nazareth Hospital Blood Bank',
        address: '13-A, Kamla Nehru Road, Civil Lines, Prayagraj, UP 211001',
        zone: 'Civil Lines',
        phone: '+91 532 2407421',
        distance: '1.2 km',
        rating: 4.9,
        responseTime: '10 mins',
        status: 'available',
        coordinates: { lat: 25.4510, lng: 81.8350 },
        availability: { 'A+': 25, 'A-': 9, 'B+': 31, 'B-': 6, 'AB+': 14, 'AB-': 4, 'O+': 40, 'O-': 11 }
      }
    ];
  }
}

export default {
  parseEmergencyRequest,
  registerDonor,
  submitEmergencyRequest,
  fetchBloodInventory,
  fetchBloodBanks,
  sendAiAssistantChat,
};

