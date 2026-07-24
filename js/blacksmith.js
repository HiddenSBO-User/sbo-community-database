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


loadInventory();


showCategory(currentCategory);


showSubCategories();


setupCategoryButtons();

setupSearch();

setupSorting();

setupFilterButtons();

setupDetailsButtons();

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


if(items.length === 0){

container.innerHTML = `

<h2 class="no-results">

No items found

</h2>

`;

return;

}


// Build all card markup into an array first, then write to the
// DOM ONCE at the end. Using container.innerHTML += inside the
// loop forces the browser to re-serialize and re-parse the
// entire accumulated HTML on every single iteration (O(n^2) as
// the item count grows) -- this is what caused the lag while
// searching/filtering.

const cardsHTML = items.map(item=>{

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

return `



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

}).join("");


container.innerHTML = cardsHTML;


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


// Debounce: wait for a short pause in typing before filtering.
// Previously this fired a full filter + re-render on every single
// keystroke, which -- combined with the innerHTML += rebuild in
// displayItems -- caused the search box to lag badly as the item
// list grew.

let searchDebounce;

search.addEventListener(
"input",
function(){

clearTimeout(searchDebounce);

searchDebounce = setTimeout(applyFilters, 150);

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




// =========================
// LOAD INVENTORY
// (materials.js owns the full inventory UI + saving;
// this page only needs read access for craft-status checks)
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


}

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
