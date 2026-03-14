import { z } from "zod";

export const createSentenceSchema = z.object({
  text: z.string().min(1, "Text is required"),
  audioUrl: z.string().url("Invalid audio URL"),
});

export const updateSentenceSchema = z.object({
  text: z.string().min(1, "Text is required").optional(),
  audioUrl: z.string().url("Invalid audio URL").optional(),
});

export type CreateSentenceDto = z.infer<typeof createSentenceSchema>;
export type UpdateSentenceDto = z.infer<typeof updateSentenceSchema>;
