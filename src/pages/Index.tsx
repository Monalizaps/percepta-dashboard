
import React from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from '../components/layout/AppSidebar';
import Dashboard from './Dashboard';
import { BreakingNews } from '../components/dashboard/BreakingNews';
import { useSecurityOverview } from '../hooks/useSecurityOverview';

const Index = () => {
  const { overview } = useSecurityOverview();

  return (
    <SidebarProvider>
      {/* Global header with trigger */}
      <header className="h-14 flex items-center border-b border-border bg-background/80 backdrop-blur-sm px-4 sticky top-0 z-50">
        <SidebarTrigger className="mr-4" />
        <div className="flex items-center gap-3">
          <img src="/logop.png" alt="Percepta Logo" className="h-6 w-auto object-contain" />
        </div>
      </header>

      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden md:ml-56">
          <Dashboard />
        </main>
      </div>

      {/* Breaking News notification */}
      <BreakingNews insights={overview.insights} />
    </SidebarProvider>
  );
};

export default Index;
