# 🚀 Resume Optimizer AI

An AI-powered web application that analyzes your resume against any job description, generates a complete optimized resume tailored to the role, and lets you download it as a polished PDF — all powered by **LLaMA 3.1** via Groq's lightning-fast inference API.

> Built with ❤️ to help job seekers land their dream roles.

## 🌍 Live Demo

**[Try it now → resume-optimizer-ai-bice.vercel.app](https://resume-optimizer-ai-bice.vercel.app/)**

---

## ✨ Features

### 🎯 Smart Analysis
- 📊 **Animated Match Score** — Visual circular progress bar showing your resume-job alignment (0–100%)
- ✅ **Matched Keywords** — Color-coded pills showing skills/keywords already in your resume
- ❌ **Missing Keywords** — Identify critical keywords from the job description you're missing
- 💪 **Strengths Highlight** — AI identifies your top selling points for the role
- 🎯 **Skills Gap Analysis** — Detailed breakdown of what you need to improve
- ✍️ **Improved Bullet Points** — AI-rewritten resume bullets with copy-to-clipboard buttons

### 📝 AI Resume Generator
- ✨ **Complete Resume Rewrite** — One-click generation of a fully optimized resume tailored to the target job
- 🎨 **Beautiful Preview** — Clean, professional formatting with sections for Summary, Skills, Experience, Education, and Projects
- 📥 **PDF Download** — Export your optimized resume as a high-quality PDF ready to send to recruiters

### 🎨 User Experience
- 🌙 **Dark/Light Mode** — Toggle between themes with preference saved in browser
- 📱 **Fully Responsive** — Works beautifully on desktop, tablet, and mobile
- ⚡ **Real-Time Feedback** — Loading spinners, smooth animations, and instant results
- 🎭 **Modern UI** — Gradient designs, smooth transitions, and polished typography

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Python, FastAPI, Uvicorn |
| **AI Model** | LLaMA 3.1 8B Instant (via Groq API) |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **PDF Generation** | jsPDF + html2canvas |
| **Backend Hosting** | Render |
| **Frontend Hosting** | Vercel |
| **Version Control** | Git, GitHub |

---

## 🏗️ Architecture
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ │ │ │ │ │
│ Frontend │──────▶│ FastAPI │──────▶│ Groq API │
│ (Vercel) │ │ Backend │ │ (LLaMA 3.1) │
│ │◀──────│ (Render) │◀──────│ │
└──────────────────┘ └──────────────────┘ └──────────────────┘
│
│ Generates PDF
▼
┌──────────────────┐
│ jsPDF + │
│ html2canvas │
└──────────────────┘

