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
