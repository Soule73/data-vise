import express, { Request, Response, NextFunction } from 'express';
import DataSource from '@/models/DataSource';
import { requireAuth } from '@/middleware/auth';

const router = express.Router();

// Lister toutes les sources de l'utilisateur (ou globales)
router.get(
  '/',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // TODO: filtrer par userId si besoin (ajouter userId dans le modèle si multi-user)
      const sources = await DataSource.find();
      res.json(sources);
    } catch (err) {
      res.status(500).json({ message: 'Erreur serveur.' });
      return;
    }
  }
);

// Créer une nouvelle source
router.post(
  '/',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, type, endpoint, config } = req.body;
      if (!name || !type || !endpoint) {
        res.status(400).json({ message: 'Champs requis manquants.' });
        return;
      }
      const source = await DataSource.create({ name, type, endpoint, config });
      res.status(201).json(source);
    } catch (err) {
      res.status(500).json({ message: 'Erreur serveur.' });
      return;
    }
  }
);

// Récupérer une source par ID
router.get(
  '/:id',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const source = await DataSource.findById(req.params.id);
      if (!source) {
        res.status(404).json({ message: 'Source non trouvée.' });
        return;
      }
      res.json(source);
    } catch (err) {
      res.status(500).json({ message: 'Erreur serveur.' });
      return;
    }
  }
);

// Mettre à jour une source
router.put(
  '/:id',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, type, endpoint, config } = req.body;
      const source = await DataSource.findByIdAndUpdate(
        req.params.id,
        { name, type, endpoint, config },
        { new: true }
      );
      if (!source) {
        res.status(404).json({ message: 'Source non trouvée.' });
        return;
      }
      res.json(source);
    } catch (err) {
      res.status(500).json({ message: 'Erreur serveur.' });
      return;
    }
  }
);

// Supprimer une source
router.delete(
  '/:id',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const source = await DataSource.findByIdAndDelete(req.params.id);
      if (!source) {
        res.status(404).json({ message: 'Source non trouvée.' });
        return;
      }
      res.json({ message: 'Source supprimée.' });
    } catch (err) {
      res.status(500).json({ message: 'Erreur serveur.' });
      return;
    }
  }
);

// Endpoint pour détecter dynamiquement les colonnes d'une source (exemple : JSON ou endpoint externe)
router.post(
  '/detect-columns',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { endpoint } = req.body;
      if (!endpoint) {
        res.status(400).json({ message: 'Endpoint requis.' });
        return;
      }
      // Récupérer les données (GET ou POST selon le type de source)
      let fetchImpl;
      try {
        fetchImpl = (await import('node-fetch')).default;
      } catch (e) {
        res.status(500).json({ message: 'node-fetch non installé.' });
        return;
      }
      const response = await fetchImpl(endpoint);
      const data = await response.json();
      // Détecter les colonnes sur le premier objet (ou sur tout le tableau)
      let columns: string[] = [];
      if (Array.isArray(data) && data.length > 0) {
        columns = Object.keys(data[0]);
      } else if (typeof data === 'object' && data !== null) {
        columns = Object.keys(data);
      }
      res.json({ columns });
    } catch (err) {
      res.status(500).json({ message: 'Impossible de détecter les colonnes.' });
      return;
    }
  }
);

// Endpoint pour servir un fichier JSON de test (pour la démo frontend)
router.get('/demo/ventes', (req, res) => {
  res.sendFile(require('path').resolve(__dirname, '../data/ventes-exemple.json'));
});

export default router;
