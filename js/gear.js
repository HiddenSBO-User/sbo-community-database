// =========================
// GEAR DATABASE
// =========================


let allGear = [];

let currentCategory = "All";

let currentGear = [];




// =========================
// LOAD GEAR JSON
// =========================


document.addEventListener(
"DOMContentLoaded",
function(){


fetch("data/gear.json")


.then(response => response.json())


.then(gear => {


allGear = gear;


showCategory(
currentCategory
);



setupCategoryButtons();

setupSearch();

setupSorting();

setupDetailsButtons();



})


.catch(error => {


console.error(
"Gear loading error:",
error
);


});


});






// =========================
// CATEGORY BUTTONS
// =========================


function setupCategoryButtons(){


const buttons =
document
.querySelectorAll(".gear-category-button");


const showAll =
document.getElementById("show-all-gear");


function setActive(activeButton){

buttons.forEach(b =>
b.classList.remove("active")
);

if(showAll)
showAll.classList.remove("active");

if(activeButton)
activeButton.classList.add("active");

}


buttons.forEach(button => {


if(button.dataset.type === currentCategory){

setActive(button);

}


button.onclick = function(){



currentCategory =
this.dataset.type;



setActive(this);



showCategory(
currentCategory
);



};



});


if(showAll){

showAll.onclick = function(){

currentCategory = "All";

setActive(showAll);

showCategory(currentCategory);

};

if(currentCategory === "All"){
setActive(showAll);
}

}


}








// =========================
// SHOW CATEGORY
// =========================


function showCategory(category){


currentGear =
category === "All"
? allGear.slice()
: allGear.filter(
item =>
item.type === category
);



applyFilters();


}







// =========================
// DISPLAY GEAR
// =========================


function displayGear(gear){



const container =
document.getElementById(
"gear-container"
);



container.innerHTML = "";




if(gear.length === 0){


container.innerHTML = `

<h2 class="no-results">

No gear found

</h2>

`;


return;


}




gear.forEach(item => {



container.innerHTML += `


<div class="card">



<h2>

${item.name}

</h2>




<p>

🛡 Defense:
${item.defense}

</p>




<p>

⚡ Dexterity:
${item.dexterity}

</p>




<p>

Lv. ${item.level}

</p>





<button

class="details-button"

data-name="${item.name}"

>

View Details

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
"gear-search"
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
"gear-sort"
);



if(!sort)
return;



sort.addEventListener(
"change",
function(){


applyFilters();


});


}









function applyFilters(){



let filtered =
[...currentGear];



const search =
document
.getElementById(
"gear-search"
)
.value
.toLowerCase()
.trim();




if(search){



filtered =
filtered.filter(item =>



(item.name || "")
.toLowerCase()
.includes(search)



||



(item.obtain || "")
.toLowerCase()
.includes(search)



);



}






const sort =
document
.getElementById(
"gear-sort"
)
.value;






switch(sort){



case "level-high":


filtered.sort(
(a,b)=>
b.level-a.level
);


break;




case "level-low":


filtered.sort(
(a,b)=>
a.level-b.level
);


break;






case "defense-high":


filtered.sort(
(a,b)=>
b.defense-a.defense
);


break;






case "defense-low":


filtered.sort(
(a,b)=>
a.defense-b.defense
);


break;






case "dex-high":


filtered.sort(
(a,b)=>
b.dexterity-a.dexterity
);


break;






case "dex-low":


filtered.sort(
(a,b)=>
a.dexterity-b.dexterity
);


break;


}





displayGear(filtered);



}









// =========================
// DETAILS BUTTON
// =========================


function setupDetailsButtons(){



document
.querySelectorAll(".details-button")
.forEach(button => {



button.onclick=function(){



const gear =
allGear.find(
item =>
item.name === this.dataset.name
);



showGearDetails(
gear
);



};



});



}









// =========================
// DETAILS POPUP
// =========================


function showGearDetails(item){



const box =
document.getElementById(
"gear-details-box"
);



const content =
document.getElementById(
"gear-details-content"
);




content.innerHTML = `



<h2>

${item.name}

</h2>




<p>

Type:

${item.type}

</p>




<p>

Level:

${item.level}

</p>




<p>

Defense:

${item.defense}

</p>




<p>

Dexterity:

${item.dexterity}

</p>




<p>

How to Obtain:

${item.obtain}

</p>



`;



box.style.display =
"flex";



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
"gear-details-box"
)
.style.display="none";



}



});

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
