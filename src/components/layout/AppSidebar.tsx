
import React from 'react';
import { FolderGit2, Info, LineChart, RefreshCw, Settings, Shield, Sparkles } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

const menuItems = [
  { title: 'Overview', url: '/', icon: Shield },
  { title: 'Findings', url: '/anomalies', icon: Sparkles },
  { title: 'Metrics', url: '/analytics', icon: LineChart },
  { title: 'Dashboards', url: '/dashboards', icon: FolderGit2 },
  { title: 'Configurações', url: '/settings', icon: Settings },
  { title: 'Sobre', url: '/about', icon: Info },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === 'collapsed';

  const isActive = (path: string) => currentPath === path;

  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-gradient-accent text-primary-foreground font-medium shadow-lg" 
      : "hover:bg-sidebar-accent/50 text-sidebar-foreground";

  return (
    <Sidebar
      className={`${collapsed ? "w-14" : "w-60"} transition-all duration-300`}
      collapsible="icon"
    >
      <SidebarContent className="bg-sidebar-background border-r border-sidebar-border">
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-lg font-bold text-gradient">Percepta</h1>
                <p className="text-xs text-sidebar-foreground/70">Security Intelligence</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70">
            Navegação
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={({ isActive }) => `
                        flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
                        ${getNavClass({ isActive })}
                      `}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Auto-refresh indicator */}
        {!collapsed && (
          <div className="mt-auto p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-2 text-xs text-sidebar-foreground/50">
              <RefreshCw className="h-3 w-3 animate-spin" />
              <span>Realtime: websocket + polling</span>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
