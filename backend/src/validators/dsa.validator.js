import { z } from 'zod';

export const dsaProblemItemSchema = z.object({
  slug: z.string().trim().min(2).max(100).optional(),
  platform: z.enum(['leetcode', 'codeforces'], {
    errorMap: () => ({ message: 'Platform must be "leetcode" or "codeforces"' }),
  }),
  problemId: z.string({ required_error: 'Problem ID or number is required' }).trim().min(1).max(50),
  title: z.string({ required_error: 'Problem title is required' }).trim().min(2).max(200),
  difficulty: z.string({ required_error: 'Difficulty or rating is required' }).trim().min(1).max(50),
  rating: z.number().int().positive().nullable().optional(),
  category: z.string().trim().max(100).optional().default('General'),
  tags: z.array(z.string().trim()).optional().default([]),
  problemUrl: z.string({ required_error: 'Original problem URL is required' }).url('Invalid problem URL'),
  summary: z.string().trim().max(5000).optional().default(''),
  approach: z.string().trim().max(10000).optional().default(''),
  dryRun: z.string().trim().max(10000).optional().default(''),
  dryRunSteps: z
    .array(
      z.object({
        step: z.number().int().positive(),
        description: z.string().trim().min(1),
        variables: z.record(z.any()).optional().default({}),
        highlight: z.string().trim().optional().default(''),
      })
    )
    .optional()
    .default([]),
  timeComplexity: z.string().trim().max(100).optional().default('O(N)'),
  spaceComplexity: z.string().trim().max(100).optional().default('O(1)'),
  sourceCode: z.string().trim().max(50000).optional().default(''),
  language: z.string().trim().max(50).optional().default('C++'),
  status: z.enum(['Solved', 'Attempted', 'Review']).optional().default('Solved'),
  runtime: z.string().trim().max(50).nullable().optional(),
  memory: z.string().trim().max(50).nullable().optional(),
  submissionDate: z.string().datetime().optional().or(z.date().optional()),
  provenance: z.enum(['live_sync', 'manual_import', 'curated_example']).optional().default('manual_import'),
});

export const dsaImportSchema = z.object({
  platform: z.enum(['leetcode', 'codeforces']).optional(),
  problems: z.array(z.any()).min(1, 'Import list must contain at least 1 problem record').max(1000).optional(),
  data: z.any().optional(),
}).refine((data) => data.problems || data.data, {
  message: 'Either "problems" array or "data" payload must be provided',
});

export const dsaUpdateSchema = z.object({
  approach: z.string().trim().max(10000).optional(),
  dryRun: z.string().trim().max(10000).optional(),
  sourceCode: z.string().trim().max(50000).optional(),
  language: z.string().trim().max(50).optional(),
  timeComplexity: z.string().trim().max(100).optional(),
  spaceComplexity: z.string().trim().max(100).optional(),
  status: z.enum(['Solved', 'Attempted', 'Review']).optional(),
  notes: z.string().trim().max(5000).optional(),
});
