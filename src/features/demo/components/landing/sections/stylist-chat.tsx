"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, UserRound } from "lucide-react";
import {
  Caption,
  FashionContainer,
  HeadingLG,
  Label,
} from "@/design-system";
import { ease } from "@/design-system/motion";
import { STYLIST_CHAT } from "../../../constants/landing-images";
import { SectionReveal } from "../shared/section-reveal";

export function StylistChatSection() {
  const [showAi, setShowAi] = useState(false);
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    const showTimer = setTimeout(() => setShowAi(true), 800);
    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!showAi) return;
    let i = 0;
    const text = STYLIST_CHAT.ai;
    const interval = setInterval(() => {
      i++;
      setTypedText(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, 28);
    return () => clearInterval(interval);
  }, [showAi]);

  const isTyping = showAi && typedText.length < STYLIST_CHAT.ai.length;

  return (
    <section className="relative py-[var(--space-section-y-lg)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,var(--champagne-glow),transparent_50%)]" />

      <FashionContainer size="narrow">
        <SectionReveal className="mb-10 text-center">
          <Label className="text-foreground/75">AI Stylist</Label>
          <HeadingLG className="mt-4">Ask anything.</HeadingLG>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <div className="glass-strong mx-auto max-w-md space-y-6 rounded-[var(--radius-3xl)] p-8 shadow-soft-xl">
            {/* User bubble */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: ease.premium }}
              className="flex justify-end"
            >
              <div className="flex max-w-[85%] items-end gap-2">
                <div className="max-w-full rounded-[var(--radius-2xl)] rounded-br-sm bg-primary px-5 py-3.5 text-primary-foreground shadow-soft-sm">
                  <p className="text-body-sm">{STYLIST_CHAT.user}</p>
                </div>
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15">
                  <UserRound className="size-3.5 text-primary" strokeWidth={1.5} />
                </div>
              </div>
            </motion.div>

            {/* AI bubble */}
            {showAi && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: ease.premium }}
                className="flex items-start gap-3"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-champagne/15">
                  <MessageCircle className="size-3.5 text-champagne" strokeWidth={1.5} />
                </div>
                <div className="max-w-[85%] rounded-[var(--radius-2xl)] rounded-bl-sm glass px-5 py-3.5 shadow-soft-sm">
                  <p className="text-body-sm leading-relaxed text-foreground">
                    {typedText}
                    {isTyping && (
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity }}
                        className="ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 bg-champagne"
                      />
                    )}
                  </p>
                  <Caption className="mt-2 text-foreground/70">
                    AI Wardrobe Stylist
                  </Caption>
                </div>
              </motion.div>
            )}
          </div>
        </SectionReveal>
      </FashionContainer>
    </section>
  );
}
