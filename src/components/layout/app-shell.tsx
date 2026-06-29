import { AppHeader } from "./app-header";
import { AppMain } from "./app-main";
import { AppSidebar } from "./app-sidebar";
type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <AppHeader />
        <AppMain>{children}</AppMain>
      </div>
    </div>
  );
}
