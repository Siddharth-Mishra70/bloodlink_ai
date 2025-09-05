import openai from './openaiClient';

/**
 * Generates a basic chat completion response for blood bank queries.
 * @param {string} userMessage - The user's input message.
 * @returns {Promise<string>} The assistant's response.
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
 * Generates AI-powered blood availability forecasts and recommendations.
 * @param {Object} inventoryData - Current blood inventory data.
 * @param {Object} historicalData - Historical usage patterns.
 * @returns {Promise<Object>} Structured forecast response.
 */
export async function getBloodInventoryForecast(inventoryData, historicalData) {
  try {
    const prompt = `Based on current inventory: ${JSON.stringify(inventoryData)} and historical patterns: ${JSON.stringify(historicalData)}, provide blood availability forecast and recommendations.`;

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
 * Analyzes emergency blood requests and provides smart recommendations.
 * @param {Object} requestData - Emergency blood request details.
 * @returns {Promise<Object>} Structured emergency response.
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
 * Streams AI chat responses for real-time assistance.
 * @param {string} userMessage - The user's input message.
 * @param {Function} onChunk - Callback to handle each streamed chunk.
 * @param {string} context - Chat context ('general', 'emergency', 'donor', 'medical').
 */
export async function getStreamingChatAssistance(userMessage, onChunk, context = 'general') {
  try {
    const systemMessages = {
      general: 'You are a helpful blood bank assistant. Provide clear, accurate information about blood donation, requirements, and processes.',
      emergency: 'You are an emergency blood request assistant. Prioritize speed and accuracy in emergency situations. Be direct and actionable.',
      donor: 'You are a donor care assistant. Help potential and existing donors with questions about eligibility, preparation, and aftercare.',
      medical: 'You are a medical professional assistant specializing in blood banking. Provide detailed medical information suitable for healthcare providers.'
    };

    const stream = await openai?.chat?.completions?.create({
      model: 'gpt-5-mini', // Faster streaming
      messages: [
        { role: 'system', content: systemMessages?.[context] || systemMessages?.general },
        { role: 'user', content: userMessage },
      ],
      stream: true,
      reasoning_effort: 'minimal', // For faster streaming
      verbosity: 'medium'
    });

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
 * Generates personalized recommendations for blood bank users.
 * @param {Object} userProfile - User profile data.
 * @param {string} userType - Type of user ('donor', 'patient', 'medical_staff').
 * @returns {Promise<Object>} Personalized recommendations.
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
 * Moderates user-generated content for safety.
 * @param {string} text - The text to moderate.
 * @returns {Promise<object>} Moderation results.
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