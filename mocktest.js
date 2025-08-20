const BANK = {
  ssc: [
    { q: "Which is the largest planet?", opts:["Earth","Jupiter","Mars","Saturn"], ans:"Jupiter" },
    { q: "Capital of India?", opts:["Mumbai","Delhi","Chennai","Kolkata"], ans:"Delhi" },
    { q: "Fastest land animal?", opts:["Cheetah","Tiger","Horse","Leopard"], ans:"Cheetah" },
    { q: "2 + 5 × 2 = ?", opts:["9","14","7","10"], ans:"12" } // trick
  ],
  jee: [
    { q: "Derivative of x^2?", opts:["x","2x","x^3","3x^2"], ans:"2x" },
    { q: "Limit of sin x / x as x→0?", opts:["0","1","∞","Does not exist"], ans:"1" },
    { q: "∫ 0→1 2x dx =", opts:["1","0","2","3"], ans:"1" },
    { q: "Unit of resistance?", opts:["Ohm","Volt","Ampere","Watt"], ans:"Ohm" }
  ],
  neet: [
    { q:"Smallest bone in human body?", opts:["Stapes","Femur","Tibia","Ulna"], ans:"Stapes" },
    { q:"RBC lifespan?", opts:["120 days","60 days","90 days","150 days"], ans:"120 days" },
    { q:"Normal human bp approx.?", opts:["90/60","120/80","140/90","110/70"], ans:"120/80" },
    { q:"Site of photosynthesis?", opts:["Mitochondria","Nucleus","Chloroplast","Ribosome"], ans:"Chloroplast" }
  ],
  nda: [
    { q:"First President of India?", opts:["Rajendra Prasad","Nehru","Patel","Azad"], ans:"Rajendra Prasad" },
    { q:"Kargil war year?", opts:["1999","2001","1995","1990"], ans:"1999" },
    { q:"National animal of India?", opts:["Lion","Tiger","Elephant","Peacock"], ans:"Tiger" },
    { q:"36 ÷ 6 × 3 =", opts:["6","18","12","9"], ans:"18" }
  ]
};

/* ---------- State ---------- */
let examKey = "";
let paper = [];
let current = 0;
let answers = [];       // user choice per question or null
let status = [];        // "not-visited" | "visited" | "answered" | "marked"
let timerId = null;
let totalSeconds = 20*60;   // set your exam time here (20 min demo)
let leftSeconds = totalSeconds;
let startedAt = null;

/* ---------- Utility ---------- */
const $ = (id)=>document.getElementById(id);

function resetAll(){
  $("examSel").value = "";
}

function startTest(){
  const sel = $("examSel").value;
  if(!sel){ alert("Please select an exam"); return; }
  examKey = sel;
  paper = BANK[sel].map(q=>({...q}));
  answers = Array(paper.length).fill(null);
  status = Array(paper.length).fill("not-visited");
  current = 0;
  startedAt = Date.now();

  $("examName").textContent = sel.toUpperCase();
  $("startScreen").classList.add("hidden");
  $("testScreen").classList.remove("hidden");

  buildPalette();
  visit(current);
  renderQuestion();

  leftSeconds = totalSeconds;
  timerId = setInterval(tick, 1000);
  tick();
}

function buildPalette(){
  const pal = $("palette");
  pal.innerHTML = "";
  paper.forEach((_,i)=>{
    const b = document.createElement("button");
    b.className = "pal-btn";
    b.textContent = i+1;
    b.onclick = ()=>{ saveTemp(); goTo(i); };
    pal.appendChild(b);
  });
  updatePalette();
}

function updatePalette(){
  const items = $("palette").children;
  let answeredCount = 0;
  [...items].forEach((el, i)=>{
    el.className = "pal-btn";
    if(status[i] === "answered") { el.classList.add("answered"); answeredCount++; }
    else if(status[i] === "marked") el.classList.add("marked");
    else if(status[i] === "visited") el.classList.add("visited");
    if(i === current) el.classList.add("current");
  });
  $("progressText").textContent = `${answeredCount}/${paper.length} answered`;
}

function renderQuestion(){
  const q = paper[current];
  $("qIndex").textContent = current+1;
  $("qText").textContent = q.q;

  const wrap = $("qOptions");
  wrap.innerHTML = "";
  q.opts.forEach(opt=>{
    const id = "opt-"+current+"-"+opt;
    const label = document.createElement("label");
    label.className = "opt";
    label.htmlFor = id;

    const input = document.createElement("input");
    input.type = "radio"; input.name = "ans"; input.value = opt; input.id = id;
    if(answers[current] === opt) input.checked = true;

    label.appendChild(input);
    label.appendChild(document.createTextNode(opt));
    wrap.appendChild(label);
  });

  updatePalette();
}

function getSelected(){
  const checked = document.querySelector("input[name='ans']:checked");
  return checked ? checked.value : null;
}

/* ---- Status helpers ---- */
function visit(i){
  if(status[i] === "not-visited") status[i] = "visited";
}
function saveTemp(){ // do not move next, just store current choice as visited/answered
  const v = getSelected();
  if(v !== null){
    answers[current] = v;
    status[current] = "answered";
  }else if(status[current] !== "marked"){
    status[current] = "visited";
  }
  updatePalette();
}

/* ---- Navigation and actions ---- */
function saveAndNext(){
  const v = getSelected();
  if(v === null){
    // no answer chosen
    status[current] = status[current] === "marked" ? "marked" : "visited";
  } else {
    answers[current] = v;
    status[current] = "answered";
  }
  nextQ();
}

function markForReview(){
  // keep current selection (if any) but mark the question
  const v = getSelected();
  if(v !== null) answers[current] = v;
  status[current] = "marked";
  nextQ();
}

function clearResponse(){
  answers[current] = null;
  const radios = document.querySelectorAll("input[name='ans']");
  radios.forEach(r=>r.checked = false);
  if(status[current] !== "marked") status[current] = "visited";
  updatePalette();
}

function nextQ(){
  if(current < paper.length-1){
    current++;
    visit(current);
    renderQuestion();
  }
}

function prevQ(){
  if(current > 0){
    current--;
    visit(current);
    renderQuestion();
  }
}

function goTo(i){
  current = i;
  visit(current);
  renderQuestion();
}

/* ---- Timer ---- */
function tick(){
  if(leftSeconds <= 0){
    clearInterval(timerId);
    doSubmit(true);
    return;
  }
  leftSeconds--;
  const m = Math.floor(leftSeconds/60);
  const s = leftSeconds%60;
  $("timer").textContent = `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}

/* ---- Submit ---- */
function confirmSubmit(){
  const unanswered = answers.filter(v=>v===null).length;
  const marked = status.filter(s=>s==="marked").length;
  const ok = confirm(
    `Submit test?\nUnanswered: ${unanswered}\nMarked for review: ${marked}\nYou cannot change answers after submit.`
  );
  if(ok) doSubmit(false);
}

function doSubmit(auto=false){
  // count score
  let score = 0;
  paper.forEach((q,i)=>{ if(answers[i] === q.ans) score++; });

  $("testScreen").classList.add("hidden");
  $("resultScreen").classList.remove("hidden");

  const usedSec = Math.max(0, totalSeconds - leftSeconds);
  const um = Math.floor(usedSec/60), us = usedSec%60;

  $("scoreLine").textContent = `Score: ${score} / ${paper.length}` + (auto ? " (auto-submitted)" : "");
  $("timeUsed").textContent = `Time used: ${String(um).padStart(2,"0")}:${String(us).padStart(2,"0")}`;
}

function restart(){
  // back to start
  clearInterval(timerId);
  $("resultScreen").classList.add("hidden");
  $("startScreen").classList.remove("hidden");
  $("examSel").value = "";
}


  function toggleMenu() {
    document.getElementById("navLinks").classList.toggle("active");
  }
