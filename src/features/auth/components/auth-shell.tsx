import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Caption, FashionContainer, HeadingLG } from "@/design-system";
import { siteConfig } from "@/config/site";
import { DEMO_ROUTES } from "@/features/demo/constants/demo.constants";

type AuthShellProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  footer: React.ReactNode;
};

export function AuthShell({ title, description, children, footer }: AuthShellProps) {
  return (
    <div className="page-ambient flex min-h-screen flex-col">
      <FashionContainer className="flex flex-1 flex-col items-center justify-center py-16">
        <Link
          href={DEMO_ROUTES.landing}
          className="mb-8 inline-flex items-center gap-2.5 text-heading-sm text-foreground no-underline"
        >
          <div className="flex size-9 items-center justify-center rounded-full bg-foreground/5 ring-1 ring-border/50">
            <Sparkles className="size-4 text-champagne" strokeWidth={1.5} />
          </div>
          <span>{siteConfig.name}</span>
        </Link>

        <div className="glass-panel w-full max-w-md rounded-[var(--radius-3xl)] p-8 md:p-10">
          <HeadingLG className="text-center text-foreground">{title}</HeadingLG>
          <Caption className="mt-2 block text-center text-muted-foreground">
            {description}
          </Caption>
          <div className="mt-8">{children}</div>
          <div className="mt-6 text-center text-body-sm text-muted-foreground">
            {footer}
          </div>
        </div>
      </FashionContainer>
    </div>
  );
}
