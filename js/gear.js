// =========================================
// GEAR DATABASE
// =========================================

let allGear = [];
let currentGear = [];
let currentCategory = "All";

// Reference ceilings used to size the stat meter bars on each card.
const MAX_DEFENSE_SCALE = 100;
const MAX_DEX_SCALE = 200;

function formatDefense(item) {
  if (item.scaling && item.defenseMin !== undefined) {
    return `${item.defenseMin} - ${item.defense}`;
  }
  return item.defense;
}

function formatDexterity(item) {
  if (item.scaling && item.dexterityMin !== undefined) {
    return `${item.dexterityMin} - ${item.dexterity}`;
  }
  return item.dexterity;
}

function formatGearLevel(item) {
  if (item.scaling && item.levelMin !== undefined) {
    return `${item.levelMin} - ${item.level}`;
  }
  return item.level;
}

document.addEventListener("DOMContentLoaded", function () {
  fetch("data/gear.json")
    .then(response => response.json())
    .then(gear => {
      allGear = gear;
      showCategory(currentCategory);
      setupCategoryButtons();
      setupSearch();
      setupSorting();
    })
    .catch(error => {
      console.error("Gear loading error:", error);
    });
});

function setupCategoryButtons() {
  const buttons = document.querySelectorAll("#gear-category-row .chip[data-type]");
  const showAll = document.getElementById("show-all-gear");

  function setActive(activeButton) {
    buttons.forEach(b => b.classList.remove("active"));
    if (showAll) showAll.classList.remove("active");
    if (activeButton) activeButton.classList.add("active");
  }

  buttons.forEach(button => {
    if (button.dataset.type === currentCategory) setActive(button);

    button.onclick = function () {
      currentCategory = this.dataset.type;
      setActive(this);
      showCategory(currentCategory);
    };
  });

  if (showAll) {
    showAll.onclick = function () {
      currentCategory = "All";
      setActive(showAll);
      showCategory(currentCategory);
    };
    if (currentCategory === "All") setActive(showAll);
  }
}

function showCategory(category) {
  currentGear = category === "All" ? allGear.slice() : allGear.filter(item => item.type === category);
  applyFilters();
}

function displayGear(gear) {
  const container = document.getElementById("gear-container");

  if (gear.length === 0) {
    container.innerHTML = `<h2 class="no-results">No gear found</h2>`;
    return;
  }

  container.innerHTML = gear
    .map(item => {
      const defensePct = Math.min(100, Math.round(((item.defense || 0) / MAX_DEFENSE_SCALE) * 100));
      const dexPct = Math.min(100, Math.round(((item.dexterity || 0) / MAX_DEX_SCALE) * 100));

      return `
        <div class="item-card">
          <span class="item-card-meta">${item.type}</span>
          <h2 class="item-card-title">${item.name}</h2>

          <div class="stat-row">
            <span class="stat-row-label">🛡 Defense</span>
            <span class="stat-row-value">${formatDefense(item)}</span>
          </div>
          <div class="stat-meter"><div class="stat-meter-fill fill-defense" style="width:${defensePct}%"></div></div>

          <div class="stat-row">
            <span class="stat-row-label">⚡ Dexterity</span>
            <span class="stat-row-value">${formatDexterity(item)}</span>
          </div>
          <div class="stat-meter"><div class="stat-meter-fill fill-dex" style="width:${dexPct}%"></div></div>

          <div class="stat-row">
            <span class="stat-row-label">Level</span>
            <span class="stat-row-value">${formatGearLevel(item)}</span>
          </div>

          ${item.scaling ? `<p class="scaling-note">📈 Stats scale with player level</p>` : ""}

          <button class="details-btn" data-name="${item.name}">View Details</button>
        </div>
      `;
    })
    .join("");

  setupDetailsButtons();
}

function setupSearch() {
  const search = document.getElementById("gear-search");
  if (!search) return;

  let debounce;
  search.addEventListener("input", function () {
    clearTimeout(debounce);
    debounce = setTimeout(applyFilters, 150);
  });
}

function setupSorting() {
  const sort = document.getElementById("gear-sort");
  if (!sort) return;

  sort.addEventListener("change", function () {
    applyFilters();
  });
}

function applyFilters() {
  let filtered = [...currentGear];

  const search = document.getElementById("gear-search").value.toLowerCase().trim();

  if (search) {
    filtered = filtered.filter(item =>
      (item.name || "").toLowerCase().includes(search) ||
      (item.obtain || "").toLowerCase().includes(search)
    );
  }

  const sort = document.getElementById("gear-sort").value;

  switch (sort) {
    case "level-high":
      filtered.sort((a, b) => b.level - a.level);
      break;
    case "level-low":
      filtered.sort((a, b) => a.level - b.level);
      break;
    case "defense-high":
      filtered.sort((a, b) => b.defense - a.defense);
      break;
    case "defense-low":
      filtered.sort((a, b) => a.defense - b.defense);
      break;
    case "dex-high":
      filtered.sort((a, b) => b.dexterity - a.dexterity);
      break;
    case "dex-low":
      filtered.sort((a, b) => a.dexterity - b.dexterity);
      break;
  }

  displayGear(filtered);
}

function setupDetailsButtons() {
  document.querySelectorAll(".details-btn").forEach(button => {
    button.onclick = function () {
      const gear = allGear.find(item => item.name === this.dataset.name);
      showGearDetails(gear);
    };
  });
}

function showGearDetails(item) {
  const box = document.getElementById("gear-details-box");
  const content = document.getElementById("gear-details-content");

  content.innerHTML = `
    <h2>${item.name}</h2>
    <p>Type: <span class="modal-value">${item.type}</span></p>
    <p>Level: <span class="modal-value">${formatGearLevel(item)}</span></p>
    <p>Defense: <span class="modal-value">${formatDefense(item)}</span></p>
    <p>Dexterity: <span class="modal-value">${formatDexterity(item)}</span></p>
    ${item.scaling ? `<p class="scaling-note">📈 Stats scale with player level</p>` : ""}
    <p>How to Obtain: ${item.obtain}</p>
  `;

  box.classList.add("visible");
}

document.addEventListener("click", function (event) {
  if (event.target.id === "close-details") {
    document.getElementById("gear-details-box").classList.remove("visible");
  }
});

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