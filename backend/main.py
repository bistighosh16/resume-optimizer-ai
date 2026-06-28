from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from backend.optimizer import analyze_resume, generate_optimized_resume
from backend.parser import extract_resume_text

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ResumeRequest(BaseModel):
    resume: str
    job_description: str

@app.get("/")
def read_root():
    return {"message": "Resume Optimizer API is running 🚀"}

@app.post("/analyze")
def analyze(request: ResumeRequest):
    result = analyze_resume(request.resume, request.job_description)
    return result

@app.post("/generate-resume")
def generate(request: ResumeRequest):
    result = generate_optimized_resume(request.resume, request.job_description)
    return result

@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    """Extract text from an uploaded PDF, DOCX, or TXT file."""
    contents = await file.read()
    text = extract_resume_text(contents, file.filename)
    return {"text": text, "filename": file.filename}
