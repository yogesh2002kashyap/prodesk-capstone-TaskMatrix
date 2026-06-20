# Prompts.md — AI Architectural Query Log

> This document logs the key prompts used with Claude (Anthropic) during the Capstone Planning Phase (Week 1) for TaskMatrix. Each entry includes the prompt intent, the actual query, and how the AI's output shaped a concrete decision in the project.

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

## Reflections on Prompt Engineering Approach

A few patterns I tried to apply consistently across these prompts:

**Context-loading before asking.** Before asking for recommendations (e.g. project selection, signature feature), I made sure relevant background — my prior sprints, my skill level — was already in the conversation, so outputs were tailored rather than generic.

**Asking "why" before "how."** For RBAC and scope decisions, I asked for explanations and trade-offs first, and only finalized the README after understanding the reasoning — this avoided baking in decisions I didn't actually understand.

**Requesting honesty over reassurance.** When I flagged the 4-week timeline concern, I phrased it as a genuine worry rather than asking "is this doable?" — which produced a realistic scope cut rather than false confidence.

**Format constraints for efficiency.** Once I understood the visual output style, I explicitly requested "text only, no visuals" for later Figma guides to conserve tokens — adapting my prompting based on what I'd already learned from earlier responses.

**Closing the loop with verification.** After each Figma build phase, I sent screenshots back and asked for review — this caught real issues (button text hidden behind a rectangle, inconsistent sentence case, misplaced badges) that pure instruction-following wouldn't have surfaced.