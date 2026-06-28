import { EmptyState } from "@/components/feedback";
import { Sparkles } from "lucide-react";

export function AppShellPlaceholder() {
  return (
    <EmptyState
      icon={Sparkles}
      title="Application shell ready"
      description="The foundation is configured. Feature modules — auth, wardrobe, try-on, and AI — will be built in upcoming sprints."
    />
  );
}
