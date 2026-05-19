import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background bg-grid">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center border-b border-border bg-card/40 backdrop-blur sticky top-0 z-20">
            <SidebarTrigger className="ml-2" />
            <div className="ml-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse-glow" style={{ background: "hsl(var(--success))" }} />
              <span className="font-display text-xs uppercase tracking-widest text-muted-foreground">
                Induction Motor Starter Simulation Lab
              </span>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
