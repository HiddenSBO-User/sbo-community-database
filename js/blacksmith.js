// =========================================
// BLACKSMITH DATABASE
// =========================================

let allItems = [];
let currentCategory = "Weapons";
let currentSubCategory = "All";
let currentItems = [];
let currentCraftFilter = "all";
let inventory = {};

document.addEventListener("DOMContentLoaded", function () {
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
    })
    .catch(error => {
      console.error("Blacksmith loading error:", error);
    });
});

// =========================================
// CATEGORY BUTTONS
// =========================================

function setupCategoryButtons() {
  const catButtons = document.querySelectorAll("#blacksmith-category-row .chip");

  catButtons.forEach(button => {
    if (button.dataset.category === currentCategory) {
      button.classList.add("active");
    }

    button.onclick = function () {
      currentCategory = this.dataset.category;
      currentSubCategory = "All";
      catButtons.forEach(b => b.classList.remove("active"));
      this.classList.add("active");
      showCategory(currentCategory);
      showSubCategories();
    };
  });
}

function showCategory(category) {
  currentItems = allItems.filter(item => item.category === category);
  applyFilters();
}

// =========================================
// SUB CATEGORY BUTTONS
// =========================================

function showSubCategories() {
  const box = document.getElementById("blacksmith-subcategories");
  box.innerHTML = "";

  let subs = [];

  if (currentCategory === "Weapons") {
    subs = ["All", "One-Handed", "Two-Handed", "Rapier", "Dagger", "Weapon Handle", "Melee"];
  } else if (currentCategory === "Defense") {
    subs = ["All", "Shield", "Armor", "Lower Headgear", "Upper Headgear"];
  } else if (currentCategory === "Events / Overlays") {
    subs = ["All", "Headwear", "3D Cosmetic Bundle"];
  } else if (currentCategory === "Legendary") {
    subs = ["All", "One-Handed", "Two-Handed", "Rapier", "Dagger"];
  } else {
    subs = ["All"];
  }

  box.innerHTML = subs
    .map(sub => `<button class="chip subcategory-chip" data-sub="${sub}">${sub}</button>`)
    .join("");

  document.querySelectorAll(".subcategory-chip").forEach(button => {
    if (button.dataset.sub === currentSubCategory) {
      button.classList.add("active");
    }

    button.onclick = function () {
      currentSubCategory = this.dataset.sub;
      document.querySelectorAll(".subcategory-chip").forEach(b => b.classList.remove("active"));
      this.classList.add("active");
      applyFilters();
    };
  });
}

// =========================================
// DISPLAY ITEMS
// =========================================

function displayItems(items) {
  const container = document.getElementById("blacksmith-container");

  if (items.length === 0) {
    container.innerHTML = `<h2 class="no-results">No items found</h2>`;
    return;
  }

  // Build all card markup into an array first, then write to the DOM
  // once at the end. Using container.innerHTML += inside the loop
  // forces the browser to re-serialize and re-parse the entire
  // accumulated HTML on every iteration; batching avoids that O(n^2)
  // cost while typing in the search box or switching filters.
  const cardsHTML = items
    .map(item => {
      const status = getCraftStatus(item);
      let cosmeticInfo = "";

      if (item.category === "Events / Overlays") {
        cosmeticInfo += `<div class="stat-row"><span class="stat-row-label">Type</span><span class="stat-row-value">${item.subCategory}</span></div>`;
        if (item.event) {
          cosmeticInfo += `<div class="stat-row"><span class="stat-row-label">Event</span><span class="stat-row-value">${item.event}</span></div>`;
        }
        if (item.limited === true) {
          cosmeticInfo += `<span class="badge badge-limited">🔥 Limited</span>`;
        }
      }

      return `
        <div class="item-card">
          <span class="item-card-meta">${item.category}</span>
          <h2 class="item-card-title">${item.name}</h2>

          ${cosmeticInfo}

          <div class="stat-row">
            <span class="stat-row-label">SK Required</span>
            <span class="stat-row-value">${item.sk}</span>
          </div>
          <div class="stat-row">
            <span class="stat-row-label">Craft EXP</span>
            <span class="stat-row-value">${item.exp}</span>
          </div>

          <span class="badge ${status.badgeClass}">${status.text}</span>

          <button class="details-btn" data-name="${item.name}">View Recipe</button>
        </div>
      `;
    })
    .join("");

  container.innerHTML = cardsHTML;
  setupDetailsButtons();
}

// =========================================
// SEARCH
// =========================================

function setupSearch() {
  const search = document.getElementById("blacksmith-search");
  if (!search) return;

  let searchDebounce;
  search.addEventListener("input", function () {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(applyFilters, 150);
  });
}

// =========================================
// SORTING
// =========================================

function setupSorting() {
  const sort = document.getElementById("blacksmith-sort");
  if (!sort) return;

  sort.addEventListener("change", function () {
    applyFilters();
  });
}

// =========================================
// FILTER SYSTEM
// =========================================

function applyFilters() {
  let filtered = [...currentItems];

  if (currentSubCategory !== "All") {
    filtered = filtered.filter(item => item.subCategory === currentSubCategory);
  }

  const search = document.getElementById("blacksmith-search").value.toLowerCase().trim();

  if (search) {
    filtered = filtered.filter(item =>
      (item.name || "").toLowerCase().includes(search) ||
      (item.category || "").toLowerCase().includes(search)
    );
  }

  if (currentCraftFilter === "craftable") {
    filtered = filtered.filter(item => canCraft(item));
  }

  if (currentCraftFilter === "missing") {
    filtered = filtered.filter(item => !canCraft(item));
  }

  if (currentCraftFilter === "almost") {
    filtered = filtered.filter(item => {
      const total = item.materials.length;
      let missing = 0;
      item.materials.forEach(mat => {
        const owned = inventory[mat.name] || 0;
        if (owned < mat.amount) missing++;
      });
      const haveAny = total - missing > 0;
      return haveAny && missing > 0 && missing <= 2;
    });
  }

  const sort = document.getElementById("blacksmith-sort").value;

  switch (sort) {
    case "sk-high":
      filtered.sort((a, b) => b.sk - a.sk);
      break;
    case "sk-low":
      filtered.sort((a, b) => a.sk - b.sk);
      break;
    case "exp-high":
      filtered.sort((a, b) => b.exp - a.exp);
      break;
    case "exp-low":
      filtered.sort((a, b) => a.exp - b.exp);
      break;
    case "az":
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "za":
      filtered.sort((a, b) => b.name.localeCompare(a.name));
      break;
  }

  displayItems(filtered);
}

// =========================================
// CRAFT FILTER BUTTONS
// =========================================

function setupFilterButtons() {
  const filterButtons = document.querySelectorAll("#blacksmith-filter-row .chip");

  filterButtons.forEach(button => {
    if (button.dataset.filter === currentCraftFilter) {
      button.classList.add("active");
    }

    button.onclick = function () {
      currentCraftFilter = this.dataset.filter;
      filterButtons.forEach(b => b.classList.remove("active"));
      this.classList.add("active");
      applyFilters();
    };
  });
}

// =========================================
// DETAILS BUTTON + MODAL
// =========================================

function setupDetailsButtons() {
  document.querySelectorAll(".details-btn").forEach(button => {
    button.onclick = function () {
      const item = allItems.find(x => x.name === this.dataset.name);
      showDetails(item);
    };
  });
}

function showDetails(item) {
  const box = document.getElementById("blacksmith-details-box");
  const content = document.getElementById("blacksmith-details-content");

  let cosmeticDetails = "";
  if (item.category === "Events / Overlays") {
    cosmeticDetails += `<p>Type: <span class="modal-value">${item.subCategory}</span></p>`;
    if (item.event) cosmeticDetails += `<p>Event: <span class="modal-value">${item.event}</span></p>`;
    if (item.limited === true) cosmeticDetails += `<span class="badge badge-limited">🔥 Limited</span>`;
  }

  let materialsHTML = "";
  let completed = 0;

  item.materials.forEach(mat => {
    const owned = inventory[mat.name] || 0;
    if (owned >= mat.amount) completed++;
    const status = owned >= mat.amount ? "✅" : "❌";

    materialsHTML += `
      <div class="recipe-material">
        <span class="recipe-material-name">${status} ${mat.name}</span>
        <span class="recipe-material-qty">${owned} / ${mat.amount}</span>
      </div>
    `;
  });

  let progress = 0;
  if (item.materials.length > 0) {
    progress = Math.floor((completed / item.materials.length) * 100);
  }

  content.innerHTML = `
    <h2>${item.name}</h2>
    <p>Category: <span class="modal-value">${item.category}</span></p>
    ${cosmeticDetails}
    <p>Type: <span class="modal-value">${item.subCategory}</span></p>
    <p>SK Required: <span class="modal-value">${item.sk}</span></p>
    <p>Craft EXP: <span class="modal-value">${item.exp}</span></p>

    <h3>Materials Required</h3>
    ${materialsHTML}

    <h3>Craft Progress</h3>
    <div class="progress-bar"><div class="progress-fill" style="width:${progress}%"></div></div>
    <p class="progress-label">${progress}% of materials ready</p>
  `;

  box.classList.add("visible");
}

document.addEventListener("click", function (event) {
  if (event.target.id === "close-details") {
    document.getElementById("blacksmith-details-box").classList.remove("visible");
  }
});

// =========================================
// INVENTORY (read-only here; materials.js owns writes)
// =========================================

function loadInventory() {
  const saved = localStorage.getItem("blacksmithInventory");
  if (saved) {
    inventory = JSON.parse(saved);
  }
}

function canCraft(item) {
  if (!item.materials) return false;
  return item.materials.every(mat => (inventory[mat.name] || 0) >= mat.amount);
}

function getCraftStatus(item) {
  const total = item.materials.length;
  let missing = 0;
  item.materials.forEach(mat => {
    const owned = inventory[mat.name] || 0;
    if (owned < mat.amount) missing++;
  });

  const haveAny = total - missing > 0;

  if (missing === 0) return { text: "🟢 Can Craft", badgeClass: "badge-ready" };
  // "Almost Ready" only makes sense if the player has made SOME progress
  // on the recipe. With small recipes (e.g. 2 materials), owning 0 of
  // everything used to still count as "missing <= 2" and get mislabeled
  // as almost ready, even at 0% progress.
  if (haveAny && missing <= 2) return { text: "🟡 Almost Ready", badgeClass: "badge-almost" };
  return { text: "🔴 Missing Materials", badgeClass: "badge-missing" };
}

// =========================================
// OPEN ITEM FROM HOMEPAGE SEARCH
// =========================================

window.addEventListener("load", function () {
  setTimeout(() => {
    if (!location.hash) return;

    const itemName = decodeURIComponent(location.hash.substring(1));
    const cards = document.querySelectorAll(".item-card");

    cards.forEach(card => {
      if (card.innerText.includes(itemName)) {
        card.scrollIntoView({ behavior: "smooth", block: "center" });
        card.classList.add("pulse-highlight");
      }
    });
  }, 500);
});


/* =========================================================
   CRAFTING QUEUE
========================================================= */

let craftingQueue=JSON.parse(localStorage.getItem("blacksmithCraftingQueue")||"[]");

function saveCraftingQueue(){
    localStorage.setItem("blacksmithCraftingQueue",JSON.stringify(craftingQueue));
}

function getInventory(){
    return JSON.parse(localStorage.getItem("blacksmithInventory")||"{}");
}

function saveInventory(inventory){
    localStorage.setItem("blacksmithInventory",JSON.stringify(inventory));
}

function getItemByName(name){
    return allItems.find(item=>
        String(item.name).toLowerCase()===String(name).toLowerCase()
    );
}

function getRecipeMaterials(item){
    if(!item)return [];
    return item.materials||item.recipe||[];
}

function getMaterialName(material){
    if(typeof material==="string")return material;
    return material.name||material.item||material.material||"";
}

function getMaterialAmount(material){
    if(typeof material==="string")return 1;
    return Number(material.amount||material.quantity||material.qty||1);
}

function getInventoryAmount(inventory,name){
    const key=Object.keys(inventory).find(key=>
        key.toLowerCase()===name.toLowerCase()
    );
    return key?Number(inventory[key]||0):0;
}

function addToCraftingQueue(itemName){
    const item=getItemByName(itemName);
    if(!item)return;

    const existing=craftingQueue.find(entry=>
        entry.name.toLowerCase()===item.name.toLowerCase()
    );

    if(existing){
        existing.quantity++;
    }else{
        craftingQueue.push({
            name:item.name,
            quantity:1
        });
    }

    saveCraftingQueue();
    renderCraftingQueue();
}

function removeFromCraftingQueue(index){
    craftingQueue.splice(index,1);
    saveCraftingQueue();
    renderCraftingQueue();
}

function changeQueueQuantity(index,amount){
    if(!craftingQueue[index])return;

    craftingQueue[index].quantity+=amount;

    if(craftingQueue[index].quantity<=0){
        craftingQueue.splice(index,1);
    }

    saveCraftingQueue();
    renderCraftingQueue();
}

function clearCraftingQueue(){
    if(!craftingQueue.length)return;

    if(!confirm("Are you sure you want to clear the crafting queue?"))return;

    craftingQueue=[];
    saveCraftingQueue();
    renderCraftingQueue();
}

function getQueueMaterialTotals(){
    const totals={};

    craftingQueue.forEach(entry=>{
        const item=getItemByName(entry.name);
        if(!item)return;

        getRecipeMaterials(item).forEach(material=>{
            const name=getMaterialName(material);
            const amount=getMaterialAmount(material)*entry.quantity;

            if(!name)return;

            totals[name]=(totals[name]||0)+amount;
        });
    });

    return totals;
}

function canCraftItem(item){
    const inventory=getInventory();

    for(const material of getRecipeMaterials(item)){
        const name=getMaterialName(material);
        const required=getMaterialAmount(material);
        const owned=getInventoryAmount(inventory,name);

        if(owned<required)return false;
    }

    return true;
}

function craftQueuedItem(index){
    const entry=craftingQueue[index];
    if(!entry)return;

    const item=getItemByName(entry.name);

    if(!item){
        alert("This item could not be found.");
        return;
    }

    const inventory=getInventory();

    for(const material of getRecipeMaterials(item)){
        const name=getMaterialName(material);
        const required=getMaterialAmount(material);
        const owned=getInventoryAmount(inventory,name);

        if(owned<required){
            alert(`You do not have enough ${name}.`);
            renderCraftingQueue();
            return;
        }
    }

    getRecipeMaterials(item).forEach(material=>{
        const name=getMaterialName(material);
        const required=getMaterialAmount(material);

        const key=Object.keys(inventory).find(key=>
            key.toLowerCase()===name.toLowerCase()
        );

        if(key){
            inventory[key]=Number(inventory[key])-required;

            if(inventory[key]<=0){
                delete inventory[key];
            }
        }
    });

    const existingKey=Object.keys(inventory).find(key=>
        key.toLowerCase()===item.name.toLowerCase()
    );

    if(existingKey){
        inventory[existingKey]=Number(inventory[existingKey])+1;
    }else{
        inventory[item.name]=1;
    }

    saveInventory(inventory);

    entry.quantity--;

    if(entry.quantity<=0){
        craftingQueue.splice(index,1);
    }

    saveCraftingQueue();
    renderCraftingQueue();

    alert(`${item.name} crafted successfully!`);
}

function renderCraftingQueue(){
    const container=document.getElementById("crafting-queue-container");
    if(!container)return;

    if(!craftingQueue.length){
        container.innerHTML=`
            <div class="crafting-queue-empty">
                <span>🔨</span>
                <p>Your crafting queue is empty.</p>
                <small>Open an item's recipe and add it to your queue.</small>
            </div>
        `;
        return;
    }

    const inventory=getInventory();

    container.innerHTML=craftingQueue.map((entry,index)=>{
        const item=getItemByName(entry.name);

        if(!item){
            return`
                <div class="crafting-queue-item">
                    <h3 class="crafting-queue-item-name">${entry.name}</h3>
                    <p>Item not found in Blacksmith data.</p>
                    <button class="queue-remove-button" onclick="removeFromCraftingQueue(${index})">Remove</button>
                </div>
            `;
        }

        const ready=canCraftItem(item);

        const materialHTML=getRecipeMaterials(item).map(material=>{
            const name=getMaterialName(material);
            const required=getMaterialAmount(material);
            const owned=getInventoryAmount(inventory,name);
            const enough=owned>=required;

            return`
                <div class="queue-material ${enough?"ready":"missing"}">
                    <span class="queue-material-name">${name}</span>
                    <span class="queue-material-amount">
                        Have: <strong>${owned}</strong> / ${required}
                    </span>
                </div>
            `;
        }).join("");

        return`
            <div class="crafting-queue-item">
                <div class="crafting-queue-item-header">
                    <div>
                        <h3 class="crafting-queue-item-name">${item.name}</h3>
                        <div class="crafting-queue-item-category">${item.category||""}</div>
                    </div>
                    <span class="queue-status ${ready?"ready":"missing"}">
                        ${ready?"🟢 Ready to Craft":"🔴 Missing Materials"}
                    </span>
                </div>

                <div class="crafting-queue-materials">
                    <h3>Materials for 1 Craft</h3>
                    <div class="queue-material-list">
                        ${materialHTML}
                    </div>
                </div>

                <div class="crafting-queue-controls">
                    <button class="queue-quantity-button" onclick="changeQueueQuantity(${index},-1)">−</button>

                    <span class="queue-quantity">${entry.quantity}</span>

                    <button class="queue-quantity-button" onclick="changeQueueQuantity(${index},1)">+</button>

                    <button
                        class="queue-craft-button"
                        onclick="craftQueuedItem(${index})"
                        ${ready?"":"disabled"}
                    >
                        Complete Craft
                    </button>

                    <button
                        class="queue-remove-button"
                        onclick="removeFromCraftingQueue(${index})"
                    >
                        Remove
                    </button>
                </div>
            </div>
        `;
    }).join("");
}

document.addEventListener("DOMContentLoaded",()=>{
    renderCraftingQueue();

    const clearButton=document.getElementById("clear-crafting-queue");

    if(clearButton){
        clearButton.addEventListener("click",clearCraftingQueue);
    }
});
