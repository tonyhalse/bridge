let problems = [];
let current = 0;

async function loadProblems() {
  const res = await fetch("problems.json");
  problems = await res.json();
  showProblem();
}

function showProblem() {
  const p = problems[current];
  document.getElementById("problem-container").innerHTML = `
    <h2>${p.title}</h2>
    <div id="table">
      <div class="north hand">N: ${p.hands.N}</div>
      <div class="west hand">W: ${p.hands.W}</div>
      <div class="center">
        <p><b>Contract:</b> ${p.contract}</p>
        <p>${p.problem}</p>
      </div>
      <div class="east hand">E: ${p.hands.E}</div>
      <div class="south hand">S: ${p.hands.S}</div>
    </div>
  `;

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";
  document.getElementById("feedback").textContent = "";
  document.getElementById("nextBtn").style.display = "none";

  p.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => {
      if (opt === p.answer) {
        document.getElementById("feedback").textContent =
          "✅ Correct! " + p.explanation;
        document.getElementById("nextBtn").style.display = "inline-block";
      } else {
        document.getElementById("feedback").textContent = "❌ Try again.";
      }
    };
    optionsDiv.appendChild(btn);
  });
}

document.getElementById("nextBtn").onclick = () => {
  current = (current + 1) % problems.length;
  showProblem();
};

loadProblems();
