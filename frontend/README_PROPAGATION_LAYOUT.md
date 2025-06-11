# Propagation des tailles des widgets dans le Dashboard

## Fonctionnement général

- **Resize natif** : Lorsqu’un utilisateur redimensionne un widget (resize: both), le composant `DashboardGridItem` détecte le changement via un `ResizeObserver`.
- **Mise à jour du layout** : Le hook `useWidgetResize` calcule la nouvelle largeur (en %) et hauteur (en px) et appelle la fonction `onSwapLayout` avec le nouveau layout.
- **Propagation** :
  - `onSwapLayout` est propagé du composant `DashboardGridItem` jusqu’à `DashboardGrid`, puis jusqu’au hook global `useDashboard`.
  - Le layout est alors mis à jour dans le store Zustand (ou local selon le mode), ce qui rend la modification persistante côté frontend.
- **Sauvegarde** : Lors d’un clic sur “Sauvegarder”, le layout stocké dans Zustand (avec les tailles à jour) est envoyé au backend.
- **Backend** : Le backend enregistre les valeurs width/height réelles (width en %, height en px) pour chaque widget du dashboard.

## Points clés

- Plus de système de grille : seules les valeurs width (en %) et height (en px) sont utilisées.
- Toute modification de taille est immédiatement propagée jusqu’au store global.
- La sauvegarde envoie toujours l’état réel du layout.

## Exemple de flux

1. L’utilisateur resize un widget.
2. `useWidgetResize` appelle `onSwapLayout` avec le nouveau layout.
3. `onSwapLayout` met à jour Zustand via le hook global.
4. L’utilisateur clique sur “Sauvegarder” : le layout à jour est envoyé au backend.

## Tests manuels recommandés

- Redimensionner un widget, puis sauvegarder : vérifier que les tailles sont bien persistées côté backend.
- Recharger la page : vérifier que les tailles sont bien restaurées.
- Ajouter/supprimer un widget : vérifier que le layout reste cohérent.

---

Pour toute modification future, s’assurer que la chaîne de propagation (resize → onSwapLayout → Zustand → backend) reste intacte.
