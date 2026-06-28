import { AppShell } from "@/components/layout/app-shell";
import { PageContainer } from "@/components/layout";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppShell>
      <PageContainer>{children}</PageContainer>
    </AppShell>
  );
}
