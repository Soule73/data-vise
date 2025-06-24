// ======================================================
// 9. Stores & Thèmes
// ======================================================

export interface SidebarStore {
  open: boolean;
  isMobile: boolean;
  setIsMobile: (mobile: boolean) => void;
  openSidebar: () => void;
  closeSidebar: () => void;
}

export interface SourcesStore {
  sources: any[];
  setSources: (s: any[]) => void;
}

export interface TableSearchState {
  search: string;
  setSearch: (search: string) => void;
  reset: () => void;
}

export type ThemeMode = "system" | "light" | "dark";

export interface ThemeStore {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

export interface AnimatedChartLogoProps {
  width?: number | string;
  height?: number | string;
}
