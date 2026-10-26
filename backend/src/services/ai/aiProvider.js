import { env } from '../../config/env.js';
import { generateGeminiContent } from './geminiAdapter.js';
import { generateMockContent } from './mockAdapter.js';

/**
 * Check if the configured AI provider has valid credentials
 */
export function isProviderConfigured() {
  if (env.AI_PROVIDER === 'mock') {
    return true;
  }
  return Boolean(env.AI_API_KEY && env.AI_API_KEY.trim().length > 0);
}

/**
 * Get safe metadata about the current AI provider without exposing keys
 */
export function getProviderInfo() {
  return {
    provider: env.AI_PROVIDER || 'gemini',
    model: env.AI_MODEL || 'gemini-2.5-flash',
    configured: isProviderConfigured(),
    maxOutputTokens: env.AI_MAX_OUTPUT_TOKENS || 600,
  };
}

/**
 * Dispatch content generation to the active AI provider adapter
 */
export async function generateAIResponse({
  systemPrompt,
  userMessage,
  conversationHistory = [],
  maxOutputTokens = env.AI_MAX_OUTPUT_TOKENS || 600,
  timeoutMs = env.AI_TIMEOUT_MS || 12000,
}) {
  const provider = (env.AI_PROVIDER || 'gemini').toLowerCase();

  if (provider === 'mock') {
    return generateMockContent({
      systemPrompt,
      userMessage,
      conversationHistory,
      maxOutputTokens,
      timeoutMs,
    });
  }

  if (provider === 'gemini') {
    if (!isProviderConfigured()) {
      const err = new Error('Google Gemini API key (AI_API_KEY) is not configured in backend/.env');
      err.code = 'AI_PROVIDER_UNCONFIGURED';
      err.statusCode = 503;
      throw err;
    }

    return generateGeminiContent({
      systemPrompt,
      userMessage,
      conversationHistory,
      maxOutputTokens,
      timeoutMs,
    });
  }

  const err = new Error(`Unsupported AI_PROVIDER: "${provider}". Expected "gemini" or "mock".`);
  err.code = 'AI_PROVIDER_INVALID';
  err.statusCode = 500;
  throw err;
}

export const aiProvider = {
  isProviderConfigured,
  getProviderInfo,
  generateAIResponse,
};

export default aiProvider;
