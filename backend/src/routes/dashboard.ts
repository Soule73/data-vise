import express, { Request, Response, NextFunction } from 'express';
import Dashboard from '@/models/Dashboard';
import Widget from '@/models/Widget';
import { requireAuth, AuthRequest } from '@/middleware/auth';

const router = express.Router();

// Récupérer le dashboard de l'utilisateur courant (single dashboard par user)
router.get(
  '/me',
  requireAuth,
  async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      let dashboard = await Dashboard.findOne({ userId: req.user!.id });
      if (!dashboard) {
        dashboard = await Dashboard.create({
          userId: req.user!.id,
          title: 'Mon dashboard',
          layout: [],
        });
      }
      // Jointure widgets : enrichir chaque item du layout avec le widget source
      const layout = dashboard.layout || [];
      const widgetIds = layout.map((item: any) => item.widgetId);
      const widgets = await Widget.find({ widgetId: { $in: widgetIds } });
      // Map widgetId -> widget
      const widgetMap = new Map(widgets.map(w => [w.widgetId, w]));
      // Debug : log des widgetId non trouvés
      const notFound = widgetIds.filter(id => !widgetMap.has(id));
      if (notFound.length > 0) {
        console.warn('Widget(s) non trouvés pour le dashboard:', notFound);
      }
      // Enrichir le layout et nettoyer les objets (POJO only)
      const enrichedLayout = layout.map((item: any) => {
        // On extrait les champs utiles de l'item (Mongoose ou POJO)
        const base = item._doc ? item._doc : item;
        return {
          widgetId: base.widgetId,
          w: base.w,
          h: base.h,
          x: base.x,
          y: base.y,
          widget: widgetMap.get(base.widgetId) || null
        };
      });
      res.json({
        ...dashboard.toObject(),
        layout: enrichedLayout
      });
    } catch (err) {
      res.status(500).json({ message: 'Erreur serveur.' });
      return;
    }
  }
);

// Mettre à jour le layout du dashboard
router.put(
  '/:id',
  requireAuth,
  async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // On attend { layout: [{ widgetId, w, h, x, y }] }
      const dashboard = await Dashboard.findByIdAndUpdate(
        req.params.id,
        { layout: req.body.layout },
        { new: true }
      );
      if (!dashboard) {
        res.status(404).json({ message: 'Dashboard non trouvé.' });
        return;
      }
      res.json(dashboard);
    } catch (err) {
      res.status(500).json({ message: 'Erreur serveur.' });
      return;
    }
  }
);

// DEBUG : endpoint temporaire pour lister tous les widgets (widgetId, _id, title)
router.get('/debug/widgets', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const widgets = await Widget.find({}, { widgetId: 1, _id: 1, title: 1 });
    res.json(widgets);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

export default router;
