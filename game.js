const CONFIG = {
  wordLength: 5,
  maxGuesses: 6,
  hintUnlockGuess: 3,
  storageKey: "birthdayWordleProgress_v1"
};

const els = {
  grid: document.getElementById("grid"),
  kbd: document.getElementById("kbd"),
  hintText: document.getElementById("hintText"),
  hintBtn: document.getElementById("hintBtn"),
  resetBtn: document.getElementById("resetBtn"),
  toast: document.getElementById("toast"),
  progressText: document.getElementById("progressText"),
  guessesText: document.getElementById("guessesText")
};

const KEYS = [
  ["q","w","e","r","t","y","u","i","o","p"],
  ["a","s","d","f","g","h","j","k","l"],
  ["enter","z","x","c","v","b","n","m","back"]
];

let puzzles = [];
let state = {};

function toast(t){
  els.toast.textContent = t;
  els.toast.classList.add("show");
  setTimeout(()=>els.toast.classList.remove("show"),1500);
}

function emptyBoard(){
  return Array.from({length:CONFIG.maxGuesses},()=>Array(CONFIG.wordLength).fill(""));
}

async function loadPuzzles(){
  const r = await fetch("puzzles.json",{cache:"no-store"});
  const d = await r.json();
  puzzles = d.puzzles;
}

function loadState(){
  const s = localStorage.getItem(CONFIG.storageKey);
  if (s) return JSON.parse(s);
  return {
    idx:0,row:0,col:0,board:emptyBoard(),hint:0,done:false
  };
}

function save(){localStorage.setItem(CONFIG.storageKey,JSON.stringify(state));}

function render(){
  els.grid.innerHTML="";
  for(let r=0;r<CONFIG.maxGuesses;r++){
    const row=document.createElement("div");row.className="row";
    for(let c=0;c<CONFIG.wordLength;c++){
      const cell=document.createElement("div");cell.className="cell";
      cell.textContent=state.board[r][c];
      row.appendChild(cell);
    }
    els.grid.appendChild(row);
  }
  els.progressText.textContent=`${state.idx+1}/${puzzles.length}`;
  els.guessesText.textContent=`${state.row}/${CONFIG.maxGuesses}`;
}

function submit(){
  if(state.done) return;
  const guess=state.board[state.row].join("");
  if(guess.length!==5) return toast("Need 5 letters");
  const ans=puzzles[state.idx].answer;
  const res=[];
  for(let i=0;i<5;i++){
    if(guess[i]===ans[i]) res[i]="correct";
    else if(ans.includes(guess[i])) res[i]="present";
    else res[i]="absent";
  }
  const rowEl=els.grid.children[state.row];
  res.forEach((r,i)=>rowEl.children[i].classList.add(r));
  if(guess===ans){
    toast("Solved!");
    els.hintText.textContent=puzzles[state.idx].winMessage;
    state.idx++;
    state.board=emptyBoard();
    state.row=0;
    save(); render(); return;
  }
  state.row++; save(); render();
}

document.addEventListener("keydown",e=>{
  if(e.key==="Enter") submit();
  if(e.key==="Backspace"){state.col--;state.board[state.row][state.col]="";save();render();}
  if(/^[a-zA-Z]$/.test(e.key)){
    if(state.col<5){state.board[state.row][state.col]=e.key.toUpperCase();state.col++;save();render();}
  }
});

els.hintBtn.onclick=()=>els.hintText.textContent=puzzles[state.idx].hints[state.hint]||"No more hints";
els.resetBtn.onclick=()=>{localStorage.removeItem(CONFIG.storageKey);location.reload();};

(async()=>{
  await loadPuzzles();
  state=loadState();
  render();
})();
