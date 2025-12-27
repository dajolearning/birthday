let data={version:"v1",puzzles:[]};

function add(){
  const a=document.getElementById("answer").value.toUpperCase();
  const h=document.getElementById("hints").value.split("\n").filter(Boolean);
  const w=document.getElementById("win").value;
  if(!/^[A-Z]{5}$/.test(a)) return alert("Answer must be 5 letters");
  data.puzzles.push({answer:a,hints:h,winMessage:w});
  document.getElementById("out").textContent=JSON.stringify(data,null,2);
}

function exportJson(){
  const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download="puzzles.json";
  a.click();
}
