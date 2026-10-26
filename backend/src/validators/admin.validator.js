import { z } from 'zod';

export const adminLoginSchema = z
  .object({
    email: z
      .string({ required_error: 'Admin email is required' })
      .trim()
      .email({ message: 'A valid email address is required' })
      .max(255),
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, { message: 'Password must be at least 6 characters' })
      .max(128, { message: 'Password cannot exceed 128 characters' }),
  })
  .strict({ message: 'Unrecognized fields in login payload' });

export const messageStatusSchema = z
  .object({
    status: z.enum(['pending', 'processed', 'replied', 'archived'], {
      errorMap: () => ({ message: 'Status must be one of: pending, processed, replied, archived' }),
    }),
  })
  .strict();

export const messageReplySchema = z
  .object({
    replyText: z
      .string({ required_error: 'Reply text is required' })
      .trim()
      .min(2, { message: 'Reply must be at least 2 characters long' })
      .max(5000, { message: 'Reply cannot exceed 5000 characters' }),
    subject: z
      .string()
      .trim()
      .max(200, { message: 'Subject cannot exceed 200 characters' })
      .optional(),
  })
  .strict();
