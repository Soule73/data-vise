import { useEffect } from "react";
import { useDashboardStore } from "@store/dashboard";
import { useSidebarStore } from "@store/sidebar";

export default function useNavBar() {
  // Affiche le bouton menu sur toutes les tailles d'écran
  const { open, openSidebar, closeSidebar } = useSidebarStore();

  // Récupère le tableau breadcrumb du store
  const breadcrumb = useDashboardStore((s) => s.breadcrumb);

  // Met à jour dynamiquement le titre de la page selon le breadcrumb
  useEffect(() => {
    if (breadcrumb && breadcrumb.length > 0) {
      document.title = `${breadcrumb[breadcrumb.length - 1].label} – DataVise`;
    } else {
      document.title = "DataVise";
    }
  }, [breadcrumb]);

  return {
    open,
    openSidebar,
    closeSidebar,
    breadcrumb,
  };
}
