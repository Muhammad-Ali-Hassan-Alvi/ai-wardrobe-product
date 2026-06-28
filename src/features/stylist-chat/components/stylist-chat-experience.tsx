"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Send, Sparkles } from "lucide-react";
import {
  FashionButton,
  FashionTextarea,
} from "@/design-system";
import { STYLIST_CHAT } from "@/features/demo/constants/landing-images";
import { PageHeader } from "@/features/app/components/page-header";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const STARTER_PROMPTS = [
  "Meri cousin ki shaadi hai kal — kya pehnu?",
  "Navy kurta with gold khussa — does it work for mehndi?",
  "Suggest a modest Eid outfit with pastel colours.",
] as const;

export function StylistChatExperience() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Assalam o alaikum! I'm your AI Wardrobe stylist. Ask about shaadi outfits, colour pairing, or what to wear for any occasion — English or Urdu.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    setError(null);
    setInput("");
    const userMessage: ChatMessage = {
      id: `user-${crypto.randomUUID()}`,
      role: "user",
      content: trimmed,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsSending(true);

    try {
      const history = [...messages, userMessage]
        .filter((m) => m.id !== "welcome")
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/v1/stylist/chat", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: history.slice(0, -1),
        }),
      });

      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error ?? "Failed to get reply");
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${crypto.randomUUID()}`,
          role: "assistant",
          content: json.data.reply as string,
        },
      ]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <PageHeader
        label="AI Stylist"
        title="Ask anything"
        description="Get modest Pakistani styling advice — shaadi, Eid, formal, or everyday. Responds in English or Urdu."
      />

      <div className="flex min-h-0 flex-1 flex-col glass-panel rounded-[var(--radius-3xl)]">
        <div className="flex-1 space-y-4 overflow-y-auto p-4 md:p-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "assistant" && (
                <div className="mr-3 flex size-8 shrink-0 items-center justify-center rounded-full bg-champagne/15">
                  <Sparkles className="size-3.5 text-champagne" strokeWidth={1.5} />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-[var(--radius-2xl)] px-4 py-3 text-body-sm leading-relaxed ${
                  message.role === "user"
                    ? "rounded-br-sm bg-primary text-primary-foreground"
                    : "rounded-bl-sm bg-muted/50 text-foreground"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}

          {isSending && (
            <div className="flex items-center gap-2 text-body-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Stylist is thinking…
            </div>
          )}

          {error && (
            <p className="text-body-sm text-destructive">{error}</p>
          )}

          <div ref={bottomRef} />
        </div>

        <div className="border-t border-border/40 p-4 md:p-5">
          <div className="mb-3 flex flex-wrap gap-2">
            {STARTER_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => sendMessage(prompt)}
                className="rounded-full border border-border/60 px-3 py-1.5 text-caption text-muted-foreground transition hover:border-border hover:text-foreground"
              >
                {prompt}
              </button>
            ))}
          </div>

          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              void sendMessage(input);
            }}
          >
            <FashionTextarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={STYLIST_CHAT.user}
              rows={2}
              className="min-h-0 flex-1 resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void sendMessage(input);
                }
              }}
            />
            <FashionButton
              type="submit"
              variant="primary"
              size="icon"
              className="size-11 shrink-0 self-end"
              disabled={isSending || !input.trim()}
              aria-label="Send message"
            >
              <Send className="size-4" />
            </FashionButton>
          </form>
        </div>
      </div>
    </div>
  );
}
