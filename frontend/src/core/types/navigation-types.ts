// ======================================================
// 3. Sidebar & Navigation
// ======================================================

import type { JSX } from "react";

export interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active?: boolean;
  children?: React.ReactNode;
}

export interface SidebarGroup {
  label: string;
  permissions: string[];
  items: SidebarGroupItem[];
}
export interface SidebarGroupItem {
  to: string;
  label: string;
  icon: JSX.Element;
  permission?: string;
}
