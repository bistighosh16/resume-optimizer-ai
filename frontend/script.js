const analyzeBtn = document.getElementById("analyzeBtn");
const resumeInput = document.getElementById("resume");
const jobInput = document.getElementById("jobDescription");
const loading = document.getElementById("loading");
const result = document.getElementById("result");

analyzeBtn.addEventListener("click", async () => {
  const resume = resumeInput.value.trim();
  const jobDescription = jobInput.value.trim();

  if (!resume || !jobDescription) {
    alert("Please fill in both fields!");
    return;
  }

  loading.classList.remove("hidden");
  result.classList.add("hidden");

  try {
    const response = await fetch("https://resume-optimizer-ai-dfs9.onrender.com/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        resume: resume,
        job_description: jobDescription
      })
    });

    const data = await response.json();

    if (data.error) {
      alert("Error: " + data.error);
      loading.classList.add("hidden");
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

function displayResults(data) {
  // Animate match score
  animateScore(data.match_score);

  // Recommendation
  document.getElementById("recommendation").textContent = data.overall_recommendation || "";

  // Matched Keywords
  const matchedEl = document.getElementById("matchedKeywords");
  matchedEl.innerHTML = "";
  (data.matched_keywords || []).forEach(kw => {
    const pill = document.createElement("span");
    pill.className = "pill matched";
    pill.textContent = kw;
    matchedEl.appendChild(pill);
  });

  // Missing Keywords
  const missingEl = document.getElementById("missingKeywords");
  missingEl.innerHTML = "";
  (data.missing_keywords || []).forEach(kw => {
    const pill = document.createElement("span");
    pill.className = "pill missing";
    pill.textContent = kw;
    missingEl.appendChild(pill);
  });

  // Strengths
  const strengthsEl = document.getElementById("strengthsList");
  strengthsEl.innerHTML = "";
  (data.strengths || []).forEach(s => {
    const li = document.createElement("li");
    li.textContent = s;
    strengthsEl.appendChild(li);
  });

  // Skills Gap
  document.getElementById("skillsGap").textContent = data.skills_gap || "";

  // Improved Bullets
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

function animateScore(score) {
  const scoreNumber = document.getElementById("scoreNumber");
  const scoreProgress = document.getElementById("scoreProgress");
  const circumference = 2 * Math.PI * 85; // 534

  // Color based on score
  let color = "#ef4444"; // red
  if (score >= 70) color = "#10b981"; // green
  else if (score >= 40) color = "#f59e0b"; // orange

  scoreProgress.style.stroke = color;
  scoreNumber.style.color = color;

  const offset = circumference - (score / 100) * circumference;
  scoreProgress.style.strokeDashoffset = offset;

  // Animate the number counter
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
