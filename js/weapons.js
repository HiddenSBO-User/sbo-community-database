// =========================
// WEAPON DATABASE
// =========================


let allWeapons = [];

let currentWeapons = [];

let selectedCategory = "All";




// =========================
// SCALING STAT FORMATTING
// =========================


function formatAttack(weapon){

if(weapon.scaling && weapon.attackMin !== undefined){

return `${weapon.attackMin} - ${weapon.attack}`;

}

return weapon.attack;

}


function formatLevel(weapon){

if(weapon.scaling && weapon.levelMin !== undefined){

return `${weapon.levelMin} - ${weapon.level}`;

}

return weapon.level;

}




// =========================
// LOAD WEAPONS
// =========================


document.addEventListener(
"DOMContentLoaded",
function(){


fetch("data/weapons.json")


.then(response => response.json())


.then(data => {


allWeapons = data;

currentWeapons = data;


displayWeapons();



})


.catch(error => {


console.error(
"Weapon loading error:",
error
);


});



setupSearch();

setupSorting();

setupCategoryButtons();

setupDetails();



});




// =========================
// DISPLAY WEAPONS
// =========================


function displayWeapons(){



const container =
document.getElementById(
"weapon-container"
);



container.innerHTML = "";



let weapons = [...currentWeapons];





// CATEGORY FILTER


if(selectedCategory !== "All"){


weapons =
weapons.filter(
weapon =>
weapon.type === selectedCategory
);


}





// EMPTY CHECK


if(weapons.length === 0){


container.innerHTML = `

<h2 class="no-results">

No weapons found

</h2>

`;


return;


}





// CREATE CARDS



weapons.forEach(weapon => {



const card =
document.createElement("div");


card.className =
"card";



card.innerHTML = `


<h2>

${weapon.name}

</h2>


<p>

⚔ Attack:
${formatAttack(weapon)}

</p>



<p>

Level:
${formatLevel(weapon)}

</p>



<p>

Type:
${weapon.type}

</p>



<button

class="details-button"

data-name="${weapon.name}"

>

View Details

</button>



`;



container.appendChild(card);



});





setupDetails();



}






// =========================
// SEARCH
// =========================


function filterWeaponsBySearch(){


const searchBox =
document.getElementById("weapon-search");


const value =
searchBox ? searchBox.value.toLowerCase().trim() : "";


return allWeapons.filter(weapon => {

const name = (weapon.name || "").toLowerCase();

const type = (weapon.type || "").toLowerCase();

const obtain = (weapon.obtain || "").toLowerCase();

return (

name.includes(value)

||

type.includes(value)

||

obtain.includes(value)

);

});


}




function applySort(list){


const sort =
document.getElementById("weapon-sort");


const value =
sort ? sort.value : "default";


switch(value){


case "level-high":

list.sort((a,b)=> b.level-a.level);

break;


case "level-low":

list.sort((a,b)=> a.level-b.level);

break;


case "attack-high":

list.sort((a,b)=> b.attack-a.attack);

break;


case "attack-low":

list.sort((a,b)=> a.attack-b.attack);

break;


}


}




function refreshWeaponList(){


currentWeapons = filterWeaponsBySearch();


applySort(currentWeapons);


displayWeapons();


}




// =========================
// SEARCH
// =========================


function setupSearch(){


const search =
document.getElementById(
"weapon-search"
);


if(!search)
return;


search.addEventListener(
"input",
function(){


refreshWeaponList();


});


}




// =========================
// SORTING
// =========================


function setupSorting(){


const sort =
document.getElementById(
"weapon-sort"
);


if(!sort)
return;


sort.addEventListener(
"change",
function(){


refreshWeaponList();


});


}







// =========================
// CATEGORY BUTTONS
// =========================


function setupCategoryButtons(){



const buttons =
document.querySelectorAll(
".weapon-category-button"
);



const showAll =
document.getElementById(
"show-all-weapons"
);



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



button.onclick=function(){



selectedCategory =
this.dataset.type;


setActive(this);


displayWeapons();



};



});





if(showAll){



showAll.onclick=function(){


selectedCategory="All";


setActive(showAll);


displayWeapons();


};



setActive(showAll);


}



}






// =========================
// DETAILS BUTTON
// =========================


function setupDetails(){



document
.querySelectorAll(
".details-button"
)

.forEach(button => {



button.onclick=function(){



const weapon =
allWeapons.find(
item =>
item.name === this.dataset.name
);



showWeaponDetails(
weapon
);



};



});



}








// =========================
// DETAILS POPUP
// =========================


function showWeaponDetails(weapon){



const box =
document.getElementById(
"weapon-details-box"
);



const content =
document.getElementById(
"weapon-details-content"
);



if(!weapon)
return;



content.innerHTML = `


<h2>

${weapon.name}

</h2>



<p>

⚔ Attack:
${formatAttack(weapon)}

</p>



<p>

Level Requirement:
${formatLevel(weapon)}

</p>


${weapon.scaling ? `<p class="scaling-note">📈 Stats scale with player level</p>` : ""}



<p>

Weapon Type:
${weapon.type}

</p>



<p>

How To Obtain:

<br>

${weapon.obtain}

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
event.target.id ===
"close-details"

){


document.getElementById(
"weapon-details-box"
).style.display =
"none";


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
