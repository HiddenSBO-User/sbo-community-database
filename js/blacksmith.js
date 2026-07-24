// =========================
// BLACKSMITH DATABASE
// =========================


let allItems = [];

let currentCategory = "Weapons";

let currentSubCategory = "All";

let currentItems = [];

let currentCraftFilter = "all";


// =========================
// INVENTORY DATABASE
// =========================


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


showCategory(currentCategory);


showSubCategories();


setupCategoryButtons();

setupSearch();

setupSorting();

setupFilterButtons();

setupDetailsButtons();

setupInventoryControls();


})


.catch(error => {


console.error(
"Blacksmith loading error:",
error
);


});


});







// =========================
// CATEGORY BUTTONS
// =========================


function setupCategoryButtons(){


const catButtons =
document
.querySelectorAll(".blacksmith-category-button");


catButtons.forEach(button => {


if(button.dataset.category === currentCategory){

button.classList.add("active");

}


button.onclick=function(){


currentCategory =
this.dataset.category;


currentSubCategory =
"All";


catButtons.forEach(b =>
b.classList.remove("active")
);

this.classList.add("active");


showCategory(
currentCategory
);


showSubCategories();


};


});


}







// =========================
// SHOW CATEGORY
// =========================


function showCategory(category){


currentItems =


allItems.filter(item =>


item.category === category


);



applyFilters();


}








// =========================
// SUB CATEGORY BUTTONS
// =========================


function showSubCategories(){


const box =
document.getElementById(
"blacksmith-subcategories"
);



box.innerHTML="";



let subs=[];



if(currentCategory==="Weapons"){


subs=[

"All",

"One-Handed",

"Two-Handed",

"Rapier",

"Dagger",

"Weapon Handle",

"Melee"

];


}




else if(currentCategory==="Defense"){


subs=[

"All",

"Shield",

"Armor",

"Lower Headgear",

"Upper Headgear"

];


}




else if(currentCategory==="Events / Overlays"){


subs=[

"All",

"Headwear",

"3D Cosmetic Bundle"

];


}



else if(currentCategory==="Legendary"){


subs=[

"All",

"One-Handed",

"Two-Handed",

"Rapier",

"Dagger"

];


}




else{


subs=[

"All"

];


}







subs.forEach(sub=>{



box.innerHTML += `



<button

class="subcategory-button"

data-sub="${sub}"

>

${sub}

</button>


`;



});




document
.querySelectorAll(".subcategory-button")
.forEach(button=>{



if(button.dataset.sub === currentSubCategory){

button.classList.add("active");

}



button.onclick=function(){


currentSubCategory =
this.dataset.sub;


document
.querySelectorAll(".subcategory-button")
.forEach(b =>
b.classList.remove("active")
);

this.classList.add("active");


applyFilters();


};



});



}








// =========================
// DISPLAY ITEMS
// =========================


function displayItems(items){



const container =

document.getElementById(
"blacksmith-container"
);



container.innerHTML="";




if(items.length === 0){

container.innerHTML = `

<h2 class="no-results">

No items found

</h2>

`;

return;

}



items.forEach(item=>{

let status = getCraftStatus(item);

let cosmeticInfo = "";

if(item.category === "Events / Overlays"){



cosmeticInfo += `



<p>

Type:

${item.subCategory}

</p>



${item.event ? `<p>Event: ${item.event}</p>` : ""}



`;





if(item.limited === true){


cosmeticInfo += `


<p class="limited-badge">

🔥 LIMITED

</p>


`;



}


}

container.innerHTML += `



<div class="card">



<h2>

${item.name}

</h2>




<p>

Category:

${item.category}

</p>

${cosmeticInfo}


<p>

SK Required:

${item.sk}

</p>




<p>

Craft EXP:

${item.exp}

</p>

<div class="${status.class}">

${status.text}

</div>


<button

class="details-button"

data-name="${item.name}"

>

View Recipe

</button>



</div>


`;



});



setupDetailsButtons();



}










// =========================
// SEARCH
// =========================


function setupSearch(){


const search =

document.getElementById(
"blacksmith-search"
);



if(!search)
return;




search.addEventListener(
"input",
function(){


applyFilters();


});


}







// =========================
// SORTING
// =========================


function setupSorting(){



const sort =

document.getElementById(
"blacksmith-sort"
);



if(!sort)
return;




sort.addEventListener(
"change",
function(){


applyFilters();


});


}









// =========================
// FILTER SYSTEM
// =========================


function applyFilters(){



let filtered=[...currentItems];






// SUB CATEGORY FILTER


if(
currentSubCategory !== "All"
){


filtered = filtered.filter(item =>


item.subCategory === currentSubCategory


);


}








// SEARCH FILTER


const search =


document

.getElementById(
"blacksmith-search"
)

.value

.toLowerCase()

.trim();





if(search){


filtered = filtered.filter(item =>


(item.name || "")
.toLowerCase()
.includes(search)



||



(item.category || "")
.toLowerCase()
.includes(search)



);



}



// =========================
// CRAFT FILTER
// =========================


if(currentCraftFilter === "craftable"){


filtered = filtered.filter(item => {


return canCraft(item);


});


}




if(currentCraftFilter === "missing"){


filtered = filtered.filter(item => {


return !canCraft(item);


});


}





if(currentCraftFilter === "almost"){


filtered = filtered.filter(item => {


let missing = 0;



item.materials.forEach(mat=>{


let owned =

inventory[mat.name] || 0;



if(owned < mat.amount){


missing++;


}


});



return missing > 0 && missing <= 2;



});


}





// SORT


const sort =


document

.getElementById(
"blacksmith-sort"
)

.value;





switch(sort){



case "sk-high":


filtered.sort(
(a,b)=>
b.sk-a.sk
);


break;




case "sk-low":


filtered.sort(
(a,b)=>
a.sk-b.sk
);


break;




case "exp-high":


filtered.sort(
(a,b)=>
b.exp-a.exp
);


break;




case "exp-low":


filtered.sort(
(a,b)=>
a.exp-b.exp
);


break;




case "az":


filtered.sort(
(a,b)=>
a.name.localeCompare(b.name)
);


break;




case "za":


filtered.sort(
(a,b)=>
b.name.localeCompare(a.name)
);


break;



}



displayItems(filtered);



}









// =========================
// FILTER BUTTONS
// =========================


function setupFilterButtons(){


const filterButtons =
document
.querySelectorAll(
".blacksmith-filter-buttons button"
);


filterButtons.forEach(button=>{


if(button.dataset.filter === currentCraftFilter){

button.classList.add("active");

}


button.onclick=function(){


currentCraftFilter =

this.dataset.filter;

filterButtons.forEach(b =>
b.classList.remove("active")
);

this.classList.add("active");

applyFilters();



};



});


}









// =========================
// DETAILS BUTTON
// =========================


function setupDetailsButtons(){


document
.querySelectorAll(".details-button")
.forEach(button=>{


button.onclick=function(){



let item =


allItems.find(
x =>
x.name === this.dataset.name
);



showDetails(item);



};



});


}








// =========================
// DETAILS POPUP
// =========================


function showDetails(item){


const box =

document.getElementById(
"blacksmith-details-box"
);



const content =

document.getElementById(
"blacksmith-details-content"
);



let cosmeticDetails = "";

if(item.category === "Events / Overlays"){


cosmeticDetails += `


<p>

Type:

${item.subCategory}

</p>


${item.event ? `<p>Event: ${item.event}</p>` : ""}


`;



if(item.limited === true){


cosmeticDetails += `


<p class="limited-badge">

🔥 LIMITED

</p>


`;


}


}

let materialsHTML = "";

let completed = 0;



item.materials.forEach(mat => {



let owned =

inventory[mat.name] || 0;



if(owned >= mat.amount){

completed++;

}



let status =

owned >= mat.amount

? "✅"

: "❌";





materialsHTML += `


<div class="recipe-material">


<h3>

${status}

${mat.name}

</h3>


<p>

Owned:

${owned}

/

Required:

${mat.amount}

</p>



</div>


`;



});







let progress = 0;



if(item.materials.length > 0){


progress =

Math.floor(

(completed / item.materials.length)

* 100

);


}





content.innerHTML = `



<h2>

${item.name}

</h2>





<p>

Category:

${item.category}

</p>

${cosmeticDetails}


<p>

Type:

${item.subCategory}

</p>





<p>

SK Required:

${item.sk}

</p>





<p>

Craft EXP:

${item.exp}

</p>





<h3>

Materials Required

</h3>



${materialsHTML}






<h3>

Craft Progress

</h3>



<div class="progress-bar">

<div

class="progress-fill"

style="width:${progress}%"

>

</div>

</div>

<p class="progress-label">${progress}% of materials ready</p>



`;





box.style.display =

"block";



}








// =========================
// CLOSE POPUP
// =========================


document.addEventListener(
"click",
function(event){



if(
event.target.id === "close-details"
){


document
.getElementById(
"blacksmith-details-box"
)

.style.display="none";


}



});



// =========================
// CREATE MATERIAL LIST
// =========================


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

showCategory(currentCategory);


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

showCategory(currentCategory);

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

showCategory(currentCategory);

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


showCategory(currentCategory);


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


// =========================
// CHECK CAN CRAFT
// =========================


function canCraft(item){


if(!item.materials){

return false;

}



let result = item.materials.every(mat=>{


let owned = inventory[mat.name] || 0;



return owned >= mat.amount;


});



return result;


}

// =========================
// CRAFT STATUS
// =========================


function getCraftStatus(item){


let missing = 0;



item.materials.forEach(mat=>{


let owned =

inventory[mat.name] || 0;



if(owned < mat.amount){


missing++;


}


});





if(missing === 0){


return {

text:"🟢 Can Craft",

class:"craft-ready"

};


}





if(missing <= 2){


return {

text:"🟡 Almost Ready",

class:"craft-almost"

};


}





return {

text:"🔴 Missing Materials",

class:"craft-missing"

};



}

// ===============================
// OPEN ITEM FROM HOMEPAGE SEARCH
// ===============================


window.addEventListener(
"load",
function(){


setTimeout(()=>{


if(!location.hash)
return;



let itemName =

decodeURIComponent(
location.hash.substring(1)
);






let cards = document.querySelectorAll(".card");






cards.forEach(card=>{


if(card.innerText.includes(itemName)){





card.scrollIntoView({

behavior:"smooth",

block:"center"

});



card.style.border =
"3px solid #4da6ff";



}


});


},500);


});
