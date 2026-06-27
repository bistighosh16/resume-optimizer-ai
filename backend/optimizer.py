import os
import requests
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

def analyze_resume(resume_text: str, job_description: str):

    if not GROQ_API_KEY:
        return "ERROR: GROQ_API_KEY not found. Check your .env file."

    prompt = f"""
You are an expert resume optimization assistant.

Compare the following resume and job description.

Resume:
{resume_text}

Job Description:
{job_description}

Provide:
1. Match percentage (0-100%)
2. Missing keywords
3. Skills gap analysis
4. Improved resume bullet suggestions
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
            ]
        }
    )

    data = response.json()

    # Debug: print full response to terminal
    print("=" * 50)
    print("GROQ RESPONSE:", data)
    print("=" * 50)

    if "choices" in data:
        return data["choices"][0]["message"]["content"]
    else:
        return f"API ERROR: {data}"