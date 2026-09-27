import { z } from 'zod';

export const dayStepIconSchema = z.enum([
  'weather',
  'navigation',
  'communication',
  'earth-observation',
  'timing',
  'emergency',
  'entertainment',
  'general',
]);

export const dayAnalysisStepSchema = z.object({
  time: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  icon: dayStepIconSchema,
  satelliteTypes: z.array(z.string().min(1)).min(1).max(3),
  explanation: z.string().min(1),
  examples: z.array(z.string().min(1)).min(1).max(3),
});

export const dayAnalysisSchema = z.object({
  summary: z.string().min(1),
  steps: z.array(dayAnalysisStepSchema).min(1).max(8),
});

export type DayAnalysis = z.infer<typeof dayAnalysisSchema>;
export type DayAnalysisStep = z.infer<typeof dayAnalysisStepSchema>;
