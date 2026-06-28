// ===== Dark Mode Toggle =====
const themeToggle = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", savedTheme);
themeToggle.textContent = savedTheme === "dark" ? "☀️" : "🌙";

themeToggle.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);
  themeToggle.textContent = newTheme === "dark" ? "☀️" : "🌙";
  localStorage.setItem("theme", newTheme);
});

// ===== API URL =====
const API_BASE = "https://resume-optimizer-ai-dfs9.onrender.com";

// ===== Element References =====
const analyzeBtn = document.getElementById("analyzeBtn");
const resumeInput = document.getElementById("resume");
const jobInput = document.getElementById("jobDescription");
const loading = document.getElementById("loading");
const result = document.getElementById("result");
const generateBtn = document.getElementById("generateBtn");
const resumeLoading = document.getElementById("resumeLoading");
const generatedResume = document.getElementById("generatedResume");
const resumePreview = document.getElementById("resumePreview");
const downloadPdfBtn = document.getElementById("downloadPdfBtn");

// ===== File Upload =====
const uploadArea = document.getElementById("uploadArea");
const fileInput = document.getElementById("fileInput");
const uploadStatus = document.getElementById("uploadStatus");

uploadArea.addEventListener("click", () => fileInput.click());

uploadArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadArea.classList.add("drag-over");
});

uploadArea.addEventListener("dragleave", () => {
  uploadArea.classList.remove("drag-over");
});

uploadArea.addEventListener("drop", (e) => {
  e.preventDefault();
  uploadArea.classList.remove("drag-over");
  const file = e.dataTransfer.files[0];
  if (file) handleFileUpload(file);
});

fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) handleFileUpload(file);
});

async function handleFileUpload(file) {
  const validTypes = [".pdf", ".docx", ".txt"];
  const fileName = file.name.toLowerCase();
  const isValid = validTypes.some(type => fileName.endsWith(type));

  if (!isValid) {
    showUploadStatus("error", "❌ Please upload a PDF, DOCX, or TXT file");
    return;
  }

  showUploadStatus("loading", "⏳ Reading your resume...");

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${API_BASE}/upload-resume`, {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.text && data.text.startsWith("ERROR:")) {
      showUploadStatus("error", "❌ " + data.text.replace("ERROR: ", ""));
    } else if (data.text && data.text.trim().length > 0) {
      document.getElementById("resume").value = data.text;
      showUploadStatus("success", `✅ Loaded: ${data.filename}`);
    } else {
      showUploadStatus("error", "❌ Could not extract text. Try a different file or paste manually.");
    }
  } catch (error) {
    showUploadStatus("error", "❌ Upload failed: " + error.message);
  }
}

function showUploadStatus(type, message) {
  uploadStatus.className = `upload-status ${type}`;
  uploadStatus.textContent = message;
  uploadStatus.classList.remove("hidden");

  if (type === "success") {
    setTimeout(() => uploadStatus.classList.add("hidden"), 4000);
  }
}

// ===== Analyze Resume =====
analyzeBtn.addEventListener("click", async () => {
  const resume = resumeInput.value.trim();
  const jobDescription = jobInput.value.trim();

  if (!resume || !jobDescription) {
    alert("Please fill in both fields!");
    return;
  }

  loading.classList.remove("hidden");
  result.classList.add("hidden");
  generatedResume.classList.add("hidden");

  try {
    const response = await fetch(`${API_BASE}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resume, job_description: jobDescription })
    });

    const data = await response.json();

    if (data.error) {
      alert("Error: " + data.error);
      return;
    }

    displayResults(data);
    saveToHistory(resume, jobDescription, data);
    result.classList.remove("hidden");
  } catch (error) {
    alert("Error: " + error.message);
  } finally {
    loading.classList.add("hidden");
  }
});

// ===== Display Analysis Results =====
function displayResults(data) {
  animateScore(data.match_score);
  document.getElementById("recommendation").textContent = data.overall_recommendation || "";

  const matchedEl = document.getElementById("matchedKeywords");
  matchedEl.innerHTML = "";
  (data.matched_keywords || []).forEach(kw => {
    const pill = document.createElement("span");
    pill.className = "pill matched";
    pill.textContent = kw;
    matchedEl.appendChild(pill);
  });

  const missingEl = document.getElementById("missingKeywords");
  missingEl.innerHTML = "";
  (data.missing_keywords || []).forEach(kw => {
    const pill = document.createElement("span");
    pill.className = "pill missing";
    pill.textContent = kw;
    missingEl.appendChild(pill);
  });

  const strengthsEl = document.getElementById("strengthsList");
  strengthsEl.innerHTML = "";
  (data.strengths || []).forEach(s => {
    const li = document.createElement("li");
    li.textContent = s;
    strengthsEl.appendChild(li);
  });

  document.getElementById("skillsGap").textContent = data.skills_gap || "";

  const bulletsEl = document.getElementById("bulletsList");
  bulletsEl.innerHTML = "";
  (data.improved_bullets || []).forEach(bullet => {
    const item = document.createElement("div");
    item.className = "bullet-item";
    const text = document.createElement("div");
    text.className = "bullet-text";
    text.textContent = bullet;
    const btn = document.createElement("button");
    btn.className = "copy-btn";
    btn.textContent = "📋 Copy";
    btn.onclick = () => {
      navigator.clipboard.writeText(bullet);
      btn.textContent = "✓ Copied";
      btn.classList.add("copied");
      setTimeout(() => {
        btn.textContent = "📋 Copy";
        btn.classList.remove("copied");
      }, 2000);
    };
    item.appendChild(text);
    item.appendChild(btn);
    bulletsEl.appendChild(item);
  });
}

// ===== Animate Score =====
function animateScore(score) {
  const scoreNumber = document.getElementById("scoreNumber");
  const scoreProgress = document.getElementById("scoreProgress");
  const circumference = 2 * Math.PI * 85;

  let color = "#ef4444";
  if (score >= 70) color = "#10b981";
  else if (score >= 40) color = "#f59e0b";

  scoreProgress.style.stroke = color;
  scoreNumber.style.color = color;

  const offset = circumference - (score / 100) * circumference;
  scoreProgress.style.strokeDashoffset = offset;

  let current = 0;
  const increment = score / 60;
  const interval = setInterval(() => {
    current += increment;
    if (current >= score) {
      current = score;
      clearInterval(interval);
    }
    scoreNumber.textContent = Math.round(current) + "%";
  }, 25);
}

// ===== Generate Optimized Resume =====
generateBtn.addEventListener("click", async () => {
  const resume = resumeInput.value.trim();
  const jobDescription = jobInput.value.trim();

  resumeLoading.classList.remove("hidden");
  generatedResume.classList.add("hidden");

  try {
    const response = await fetch(`${API_BASE}/generate-resume`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resume, job_description: jobDescription })
    });

    const data = await response.json();

    if (data.error) {
      alert("Error: " + data.error);
      return;
    }

    renderResume(data);
    generatedResume.classList.remove("hidden");
    generatedResume.scrollIntoView({ behavior: "smooth" });
  } catch (error) {
    alert("Error: " + error.message);
  } finally {
    resumeLoading.classList.add("hidden");
  }
});

// ===== Render the Resume =====
function renderResume(data) {
  const contact = data.contact || {};
  const contactParts = [];
  if (contact.email) contactParts.push(contact.email);
  if (contact.phone) contactParts.push(contact.phone);
  if (contact.location) contactParts.push(contact.location);
  if (contact.linkedin) contactParts.push(contact.linkedin);

  let html = `
    <div class="resume-header">
      <div class="resume-name">${data.full_name || "Your Name"}</div>
      <div class="resume-title">${data.title || ""}</div>
      <div class="resume-contact">
        ${contactParts.map(p => `<span>${p}</span>`).join("•")}
      </div>
    </div>
  `;

  if (data.summary) {
    html += `
      <div class="resume-section">
        <div class="resume-section-title">Professional Summary</div>
        <div class="resume-summary">${data.summary}</div>
      </div>
    `;
  }

  if (data.skills && data.skills.length > 0) {
    html += `
      <div class="resume-section">
        <div class="resume-section-title">Skills</div>
        <div class="resume-skills">
          ${data.skills.map(s => `<span class="resume-skill">${s}</span>`).join("")}
        </div>
      </div>
    `;
  }

  if (data.experience && data.experience.length > 0) {
    html += `<div class="resume-section"><div class="resume-section-title">Experience</div>`;
    data.experience.forEach(job => {
      html += `
        <div class="resume-job">
          <div class="resume-job-header">
            <div>
              <span class="resume-job-role">${job.role || ""}</span>
              ${job.company ? ` — <span class="resume-job-company">${job.company}</span>` : ""}
            </div>
            <div class="resume-job-duration">${job.duration || ""}</div>
          </div>
          <ul class="resume-job-bullets">
            ${(job.bullets || []).map(b => `<li>${b}</li>`).join("")}
          </ul>
        </div>
      `;
    });
    html += `</div>`;
  }

  if (data.education && data.education.length > 0) {
    html += `<div class="resume-section"><div class="resume-section-title">Education</div>`;
    data.education.forEach(edu => {
      html += `
        <div class="resume-edu-item">
          <div class="resume-edu-degree">${edu.degree || ""}</div>
          <div class="resume-edu-institution">${edu.institution || ""} ${edu.year ? `• ${edu.year}` : ""}</div>
        </div>
      `;
    });
    html += `</div>`;
  }

  if (data.projects && data.projects.length > 0) {
    html += `<div class="resume-section"><div class="resume-section-title">Projects</div>`;
    data.projects.forEach(p => {
      if (p.name || p.description) {
        html += `
          <div class="resume-project-item">
            <div class="resume-project-name">${p.name || ""}</div>
            <div class="resume-project-desc">${p.description || ""}</div>
          </div>
        `;
      }
    });
    html += `</div>`;
  }

  resumePreview.innerHTML = html;
}

// ===== Download as PDF =====
downloadPdfBtn.addEventListener("click", async () => {
  downloadPdfBtn.textContent = "⏳ Generating PDF...";
  downloadPdfBtn.disabled = true;

  try {
    const canvas = await html2canvas(resumePreview, {
      scale: 2,
      backgroundColor: "#ffffff"
    });

    const imgData = canvas.toDataURL("image/png");
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("Optimized_Resume.pdf");
  } catch (error) {
    alert("Error generating PDF: " + error.message);
  } finally {
    downloadPdfBtn.textContent = "📥 Download as PDF";
    downloadPdfBtn.disabled = false;
  }
});

// ===== Edit Resume =====
const editBtn = document.getElementById("editBtn");
let isEditMode = false;
let editHint = null;

editBtn.addEventListener("click", () => {
  isEditMode = !isEditMode;
  toggleEditMode(isEditMode);
});

function toggleEditMode(enable) {
  const editableElements = resumePreview.querySelectorAll(
    ".resume-name, .resume-title, .resume-contact, .resume-summary, " +
    ".resume-skill, .resume-job-role, .resume-job-company, .resume-job-duration, " +
    ".resume-job-bullets li, .resume-edu-degree, .resume-edu-institution, " +
    ".resume-project-name, .resume-project-desc"
  );

  if (enable) {
    resumePreview.classList.add("editing");
    editBtn.classList.add("active");
    editBtn.textContent = "✓ Done Editing";
    editableElements.forEach(el => el.setAttribute("contenteditable", "true"));
    
    // Add edit hint
    if (!editHint) {
      editHint = document.createElement("div");
      editHint.className = "edit-hint";
      editHint.textContent = "✏️ Click any text to edit it. Click 'Done Editing' when finished.";
      resumePreview.parentNode.insertBefore(editHint, resumePreview);
    }
  } else {
    resumePreview.classList.remove("editing");
    editBtn.classList.remove("active");
    editBtn.textContent = "✏️ Edit";
    editableElements.forEach(el => el.removeAttribute("contenteditable"));
    
    // Remove edit hint
    if (editHint) {
      editHint.remove();
      editHint = null;
    }
  }
}

// Also reset edit mode when generating a new resume
const originalRenderResume = renderResume;
renderResume = function(data) {
  isEditMode = false;
  if (editHint) {
    editHint.remove();
    editHint = null;
  }
  editBtn.classList.remove("active");
  editBtn.textContent = "✏️ Edit";
  originalRenderResume(data);
};

// ===== History Feature =====
const HISTORY_KEY = "resume_optimizer_history";
const historyToggle = document.getElementById("historyToggle");
const historyPanel = document.getElementById("historyPanel");
const historyOverlay = document.getElementById("historyOverlay");
const closeHistoryBtn = document.getElementById("closeHistoryBtn");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");
const historyList = document.getElementById("historyList");

historyToggle.addEventListener("click", () => {
  historyPanel.classList.remove("hidden");
  historyOverlay.classList.remove("hidden");
  renderHistory();
});

closeHistoryBtn.addEventListener("click", closeHistory);
historyOverlay.addEventListener("click", closeHistory);

function closeHistory() {
  historyPanel.classList.add("hidden");
  historyOverlay.classList.add("hidden");
}

clearHistoryBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all history?")) {
    localStorage.removeItem(HISTORY_KEY);
    renderHistory();
  }
});

function saveToHistory(resume, jobDescription, analysisData) {
  const history = getHistory();
  
  const entry = {
    id: Date.now(),
    date: new Date().toISOString(),
    resume: resume,
    jobDescription: jobDescription,
    analysis: analysisData,
    score: analysisData.match_score || 0,
    jobTitle: extractJobTitle(jobDescription)
  };

  history.unshift(entry);
  
  if (history.length > 20) {
    history.splice(20);
  }

  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  } catch {
    return [];
  }
}

function extractJobTitle(jobDescription) {
  const firstLine = jobDescription.split("\n")[0].trim();
  if (firstLine.length > 0 && firstLine.length < 80) {
    return firstLine;
  }
  return jobDescription.substring(0, 50) + "...";
}

function renderHistory() {
  const history = getHistory();

  if (history.length === 0) {
    historyList.innerHTML = '<div class="history-empty">No analyses yet. Run your first analysis!</div>';
    return;
  }

  historyList.innerHTML = "";

  history.forEach(entry => {
    const item = document.createElement("div");
    item.className = "history-item";

    const scoreClass = entry.score >= 70 ? "high" : entry.score >= 40 ? "medium" : "low";
    const date = new Date(entry.date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });

    item.innerHTML = `
      <button class="history-item-delete" data-id="${entry.id}" title="Delete">🗑️</button>
      <div class="history-item-score ${scoreClass}">${entry.score}% Match</div>
      <div class="history-item-title">${escapeHtml(entry.jobTitle)}</div>
      <div class="history-item-date">${date}</div>
    `;

    item.addEventListener("click", (e) => {
      if (e.target.classList.contains("history-item-delete")) return;
      loadHistoryItem(entry);
    });

    item.querySelector(".history-item-delete").addEventListener("click", (e) => {
      e.stopPropagation();
      deleteHistoryItem(entry.id);
    });

    historyList.appendChild(item);
  });
}

function loadHistoryItem(entry) {
  document.getElementById("resume").value = entry.resume;
  document.getElementById("jobDescription").value = entry.jobDescription;
  
  displayResults(entry.analysis);
  result.classList.remove("hidden");
  
  generatedResume.classList.add("hidden");
  
  closeHistory();
  
  result.scrollIntoView({ behavior: "smooth" });
}

function deleteHistoryItem(id) {
  const history = getHistory().filter(entry => entry.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  renderHistory();
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
