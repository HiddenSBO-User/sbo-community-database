// =========================================
// HOMEPAGE DATABASE LOADER
// =========================================

let homeWeapons = [];
let homeGear = [];
let homeBlacksmith = [];

Promise.all([
  fetch("data/weapons.json").then(res => res.json()),
  fetch("data/gear.json").then(res => res.json()),
  fetch("data/blacksmith.json").then(res => res.json())
]).then(data => {
  homeWeapons = data[0];
  homeGear = data[1];
  homeBlacksmith = data[2];
  updateStats();
});

// =========================================
// UPDATE STAT CARDS
// =========================================

function updateStats() {
  document.getElementById("weapon-count").innerText = homeWeapons.length;
  document.getElementById("gear-count").innerText = homeGear.length;

  const craftableItems = homeBlacksmith.filter(
    item => item.materials && item.materials.length > 0
  );
  document.getElementById("craft-count").innerText = craftableItems.length;

  const uniqueMaterials = new Set();
  homeBlacksmith.forEach(item => {
    if (!item.materials) return;
    item.materials.forEach(mat => uniqueMaterials.add(mat.name));
  });
  document.getElementById("material-count").innerText = uniqueMaterials.size;
}

// =========================================
// GLOBAL SEARCH
// =========================================

const searchBox = document.getElementById("global-search");
const searchResults = document.getElementById("search-results");

if (searchBox) {
  searchBox.addEventListener("input", function () {
    const search = this.value.toLowerCase().trim();
    searchResults.innerHTML = "";

    if (!search) return;

    let results = [];

    homeWeapons.forEach(item => {
      if ((item.name || "").toLowerCase().includes(search)) {
        results.push({ name: item.name, type: "Weapon", page: "weapons.html" });
      }
    });

    homeGear.forEach(item => {
      if ((item.name || "").toLowerCase().includes(search)) {
        results.push({ name: item.name, type: "Gear", page: "gear.html" });
      }
    });

    homeBlacksmith.forEach(item => {
      if ((item.name || "").toLowerCase().includes(search)) {
        results.push({ name: item.name, type: "Blacksmith", page: "blacksmith.html" });
      }
    });

    sortSearchResults(results, search);
    displaySearchResults(results);
  });
}

function displaySearchResults(results) {
  if (results.length === 0) {
    searchResults.innerHTML = `<div class="search-result-row"><h3>No results found</h3></div>`;
    return;
  }

  searchResults.innerHTML = results
    .slice(0, 10)
    .map(item => `
      <div class="search-result-row" data-page="${item.page}" data-item="${item.name}">
        <h3>${item.name}</h3>
        <span class="search-type-tag ${item.type.toLowerCase()}">${getSearchIcon(item.type)} ${item.type}</span>
      </div>
    `)
    .join("");

  setupSearchResultClicks();
}

function setupSearchResultClicks() {
  document.querySelectorAll(".search-result-row").forEach(result => {
    result.onclick = function () {
      window.location.href = this.dataset.page + "#" + encodeURIComponent(this.dataset.item);
    };
  });
}

function getSearchIcon(type) {
  type = type.toLowerCase();
  if (type.includes("weapon")) return "⚔️";
  if (type.includes("gear")) return "🛡️";
  if (type.includes("blacksmith")) return "🔨";
  return "📦";
}

function sortSearchResults(results, search) {
  results.sort((a, b) => {
    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();
    let aScore = 0;
    let bScore = 0;

    if (aName === search) aScore += 100;
    if (bName === search) bScore += 100;
    if (aName.startsWith(search)) aScore += 50;
    if (bName.startsWith(search)) bScore += 50;
    if (aName.includes(search)) aScore += 10;
    if (bName.includes(search)) bScore += 10;

    return bScore - aScore;
  });
}
