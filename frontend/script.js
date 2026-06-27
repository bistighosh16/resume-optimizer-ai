const analyzeBtn = document.getElementById("analyzeBtn");
const resumeInput = document.getElementById("resume");
const jobInput = document.getElementById("jobDescription");
const loading = document.getElementById("loading");
const result = document.getElementById("result");
const resultText = document.getElementById("resultText");

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

    resultText.innerHTML = marked.parse(data.analysis);
    result.classList.remove("hidden");
  } catch (error) {
    resultText.textContent = "Error: " + error.message;
    result.classList.remove("hidden");
  } finally {
    loading.classList.add("hidden");
  }
});
