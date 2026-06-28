import Link from "next/link";
import { Sparkles, Upload, Wand2 } from "lucide-react";
import { FashionButton } from "@/design-system";
import { DEMO_ROUTES } from "@/features/demo/constants/demo.constants";
import { PageHeader } from "../components/page-header";

const STEPS = [
  {
    icon: Upload,
    title: "Upload portrait + pieces",
    description: "Add your photo and at least one kurta, khussa, or clutch.",
  },
  {
    icon: Wand2,
    title: "AI composes your look",
    description: "Gemini generates a virtual try-on with styling analysis.",
  },
  {
    icon: Sparkles,
    title: "Review & refine",
    description: "Check your score, palette, and 3D preview before the event.",
  },
] as const;

export function TryOnPage() {
  return (
    <div>
      <PageHeader
        label="Virtual Try-On"
        title="See yourself in the outfit"
        description="Upload your portrait and wardrobe pieces — AI composites a photorealistic try-on preview."
      />

      <div className="glass-panel rounded-[var(--radius-3xl)] p-8 md:p-12">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-champagne/15">
            <Sparkles className="size-7 text-champagne" strokeWidth={1.5} />
          </div>
          <h2 className="mt-6 text-heading-md">Style Studio</h2>
          <p className="mt-3 text-body-md text-muted-foreground">
            The full try-on flow lives in the studio — upload, generate, and view
            your composed look with score and colour palette.
          </p>
          <FashionButton variant="primary" size="pill-lg" className="mt-8" asChild>
            <Link href={DEMO_ROUTES.studio}>
              <Wand2 className="size-4" />
              Launch studio
            </Link>
          </FashionButton>
        </div>

        <ol className="mx-auto mt-12 grid max-w-3xl gap-6 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className="rounded-[var(--radius-xl)] border border-border/50 bg-muted/20 p-5"
            >
              <span className="text-caption text-champagne-foreground">
                Step {index + 1}
              </span>
              <step.icon className="mt-3 size-5 text-foreground" strokeWidth={1.5} />
              <h3 className="mt-3 text-body-sm font-medium">{step.title}</h3>
              <p className="mt-2 text-caption text-muted-foreground">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
