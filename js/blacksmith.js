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
