import * as z from 'zod';

export const userSchema = z.object({
  email: z.string().email({ message: 'Email invalide' }),
  username: z.string().min(2, 'Le nom d’utilisateur est requis'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères').optional(),
  role: z.string().min(1, 'Le rôle est requis'),
});
