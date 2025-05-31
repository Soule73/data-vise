import * as z from 'zod';

export const registerSchema = z.object({
  username: z.string().min(2, { message: 'Le nom d’utilisateur doit contenir au moins 2 caractères' }),
  email: z.string().email({ message: 'Adresse e-mail invalide' }),
  password: z.string().min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' }),
  confirmPassword: z.string({ required_error: 'La confirmation du mot de passe est requise' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

export type RegisterForm = z.infer<typeof registerSchema>;
