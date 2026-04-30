export interface SidebarProps {
  className?: string;
  isMobileMenuOpen?: boolean;
  onMobileNavigate?: () => void;
}

export interface SidebarMenuItem {
  name: string;
  path: string;
}
