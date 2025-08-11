import { useEffect } from "react";
import { create } from "zustand";
import type { SidebarStore } from "@type/themeTypes";

export const useSidebarStore = create<SidebarStore>((set) => ({
  open: false,
  isMobile: typeof window !== "undefined" ? window.innerWidth < 768 : false,
  setIsMobile: (mobile) => set({ isMobile: mobile }),
  openSidebar: () => set({ open: true }),
  closeSidebar: () => set({ open: false }),
}));

// Hook pour gérer la fermeture automatique du sidebar mobile au resize md+
export function useSidebarAutoClose() {
  const closeSidebar = useSidebarStore((s) => s.closeSidebar);
  const setIsMobile = useSidebarStore((s) => s.setIsMobile);
  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) closeSidebar();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [closeSidebar, setIsMobile]);
}
