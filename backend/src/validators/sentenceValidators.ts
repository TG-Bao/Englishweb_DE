import { z } from 'zod';

export const sentenceIdSchema = z.object({
    id: z.string().refine(value => /^[0-9a-fA-F]{24}$/.test(value), 'Invalid ObjectId format'),
});
