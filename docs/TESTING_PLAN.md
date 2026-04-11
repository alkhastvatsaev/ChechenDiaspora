# Testing Architecture & Restoration Plan

To ensure the "Luxury" standard of the Chechen Diaspora Hub and facilitate collaboration with AI agents, we need a robust, standardized testing architecture.

## 1. Immediate Actions (Restoration)
- [x] **Fix UI Text Regression**: Restored missing Cyrillic characters ('а') in `src/app/page.tsx`.
- [ ] **Stabilize Unit Tests**: Update `src/app/page.test.tsx` and `src/components/__tests__/MemberProfile.test.tsx` to match the localized UI strings (Cyrillic).

## 2. Proposed Architecture

### A. Directory Structure
Tests should follow the proximity principle:
- **Unit Tests**: `src/components/__tests__/[Component].test.tsx` or `src/lib/__tests__/[logic].test.ts`.
- **Integration Tests**: `src/app/__tests__/[page].test.tsx`.
- **E2E Tests**: `tests/e2e/*.spec.ts`.

### B. Framework Stack
| Level | Tool | Purpose |
| :--- | :--- | :--- |
| **Unit/UI** | Vitest + React Testing Library | Rapid testing of component render and interaction. |
| **E2E** | Playwright | Testing critical user flows (Login, Community Join). |
| **State** | Vitest | Testing Context providers and complex hooks. |

### C. Standardized Mocks
The `src/test/setup.tsx` will be expanded to include:
- Consistent **Firebase Realtime Database** mocks.
- **Leaflet/Map** mocks to prevent DOM errors.
- **Framer Motion** reduce-motion mocks to speed up tests.

## 3. Automation for AI Agents
To allow AI agents to maintain tests correctly:
- **`npm run check`**: A new command combining `lint`, `type-check`, and `test`.
- **Snapshot Testing**: Selective use of snapshots for critical UI components to detect accidental layout changes.
- **`AGENTS.md` update**: Add a directive for agents to always run tests before finishing a task.

## 4. Next Steps
1. Finish fixing `MemberProfile.test.tsx`.
2. Implement `npm run check`.
3. Add a unit test for `AuthContext`.
4. Run all tests to ensure 100% green state.
