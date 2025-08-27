let problems = [];
let current = 0;

async function loadProblems() {
  const res = await fetch("problems.json");
  problems = await res.json();
  for (let p of problems) {
    checkDeal(p)
  }
  showProblem();
}

function checkDeal(deal) {
  const allCards = new Set();
  const suits = ["spades", "hearts", "diamonds", "clubs"];
  const ranks = "AKQJT98765432".split("");

  const expectedCards = [];
  for (let s of ["S","H","D","C"]) {
    for (let r of ranks) {
      expectedCards.push(r + s);
    }
  }

  let counts = { N:0, E:0, S:0, W:0 };

  for (let seat of ["N","E","S","W"]) {
    for (let suit of suits) {
      for (let r of deal.hands[seat][suit]) {
        let code = r + suit[0].toUpperCase(); // e.g. "A" + "S" → "AS"
        counts[seat]++;
        if (allCards.has(code)) {
          console.error("Duplicate card:", code);
        }
        allCards.add(code);
      }
    }
  }

  console.log("Card counts:", counts);

  if (allCards.size !== 52) {
    console.error("Error: deal does not contain 52 unique cards.");
  } else {
    console.log("Deal is valid: 52 cards, 13 per hand.");
  }
}


function renderHandOLD(label, hand) {
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
function renderHand(container, cards) {
  // cards: e.g. ["AS","KH","QD","2C"]
  const handDiv = document.createElement("div");
  handDiv.className = "cards";

  cards.forEach(card => {
    const img = document.createElement("img");
    img.src = `cards/${card}.png`;   // adjust path if needed
    img.alt = card;
    handDiv.appendChild(img);
  });

  container.appendChild(handDiv);
}

function renderProblem(problem) {
  const board = document.getElementById("board");
  board.innerHTML = ""; // clear old

  // Layout grid for compass positions
  board.className = "table";

  const seats = ["north", "west", "east", "south"];
  seats.forEach(seat => {
    const div = document.createElement("div");
    div.className = `hand ${seat}`;

    // Gather all cards into one array
    let cards = [];
    ["spades", "hearts", "diamonds", "clubs"].forEach(suit => {
      if (problem.hands[seat[0].toUpperCase()]) {
        const suitCards = problem.hands[seat[0].toUpperCase()][suit];
        if (suitCards) {
          cards = cards.concat(suitCards.split("").map(r => {
            // handle 10 as "T"
            return r + suit[0].toUpperCase();
          }));
        }
      }
    });

    renderHand(div, cards);
    board.appendChild(div);
  });

  // Show contract/problem text in center
  const center = document.createElement("div");
  center.className = "center";
  center.innerHTML = `<h3>${problem.contract}</h3><p>${problem.problem}</p>`;
  board.appendChild(center);
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
  renderProblem(p);
}

function showProblemOLD() {
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
