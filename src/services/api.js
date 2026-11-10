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

export default {
  parseEmergencyRequest,
  registerDonor,
};
