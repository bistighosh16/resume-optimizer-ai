import os
import json
import requests
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

def analyze_resume(resume_text: str, job_description: str):

    if not GROQ_API_KEY:
        return {"error": "GROQ_API_KEY not found. Check your .env file."}

    prompt = f"""
You are an expert resume optimization assistant.

Analyze the following resume against the job description and respond ONLY with valid JSON in the exact format below. Do NOT include any explanation, markdown, or text outside the JSON.

Resume:
{resume_text}

Job Description:
{job_description}

Respond with this exact JSON structure:
{{
  "match_score": <integer between 0 and 100>,
  "matched_keywords": [<list of keywords/skills from the resume that match the job description>],
  "missing_keywords": [<list of important keywords/skills from the job description NOT found in the resume>],
  "skills_gap": "<2-3 sentence summary of the biggest skill gaps>",
  "strengths": [<list of 3-5 strengths the candidate already has>],
  "improved_bullets": [<list of 4-6 improved resume bullet points tailored to the job>],
  "overall_recommendation": "<1-2 sentence final recommendation>"
}}
"""

    response = requests.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": "llama-3.1-8b-instant",
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "response_format": {"type": "json_object"},
            "temperature": 0.3
        }
    )

    data = response.json()

    print("=" * 50)
    print("GROQ RESPONSE:", data)
    print("=" * 50)

    if "choices" in data:
        content = data["choices"][0]["message"]["content"]
        try:
            return json.loads(content)
        except json.JSONDecodeError:
            return {"error": "AI did not return valid JSON", "raw": content}
    else:
        return {"error": "API call failed", "details": data}

def generate_optimized_resume(resume_text: str, job_description: str):

    if not GROQ_API_KEY:
        return {"error": "GROQ_API_KEY not found."}

    prompt = f"""
You are an expert resume writer and career coach.

Rewrite the following resume to be perfectly optimized for the given job description. 
Use strong action verbs, quantifiable achievements, and incorporate relevant keywords naturally.
Keep all information truthful — only rewrite, enhance, and reframe existing experience.

Original Resume:
{resume_text}

Target Job Description:
{job_description}

Respond ONLY with valid JSON in this exact structure. No markdown, no extra text.

{{
  "full_name": "<candidate's full name>",
  "title": "<professional title tailored to the job>",
  "contact": {{
    "email": "<email if present, else empty string>",
    "phone": "<phone if present, else empty string>",
    "location": "<location if present, else empty string>",
    "linkedin": "<linkedin if present, else empty string>"
  }},
  "summary": "<2-3 sentence powerful professional summary tailored to this job>",
  "skills": [<list of 10-15 relevant skills, prioritizing those in the job description>],
  "experience": [
    {{
      "role": "<job title>",
      "company": "<company name>",
      "duration": "<duration>",
      "bullets": [<list of 3-5 strong, quantified, action-verb bullet points tailored to the target job>]
    }}
  ],
  "education": [
    {{
      "degree": "<degree>",
      "institution": "<institution>",
      "year": "<year>"
    }}
  ],
  "projects": [
    {{
      "name": "<project name if any are mentioned>",
      "description": "<short impactful description>"
    }}
  ]
}}

If certain information isn't in the original resume, use empty strings or empty arrays. 
NEVER invent fake jobs, companies, or credentials — only enhance what exists.
"""

    response = requests.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": "llama-3.1-8b-instant",
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "response_format": {"type": "json_object"},
            "temperature": 0.4
        }
    )

    data = response.json()

    print("=" * 50)
    print("RESUME GEN RESPONSE:", data)
    print("=" * 50)

    if "choices" in data:
        content = data["choices"][0]["message"]["content"]
        try:
            return json.loads(content)
        except json.JSONDecodeError:
            return {"error": "AI did not return valid JSON", "raw": content}
    else:
        return {"error": "API call failed", "details": data}
