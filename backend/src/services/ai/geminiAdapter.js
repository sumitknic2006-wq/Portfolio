import { GoogleGenAI } from '@google/genai';
import { env } from '../../config/env.js';

/**
 * Gemini Adapter using the official @google/genai SDK
 * Uses current models like gemini-2.5-flash with low temperature for factual grounding
 */
export async function generateGeminiContent({
  systemPrompt,
  userMessage,
  conversationHistory = [],
  maxOutputTokens = 600,
  timeoutMs = 60000,
}) {
  if (!env.AI_API_KEY) {
    const error = new Error('AI provider API key is not configured.');
    error.code = 'AI_PROVIDER_UNCONFIGURED';
    throw error;
  }

  const ai = new GoogleGenAI({ apiKey: env.AI_API_KEY });
  const modelName = env.AI_MODEL || 'gemini-2.5-flash';

  // Construct bounded turn sequence
  const contents = [];
  for (const item of conversationHistory) {
    contents.push({
      role: item.role === 'assistant' || item.role === 'model' ? 'model' : 'user',
      parts: [{ text: item.text }],
    });
  }

  contents.push({
    role: 'user',
    parts: [{ text: userMessage }],
  });

  // Enforce provider timeout
  let timerId;
  const timeoutPromise = new Promise((_, reject) => {
    timerId = setTimeout(() => {
      const err = new Error(`AI generation request timed out after ${timeoutMs}ms`);
      err.code = 'AI_REQUEST_TIMEOUT';
      reject(err);
    }, timeoutMs);
  });

  try {
    const requestPromise = ai.models.generateContent({
      model: modelName,
      contents,
      config: {
        systemInstruction: systemPrompt,
        maxOutputTokens,
        temperature: 0.2, // Factual, deterministic grounding
      },
    });

    const response = await Promise.race([requestPromise, timeoutPromise]);
    clearTimeout(timerId);

    const generatedText = response.text ? response.text.trim() : '';
    return generatedText;
  } catch (err) {
    clearTimeout(timerId);
    if (err.code === 'AI_REQUEST_TIMEOUT') {
      throw err;
    }
    // Mask raw network / credential traces
    const safeError = new Error('AI generation provider failure: ' + (err.message || 'Unknown error'));
    safeError.code = err.code || 'AI_PROVIDER_ERROR';
    throw safeError;
  }
}

export default {
  generateGeminiContent,
};
