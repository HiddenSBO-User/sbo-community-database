// =========================
// MATERIALS DATABASE
// (split out of blacksmith.js)
// =========================


let allItems = [];

let inventory = {};

let inventorySearchTerm = "";

let inventorySort = "az";

let materialUsage = {};


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


html += `


<div class="inventory-item ${ownedClass}">


<div class="inventory-item-info">

<h3>${material}</h3>

<span class="inventory-usage">Used in ${usedIn} recipe${usedIn === 1 ? "" : "s"}</span>

</div>


<div class="inventory-item-controls">

<button class="qty-btn" onclick="changeMaterial('${material}',-1)">-</button>

<input

class="qty-input"

type="number"

min="0"

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


inventory[name] = amount;


saveInventory();

displayInventory();


}




function populateMaterialOptions(){


const list =
document.getElementById("material-name-options");


if(!list)
return;


list.innerHTML =
Object.keys(inventory)
.sort()
.map(name => `<option value="${name}"></option>`)
.join("");


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
