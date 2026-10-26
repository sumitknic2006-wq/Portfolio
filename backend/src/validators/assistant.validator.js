import { z } from 'zod';

/**
 * Assistant Chat Message Validation Schema
 * Rejects empty or oversized messages and enforces bounded conversation history
 */
export const assistantChatSchema = z.object({
  message: z
    .string({ required_error: 'Message is required' })
    .trim()
    .min(1, { message: 'Message cannot be empty' })
    .max(500, { message: 'Message cannot exceed 500 characters' }),
  language: z
    .enum(['en', 'hi'], { invalid_type_error: "Language must be either 'en' or 'hi'" })
    .optional()
    .default('en'),
  conversationHistory: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant', 'model']),
        text: z.string().trim().max(500),
      })
    )
    .max(4, { message: 'Conversation history is limited to the last 4 messages' })
    .optional()
    .default([]),
}).strict({ message: 'Unrecognized fields detected in assistant chat request' });

export default assistantChatSchema;
