// =========================
// MATERIALS DATABASE
// (split out of blacksmith.js)
// =========================


let allItems = [];

let inventory = {};

let inventorySearchTerm = "";

let inventorySort = "az";

let materialUsage = {};

let materialNameList = [];

// Materials over the cap are ones people keep extra of on storage alts;
// this flag is stored separately from the owned quantity itself so
// checking it doesn't wipe out what they've already entered.
let overCap = {};

// =========================
// MATERIAL CAPS
// =========================

// In-game storage caps. Everything defaults to 500 unless it's named in
// one of the lists below. These lists are a best-effort guess based on
// naming conventions (e.g. "Token" items look like event currency) —
// edit them directly if a material is capped differently in-game.
const DEFAULT_MATERIAL_CAP = 500;
const CONSUMABLE_MATERIAL_CAP = 999;
const EVENT_CURRENCY_MATERIAL_CAP = 5000;

const CONSUMABLE_MATERIALS = [
  // Add consumable item names here, e.g. "Candy", "Turkey Leg"
];

const EVENT_CURRENCY_MATERIALS = [
  // Add event currency item names here, e.g. "Easter Egg"
];

function getMaterialCap(name) {
  if (CONSUMABLE_MATERIALS.includes(name)) return CONSUMABLE_MATERIAL_CAP;
  if (EVENT_CURRENCY_MATERIALS.includes(name)) return EVENT_CURRENCY_MATERIAL_CAP;
  return DEFAULT_MATERIAL_CAP;
}


// =========================
// LOAD BLACKSMITH JSON
// =========================


document.addEventListener(
"DOMContentLoaded",
function(){


fetch("data/blacksmith.json")


.then(response => response.json())


.then(items => {


allItems = items;


buildMaterialUsage();


loadInventory();


setupInventoryControls();

setupMaterialNameAutocomplete();


})


.catch(error => {


console.error(
"Materials loading error:",
error
);


});


});


// =========================
// MATERIAL USAGE MAP
// =========================


function buildMaterialUsage(){


materialUsage = {};

allItems.forEach(item=>{


if(!item.materials) return;

item.materials.forEach(mat=>{


if(materialUsage[mat.name] === undefined){

materialUsage[mat.name] = 0;

}


materialUsage[mat.name]++;


});


});


}




function createInventory(){

let materials = [];


allItems.forEach(item=>{


if(item.materials){


item.materials.forEach(mat=>{


if(!materials.includes(mat.name)){


materials.push(mat.name);


}


});


}



});




materials.forEach(material=>{


if(inventory[material] === undefined){


inventory[material] = 0;


}



});





saveInventory();

populateMaterialOptions();


displayInventory();




}





// =========================
// LOAD INVENTORY
// =========================


function loadInventory(){



let saved =

localStorage.getItem(
"blacksmithInventory"
);


if(saved){



inventory =
JSON.parse(saved);



}

let savedOverCap =
localStorage.getItem("blacksmithOverCap");

if(savedOverCap){
overCap = JSON.parse(savedOverCap);
}



createInventory();


}







// =========================
// SAVE INVENTORY
// =========================


function saveInventory(){



localStorage.setItem(

"blacksmithInventory",

JSON.stringify(inventory)

);



}


function saveOverCap(){

localStorage.setItem(
"blacksmithOverCap",
JSON.stringify(overCap)
);

}








// =========================
// DISPLAY INVENTORY
// =========================


function displayInventory(){

const container =

document.getElementById(
"inventory-container"
);


if(!container)
return;


const summaryBox =
document.getElementById("inventory-summary");


let names = Object.keys(inventory);


const totalCount = names.length;

const collectedCount =
names.filter(n => inventory[n] > 0).length;


if(summaryBox){

summaryBox.innerHTML =
`<strong>${collectedCount}</strong> / ${totalCount} materials collected`;

}


const term = inventorySearchTerm.trim().toLowerCase();

if(term){

names = names.filter(n =>
n.toLowerCase().includes(term)
);

}


if(inventorySort === "az"){

names.sort();

}
else if(inventorySort === "owned-high"){

names.sort((a,b) => inventory[b] - inventory[a] || a.localeCompare(b));

}
else if(inventorySort === "owned-low"){

names.sort((a,b) => inventory[a] - inventory[b] || a.localeCompare(b));

}
else if(inventorySort === "needed"){

names.sort((a,b) => {

const aZero = inventory[a] === 0 ? 0 : 1;

const bZero = inventory[b] === 0 ? 0 : 1;

return aZero - bZero || a.localeCompare(b);

});

}


container.innerHTML="";


if(names.length === 0){

container.innerHTML =
`<p class="inventory-empty">No materials match "${inventorySearchTerm}".</p>`;

return;

}


let html = "";

names.forEach(material=>{


const owned = inventory[material] || 0;

const usedIn = materialUsage[material] || 0;

const ownedClass = owned > 0 ? "has-stock" : "no-stock";

const cap = getMaterialCap(material);

const isOverCap = !!overCap[material];

const atCapClass = (!isOverCap && owned >= cap) ? "at-cap" : "";


html += `


<div class="inventory-item ${ownedClass} ${atCapClass}">


<div class="inventory-item-info">

<h3>${material}</h3>

<span class="inventory-usage">Used in ${usedIn} recipe${usedIn === 1 ? "" : "s"} · Cap: ${cap}</span>

<label class="over-cap-toggle">
<input
type="checkbox"
${isOverCap ? "checked" : ""}
onchange="setOverCap('${material}', this.checked)"
>
On storage alt (more than ${cap})
</label>

</div>


<div class="inventory-item-controls">

<button class="qty-btn" onclick="changeMaterial('${material}',-1)">-</button>

<input

class="qty-input"

type="number"

min="0"

${isOverCap ? "" : `max="${cap}"`}

value="${owned}"

onchange="setMaterialAmount('${material}', this.value)"

>

<button class="qty-btn" onclick="changeMaterial('${material}',1)">+</button>

</div>


</div>


`;


});


container.innerHTML = html;


}




function setMaterialAmount(name, value){


let amount = Number(value);


if(isNaN(amount) || amount < 0){

amount = 0;

}

if(!overCap[name]){
const cap = getMaterialCap(name);
if(amount > cap) amount = cap;
}


inventory[name] = amount;


saveInventory();

displayInventory();


}


function setOverCap(name, checked){

overCap[name] = checked;

saveOverCap();

// Re-clamp the current amount if the flag was just turned off.
if(!checked){
const cap = getMaterialCap(name);
if((inventory[name] || 0) > cap){
inventory[name] = cap;
saveInventory();
}
}

displayInventory();

}




function populateMaterialOptions(){


// Kept as the source list; the actual dropdown is built on demand in
// setupMaterialNameAutocomplete so it can be filtered as the user types.
materialNameList = Object.keys(inventory).sort();


}




function setupMaterialNameAutocomplete(){


const input = document.getElementById("material-name");

const box = document.getElementById("material-name-suggestions");


if(!input || !box) return;


function render(matches){

if(matches.length === 0){
box.innerHTML = "";
box.classList.remove("visible");
return;
}

box.innerHTML = matches
.slice(0, 8)
.map(name => `<div class="material-suggestion-row" data-name="${name}">${name}</div>`)
.join("");

box.classList.add("visible");

box.querySelectorAll(".material-suggestion-row").forEach(row => {
// touchstart fires before the input's blur/click race on mobile,
// so the tap reliably registers on both iOS and Android instead
// of the row disappearing before the tap lands.
["touchstart", "mousedown"].forEach(evtName => {
row.addEventListener(evtName, function(event){
event.preventDefault();
input.value = this.dataset.name;
box.innerHTML = "";
box.classList.remove("visible");
});
});
});

}


input.addEventListener("input", function(){

const value = this.value.trim().toLowerCase();

if(!value){
box.innerHTML = "";
box.classList.remove("visible");
return;
}

const matches = materialNameList.filter(name =>
name.toLowerCase().includes(value)
);

render(matches);

});


input.addEventListener("blur", function(){

// Small delay so a tap on a suggestion row still registers before
// the list is cleared.
setTimeout(() => {
box.innerHTML = "";
box.classList.remove("visible");
}, 150);

});


}




function setupInventoryControls(){


const searchInput =
document.getElementById("inventory-search");


const sortSelect =
document.getElementById("inventory-sort");


if(searchInput){

let searchDebounce;

searchInput.oninput = function(){

inventorySearchTerm = this.value;

clearTimeout(searchDebounce);

searchDebounce = setTimeout(displayInventory, 150);

};

}


if(sortSelect){

sortSelect.onchange = function(){

inventorySort = this.value;

displayInventory();

};

}


}








// =========================
// CHANGE AMOUNT
// =========================


function changeMaterial(name,amount){


if(inventory[name] === undefined){

inventory[name]=0;

}


inventory[name]+=amount;


if(inventory[name]<0){

inventory[name]=0;

}

if(!overCap[name]){
const cap = getMaterialCap(name);
if(inventory[name] > cap){
inventory[name] = cap;
}
}



saveInventory();

displayInventory();

}









// =========================
// RESET INVENTORY
// =========================


document.addEventListener(

"click",

function(event){



if(
event.target.id === "reset-inventory"
){


if(!confirm("Reset all material quantities to 0? This can't be undone.")){

return;

}


Object.keys(inventory)

.forEach(material=>{


inventory[material]=0;


});



saveInventory();

displayInventory();

}



});

// =========================
// MANUAL ADD MATERIAL
// =========================


document.addEventListener(
"DOMContentLoaded",
function(){


const addButton =
document.getElementById(
"add-material"
);


if(!addButton)
return;


addButton.onclick=function(){



const name =

document
.getElementById(
"material-name"
)
.value
.trim();


const amount =

Number(

document
.getElementById(
"material-amount"
)
.value

);




if(!name || amount <= 0){

return;

}

const errorBox =
document.getElementById("material-add-error");


// find matching material name

let found =

Object.keys(inventory)

.find(

material =>

material.toLowerCase() === name.toLowerCase()

);


if(found){


inventory[found]+=amount;

if(!overCap[found]){
const cap = getMaterialCap(found);
if(inventory[found] > cap) inventory[found] = cap;
}

if(errorBox) errorBox.textContent = "";

}

else{

if(errorBox){

errorBox.textContent =
`No material named "${name}" found. Pick one from the suggestions list.`;

}

return;

}




saveInventory();

displayInventory();

document
.getElementById(
"material-name"
)
.value="";


document
.getElementById(
"material-amount"
)
.value="";


};



});
