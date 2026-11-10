/**
 * @file openaiClient.js
 * @description Configures and exports a singleton OpenAI API client instance for BloodLink AI.
 * Handles client-side execution in Vite with browser allowance enabled.
 */

import OpenAI from 'openai';

/**
 * Initializes the OpenAI client with the API key defined in Vite environment variables (`.env`).
 * Note: `dangerouslyAllowBrowser: true` is enabled to allow direct API calls from the client-side
 * React single-page application. In a production multi-tier architecture, consider routing these
 * requests through a secure backend proxy to protect API credentials.
 *
 * @type {OpenAI} Configured OpenAI client instance.
 */
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Required for client-side usage in React/Vite
});

export default openai;
