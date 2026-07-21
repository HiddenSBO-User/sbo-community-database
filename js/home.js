// ===============================
// HOMEPAGE DATABASE LOADER
// ===============================


let homeWeapons = [];
let homeGear = [];
let homeBlacksmith = [];




// LOAD DATABASES

Promise.all([

    fetch("data/weapons.json").then(res => res.json()),

    fetch("data/gear.json").then(res => res.json()),

    fetch("data/blacksmith.json").then(res => res.json())

])


.then(data => {


    homeWeapons = data[0];

    homeGear = data[1];

    homeBlacksmith = data[2];


    updateStats();


});





// ===============================
// UPDATE STAT BADGES
// ===============================


function updateStats(){


    document.getElementById("weapon-count").innerText =
    homeWeapons.length;



    document.getElementById("gear-count").innerText =
    homeGear.length;



    let craftableItems = homeBlacksmith.filter(item =>

        item.materials &&
        item.materials.length > 0

    );



    document.getElementById("craft-count").innerText =
    craftableItems.length;




    let materials = homeBlacksmith.filter(item =>

        item.category === "Materials"

    );



    document.getElementById("material-count").innerText =
    materials.length;


}

// ===============================
// GLOBAL SEARCH
// ===============================


const searchBox = document.getElementById(
    "global-search"
);


const searchResults = document.getElementById(
    "search-results"
);




if(searchBox){


searchBox.addEventListener(
"input",
function(){


let search = this.value
.toLowerCase()
.trim();



searchResults.innerHTML = "";



if(!search){

return;

}




let results = [];




// WEAPONS SEARCH

homeWeapons.forEach(item => {


if(
(item.name || "")
.toLowerCase()
.includes(search)
){


results.push({

name:item.name,

type:"Weapon",

page:"weapons.html",

source:"weapon"

});


}


});





// GEAR SEARCH

homeGear.forEach(item => {


if(
(item.name || "")
.toLowerCase()
.includes(search)
){


results.push({

name:item.name,

type:"Gear",

page:"gear.html",

source:"gear"

});


}


});





// BLACKSMITH SEARCH

homeBlacksmith.forEach(item => {


if(
(item.name || "")
.toLowerCase()
.includes(search)
){


results.push({

name:item.name,

type:"Blacksmith",

page:"blacksmith.html",

source:"blacksmith"

});


}


});





sortSearchResults(results, search);

displaySearchResults(results);



});


}






function displaySearchResults(results){



if(results.length === 0){


searchResults.innerHTML = `

<div class="search-result">

No results found

</div>

`;


return;

}




searchResults.innerHTML = "";



results.slice(0,10)
.forEach(item => {



searchResults.innerHTML += `


<div 

class="search-result"

data-page="${item.page}"

data-item="${item.name}"

>


<h3>

${item.name}

</h3>


<p>

<span class="search-type ${item.type.toLowerCase()}">

${getSearchIcon(item.type)}

${item.type}

</span>

</p>


</div>


`;



});



setupSearchResultClicks();



}






function setupSearchResultClicks(){



document
.querySelectorAll(".search-result")
.forEach(result => {



result.onclick = function(){



window.location.href =
this.dataset.page +
"#" +
encodeURIComponent(this.dataset.item);


};



});



}

// ===============================
// SEARCH RESULT ICONS
// ===============================


function getSearchIcon(type){


type = type.toLowerCase();



if(type.includes("weapon")){

    return "⚔️";

}



if(type.includes("gear")){

    return "🛡️";

}



if(type.includes("blacksmith")){

    return "🔨";

}



return "📦";


}

// ===============================
// SEARCH RELEVANCE SORTING
// ===============================


function sortSearchResults(results, search){


results.sort((a,b)=>{


let aName = a.name.toLowerCase();

let bName = b.name.toLowerCase();



let aScore = 0;

let bScore = 0;




// exact match

if(aName === search){

aScore += 100;

}


if(bName === search){

bScore += 100;

}




// starts with

if(aName.startsWith(search)){

aScore += 50;

}


if(bName.startsWith(search)){

bScore += 50;

}




// contains

if(aName.includes(search)){

aScore += 10;

}


if(bName.includes(search)){

bScore += 10;

}




return bScore - aScore;


});


}