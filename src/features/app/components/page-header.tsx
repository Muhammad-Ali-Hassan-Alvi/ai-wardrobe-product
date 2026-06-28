import type { ReactNode } from "react";
import { HeadingLG, Label } from "@/design-system";

type PageHeaderProps = {
  label: string;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function PageHeader({ label, title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <Label className="text-champagne-foreground">{label}</Label>
        <HeadingLG className="mt-2">{title}</HeadingLG>
        {description && (
          <p className="mt-2 max-w-2xl text-body-md text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
