
let puzzle;
let selected = [];
let solvedGroups = [];
let mistakes = 4;

async function loadPuzzle() {
  try {
    const response = await fetch("./puzzles.json");

    if (!response.ok) {
      throw new Error("Could not find puzzles.json: " + response.status);
    }

    const puzzles = await response.json();

    puzzle = puzzles["2026-03-07"];

    if (!puzzle) {
      throw new Error("Puzzle dated 2026-03-07 was not found.");
    }

    if (!puzzle.groups || puzzle.groups.length !== 4) {
      throw new Error("Puzzle groups are missing or incomplete.");
    }

    let words = puzzle.groups.flatMap(g => g.words);

    words = words.sort(() => Math.random() - 0.5);

    const grid = document.getElementById("grid");

    if (!grid) {
      throw new Error("Could not find the grid element in HTML.");
    }

    grid.innerHTML = "";

    words.forEach(word => {
      let div = document.createElement("div");
      div.className = "word";
      div.innerText = word;

      div.onclick = () => toggleWord(div, word);

      grid.appendChild(div);
    });

    console.log("Puzzle loaded successfully!");

  } catch (error) {
    console.error("Puzzle loading error:", error);
    alert("Puzzle loading error: " + error.message);
  }
}

function toggleWord(div, word) {
  if (div.classList.contains("selected")) {
    div.classList.remove("selected");
    selected = selected.filter(w => w !== word);
    return;
  }

  if (selected.length >= 4) return;

  div.classList.add("selected");
  selected.push(word);
}

function submitGuess() {
  if (selected.length !== 4) {
    alert("Select 4 words");
    return;
  }

  for (let group of puzzle.groups) {
    if (solvedGroups.includes(group)) continue;

    let match = group.words.every(w => selected.includes(w));

    if (match) {
      solveGroup(group);
      clearSelection();
      return;
    }
  }

  mistakes--;

  document.getElementById("mistakes").innerText =
    "Mistakes remaining: " + mistakes;

  if (mistakes === 0) {
    alert("Ok \nTry one more time");
  }

  clearSelection();
}

function solveGroup(group) {
  solvedGroups.push(group);

  const solvedDiv = document.getElementById("solved");

  let div = document.createElement("div");

  div.className = "group";
  div.style.background = group.color;

  div.innerText = group.name + ": " + group.words.join(", ");

  solvedDiv.appendChild(div);

  removeWords(group.words);

  if (solvedGroups.length === 4) {
    alert("GOOD JOB BRANSON");
  }
}

function removeWords(words) {
  const tiles = document.querySelectorAll(".word");

  tiles.forEach(tile => {
    if (words.includes(tile.innerText)) {
      tile.remove();
    }
  });
}

function clearSelection() {
  selected = [];

  document.querySelectorAll(".word").forEach(tile => {
    tile.classList.remove("selected");
  });
}

loadPuzzle();
