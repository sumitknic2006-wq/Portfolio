import { assistantService } from '../services/assistant.service.js';
import { aiProvider } from '../services/ai/aiProvider.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * GET /api/v1/assistant/status
 * Check whether the AI provider is configured without exposing secrets
 */
export const getAssistantStatus = asyncHandler(async (req, res) => {
  const providerInfo = aiProvider.getProviderInfo();
  return sendSuccess(res, providerInfo, 'Assistant provider status retrieved successfully');
});

/**
 * POST /api/v1/assistant/chat
 * Primary conversation endpoint for portfolio queries
 */
export const chatWithAssistant = asyncHandler(async (req, res) => {
  const { message, language = 'en', conversationHistory = [] } = req.body;

  if (!aiProvider.isProviderConfigured()) {
    return sendError(
      res,
      'The AI Portfolio Assistant is currently unconfigured. Set AI_API_KEY in backend/.env to activate live answers.',
      503,
      { configured: false },
      'AI_PROVIDER_UNCONFIGURED'
    );
  }

  try {
    const result = await assistantService.askAssistant({
      message,
      language,
      conversationHistory,
    });

    return sendSuccess(
      res,
      {
        answer: result.answer,
        sources: result.sources,
      },
      'Assistant response generated successfully'
    );
  } catch (error) {
    if (error.code === 'AI_PROVIDER_UNCONFIGURED') {
      return sendError(
        res,
        'The AI Portfolio Assistant is currently unconfigured. Set AI_API_KEY in backend/.env to activate live answers.',
        503,
        { configured: false },
        'AI_PROVIDER_UNCONFIGURED'
      );
    }

    if (error.code === 'AI_REQUEST_TIMEOUT') {
      return sendError(
        res,
        'The AI provider request timed out. Please try again.',
        504,
        null,
        'AI_REQUEST_TIMEOUT'
      );
    }

    // Mask internal error details
    return sendError(
      res,
      'Failed to generate assistant response from provider. Please try again shortly.',
      502,
      null,
      'AI_PROVIDER_ERROR'
    );
  }
});

export default {
  getAssistantStatus,
  chatWithAssistant,
};
