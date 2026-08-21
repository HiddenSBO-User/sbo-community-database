(()=>{const $=id=>document.getElementById(id),fmt=new Intl.NumberFormat("en-US");let mode=1;
const data=g=>g==="event"?(window.SBO_EVENT_BOSSES||[]):((window.SBO_BOSSES||{})[g]||[]);
const selected=(g,b)=>data(g.value)[+b.value]||null;
function fill(g,b,e){b.innerHTML="";data(g.value).forEach((x,i)=>{let o=document.createElement("option");o.value=i;o.textContent=`${x.floor?"Floor "+x.floor+" · ":""}${x.name} — ${fmt.format(x.exp)} EXP`;b.appendChild(o)});show(g,b,e)}
function show(g,b,e){let x=selected(g,b);e.textContent=x?fmt.format(x.exp)+" EXP":"0 EXP"}
function req(l){return 3*l*l+9*l-3} function remaining(c,ce,t){let s=0;for(let l=c+1;l<=t;l++)s+=req(l);return Math.max(0,s-ce)}
const g1=$("g1"),b1=$("b1"),e1=$("e1"),g2=$("g2"),b2=$("b2"),e2=$("e2");
document.querySelectorAll("[data-mode]").forEach(btn=>btn.onclick=()=>{mode=+btn.dataset.mode;document.querySelectorAll("[data-mode]").forEach(x=>x.classList.toggle("active",x===btn));$("box2").classList.toggle("hidden",mode===1);$("totalBox").classList.toggle("hidden",mode===1);$("perLabel").textContent=mode===2?"EXP Per Rotation":"EXP Per Kill";$("countLabel").textContent=mode===2?"Rotations Required":"Bosses Required"});
g1.onchange=()=>fill(g1,b1,e1);b1.onchange=()=>show(g1,b1,e1);g2.onchange=()=>fill(g2,b2,e2);b2.onchange=()=>show(g2,b2,e2);
$("calc").onclick=()=>{let c=+$("cl").value,ce=+$("ce").value||0,t=+$("tl").value,err=$("error");err.textContent="";$("results").hidden=true;
if(!Number.isInteger(c)||c<1||c>1000)return err.textContent="Enter a valid Current Level between 1 and 1000.";
if(!Number.isInteger(t)||t<=c||t>1000)return err.textContent="Target Level must be higher than Current Level and no higher than 1000.";
if(ce<0||ce>=req(c+1))return err.textContent=`Current EXP must be between 0 and ${fmt.format(req(c+1)-1)}.`;
let x=selected(g1,b1),y=selected(g2,b2);if(!x||x.exp<=0)return err.textContent="Select an active Boss 1.";if(mode===2&&(!y||y.exp<=0))return err.textContent="Select an active Boss 2.";
let mult=$("doubleXp").checked?2:1,xp1=x.exp*mult,xp2=mode===2?y.exp*mult:0,per=xp1+xp2,rem=remaining(c,ce,t),count=Math.ceil(rem/per),total=count*mode;
$("rem").textContent=fmt.format(rem);$("per").textContent=fmt.format(per);$("count").textContent=fmt.format(count);$("total").textContent=fmt.format(total);
$("detail").innerHTML=`<strong>${x.name}</strong> — ${fmt.format(xp1)} EXP/kill — ${fmt.format(count)} kills`+(mode===2?`<br><strong>${y.name}</strong> — ${fmt.format(xp2)} EXP/kill — ${fmt.format(count)} kills`:"");$("results").hidden=false};
g1.value=g2.value="floors16to19";fill(g1,b1,e1);fill(g2,b2,e2);let arr=data("floors16to19");b1.value=Math.max(0,arr.findIndex(x=>x.name==="Thug Boss"));b2.value=Math.max(0,arr.findIndex(x=>x.name==="Loan Shark Boss"));show(g1,b1,e1);show(g2,b2,e2)})();