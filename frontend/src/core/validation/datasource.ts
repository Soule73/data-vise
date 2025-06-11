import * as z from 'zod';

export const dataSourceSchema = z.object({
  name: z.string().min(2, { message: 'Le nom de la source est requis' }),
  type: z.string().min(2, { message: 'Le type est requis' }),
  endpoint: z.string().url({ message: 'URL de la source invalide' }),
});

export type DataSourceForm = z.infer<typeof dataSourceSchema>;
