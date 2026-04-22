# AGENTS.md

## Project
- Project name: thingo-mobile
- Goal: migrate the existing web app to React Native
- Priorities:
  1. readability
  2. maintainability
  3. architectural clarity
  4. mobile-first UX
- Do not blindly port web UI 1:1
- Prefer structures that help a small team move quickly and safely

## Tech baseline
- React Native with Expo Development Build
- pnpm
- TypeScript

## Native constraints
- Naver Map integration is mandatory
- Native-capable setup must be preserved
- Do not propose Expo Go-only solutions
- Any map-related feature must consider native dependency boundaries
- Any native dependency must be introduced with setup notes and risks

## Source of reference
- Web repository: https://github.com/NOVA-MJU/MJS-FRONT
- Reference branch: main

## Primary reference paths from web
- src/pages
- src/components
- src/api
- src/hooks
- src/store
- src/types
- src/utils
- src/constants

## Migration guidance
- Reuse domain logic, API contracts, constants, utility logic when appropriate
- Do not directly port DOM-based code
- Do not directly port BrowserRouter-based structure
- Do not directly port web CSS/Tailwind assumptions into mobile
- Rebuild screens for mobile interaction patterns
- Prefer app-router-oriented migration over atomic re-architecture
- Keep route-local UI local unless repetition is proven
- Prefer duplication over premature abstraction when Figma-driven customization changes often
- Prefer clear resource naming for routes such as `posts/[postId]` over web-era naming that is harder to reason about

## Architectural rules
- Prefer `app/*` route modules for user-facing entry points
- Co-locate route UI, route-specific interaction logic, and section components when it improves speed and readability
- Keep routing entry files small, but do not force page modules to be artificially thin
- Use Expo Router conventions as the source of truth for route shape
- Put external integrations and app-wide pure utilities under shared/lib or equivalent shared modules
- Separate API clients, constants, types, and pure utilities when doing so reduces coupling
- Keep shared UI minimal, stable, and design-system-like
- Promote a local component to shared only after repetition is proven
- If a component is heavily tied to one route's Figma layout, keep it local to that route
- Avoid unnecessary libraries

## Folder intent
- app/*: Expo Router route entries and route groups
- app/*/index.tsx: the default screen for that route segment
- app/*/_components: components used only by that route subtree when local reuse is helpful
- app/*/_sections: large visual sections of that route when keeping them local improves readability
- shared/ui: only truly stable primitives reused across multiple pages
- shared/lib: app-wide pure utilities and helpers
- shared/theme: design tokens and visual foundations
- shared/api: app-wide API clients or shared API helpers when needed

## Styling rules
- Do not assume NativeWind is final
- Prefer maintainable styling with clear tokens and minimal shared component boundaries
- Any styling decision must include rationale and trade-offs
- Optimize for Figma accuracy and fast iteration over deep abstraction

## Before completing any task
- Summarize what changed
- Explain why it changed
- List trade-offs
- List risks or follow-up work

## Decision rule
- For any major architectural decision, explain:
  - chosen option
  - rejected alternatives
  - rationale
  - trade-offs
