# Prompts.md — AI Architectural Query Log

> This document logs the key prompts used with Claude (Anthropic) during the Capstone Planning Phase (Week 1) and Auth Backend Sprint (Week 2) for TaskMatrix. Each entry includes the prompt intent, the actual query, and how the AI's output shaped a concrete decision in the project.

---

## SPRINT 1 — Capstone Blueprint (Week 1)

---

## 1. Project Selection — Comparative Evaluation

**Intent:** Rather than picking a project on gut feel, I asked for a structured comparison against my own skill profile and prior sprint work, so the decision was evidence-based.

**Prompt used:**
> "Explain the pros and cons of each project and which is best for me."

*(Context provided beforehand: the three RFP options — EduCore, VitalSync, TaskMatrix — plus my prior sprint history with React, Socket.io, and MERN stack work.)*

**Outcome:** The AI scored each option against "stack fit," "portfolio impact," and "technical stretch" using my actual prior projects (Sprint 11 Cloudinary uploads, Sprint 12 Socket.io chat) as evidence. TaskMatrix was recommended because its real-time activity feed and drag-and-drop board directly extend skills I already had, while still introducing two new technologies (`@dnd-kit`, `node-cron`). This became the foundation for the entire PRD.

---

## 2. Differentiation Strategy — Avoiding the "Generic Clone" Trap

**Intent:** I was aware that a Jira/Asana clone is a common portfolio project, so I asked how to make mine stand out before locking in features.

**Prompt used:**
> "How can we tackle the risk you mention and stand out?"

**Outcome:** The AI proposed a "niche down and polish up" strategy — targeting small engineering teams specifically, leaning into real-time as a first-class feature (not an afterthought), and picking one signature feature. Four signature feature options were proposed (AI task breakdown, Focus mode, Smart deadline warnings, Workload Heatmap). I selected **Workload Heatmap** because it solves a real sprint-planning problem and is visually distinctive. This decision shaped the entire P1 priority tier and became the centrepiece of the demo.

---

## 3. RBAC Model Clarification

**Intent:** The initial PRD draft included a Viewer role, but I wasn't sure it was necessary or how task-level permissions should actually work. I asked for the model to be explained simply before committing to it in the README.

**Prompt used:**
> "In P0 Mandatory 1, what is the need for a viewer, and who are the admins and which users are allowed to create tasks? I am confused about all of this."

**Outcome:** The AI explained the three-role model (Admin / Member / Viewer) in plain terms, then proactively flagged that Viewer adds RBAC complexity (guards on every endpoint and UI action) with limited value for a 2–8 person team. It proposed two options and recommended deferring Viewer to P2. I accepted this — it kept Week 2's auth middleware scope small (two roles instead of three) while preserving the option to add Viewer later. A clear permissions table (Create/Edit/Delete/Move/Invite per role) was generated and used directly in planning.

---

## 4. Scope Realism Check — 4-Week Feasibility

**Intent:** After seeing the full wireframe complexity, I was concerned the project was too large for the 4-week build window. I asked for an honest assessment rather than reassurance.

**Prompt used:**
> "The 3-viewport you have made is amazing... But I want to build my own using Figma... And also looking at the kanban board complexity that you made there are some new words and feels like I am not able to complete such complex project in 4 weeks."

**Outcome:** The AI validated the concern as reasonable rather than dismissing it, then produced a week-by-week scoped plan that explicitly separated "must keep" features (Auth+RBAC, Kanban drag-drop, real-time sync, Heatmap, cron job, deployment) from "drop without guilt" features (file attachments, comments, sprint view, AI breakdown, Focus mode). It also demystified the unfamiliar terms (`@dnd-kit`, `node-cron`, MongoDB aggregation) by mapping each to a small, bounded amount of work. This directly produced the P0/P1/P2 split and the 4-week phase table in the final README.

---

## 5. Design System Generation

**Intent:** Before building any Figma screens, I asked for a complete, reusable design system so every screen would be visually consistent without me making ad-hoc colour/spacing decisions per screen.

**Prompt used:**
> "Give me all of the colour palette and everything required for me to design web page."

**Outcome:** The AI produced a full design system: a 5-tier neutral palette, a blue action/info palette, semantic status colours (red/amber/green) for priority badges, a 5-stop heatmap intensity scale, a typography scale (7 sizes, only weights 400/500), an 8px-based spacing scale, border radius rules per component type, and icon set (Tabler outline). This became the single source of truth — every subsequent Figma instruction referenced these tokens by name (e.g. "Blue 400", "Card Title") instead of raw hex values, which kept all 5 wireframe screens visually consistent.

---

## 6. Step-by-Step Figma Build Guides (Beginner-Level)

**Intent:** I have no prior Figma experience, so I asked for granular, sequential build instructions for each screen rather than a general tutorial — and explicitly requested text-only output to conserve resources once images became too token-heavy.

**Prompts used (sequence):**
> "Please generate a step-by-step guide to make the Auth page in Figma"
> "Please generate the same as the Auth page for the Kanban board frame step-by-step guide, only text, no visuals, be precise"
> "Now generate steps for workload heatmap"
> "Generate steps to quickly make mobile version of these 2 pages"

**Outcome:** Each guide broke the screen into atomic steps (exact pixel dimensions, corner radii, fill colours by style name, Auto Layout settings) building from primitives (rectangles, text) up to components (`task-card`, `nav-item`, `heatmap-cell`) to full frames. This let me build all 5 frames — 3 desktop, 2 mobile — without getting stuck, and the AI iterated on the guides based on screenshots I sent back (e.g. fixing the button-text-hidden-behind-rectangle layer-order bug, fixing avatar overlap z-index issues, and catching repeated sentence-case typos across frames).

---

## 7. ERD Generation for System Architecture (Phase 3)

**Intent:** Phase 3 required an ERD covering MongoDB collections and relationships, exportable via dbdiagram.io. I asked for this to be derived directly from the data models already defined in the PRD, to ensure consistency.

**Prompt used:**
> "Now let's complete Phase 3 than look for mobile version of these pages."

*(This followed a prior request where the data models — User, Workspace, Project, Task, Notification — had already been defined in the README.)*

**Outcome:** The AI generated a six-collection ERD (adding a `WorkspaceMember` join collection that wasn't in my original data model list, to correctly represent the many-to-many User↔Workspace relationship with role data). It also provided ready-to-paste DBML syntax for dbdiagram.io and exact README embed instructions. The addition of `WorkspaceMember` directly informed how my RBAC middleware will query roles — a structural improvement I hadn't considered in the original PRD.

---

## 8. AI-to-AI Context Handoff

**Intent:** To ensure continuity if I switch tools, models, or sessions mid-project, I asked for a complete project-state export that a new AI instance could use without re-explaining context.

**Prompt used:**
> "Create a complete AI-to-AI transfer package. Assume the next AI has never seen this project before. Include all context needed to continue development without asking follow-up questions."

**Outcome:** Produced a single Markdown document covering: my skill profile and working style, all locked architectural decisions with rationale, the full design system, feature scope (P0/P1/P2), data models, wireframe specs, and immediate next actions. This is stored as `TASKMATRIX_AI_HANDOFF.md` and will be pasted into any new AI session at the start of Week 2 to preserve all planning-phase decisions.

---

## SPRINT 2 — Node.js Secure Authentication & JWT Integration (Week 2)

---

## 9. Auth Architecture — Understanding the Right Implementation Flow

**Intent:** Before writing any code, I asked for the correct sequence of implementing authentication end-to-end so I understood the full flow rather than just copying code snippets.

**Prompt used:**
> "What is the right flow of implementing authentication."

**Outcome:** The AI produced a complete flow broken into five distinct sequences — Register, Login, Every Subsequent Request, Page Load/Refresh, and Logout. This clarified the exact role of each piece: bcrypt handles password security at rest, JWT handles stateless identity on every request, localStorage handles persistence across page refreshes, and the Axios interceptor handles automatic token attachment without repeating code in every component. Understanding this flow upfront prevented misplacing logic (e.g. putting token verification on the client instead of the server).

---

## 10. Password Hashing — How bcrypt Works Internally

**Intent:** The assignment brief stated that saving plain-text passwords is an automatic sprint failure. Before implementing, I asked how bcrypt actually works under the hood so I could explain it confidently and implement it correctly.

**Prompt used:**
> "How does inside the User.js the password hashed before saving, how bcrypt works."

**Outcome:** The AI explained the full bcrypt lifecycle: salt generation (why salts exist and what the cost factor `10` means in terms of iterations and brute-force resistance), the one-way hashing process, how the salt is embedded inside the output hash string, and how `compareSync` re-hashes the login attempt rather than decrypting the stored hash. It also explained why `bcrypt.compareSync` is resistant to timing attacks. This understanding directly informed the decision to use a virtual setter on the Mongoose schema — storing `passwordHash` instead of `password` makes it explicit in the database that the field is never plain text.

---

## 11. JWT Verification — How authGuard Works on Every Request

**Intent:** I needed to understand how the server verifies identity on every protected request without hitting the database each time, and how the middleware chain connects auth to route handlers.

**Prompt used:**
> "How does AuthGuard verify every request."

**Outcome:** The AI walked through each step of the middleware: reading the `Authorization` header, extracting the token after the `Bearer ` prefix, and what `jwt.verify()` does simultaneously — signature verification (re-hashing header+payload with `JWT_SECRET` and comparing against the embedded signature), expiry check, and returning the decoded payload. It also explained why the same error message is returned for both "no token" and "invalid token" (to avoid leaking information), and how `req.user` makes identity available to every downstream route handler without a database lookup. This understanding directly informed how `roleGuard` was layered on top — it trusts `req.user.role` already populated by `authGuard`.

---

## 12. React Auth Architecture — AuthContext and ProtectedRoute

**Intent:** I understood the backend auth flow but needed to understand how the React side manages auth state across the app, survives page refreshes, and gates protected pages.

**Prompt used:**
> "How does AuthContext and ProtectedRoute work."

**Outcome:** The AI explained React Context as a global state container that eliminates prop drilling, and walked through exactly how `AuthProvider` initializes from `localStorage` (so users stay logged in on refresh), how `setUser()` propagates changes to every component using `useAuth()` simultaneously, and how `ProtectedRoute` acts as a gatekeeper by reading that state and either rendering children or redirecting to `/login`. The lazy initializer pattern (`useState(() => ...)`) was explained as running only once on mount rather than every render — a subtle but important performance detail. This confirmed the architecture choice of keeping `AuthProvider` inside `BrowserRouter` in `App.jsx` rather than wrapping it in `main.jsx`.

---

## 13. Axios Interceptors — How JWT Attaches to Every Request

**Intent:** I wanted to understand the mechanics of how the JWT gets attached automatically without manually adding headers in every component, and how the 401 redirect works from outside React's component tree.

**Prompt used:**
> "How does the inside of api.js JWT attach to every outgoing request."

**Outcome:** The AI explained `axios.create()` as a custom instance with pre-configured `baseURL`, and interceptors as checkpoints that run before every request and after every response. The request interceptor reads `tm_token` from localStorage and injects `Authorization: Bearer <token>` into `config.headers` before the request leaves the browser. The response interceptor catches `401` responses and uses `window.location.href` (rather than `useNavigate`) because `api.js` lives outside React's component tree and has no access to React Router context. This explained why the pattern is called a cross-cutting concern — one place handles what would otherwise be repeated boilerplate in every API call.

---

## 14. Debugging — CORS Policy Errors in Production

**Intent:** After deploying to Render and Vercel, the frontend was blocked by CORS errors. I needed to diagnose and fix the issue from the error message alone.

**Prompt used:**
> *(Pasted the exact browser console error):*
> "Access to XMLHttpRequest at 'https://prodesk-capstone-taskmatrix-dar4.onrender.com/auth/register' from origin 'https://prodesk-capstone-task-matrix-er83ostkp.vercel.app' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: The 'Access-Control-Allow-Origin' header has a value 'https://prodesk-capstone-task-matrix-sigma.vercel.app/' that is not equal to the supplied origin."

**Outcome:** The AI read the error precisely and identified two separate issues from the message alone: the `CLIENT_URL` environment variable on Render had a trailing slash (which causes an exact-string mismatch against the origin header), and it was pointing to an old Vercel deployment URL rather than the current one. It also identified a third issue — the `VITE_API_URL` on Vercel was missing the `/api` path prefix, causing requests to hit `/auth/register` instead of `/api/auth/register`. All three fixes were applied separately, and the AI explained why Vercel requires a manual redeploy after environment variable changes (unlike Render which auto-redeploys). This pattern — reading error messages precisely before proposing fixes — avoided shotgun debugging.

---

## 15. Security Hardening — JWT Secret and CORS Before Deployment

**Intent:** Before deploying, I wanted to confirm what production-readiness changes were required for security, specifically around the JWT secret and CORS policy.

**Prompts used:**
> "Before deploying the server, do I need to change JWT secret."
> "Do I need to change cors policy."

**Outcome:** For JWT secret, the AI confirmed the placeholder value was publicly visible in the conversation history and generated a cryptographically random 64-byte hex string using Node's built-in `crypto` module — and explained that the secret should live only in Render's environment variables, never in committed code. For CORS, it updated the config from the open `cors()` call to a strict origin whitelist using `process.env.CLIENT_URL`, added `credentials: true` for future httpOnly cookie support, and updated the Axios `baseURL` to use `import.meta.env.VITE_API_URL` so the frontend URL is configurable per environment. It also noted the `VITE_` prefix requirement — Vite only exposes env variables with that prefix to the browser, a security rule that isn't optional.

---

## Reflections on Prompt Engineering Approach

A few patterns applied consistently across both sprints:

**Context-loading before asking.** Before asking for recommendations (e.g. project selection, signature feature, auth architecture), relevant background — prior sprints, skill level, current error messages — was already in the conversation so outputs were tailored rather than generic.

**Asking "why" before "how."** For RBAC, bcrypt, JWT verification, and AuthContext, explanations and trade-offs were requested first, and implementation only followed after understanding the reasoning. This avoided copying code without understanding it — which is especially important for security-critical auth code.

**Pasting exact error messages.** For all three production bugs (CORS, 404, wrong URL), the exact console error was pasted verbatim rather than paraphrasing it. This let the AI read specific values (the mismatched origin URLs, the missing `/api` prefix) directly from the error rather than guessing. Every bug was resolved in one round of fixes.

**Requesting honesty over reassurance.** When the 4-week timeline concern was raised, it was framed as a genuine worry rather than "is this doable?" — which produced a realistic scope cut rather than false confidence.

**Format constraints for efficiency.** Text-only output was requested explicitly for Figma guides to conserve tokens — adapting prompting style based on what was already learned from earlier responses.

**Closing the loop with verification.** After each Figma build phase and each deployment fix, screenshots and error messages were sent back for review — this caught real issues (layer-order bugs, mismatched URLs, missing env variable prefixes) that pure instruction-following wouldn't have surfaced.

**Building understanding before the next feature.** Before starting each new piece of the auth system (bcrypt, JWT, AuthContext, interceptors), the internal mechanics were asked about first. This means the codebase can be explained and defended in a demo or code review — not just shipped.

---

## SPRINT 3 — REST API CRUD Finalisation & Stripe Monetisation (Week 3)

---

## 16. Full-Stack CRUD Architecture — Planning Before Coding

**Intent:** Before writing any controller or route, I asked for a complete build order and architecture plan covering all three resources (Workspace, Project, Task) so dependencies were respected and nothing needed retrofitting.

**Prompt used:**
> "Which resource should we build CRUD for first?"

**Outcome:** The AI identified the dependency chain (Workspace → Project → Task) and produced the complete backend in the correct order — models, controllers, routes, and index.js registration — before any frontend work began. Data ownership validation (`task.createdBy.toString() !== req.user.id` → 403) was baked into every controller from the start rather than added as an afterthought. This produced a clean E2E test report with all 9 steps passing, including the cross-user 403 ownership test.

---

## 17. Frontend Architecture Correction — Component-Based SPA Shell

**Intent:** The first frontend implementation collapsed everything into two page-level components. I flagged this was wrong based on the actual Figma design which shows a persistent sidebar and topbar.

**Prompt used:**
> "The actual kanban looks like this: sidebar panel, top-left navbar, main navbar, priority columns — which means so many components, but your description compiles everything into just two pages."

**Outcome:** The AI fully re-architected the frontend into the correct structure: persistent Sidebar and Topbar layout components, decomposed board components (KanbanBoard, KanbanColumn, TaskCard), a shared WorkspaceContext replacing prop drilling, and three routes only (/auth, /board, /heatmap) instead of per-resource pages. WorkspaceContext became the single source of truth for workspace/project/task state — any component reads from it via useWorkspace() without prop chains.

---

## 18. Colour Token System — Single Source of Truth

**Intent:** Raw hex values were scattered across JSX files. I asked for a systematic fix before writing more components.

**Prompt used:**
> "Instead of using raw hex values anywhere for colours, why can't we just define a colour palette as a single source of truth."

**Outcome:** The entire colour system was moved into tailwind.config.js as named semantic tokens (brand-dark, brand-bg, blue-50, col-inprogress, heat-0 through heat-4, etc.). A priorityStyles.js utility file was created for reusable badge and column dot class mappings. Every component was updated to reference token names instead of hex values — a single config change now updates the whole UI.

---

## 19. Agentic AI Bug Fix — Targeted Prompt Engineering

**Intent:** A manual code review identified 6 specific bugs across 6 files. Rather than fixing them myself or asking the AI to fix them conversationally, I wrote a structured prompt for an agentic AI tool to apply the fixes precisely without touching unrelated code.

**Prompt used:**
> Full agentic prompt specifying: exact file paths, exact broken code snippets, exact fixed code, fix constraints, and a post-fix verification checklist.

**Outcome:** The prompt prevented the most common agentic failure mode — over-fixing. By specifying "fix ONLY the issues listed" and including before/after diffs for each bug, the agent applied targeted changes without refactoring working code. Key bugs caught: KanbanColumn broken JSX nesting (everything rendered inside an 8px dot div), TaskCard invalid Tailwind classes (border-1-2 instead of border-l-2), AuthPage wrong API endpoint (/api/register double-prefixed), Sidebar setShowWSInput(true) called during render instead of on click.

---

## 20. Service Layer Debugging — Syntax and Return Value Bugs

**Intent:** The app wasn't running after the component refactor. I uploaded all service files for a rigorous review.

**Prompt used:**
> "Rigorously read all service files. Do you find any flaws because the app is not running?"

**Outcome:** Three bugs were found: a syntax error in taskService.js (= instead of => in an arrow function) which caused a Vite build failure blocking the entire app; stripeService.js returning res.data.url from getCheckoutSession instead of res.data causing the success page to always render blank; and a stray import { data } from 'autoprefixer' in projectService.js importing a PostCSS plugin into a JavaScript API file. The syntax error was the root cause of the app not starting — a single missing > character.

---

## 21. Stripe Integration — End-to-End Flow and Debugging

**Intent:** The Stripe checkout button returned a 500. I needed to diagnose and fix the integration across the full stack.

**Prompts used (sequence):**
> "Still the same issue — network response is: You must provide at least one recurring price in subscription mode when using prices."
> "I guess stripe npm package is not installed."
> "First bugs found: REQUIRED_ENV array has no Stripe secret key and the dummy_key fallback is removed."

**Outcome:** Three separate Stripe bugs were resolved across three rounds: (1) the price created in Stripe was one-time instead of recurring — fixed by creating a new recurring monthly price and updating STRIPE_PRICE_ID on Render; (2) the stripe npm package was missing from server/package.json — added and committed so Render installs it on deploy; (3) STRIPE_SECRET_KEY and STRIPE_PRICE_ID were missing from the REQUIRED_ENV startup validation array, and a || 'dummy_key' fallback masked missing env vars silently — both removed so the server fails fast with a clear error if keys are absent.

---

## 22. Production Debugging — Vercel Domain and CORS

**Intent:** After deployment, the stable domain URL returned 404 while the per-commit deployment URL worked. The CORS policy on Render pointed to the stable domain which wasn't loading — creating a catch-22.

**Prompts used:**
> "Why does every new commit create a new deployment link and how can it be fixed?"
> "The domain URL works but it keeps on continuously reloading."

**Outcome:** Two separate issues were identified and fixed: (1) the Vercel domain alias was detached from the Production environment — resolved by removing and re-adding the domain so it reattached to the latest production deployment; (2) the missing vercel.json SPA rewrite config caused Vercel to return 404 on any direct URL visit since no physical file exists at /auth or /board — fixed by adding { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }. The continuous reload was caused by the api.js 401 interceptor firing on every load because the httpOnly cookie wasn't being sent — confirmed withCredentials: true was on axios.create() and credentials: true was on the Render CORS config.

---

## Reflections — Sprint 3 additions

**Writing agentic prompts as specifications, not requests.** The bug-fix prompts written for agentic AI included exact file paths, exact broken code, exact fixed code, and explicit constraints ("do not touch anything outside these files"). This produced precise targeted fixes without collateral changes — the same principle as writing a good pull request description.

**Separating symptoms from causes.** Multiple times in this sprint, a surface symptom (500 error, app not loading, infinite reload) masked a different root cause (missing npm package, syntax error in an unrelated file, missing vercel.json). The consistent pattern was: read the exact error message → identify the layer it came from (build, runtime, network, browser) → fix that specific layer before assuming the problem is elsewhere.

**Testing environment parity.** Several bugs only appeared in production (Render env vars missing, Vercel domain alias detached, CORS credential mismatch) because local dev uses .env files that don't exist on the server. The fix was treating Render's Environment tab as the equivalent of .env — every variable that exists locally must also exist there explicitly.