import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { typography } from "../tokens";

type TypographyElement = "h1" | "h2" | "h3" | "h4" | "p" | "span" | "label";

interface TypographyProps<T extends TypographyElement> {
  as?: T;
  className?: string;
  children: ReactNode;
}

function createTypographyComponent(
  defaultElement: TypographyElement,
  styleClass: string,
) {
  return function TypographyComponent({
    as,
    className,
    children,
  }: TypographyProps<TypographyElement>) {
    const Component = as ?? defaultElement;
    return (
      <Component className={cn(styleClass, className)}>{children}</Component>
    );
  };
}

export const DisplayXL = createTypographyComponent("h1", `${typography.displayXl} text-foreground`);
export const DisplayLG = createTypographyComponent("h1", `${typography.displayLg} text-foreground`);
export const HeadingXL = createTypographyComponent("h2", `${typography.headingXl} text-foreground`);
export const HeadingLG = createTypographyComponent("h2", `${typography.headingLg} text-foreground`);
export const HeadingMD = createTypographyComponent("h3", `${typography.headingMd} text-foreground`);
export const HeadingSM = createTypographyComponent("h4", `${typography.headingSm} text-foreground`);
export const BodyLG = createTypographyComponent("p", `${typography.bodyLg} text-foreground`);
export const BodyMD = createTypographyComponent("p", `${typography.bodyMd} text-foreground`);
export const BodySM = createTypographyComponent("p", `${typography.bodySm} text-foreground`);
export const Label = createTypographyComponent("label", `${typography.label} text-foreground`);
export const Caption = createTypographyComponent("span", `${typography.caption} text-muted-foreground`);
