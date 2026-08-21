// =========================================
// SBO EXP Calculator
// =========================================

(() => {
  "use strict";

  const MAX_LEVEL = 10000;
  const DEFAULT_BOSS_GROUP = "floors2to10";

  const numberFormatter = new Intl.NumberFormat("en-US");

  const elements = {
    doubleXp: document.getElementById("doubleXp"),

    boss1Group: document.getElementById("boss-1-group"),
    boss1: document.getElementById("boss-1"),
    boss1Exp: document.getElementById("boss-1-exp"),

    boss2Card: document.getElementById("boss-2-card"),
    boss2Group: document.getElementById("boss-2-group"),
    boss2: document.getElementById("boss-2"),
    boss2Exp: document.getElementById("boss-2-exp"),

    currentLevel: document.getElementById("current-level"),
    currentExp: document.getElementById("current-exp"),
    targetLevel: document.getElementById("target-level"),

    calculateButton: document.getElementById("calculate-exp"),
    error: document.getElementById("exp-error"),

    results: document.getElementById("exp-results"),

    resultExpRemaining: document.getElementById("result-exp-remaining"),
    resultNextLevel: document.getElementById("result-next-level"),

    resultExpLabel: document.getElementById("result-exp-label"),
    resultExpPerRotation: document.getElementById("result-exp-per-rotation"),

    resultCountCard: document.getElementById("result-count-card"),
    resultCountLabel: document.getElementById("result-count-label"),
    resultCount: document.getElementById("result-count"),

    resultTotalCard: document.getElementById("result-total-card"),
    resultTotalKills: document.getElementById("result-total-kills"),

    resultDetails: document.getElementById("result-details")
  };

  let bossMode = 1;


  // =========================================
  // Saved Settings
  // =========================================

  const STORAGE_KEYS = {
    bossMode: "sboExpBossMode",
    doubleXp: "sboExpDoubleXp",

    boss1Group: "sboExpBoss1Group",
    boss1Boss: "sboExpBoss1Boss",

    boss2Group: "sboExpBoss2Group",
    boss2Boss: "sboExpBoss2Boss",

    currentLevel: "sboExpCurrentLevel",
    currentExp: "sboExpCurrentExp",
    targetLevel: "sboExpTargetLevel",

    resultsOpen: "sboExpResultsOpen"
  };


  function saveSettings() {
    localStorage.setItem(
      STORAGE_KEYS.bossMode,
      String(bossMode)
    );

    localStorage.setItem(
      STORAGE_KEYS.doubleXp,
      String(elements.doubleXp.checked)
    );

    localStorage.setItem(
      STORAGE_KEYS.boss1Group,
      elements.boss1Group.value
    );

    localStorage.setItem(
      STORAGE_KEYS.boss1Boss,
      elements.boss1.value
    );

    localStorage.setItem(
      STORAGE_KEYS.boss2Group,
      elements.boss2Group.value
    );

    localStorage.setItem(
      STORAGE_KEYS.boss2Boss,
      elements.boss2.value
    );

    localStorage.setItem(
      STORAGE_KEYS.currentLevel,
      elements.currentLevel.value
    );

    localStorage.setItem(
      STORAGE_KEYS.currentExp,
      elements.currentExp.value
    );

    localStorage.setItem(
      STORAGE_KEYS.targetLevel,
      elements.targetLevel.value
    );
  }


  // =========================================
  // EXP Formula
  // =========================================

  function getLevelExp(level) {
    return (3 * level * level) + (9 * level) - 3;
  }


  function getRemainingExp(
    currentLevel,
    currentExp,
    targetLevel
  ) {
    let requiredExp = 0;

    for (
      let level = currentLevel + 1;
      level <= targetLevel;
      level += 1
    ) {
      requiredExp += getLevelExp(level);
    }

    return Math.max(
      0,
      requiredExp - currentExp
    );
  }


  // =========================================
  // Boss Data
  // =========================================

  function getBossGroup(groupName) {
    if (groupName === "event") {
      return window.SBO_EVENT_BOSSES || [];
    }

    return (window.SBO_BOSSES || {})[groupName] || [];
  }


  function isValidBossGroup(groupName) {
    if (groupName === "event") {
      return true;
    }

    return Object.prototype.hasOwnProperty.call(
      window.SBO_BOSSES || {},
      groupName
    );
  }


  function getSelectedBoss(
    groupSelect,
    bossSelect
  ) {
    const bossList =
      getBossGroup(groupSelect.value);

    const bossIndex =
      Number(bossSelect.value);

    return bossList[bossIndex] || null;
  }


  function populateBossDropdown(
    groupSelect,
    bossSelect,
    expDisplay,
    savedBossIndex = 0
  ) {
    const bossList =
      getBossGroup(groupSelect.value);

    bossSelect.innerHTML = "";

    bossList.forEach((boss, index) => {
      const option =
        document.createElement("option");

      option.value =
        String(index);

      const floorText =
        boss.floor
          ? `Floor ${boss.floor} · `
          : "";

      option.textContent =
        `${floorText}${boss.name} — ${numberFormatter.format(boss.exp)} EXP`;

      bossSelect.appendChild(option);
    });

    const validBossIndex =
      Number.isInteger(savedBossIndex) &&
      savedBossIndex >= 0 &&
      savedBossIndex < bossList.length
        ? savedBossIndex
        : 0;

    bossSelect.value =
      String(validBossIndex);

    updateBossExpDisplay(
      groupSelect,
      bossSelect,
      expDisplay
    );
  }


  function updateBossExpDisplay(
    groupSelect,
    bossSelect,
    expDisplay
  ) {
    const boss =
      getSelectedBoss(
        groupSelect,
        bossSelect
      );

    if (!boss) {
      expDisplay.textContent =
        "0 EXP";

      return;
    }

    expDisplay.textContent =
      `${numberFormatter.format(boss.exp)} EXP`;
  }


  // =========================================
  // Boss Mode
  // =========================================

  function setBossMode(
    mode,
    shouldSave = true
  ) {
    bossMode =
      mode === 2
        ? 2
        : 1;

    document
      .querySelectorAll(".exp-mode-button")
      .forEach((button) => {
        const buttonMode =
          Number(button.dataset.mode);

        button.classList.toggle(
          "active",
          buttonMode === bossMode
        );
      });

    elements.boss2Card.classList.toggle(
      "hidden",
      bossMode !== 2
    );

    elements.resultCountCard.classList.toggle(
      "hidden",
      bossMode === 2
    );

    elements.resultTotalCard.classList.toggle(
      "hidden",
      bossMode !== 2
    );

    elements.resultExpLabel.textContent =
      bossMode === 2
        ? "EXP Per Rotation"
        : "EXP Per Kill";

    elements.resultCountLabel.textContent =
      "Bosses Required";

    if (shouldSave) {
      saveSettings();
    }
  }


  // =========================================
  // Validation
  // =========================================

  function showError(message) {
    elements.error.textContent =
      message;

    elements.results.hidden =
      true;

    localStorage.setItem(
      STORAGE_KEYS.resultsOpen,
      "false"
    );
  }


  function clearError() {
    elements.error.textContent =
      "";
  }


  // =========================================
  // Calculation
  // =========================================

  function calculateExp(
    saveResultsState = true
  ) {
    clearError();

    const currentLevel =
      Number(elements.currentLevel.value);

    const currentExp =
      Number(elements.currentExp.value || 0);

    const targetLevel =
      Number(elements.targetLevel.value);

    if (
      !Number.isInteger(currentLevel) ||
      currentLevel < 1 ||
      currentLevel > MAX_LEVEL
    ) {
      showError(
        `Enter a valid Current Level between 1 and ${MAX_LEVEL}.`
      );

      return false;
    }

    if (
      !Number.isInteger(targetLevel) ||
      targetLevel <= currentLevel ||
      targetLevel > MAX_LEVEL
    ) {
      showError(
        `Target Level must be higher than Current Level and no higher than ${MAX_LEVEL}.`
      );

      return false;
    }

    const nextLevelRequirement =
      getLevelExp(currentLevel + 1);

    if (
      !Number.isFinite(currentExp) ||
      currentExp < 0 ||
      currentExp >= nextLevelRequirement
    ) {
      showError(
        `Current EXP must be between 0 and ${numberFormatter.format(nextLevelRequirement - 1)}.`
      );

      return false;
    }

    const expTillNextLevel =
      Math.max(
        0,
        nextLevelRequirement - currentExp
      );

    const boss1 =
      getSelectedBoss(
        elements.boss1Group,
        elements.boss1
      );

    const boss2 =
      getSelectedBoss(
        elements.boss2Group,
        elements.boss2
      );

    if (
      !boss1 ||
      boss1.exp <= 0
    ) {
      showError(
        "Select an active Boss 1 with an EXP value above 0."
      );

      return false;
    }

    if (
      bossMode === 2 &&
      (!boss2 || boss2.exp <= 0)
    ) {
      showError(
        "Select an active Boss 2 with an EXP value above 0."
      );

      return false;
    }

    const xpMultiplier =
      elements.doubleXp.checked
        ? 2
        : 1;

    const boss1Exp =
      boss1.exp * xpMultiplier;

    const boss2Exp =
      bossMode === 2
        ? boss2.exp * xpMultiplier
        : 0;

    const expPerRotation =
      boss1Exp + boss2Exp;

    const remainingExp =
      getRemainingExp(
        currentLevel,
        currentExp,
        targetLevel
      );

    const requiredRotations =
      Math.ceil(
        remainingExp /
        expPerRotation
      );

    const totalBossKills =
      requiredRotations * bossMode;

    const nextLevelRotations =
      Math.ceil(
        expTillNextLevel /
        expPerRotation
      );

    const nextLevelBossKills =
      nextLevelRotations * bossMode;


    // =========================================
    // Results
    // =========================================

    elements.resultExpRemaining.textContent =
      numberFormatter.format(
        remainingExp
      );

    elements.resultNextLevel.textContent =
      `${numberFormatter.format(expTillNextLevel)} / ${numberFormatter.format(nextLevelBossKills)}`;

    elements.resultExpPerRotation.textContent =
      numberFormatter.format(
        expPerRotation
      );

    elements.resultCount.textContent =
      numberFormatter.format(
        requiredRotations
      );

    elements.resultTotalKills.textContent =
      numberFormatter.format(
        totalBossKills
      );

    let detailsHtml = `
      <strong>${boss1.name}</strong>
      — ${numberFormatter.format(boss1Exp)} EXP per kill
      — ${numberFormatter.format(requiredRotations)} kills
    `;

    if (bossMode === 2) {
      detailsHtml += `
        <br>
        <strong>${boss2.name}</strong>
        — ${numberFormatter.format(boss2Exp)} EXP per kill
        — ${numberFormatter.format(requiredRotations)} kills
      `;
    }

    elements.resultDetails.innerHTML =
      detailsHtml;

    elements.results.hidden =
      false;

    if (saveResultsState) {
      localStorage.setItem(
        STORAGE_KEYS.resultsOpen,
        "true"
      );
    }

    return true;
  }


  // =========================================
  // Event Listeners
  // =========================================

  document
    .querySelectorAll(".exp-mode-button")
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          setBossMode(
            Number(button.dataset.mode)
          );
        }
      );
    });


  elements.doubleXp.addEventListener(
    "change",
    saveSettings
  );


  elements.boss1Group.addEventListener(
    "change",
    () => {
      populateBossDropdown(
        elements.boss1Group,
        elements.boss1,
        elements.boss1Exp
      );

      saveSettings();
    }
  );


  elements.boss1.addEventListener(
    "change",
    () => {
      updateBossExpDisplay(
        elements.boss1Group,
        elements.boss1,
        elements.boss1Exp
      );

      saveSettings();
    }
  );


  elements.boss2Group.addEventListener(
    "change",
    () => {
      populateBossDropdown(
        elements.boss2Group,
        elements.boss2,
        elements.boss2Exp
      );

      saveSettings();
    }
  );


  elements.boss2.addEventListener(
    "change",
    () => {
      updateBossExpDisplay(
        elements.boss2Group,
        elements.boss2,
        elements.boss2Exp
      );

      saveSettings();
    }
  );


  elements.calculateButton.addEventListener(
    "click",
    () => {
      calculateExp(true);
    }
  );


  [
    elements.currentLevel,
    elements.currentExp,
    elements.targetLevel
  ].forEach((input) => {
    input.addEventListener(
      "input",
      saveSettings
    );

    input.addEventListener(
      "keydown",
      (event) => {
        if (event.key === "Enter") {
          calculateExp(true);
        }
      }
    );
  });


  // =========================================
  // Load Saved Settings
  // =========================================

  function loadSavedSettings() {
    const savedMode =
      Number(
        localStorage.getItem(
          STORAGE_KEYS.bossMode
        )
      );

    const savedDoubleXp =
      localStorage.getItem(
        STORAGE_KEYS.doubleXp
      );

    const savedBoss1Group =
      localStorage.getItem(
        STORAGE_KEYS.boss1Group
      );

    const savedBoss1Boss =
      Number(
        localStorage.getItem(
          STORAGE_KEYS.boss1Boss
        )
      );

    const savedBoss2Group =
      localStorage.getItem(
        STORAGE_KEYS.boss2Group
      );

    const savedBoss2Boss =
      Number(
        localStorage.getItem(
          STORAGE_KEYS.boss2Boss
        )
      );

    const savedCurrentLevel =
      localStorage.getItem(
        STORAGE_KEYS.currentLevel
      );

    const savedCurrentExp =
      localStorage.getItem(
        STORAGE_KEYS.currentExp
      );

    const savedTargetLevel =
      localStorage.getItem(
        STORAGE_KEYS.targetLevel
      );

    const savedResultsOpen =
      localStorage.getItem(
        STORAGE_KEYS.resultsOpen
      );

    elements.boss1Group.value =
      isValidBossGroup(savedBoss1Group)
        ? savedBoss1Group
        : DEFAULT_BOSS_GROUP;

    elements.boss2Group.value =
      isValidBossGroup(savedBoss2Group)
        ? savedBoss2Group
        : DEFAULT_BOSS_GROUP;

    populateBossDropdown(
      elements.boss1Group,
      elements.boss1,
      elements.boss1Exp,
      Number.isInteger(savedBoss1Boss)
        ? savedBoss1Boss
        : 0
    );

    populateBossDropdown(
      elements.boss2Group,
      elements.boss2,
      elements.boss2Exp,
      Number.isInteger(savedBoss2Boss)
        ? savedBoss2Boss
        : 0
    );

    elements.doubleXp.checked =
      savedDoubleXp === "true";

    elements.currentLevel.value =
      savedCurrentLevel || "";

    elements.currentExp.value =
      savedCurrentExp || "";

    elements.targetLevel.value =
      savedTargetLevel || "";

    setBossMode(
      savedMode === 2
        ? 2
        : 1,
      false
    );

    if (savedResultsOpen === "true") {
      calculateExp(false);
    } else {
      elements.results.hidden =
        true;
    }
  }


  // =========================================
  // Initialization
  // =========================================

  loadSavedSettings();

})();
