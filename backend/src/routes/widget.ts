import express, { Request, Response, NextFunction } from 'express';
import Widget from '@/models/Widget';
import { requireAuth } from '@/middleware/auth';

const router = express.Router();

// Lister tous les widgets d'un dashboard
router.get(
  '/',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { dashboardId } = req.query;
      const filter: any = dashboardId ? { dashboardId } : {};
      const widgets = await Widget.find(filter);
      res.json(widgets);
    } catch (err) {
      res.status(500).json({ message: 'Erreur serveur.' });
      return;
    }
  }
);

// Créer un widget
router.post(
  '/',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { widgetId, title, type, dataSourceId, config } = req.body;
      if (!widgetId || !title || !type || !dataSourceId) {
        res.status(400).json({ message: 'Champs requis manquants.' });
        return;
      }
      const widget = await Widget.create({ widgetId, title, type, dataSourceId, config });
      res.status(201).json(widget);
    } catch (err) {
      console.error('Erreur lors de la création du widget:', err);
      res.status(500).json({ message: 'Erreur serveur.' });
      return;
    }
  }
);

// Mettre à jour un widget
router.put(
  '/:id',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const widget = await Widget.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!widget) {
        res.status(404).json({ message: 'Widget non trouvé.' });
        return;
      }
      res.json(widget);
    } catch (err) {
      res.status(500).json({ message: 'Erreur serveur.' });
      return;
    }
  }
);

// Supprimer un widget
router.delete(
  '/:id',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const widget = await Widget.findByIdAndDelete(req.params.id);
      if (!widget) {
        res.status(404).json({ message: 'Widget non trouvé.' });
        return;
      }
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ message: 'Erreur serveur.' });
      return;
    }
  }
);

// Récupérer un widget par ID
router.get(
  '/:id',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const widget = await Widget.findById(req.params.id);
      if (!widget) {
        res.status(404).json({ message: 'Widget non trouvé.' });
        return;
      }
      res.json(widget);
    } catch (err) {
      res.status(500).json({ message: 'Erreur serveur.' });
      return;
    }
  }
);

export default router;
