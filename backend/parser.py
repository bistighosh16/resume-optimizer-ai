import io
from pypdf import PdfReader
from docx import Document

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract text from PDF file bytes."""
    try:
        reader = PdfReader(io.BytesIO(file_bytes))
        text = ""
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
        
        if not text.strip():
            return "ERROR: This PDF appears to be image-based (scanned or generated from HTML). Please upload a text-based PDF or paste your resume manually."
        
        return text.strip()
    except Exception as e:
        return f"ERROR: Could not read PDF — {str(e)}"

def extract_text_from_docx(file_bytes: bytes) -> str:
    """Extract text from DOCX file bytes."""
    try:
        doc = Document(io.BytesIO(file_bytes))
        text = ""
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
        
        if not text.strip():
            return "ERROR: This DOCX appears to be empty."
        
        return text.strip()
    except Exception as e:
        return f"ERROR: Could not read DOCX — {str(e)}"

def extract_text_from_txt(file_bytes: bytes) -> str:
    """Extract text from TXT file bytes."""
    try:
        text = file_bytes.decode("utf-8").strip()
        if not text:
            return "ERROR: This TXT file is empty."
        return text
    except UnicodeDecodeError:
        try:
            return file_bytes.decode("latin-1").strip()
        except Exception as e:
            return f"ERROR: Could not read TXT — {str(e)}"

def extract_resume_text(file_bytes: bytes, filename: str) -> str:
    """Detect file type and extract text accordingly."""
    filename_lower = filename.lower()
    
    if filename_lower.endswith(".pdf"):
        return extract_text_from_pdf(file_bytes)
    elif filename_lower.endswith(".docx"):
        return extract_text_from_docx(file_bytes)
    elif filename_lower.endswith(".txt"):
        return extract_text_from_txt(file_bytes)
    else:
        return "ERROR: Unsupported file type. Please upload PDF, DOCX, or TXT."