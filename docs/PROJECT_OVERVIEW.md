# AI Wardrobe — Project Overview

## Vision

AI Wardrobe is a production-ready AI Fashion SaaS platform that helps users manage a digital wardrobe, visualize outfits with AI virtual try-on, receive personalized fashion recommendations, and interact with an AI stylist — all from a modern web application.

## Problem Statement

People struggle to visualize how clothing items work together, remember what they own, and get actionable styling advice. AI Wardrobe centralizes wardrobe management and uses AI to reduce decision fatigue and improve outfit confidence.

## Target Users

| Persona | Need |
|---------|------|
| Everyday dresser | Quick outfit ideas from owned items |
| Fashion enthusiast | Digital closet, saved looks, history |
| Online shopper | Try-before-you-buy via virtual try-on |

## V1 Feature Scope

### In Scope

| Feature | Description |
|---------|-------------|
| Authentication | Email/password account creation and login |
| User profile | Basic profile with user photo upload |
| Wardrobe management | CRUD for clothing items (dress, shirt, pants, shoes, accessories) |
| Virtual try-on | AI-generated try-on images (dedicated API integration) |
| AI recommendations | Outfit suggestions powered by Google Gemini |
| Saved outfits | Persist and organize favorite combinations |
| Outfit history | Timeline of generated and saved looks |
| AI stylist chat | Conversational styling assistant (Gemini) |
| 3D preview | Interactive outfit preview via React Three Fiber (simplified V1 — not photorealistic avatars) |

### Out of Scope (V1)

- Photorealistic 3D avatars
- Advanced body scanning / sizing
- Social sharing / marketplace
- Mobile native apps
- Multi-tenant B2B / white-label
- Payment / subscription billing (unless added explicitly later)

## Tech Stack Summary

| Layer | Technology |
|-------|------------|
| Frontend | Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, Framer Motion |
| Backend | Node.js via Next.js Route Handlers & Server Actions |
| Database | PostgreSQL via Prisma ORM |
| Storage | Cloudinary (images) |
| AI — Analysis & Chat | Google Gemini |
| AI — Virtual Try-On | Dedicated third-party API (TBD, integrated later) |
| 3D | Three.js, React Three Fiber, Drei |
| Deployment | Vercel |
| Auth | **Supabase Auth** |
| Database | **Supabase PostgreSQL** + Prisma |

## Success Criteria (V1)

- Users can sign up, upload photos and wardrobe items, and generate try-on images reliably
- AI recommendations and chat respond within acceptable latency (< 5s for chat, < 30s for try-on)
- Images are stored securely with proper access control
- Application deploys to Vercel with environment-based configuration
- Codebase is modular, typed, and documented for team/onboarding scalability

## Documentation Index

| Document | Purpose |
|----------|---------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System design, data flow, integrations |
| [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) | Directory layout and module boundaries |
| [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) | Local setup, workflows, deployment |
| [CODING_STANDARDS.md](./CODING_STANDARDS.md) | Conventions, patterns, review checklist |
| [../PROJECT_CONTEXT.md](../PROJECT_CONTEXT.md) | Living project status (update after every task) |

## Stakeholders & Roles

| Role | Responsibility |
|------|----------------|
| Product | Feature prioritization, V1 scope |
| Frontend | UI, 3D preview, client state |
| Backend | API, Prisma, AI orchestration |
| DevOps | Vercel, env management, monitoring |
| AI/ML | Gemini prompts, try-on API integration |

## Glossary

| Term | Definition |
|------|------------|
| Wardrobe item | A single clothing piece owned by the user |
| Outfit | A combination of wardrobe items (and optionally try-on result) |
| Try-on | AI-generated image showing user wearing selected items |
| Digital wardrobe | User's collection of uploaded clothing items |
