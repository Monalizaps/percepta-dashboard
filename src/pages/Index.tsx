
import React from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from '../components/layout/AppSidebar';
import Dashboard from './Dashboard';

const Index = () => {
  return (
    <SidebarProvider>
      {/* Global header with trigger */}
      <header className="h-14 flex items-center border-b border-border bg-background/80 backdrop-blur-sm px-4 sticky top-0 z-50">
        <SidebarTrigger className="mr-4" />
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-primary rounded flex items-center justify-center">
            <span className="text-xs font-bold text-white">P</span>
          </div>
          <span className="font-semibold text-foreground">Percepta Dashboard</span>
        </div>
      </header>

      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 overflow-hidden">
          <Dashboard />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
