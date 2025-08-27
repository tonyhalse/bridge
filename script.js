// Example problem set
const problems = [
  {
    title: "Problem 1",
    contract: "4♥ by South",
    problem: "West leads the ♠K. How should South play?",
    hands: {
      N: { spades: "AQT7", hearts: "KJ3", diamonds: "762", clubs: "985" },
      E: { spades: "J32", hearts: "T84", diamonds: "QJ83", clubs: "Q42" },
      S: { spades: "964", hearts: "AQ9762", diamonds: "AK", clubs: "K3" },
      W: { spades: "K85", hearts: "5", diamonds: "T954", clubs: "AJT76" }
    },
    options: ["Win ♠A", "Duck spade", "Ruff immediately"],
    answer: "Duck spade",
    explanation: "If South ducks the first spade, West has no entry to continue the attack."
  }
];

let current = 0;

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

// Load first problem
showProblem();
