import * as z from 'zod';

export const roleSchema = z.object({
  name: z.string().min(2, 'Le nom du rôle est requis'),
  description: z.string().optional(),
  permissions: z.array(z.string()).min(1, 'Au moins une permission est requise'),
});
