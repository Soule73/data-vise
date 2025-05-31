import express, { Request, Response, NextFunction } from 'express';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Inscription
router.post(
  '/register',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { username, email, password } = req.body;
    const errors: Record<string, string> = {};
    if (!username || username.length < 2) errors.username = 'Le nom d\'utilisateur doit contenir au moins 2 caractères.';
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errors.email = 'Email invalide.';
    if (!password || password.length < 6) errors.password = 'Le mot de passe doit contenir au moins 6 caractères.';
    if (Object.keys(errors).length > 0) {
      res.status(422).json({ errors });
      return;
    }
    try {
      const existing = await User.findOne({ email });
      if (existing) {
        res.status(422).json({ errors: { email: 'Cet email est déjà utilisé.' } });
        return;
      }
      const hash = await bcrypt.hash(password, 10);
      const user = await User.create({ username, email, password: hash });
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '7d' }
      );
      res.status(201).json({
        user: { id: user._id, username: user.username, email: user.email, role: user.role },
        token,
      });
    } catch (err) {
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  }
);

// Connexion
router.post(
  '/login',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password } = req.body;
    const errors: Record<string, string> = {};
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errors.email = 'Email invalide.';
    if (!password) errors.password = 'Mot de passe requis.';
    if (Object.keys(errors).length > 0) {
      res.status(422).json({ errors });
      return;
    }
    try {
      const user = await User.findOne({ email });
      if (!user) {
        res.status(401).json({ message: 'Identifiants invalides.' });
        return;
      }
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        res.status(401).json({ message: 'Identifiants invalides.' });
        return;
      }
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '7d' }
      );
      res.json({
        user: { id: user._id, username: user.username, email: user.email, role: user.role },
        token,
      });
    } catch (err) {
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  }
);

export default router;
