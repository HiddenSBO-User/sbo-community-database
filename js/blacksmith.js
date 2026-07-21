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


document
.querySelectorAll(".blacksmith-category-button")
.forEach(button => {


button.onclick=function(){


currentCategory =
this.dataset.category;


currentSubCategory =
"All";


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

"Dagger"

];


}




else if(currentCategory==="Defense"){


subs=[

"All",

"Shield",

"Armor",

"Headgear"

];


}




else if(currentCategory==="Events / Overlays"){


subs=[

"All",

"Cosmetic",

"3D Overlay",

"Event Item"

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



button.onclick=function(){


currentSubCategory =
this.dataset.sub;


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





items.forEach(item=>{

let status = getCraftStatus(item);

let cosmeticInfo = "";

if(item.category === "Events / Overlays"){



cosmeticInfo += `



<p>

Type:

${item.subCategory}

</p>



<p>

Event:

${item.event}

</p>



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


document
.querySelectorAll(
".blacksmith-filter-buttons button"
)
.forEach(button=>{


button.onclick=function(){


currentCraftFilter =

this.dataset.filter;

console.log(currentCraftFilter);

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


<p>

Event:

${item.event}

</p>


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



<div class="progress-container">


<div

class="progress-bar"

style="width:${progress}%"

>


${progress}%


</div>


</div>



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



container.innerHTML="";





Object.keys(inventory)

.sort()

.forEach(material=>{



container.innerHTML += `



<div class="inventory-item">



<h3>

${material}

</h3>



<p>

Owned:

${inventory[material]}

</p>



<button onclick="changeMaterial('${material}',-1)">

-

</button>



<button onclick="changeMaterial('${material}',1)">

+

</button>



</div>



`;



});



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





// find matching material name

let found =

Object.keys(inventory)

.find(

material =>

material.toLowerCase() === name.toLowerCase()

);





if(found){



inventory[found]+=amount;



}

else{


alert(
"Material not found"
);


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


console.log(
"Checking:",
item.name,
item.materials
);



if(!item.materials){

console.log(
"No materials:",
item.name
);

return false;

}



let result = item.materials.every(mat=>{


let owned = inventory[mat.name] || 0;



console.log(
mat.name,
"Owned:",
owned,
"Need:",
mat.amount
);



return owned >= mat.amount;



});



console.log(
item.name,
"Can craft:",
result
);



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



console.log("Looking for:", itemName);



let cards = document.querySelectorAll(".card");



console.log("Cards found:", cards.length);



cards.forEach(card=>{


if(card.innerText.includes(itemName)){


console.log("Found:", card);



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