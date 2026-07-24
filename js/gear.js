<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8">

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Gear</title>

<link rel="stylesheet" href="css/style.css">

</head>


<body>


<nav>

<h2>🛡 Gear</h2>

<a href="index.html">Home</a>
<a href="weapons.html">Weapons</a>
<a href="gear.html">Gear</a>
<a href="blacksmith.html">Blacksmith</a>
<a href="materials.html">Materials</a>

</nav>




<h1 class="page-title">
Gear Database
</h1>





<!-- CATEGORY BUTTONS -->

<div class="gear-buttons">


<button class="gear-category-button" data-type="Armor">
Armor
</button>


<button class="gear-category-button" data-type="Shield">
Shield
</button>


<button class="gear-category-button" data-type="Upper Gear">
Upper Gear
</button>


<button class="gear-category-button" data-type="Lower Gear">
Lower Gear
</button>


<button class="gear-category-button" id="show-all-gear">
Show All
</button>


</div>






<!-- SEARCH + SORT -->


<div class="gear-controls">


<input
id="gear-search"
type="text"
placeholder="Search gear..."
>



<select id="gear-sort">


<option value="default">
Default
</option>


<option value="level-high">
Highest Level
</option>


<option value="level-low">
Lowest Level
</option>


<option value="defense-high">
Highest Defense
</option>


<option value="defense-low">
Lowest Defense
</option>


<option value="dex-high">
Highest Dexterity
</option>


<option value="dex-low">
Lowest Dexterity
</option>


</select>


</div>






<div id="gear-container"></div>





<!-- DETAILS -->

<div id="gear-details-box" class="details-box">


<div class="details-content">


<button id="close-details">

X

</button>


<div id="gear-details-content"></div>


</div>


</div>




<script src="js/gear.js"></script>


</body>

</html>
