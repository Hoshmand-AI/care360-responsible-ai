# Care360 — Responsible AI Edition

**Care360 Responsible AI** is the ethically redesigned version of Care360, built as part of an Ethics of AI final project at GMU. It implements responsible innovation principles from:

- NIST AI Risk Management Framework (Govern, Map, Measure, Manage)
- Jobin et al. — The global landscape of AI ethics guidelines  
- Stilgoe/Owen — Responsible Innovation Framework
- Hallamaa & Kalliokoski — AI Ethics as Applied Ethics

## Responsible AI Features

| Feature | Framework Source | Status |
|---------|-----------------|--------|
| Emergency Kill Switch (911 screen) | Roxette / Safety | ✅ |
| Explicit Consent Gate | Alex / Privacy | ✅ |
| Controlled Substance Guardrails | Molly / Safety | ✅ |
| Out-of-Scope Query Detection | Bibhu / Accountability | ✅ |
| Bio-Safety Profile + Contraindication Check | Roxette / Fairness | ✅ |
| Confidence Score on Results | Roxette / Transparency | ✅ |
| Verified Source Tags (FDA/Mayo Clinic) | Roxette / Transparency | ✅ |
| Model Transparency (GPT-4o visible) | Alex / Transparency | ✅ |
| Human-in-the-Loop Feedback/Flag | Alex/Max / Accountability | ✅ |
| Doctor Referral Enforcement | Bibhu / Safety | ✅ |
| HIPAA Notice | Alex / Privacy | ✅ |
| Explainability Section | NIST AI RMF | ✅ |
| Fairness Demographic Inputs | Max / Fairness | ✅ |
| Data Delete Rights | Max / Privacy | ✅ |
| Audit Trail (model version logged) | Roxette / Accountability | ✅ |
| Human Oversight Banners | Stilgoe/Owen | ✅ |
| "Talk to a Nurse Now" for urgent cases | Roxette / Safety | ✅ |

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **AI Model:** GPT-4o (OpenAI) — disclosed on every output
- **Database:** PostgreSQL (Neon) via Prisma
- **Auth:** NextAuth.js
- **Styling:** Tailwind CSS

## Compare with v1

- v1 (Irresponsible): https://care360-irresponsible-ai.vercel.app
- v2 (Responsible): https://care360-responsible-ai.vercel.app

## Academic Context

Built for Ethics of AI final project — GMU  
Team: Ahmad Sediqzada, Molly K. Kalua, Max Guscoff, Bibhu Paudyal, Roxette Lovia, Alex
