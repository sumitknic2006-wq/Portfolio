import { z } from 'zod';

/**
 * Contact Submission Validation Schema
 * Rejects empty, malformed, oversized input, and unexpected fields
 */
export const contactSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(2, { message: 'Name must be at least 2 characters long' })
    .max(100, { message: 'Name cannot exceed 100 characters' }),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email({ message: 'A valid email address is required' })
    .max(255, { message: 'Email cannot exceed 255 characters' }),
  message: z
    .string({ required_error: 'Message is required' })
    .trim()
    .min(10, { message: 'Message must be at least 10 characters long' })
    .max(2000, { message: 'Message cannot exceed 2000 characters' }),
}).strict({ message: 'Unrecognized fields detected in request payload' });

export default contactSchema;
