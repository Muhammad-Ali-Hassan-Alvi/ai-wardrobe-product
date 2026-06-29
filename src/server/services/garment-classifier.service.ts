import { z } from "zod";
import type { UploadSlot } from "@/generated/prisma/client";
import { getAiProvider } from "../ai";
import { GeminiAiProvider } from "../ai/providers/gemini.provider";

const garmentClassificationSchema = z.object({
  slot: z.enum(["DRESS", "SHOES", "ACCESSORIES"]),
  label: z.string().min(2).max(80),
  confidence: z.enum(["high", "medium", "low"]).optional(),
});

export type GarmentClassification = z.infer<typeof garmentClassificationSchema>;

const CLASSIFY_PROMPT = `You are a fashion vision AI for a women's modest wardrobe app.

Look at this clothing or accessory image and classify it into exactly ONE category:
- DRESS: tops, kurtas, shalwar kameez, dresses, abayas, dupattas worn as main piece, jackets, coats
- SHOES: shoes, khussa, heels, sandals, boots, sneakers
- ACCESSORIES: bags, clutches, jewelry, belts, scarves as accent, hats

Return JSON only:
{
  "slot": "DRESS" | "SHOES" | "ACCESSORIES",
  "label": "short human-readable name e.g. Embroidered navy kurta",
  "confidence": "high" | "medium" | "low"
}

Do not use generic placeholders. Describe what you actually see.`;

export async function classifyGarmentImage(
  imageUrl: string,
): Promise<GarmentClassification> {
  const ai = getAiProvider();

  if (ai instanceof GeminiAiProvider) {
    const raw = await ai.analyzeImages([imageUrl], CLASSIFY_PROMPT);
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    return garmentClassificationSchema.parse(JSON.parse(jsonMatch?.[0] ?? raw));
  }

  return garmentClassificationSchema.parse(
    await ai.completeStructured(
      [
        {
          role: "system",
          content: "Respond in JSON only.",
        },
        {
          role: "user",
          content: `${CLASSIFY_PROMPT}\n\nImage: ${imageUrl}`,
        },
      ],
      { schema: garmentClassificationSchema },
    ),
  );
}

export function slotToStudioKey(
  slot: UploadSlot,
): "dress" | "shoes" | "accessories" {
  if (slot === "SHOES") return "shoes";
  if (slot === "ACCESSORIES") return "accessories";
  return "dress";
}
