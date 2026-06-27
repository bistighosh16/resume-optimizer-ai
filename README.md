# 🚀 Resume Optimizer AI

An AI-powered web application that analyzes resumes against job descriptions, providing match scores, missing keywords, skill gap analysis, and AI-generated bullet point suggestions.

## ✨ Features

- 📊 **Match Score Analysis** — Get a percentage match between your resume and any job description
- 🔍 **Missing Keywords Detection** — Identify critical keywords from the job description not present in your resume
- 📋 **Skills Gap Analysis** — Understand exactly what skills you're missing
- ✍️ **AI Bullet Point Suggestions** — Get optimized resume bullet points tailored to the job

## 🛠️ Tech Stack

- **Backend:** Python, FastAPI, Uvicorn
- **AI Model:** LLaMA 3.1 (via Groq API)
- **Frontend:** HTML, CSS, JavaScript
- **Deployment:** Render (Backend), Vercel (Frontend)

## 🚀 Live Demo

https://resume-optimizer-ai-bice.vercel.app/

## 📦 Local Setup

### Backend

```bash
cd resume-optimizer
python -m venv venv
venv\Scripts\activate
pip install -r backend/requirements.txt
