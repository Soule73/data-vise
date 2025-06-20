import { useEffect, useState } from "react";
import { useSidebarStore } from "@/core/store/sidebar";
import { useUserStore } from "@/core/store/user";

export function useSidebar(sidebarGroups: any[]) {
  const user = useUserStore((s) => s.user);
  const open = useSidebarStore((s) => s.open);
  const closeSidebar = useSidebarStore((s) => s.closeSidebar);
  const isMobile = useSidebarStore((s) => s.isMobile);
  const hasPermission = useUserStore((s) => s.hasPermission);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const toggleGroup = (label: string) =>
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));

  
  // Fermer le sidebar si on clique en dehors (overlay ou desktop)
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      const sidebar = document.getElementById("sidebar-panel");
      if (sidebar && !sidebar.contains(e.target as Node)) {
        closeSidebar();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, closeSidebar]);

  // Filtrage des groupes selon les permissions
  const filteredGroups = sidebarGroups.filter((group: any) =>
    group.items.some(
      (item: any) => !item.permission || hasPermission(item.permission)
    )
  );

  return {
    user,
    open,
    closeSidebar,
    isMobile,
    hasPermission,
    openGroups,
    toggleGroup,
    filteredGroups,
  };
}
