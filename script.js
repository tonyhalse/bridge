let problems = [];
let current = 0;

async function loadProblems() {
  const res = await fetch("problems.json");
  problems = await res.json();
  showProblem();
}

function renderHand(label, hand) {
  return `
    <div class="hand">
      <div><b>${label}</b></div>
      <div class="cards">${renderCards("spades", hand.spades)}</div>
      <div class="cards">${renderCards("hearts", hand.hearts)}</div>
      <div class="cards">${renderCards("diamonds", hand.diamonds)}</div>
      <div class="cards">${renderCards("clubs", hand.clubs)}</div>
    </div>
  `;
}

function renderCards(suit, ranks) {
  if (!ranks) return "";
  return ranks.split("").map(r => {
    const rank = convertRank(r);
    const suitLetter = suit[0].toUpperCase(); // "S", "H", "D", "C"
    const code = rank + suitLetter;           // e.g. "AS", "0H"
    return `<img src="https://deckofcardsapi.com/static/img/${code}.png" class="card">`;
  }).join("");
}

function convertRank(r) {
  // Map characters to API codes
  if (r === "T") return "0"; // API uses "0" for Ten
  return r;
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
        <div id="options"></div>
        <div id="feedback"></div>
      </div>
      <div class="east">${renderHand("E", p.hands.E)}</div>
      <div class="south">${renderHand("S", p.hands.S)}</div>
    </div>
  `;

  // Reset options/feedback
  const optionsDiv = document.getElementById("options");
  document.getElementById("feedback").textContent = "";
  document.getElementById("nextBtn").style.display = "none";

  // Build answer buttons
  p.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt;

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
}

// Next problem
document.getElementById("nextBtn").onclick = () => {
  current = (current + 1) % problems.length;
  showProblem();
};

loadProblems();
