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
      <div class="north">${renderHand("N", p.hands.N)}</div>
      <div class="west">${renderHand("W", p.hands.W)}</div>
      <div class="center">
        <p><b>Contract:</b> ${p.contract}</p>
        <p>${p.problem}</p>
        <div id="options"></div>   <!-- 👈 add options container here -->
        <div id="feedback"></div>  <!-- 👈 and feedback -->
      </div>
      <div class="east">${renderHand("E", p.hands.E)}</div>
      <div class="south">${renderHand("S", p.hands.S)}</div>
    </div>
  `;

  // Reset feedback + buttons
  const optionsDiv = document.getElementById("options");
  document.getElementById("feedback").textContent = "";
  document.getElementById("nextBtn").style.display = "none";

  // Build answer buttons
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


function renderHand(label, hand) {
  return `
    <div class="hand">
      <div><b>${label}</b></div>
      <div class="spades">♠ ${hand.spades || "-"}</div>
      <div class="hearts">♥ ${hand.hearts || "-"}</div>
      <div class="diamonds">♦ ${hand.diamonds || "-"}</div>
      <div class="clubs">♣ ${hand.clubs || "-"}</div>
    </div>
  `;
}

document.getElementById("nextBtn").onclick = () => {
  current = (current + 1) % problems.length;
  showProblem();
};

p.options.forEach(opt => {
  const btn = document.createElement("button");
  btn.textContent = opt;

  // add a class depending on the suit
  if (opt.includes("♠")) btn.classList.add("spades");
  if (opt.includes("♥")) btn.classList.add("hearts");
  if (opt.includes("♦")) btn.classList.add("diamonds");
  if (opt.includes("♣")) btn.classList.add("clubs");

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


loadProblems();
