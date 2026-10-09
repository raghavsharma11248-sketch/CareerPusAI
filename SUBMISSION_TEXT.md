# 📋 HackNowa 2026 — Project Submission Copy
### *Ready-to-Paste Form Fields for Unstop / Devpost*

---

### Project Title
**CareerPulse AI — Autonomous Hiring Readiness Copilot**

### Tagline
An autonomous 5-agent career platform powered by Google Gemini 2.5 bridging the gap between resume ATS screening, live voice mock interviews, and recruiter outreach.

### Track
**Future of Work & Automation**

---

### 💡 Inspiration
Over 88% of enterprise executives (Harvard Business School, *"Hidden Workers: Untapped Talent"*) admit that automated Applicant Tracking Systems (ATS) filter out millions of qualified candidates due to rigid keyword checking and formatting nuances. Existing tools charge \$30–\$90/month for superficial keyword stuffing, leaving candidates completely unprepared for technical interviews. We asked: *What if an autonomous fleet of AI specialists could not just audit your resume, but re-engineer your achievements into Google's XYZ formula, interview you on your exact gaps using voice AI, and build your portfolio in seconds?*

---

### ⚙️ What It Does
CareerPulse AI turns fragmented job applications into an autonomous, closed-loop pipeline:
1. **Agent 1 (Semantic ATS Auditor):** Analyzes the resume against the job description to calculate an Explainable Hiring Readiness Index (0–100) and identify skill gaps.
2. **Agent 2 (Google XYZ Resume Tailor):** Transforms weak, passive bullet points into quantified achievements using Google's XYZ formula (`"Accomplished [X] by doing [Y], resulting in [Z]"`), with full human-in-the-loop Accept/Reject/Edit diff reviews and real-time score recalculation.
3. **Agent 3 (Voice Mock Interview Room):** Conducts live voice mock interviews specifically targeting the candidate's detected skill gaps. Evaluates answers against the industry-standard STAR rubric with dynamic waveform visualizers and silent text fallback.
4. **Agent 4 (Recruiter Outreach Strategist):** Generates personalized LinkedIn connection notes (<300 characters), cold recruiter emails, and optimized bio copy.
5. **Agent 5 (Live Portfolio Architect):** Automatically generates a live web portfolio at `/portfolio/[slug]` tailored to the candidate's target employer.

---

### 🛠️ How We Built It
- **Frontend & Routing:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons.
- **AI Core:** Google Gemini 2.5 Flash, structured output validation via Zod schemas, heuristic fallback architectures for 100% uptime.
- **Multimodal Audio:** Web Speech API (SpeechRecognition + SpeechSynthesis) paired with custom audio waveform visualizers.
- **Security Guardrails:** Ingestion prompt-injection sanitizer, single-column Workday ATS hygiene checks, and trusted candidate email validation.

---

### 🧗 Challenges We Ran Into
- **Guaranteed Zero-Crash LLM Reliability:** Handling edge cases where API keys might be absent or quotas hit. We solved this by implementing robust heuristic fallbacks across all 5 agent pipelines, ensuring 200 OK responses regardless of network conditions.
- **Human-in-the-Loop Real-Time Math:** Synchronizing the circular ATS gauge with user bullet selections so that accepting an XYZ rewrite updates the score dynamically in real time without lag.
- **Ultra-Clean Minimalist UX:** Crafting an uncluttered, high-contrast white aesthetic that provides instant clarity for judges while maintaining deep telemetry in the background.

---

### 🏆 Accomplishments That We're Proud Of
- A truly **closed-loop multi-agent architecture** where each agent passes typed context to the next.
- Fully verified production build with zero errors (`npm run build` passing in Turbopack).
- 1-Click Demo capability allowing judges to test the entire candidate journey in seconds without typing or uploading files.

---

### 🚀 What's Next for CareerPulse AI
- Integration with LinkedIn Job Search APIs for automated 1-click tailored application packages.
- Real-time video emotion & confidence analysis during mock interviews.
- Export to formatted .docx and Greenhouse-direct submission pipelines.

---

### 🔗 Links
- **GitHub Repository:** https://github.com/raghavsharma11248-sketch/CareerPusAI
- **Demo Candidate Slug:** `/portfolio/alex-chen-stripe-2026`
