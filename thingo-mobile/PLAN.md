# PLAN.md

## Phase 1. Baseline and technical validation
- Confirm Expo Development Build as runtime strategy
- Confirm Naver Map integration strategy
- Confirm styling baseline
- Confirm folder architecture
- Confirm minimal shared module boundaries
- Validate Naver Map integration in Expo Development Build
- Document native setup requirements
- Confirm map screen architecture boundary
- Confirm permission and location handling strategy

## Phase 2. Web analysis
- Analyze main user flows from the web app
- Classify reusable logic vs web-only logic
- Identify route-level composition patterns in the web app
- Distinguish stable primitives from route-specific sections
- Identify components that should remain local during migration
- Propose a new Expo Router path scheme where improving route naming helps clarity
- Identify API, domain, type, and utility candidates for migration
- Identify screens that must be redesigned for mobile UX

## Reference sources
- Web repository: https://github.com/NOVA-MJU/MJS-FRONT
- Branch: main

## Priority reference paths
- src/pages
- src/components
- src/api
- src/hooks
- src/store
- src/types
- src/utils
- src/constants

## Web-only areas to avoid direct porting
- BrowserRouter structure
- DOM and browser event assumptions
- CSS and Tailwind web-specific layout behavior
- App bootstrap code tied to web rendering

## Phase 3. Target architecture
- Define app routing structure
- Define Expo Router `app/*` route boundaries
- Define minimal shared UI surface
- Define shared lib boundaries
- Define API and query boundaries
- Define design token structure
- Define criteria for keeping UI local vs promoting it to shared
- Define native integration boundary for Naver Map

## Phase 4. First PoC
- Implement one Naver Map screen
- Validate dev build pipeline
- Validate API call flow
- Validate page and section boundary
- Validate styling direction

## Phase 5. First migration slice
- Select one end-to-end route flow
- Port only the necessary business logic
- Rebuild one route with local sections first
- Promote only repeated UI primitives after validation
- Document decisions and trade-offs
