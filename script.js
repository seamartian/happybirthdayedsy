let puzzle;
let selected = [];
let solvedGroups = [];
let mistakes = 4;

async function loadPuzzle(){

const response = await fetch("puzzles.json");
const puzzles = await response.json();

const today = new Date().toISOString().slice(0,10);
puzzle = puzzles["2026-03-07"];

let words = puzzle.groups.flatMap(g => g.words);

words = words.sort(()=>Math.random()-0.5);

const grid = document.getElementById("grid");

words.forEach(word=>{

let div=document.createElement("div");
div.className="word";
div.innerText=word;

div.onclick=()=>toggleWord(div,word);

grid.appendChild(div);

});
}

function toggleWord(div,word){

if(div.classList.contains("selected")){
div.classList.remove("selected");
selected = selected.filter(w=>w!==word);
return;
}

if(selected.length>=4) return;

div.classList.add("selected");
selected.push(word);

}

function submitGuess(){

if(selected.length!==4){
alert("Select 4 words");
return;
}

for(let group of puzzle.groups){

if(solvedGroups.includes(group)) continue;

let match = group.words.every(w=>selected.includes(w));

if(match){

solveGroup(group);
clearSelection();
return;

}

}

mistakes--;

document.getElementById("mistakes").innerText =
"Mistakes remaining: " + mistakes;

if(mistakes===0){
alert("Sowwy \nBetter luck next time");
}

clearSelection();

}

function solveGroup(group){

solvedGroups.push(group);

const solvedDiv=document.getElementById("solved");

let div=document.createElement("div");

div.className="group";
div.style.background=group.color;

div.innerText =
group.name + ": " + group.words.join(", ");

solvedDiv.appendChild(div);

removeWords(group.words);

if(solvedGroups.length===4){
alert("HECK YEAH");
}

}

function removeWords(words){

const tiles=document.querySelectorAll(".word");

tiles.forEach(tile=>{
if(words.includes(tile.innerText)){
tile.remove();
}
});

}

function clearSelection(){

selected=[];

document.querySelectorAll(".word").forEach(tile=>{
tile.classList.remove("selected");
});

}

loadPuzzle();
