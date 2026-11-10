/**
 * @file openaiService.js
 * @description Core artificial intelligence services for the BloodLink AI platform.
 * Provides integration with OpenAI models for:
 * 1. Conversational assistance for blood donation inquiries.
 * 2. Predictive blood inventory forecasting with structured JSON schema outputs.
 * 3. Emergency triage & alternative blood group compatibility calculations.
 * 4. Low-latency streaming chat interactions.
 * 5. Personalized donor & patient healthcare recommendations.
 * 6. Automated user-generated content safety moderation.
 */

import openai from './openaiClient';

/**
 * Generates a conversational response for blood bank queries and donation procedures.
 *
 * @async
 * @function getBloodBankChatCompletion
 * @param {string} userMessage - The user's input question or issue description.
 * @returns {Promise<string>} The assistant's generated advice or explanation.
 * @throws {Error} Propagates any OpenAI API communication or quota error.
 */
export async function getBloodBankChatCompletion(userMessage) {
  try {
    const response = await openai?.chat?.completions?.create({
      model: 'gpt-5',
      messages: [
        { 
          role: 'system', 
          content: 'You are a helpful medical assistant specialized in blood donation and blood banking. Provide accurate, helpful information about blood types, donation requirements, emergency protocols, and blood availability.' 
        },
        { role: 'user', content: userMessage },
      ],
      max_completion_tokens: 2000,
      reasoning_effort: 'medium',
      verbosity: 'medium'
    });

    return response?.choices?.[0]?.message?.content;
  } catch (error) {
    console.error('Error in blood bank chat completion:', error);
    throw error;
  }
}

/**
 * Generates predictive blood inventory forecasts and replenishment recommendations using structured JSON outputs.
 *
 * @async
 * @function getBloodInventoryForecast
 * @param {Object} inventoryData - Current stock levels, expiry dates, and blood type distribution.
 * @param {Object} historicalData - Historical usage velocity, emergency pull rates, and seasonal trends.
 * @returns {Promise<{
 *   forecast_summary: string,
 *   critical_alerts: Array<{ blood_type: string, alert_level: 'low'|'critical'|'urgent', days_remaining: number, recommendation: string }>,
 *   recommendations: string[],
 *   next_actions: Array<{ action: string, priority: 'high'|'medium'|'low', timeline?: string }>
 * }>} Parsed structured JSON forecast response.
 * @throws {Error} If API call fails or response parsing encounters invalid syntax.
 */
export async function getBloodInventoryForecast(inventoryData, historicalData) {
  try {
    const prompt = `Based on current inventory: ${JSON.stringify(inventoryData)} and historical patterns: ${JSON.stringify(historicalData)}, provide blood availability forecast and recommendations.`;

    // Request structured output enforced by a rigorous JSON Schema
    const response = await openai?.chat?.completions?.create({
      model: 'gpt-5',
      messages: [
        { 
          role: 'system', 
          content: 'You are an AI analytics specialist for blood banking. Analyze inventory data and provide forecasts, alerts, and actionable recommendations for blood bank managers.' 
        },
        { role: 'user', content: prompt },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'blood_forecast_response',
          schema: {
            type: 'object',
            properties: {
              forecast_summary: { type: 'string' },
              critical_alerts: { 
                type: 'array',
                items: { 
                  type: 'object',
                  properties: {
                    blood_type: { type: 'string' },
                    alert_level: { type: 'string', enum: ['low', 'critical', 'urgent'] },
                    days_remaining: { type: 'number' },
                    recommendation: { type: 'string' }
                  },
                  required: ['blood_type', 'alert_level', 'recommendation']
                }
              },
              recommendations: { 
                type: 'array', 
                items: { type: 'string' }
              },
              next_actions: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    action: { type: 'string' },
                    priority: { type: 'string', enum: ['high', 'medium', 'low'] },
                    timeline: { type: 'string' }
                  },
                  required: ['action', 'priority']
                }
              }
            },
            required: ['forecast_summary', 'critical_alerts', 'recommendations'],
            additionalProperties: false,
          },
        },
      },
      reasoning_effort: 'high',
      verbosity: 'high'
    });

    return JSON.parse(response?.choices?.[0]?.message?.content);
  } catch (error) {
    console.error('Error in blood inventory forecast:', error);
    throw error;
  }
}

/**
 * Analyzes emergency blood dispatch requests and formulates prioritized emergency recommendations.
 * Computes clinically valid alternative compatible blood groups when requested types are scarce.
 *
 * @async
 * @function getEmergencyBloodRecommendations
 * @param {Object} requestData - Urgent request details (patient blood type, units needed, hospital, urgency).
 * @returns {Promise<{
 *   urgency_level: 'critical'|'high'|'moderate',
 *   primary_recommendation: string,
 *   alternative_blood_types: Array<{ blood_type: string, compatibility: string, availability_estimate?: string }>,
 *   immediate_actions: string[],
 *   estimated_response_time?: string
 * }>} Parsed structured emergency response.
 * @throws {Error} If emergency AI triage analysis fails.
 */
export async function getEmergencyBloodRecommendations(requestData) {
  try {
    const prompt = `Emergency blood request: ${JSON.stringify(requestData)}. Provide immediate recommendations, alternative blood types, and priority routing suggestions.`;

    const response = await openai?.chat?.completions?.create({
      model: 'gpt-5',
      messages: [
        { 
          role: 'system', 
          content: 'You are an emergency medical AI assistant. Analyze urgent blood requests and provide immediate, life-saving recommendations including alternative blood types, nearest availability, and priority protocols.' 
        },
        { role: 'user', content: prompt },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'emergency_response',
          schema: {
            type: 'object',
            properties: {
              urgency_level: { type: 'string', enum: ['critical', 'high', 'moderate'] },
              primary_recommendation: { type: 'string' },
              alternative_blood_types: { 
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    blood_type: { type: 'string' },
                    compatibility: { type: 'string' },
                    availability_estimate: { type: 'string' }
                  },
                  required: ['blood_type', 'compatibility']
                }
              },
              immediate_actions: { 
                type: 'array', 
                items: { type: 'string' }
              },
              estimated_response_time: { type: 'string' }
            },
            required: ['urgency_level', 'primary_recommendation', 'immediate_actions'],
            additionalProperties: false,
          },
        },
      },
      reasoning_effort: 'high',
      verbosity: 'medium'
    });

    return JSON.parse(response?.choices?.[0]?.message?.content);
  } catch (error) {
    console.error('Error in emergency blood recommendations:', error);
    throw error;
  }
}

/**
 * Streams AI chat responses token-by-token for real-time reactive user interfaces.
 *
 * @async
 * @function getStreamingChatAssistance
 * @param {string} userMessage - The message submitted by the user.
 * @param {(chunk: string) => void} onChunk - Callback executed on receipt of each streaming text token.
 * @param {'general'|'emergency'|'donor'|'medical'} [context='general'] - Operational domain context persona.
 * @returns {Promise<void>} Resolves when the stream reaches completion.
 * @throws {Error} If streaming stream terminates prematurely or errors.
 */
export async function getStreamingChatAssistance(userMessage, onChunk, context = 'general') {
  try {
    // Context-specific system prompts to tune behavior and urgency
    const systemMessages = {
      general: 'You are a helpful blood bank assistant. Provide clear, accurate information about blood donation, requirements, and processes.',
      emergency: 'You are an emergency blood request assistant. Prioritize speed and accuracy in emergency situations. Be direct and actionable.',
      donor: 'You are a donor care assistant. Help potential and existing donors with questions about eligibility, preparation, and aftercare.',
      medical: 'You are a medical professional assistant specializing in blood banking. Provide detailed medical information suitable for healthcare providers.'
    };

    const stream = await openai?.chat?.completions?.create({
      model: 'gpt-5-mini', // Lightweight model selected for low-latency streaming
      messages: [
        { role: 'system', content: systemMessages?.[context] || systemMessages?.general },
        { role: 'user', content: userMessage },
      ],
      stream: true,
      reasoning_effort: 'minimal', // Minimal reasoning overhead for instant token delivery
      verbosity: 'medium'
    });

    // Iterate asynchronously through arriving stream chunks
    for await (const chunk of stream) {
      const content = chunk?.choices?.[0]?.delta?.content || '';
      if (content) {
        onChunk(content);
      }
    }
  } catch (error) {
    console.error('Error in streaming chat assistance:', error);
    throw error;
  }
}

/**
 * Generates personalized medical insights, reminders, and next steps for donors or patients.
 *
 * @async
 * @function getPersonalizedRecommendations
 * @param {Object} userProfile - Profile details including donation history, eligibility date, blood type.
 * @param {'donor'|'patient'|'medical_staff'} userType - Category of authenticated user.
 * @returns {Promise<{
 *   welcome_message: string,
 *   key_recommendations: string[],
 *   next_steps: Array<{ title: string, description: string, priority: 'high'|'medium'|'low' }>,
 *   health_tips?: string[],
 *   reminders?: string[]
 * }>} Personalized structured user insights.
 * @throws {Error} If OpenAI service call fails.
 */
export async function getPersonalizedRecommendations(userProfile, userType) {
  try {
    const prompt = `User profile: ${JSON.stringify(userProfile)}. User type: ${userType}. Generate personalized recommendations and insights.`;

    const response = await openai?.chat?.completions?.create({
      model: 'gpt-5',
      messages: [
        { 
          role: 'system', 
          content: `You are a personalization AI for blood banking services. Analyze user profiles and provide tailored recommendations for ${userType}s to improve their experience and outcomes.` 
        },
        { role: 'user', content: prompt },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'personalized_recommendations',
          schema: {
            type: 'object',
            properties: {
              welcome_message: { type: 'string' },
              key_recommendations: { 
                type: 'array', 
                items: { type: 'string' }
              },
              next_steps: { 
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    description: { type: 'string' },
                    priority: { type: 'string', enum: ['high', 'medium', 'low'] }
                  },
                  required: ['title', 'description', 'priority']
                }
              },
              health_tips: { 
                type: 'array', 
                items: { type: 'string' }
              },
              reminders: { 
                type: 'array', 
                items: { type: 'string' }
              }
            },
            required: ['welcome_message', 'key_recommendations', 'next_steps'],
            additionalProperties: false,
          },
        },
      },
      reasoning_effort: 'medium',
      verbosity: 'medium'
    });

    return JSON.parse(response?.choices?.[0]?.message?.content);
  } catch (error) {
    console.error('Error in personalized recommendations:', error);
    throw error;
  }
}

/**
 * Validates user-submitted content against OpenAI moderation safety guidelines to prevent abuse.
 *
 * @async
 * @function moderateContent
 * @param {string} text - The user input string or notes to be moderated.
 * @returns {Promise<Object>} Moderation result object detailing flagged categories and scores.
 * @throws {Error} If moderation API request fails.
 */
export async function moderateContent(text) {
  try {
    const response = await openai?.moderations?.create({
      model: 'text-moderation-latest',
      input: text,
    });

    return response?.results?.[0];
  } catch (error) {
    console.error('Error moderating content:', error);
    throw error;
  }
}
