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

    error: document.getElementById("exp-error"),

    levelledButton: document.getElementById("levelled-button"),
    diedButton: document.getElementById("died-button"),

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

    resultDetails: document.getElementById("result-details"),

    levelledModal: document.getElementById("levelled-modal"),
    levelledModalClose: document.getElementById("levelled-modal-close"),
    levelledModalCancel: document.getElementById("levelled-modal-cancel"),

    levelledBoss1Button: document.getElementById("levelled-boss-1"),
    levelledBoss1Name: document.getElementById("levelled-boss-1-name"),
    levelledBoss1Exp: document.getElementById("levelled-boss-1-exp"),

    levelledBoss2Button: document.getElementById("levelled-boss-2"),
    levelledBoss2Name: document.getElementById("levelled-boss-2-name"),
    levelledBoss2Exp: document.getElementById("levelled-boss-2-exp"),

    deathModal: document.getElementById("death-modal"),
    deathModalClose: document.getElementById("death-modal-close"),
    deathModalCancel: document.getElementById("death-modal-cancel"),
    confirmDeathButton: document.getElementById("confirm-death-button"),

    deathPreviewLevel: document.getElementById("death-preview-level"),
    deathPreviewBefore: document.getElementById("death-preview-before"),
    deathPreviewPreservation: document.getElementById("death-preview-preservation"),
    deathPreviewLost: document.getElementById("death-preview-lost"),
    deathPreviewAfter: document.getElementById("death-preview-after")
  };

  let bossMode = 1;

  let pendingDeath = null;


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
    targetLevel: "sboExpTargetLevel"
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


  function getBossActualExp(boss) {
    if (!boss) {
      return 0;
    }

    const multiplier =
      elements.doubleXp.checked
        ? 2
        : 1;

    return boss.exp * multiplier;
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
  // Auto Calculation
  // =========================================

  function canAutoCalculate() {
    return (
      elements.currentLevel.value !== "" &&
      elements.targetLevel.value !== ""
    );
  }


  function recalculateIfReady() {
    if (!canAutoCalculate()) {
      return;
    }

    const currentLevel =
      Number(elements.currentLevel.value);

    const targetLevel =
      Number(elements.targetLevel.value);

    if (
      Number.isInteger(currentLevel) &&
      Number.isInteger(targetLevel) &&
      targetLevel > currentLevel
    ) {
      calculateExp();
      return;
    }

    if (
      Number.isInteger(currentLevel) &&
      Number.isInteger(targetLevel) &&
      currentLevel >= targetLevel
    ) {
      clearError();

      if (elements.results) {
        elements.results.hidden =
          true;
      }
    }
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
      recalculateIfReady();
    }
  }


  // =========================================
  // Validation
  // =========================================

  function showError(message) {
    if (!elements.error) {
      return;
    }

    elements.error.textContent =
      message;
  }


  function clearError() {
    if (!elements.error) {
      return;
    }

    elements.error.textContent =
      "";
  }


  function getProgressValues() {
    const currentLevel =
      Number(elements.currentLevel.value);

    const currentExp =
      Number(elements.currentExp.value || 0);

    const targetLevel =
      Number(elements.targetLevel.value);

    return {
      currentLevel,
      currentExp,
      targetLevel
    };
  }


  function validateCurrentProgress() {
    clearError();

    const {
      currentLevel,
      currentExp
    } = getProgressValues();

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

    return true;
  }


  // =========================================
  // Calculation
  // =========================================

  function calculateExp() {
    clearError();

    const {
      currentLevel,
      currentExp,
      targetLevel
    } = getProgressValues();

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

    const boss1Exp =
      getBossActualExp(boss1);

    const boss2Exp =
      bossMode === 2
        ? getBossActualExp(boss2)
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

    return true;
  }


  // =========================================
  // I Levelled
  // =========================================

  function showLevelUpdatedMessage() {
    if (!elements.levelledButton) {
      return;
    }

    const originalText =
      "I Levelled";

    elements.levelledButton.textContent =
      "Level Updated ✓";

    elements.levelledButton.classList.add(
      "level-updated"
    );

    window.setTimeout(
      () => {
        elements.levelledButton.textContent =
          originalText;

        elements.levelledButton.classList.remove(
          "level-updated"
        );
      },
      1200
    );
  }


  function applyLevelUp(boss) {
    if (!validateCurrentProgress()) {
      return;
    }

    if (
      !boss ||
      boss.exp <= 0
    ) {
      showError(
        "The selected boss does not have a valid EXP value."
      );

      return;
    }

    let {
      currentLevel,
      currentExp
    } = getProgressValues();

    if (currentLevel >= MAX_LEVEL) {
      showError(
        `Level ${MAX_LEVEL} is the maximum supported calculator level.`
      );

      return;
    }

    const bossExp =
      getBossActualExp(boss);

    let updatedExp =
      currentExp + bossExp;

    const firstLevelRequirement =
      getLevelExp(currentLevel + 1);

    if (
      updatedExp <
      firstLevelRequirement
    ) {
      const missingExp =
        firstLevelRequirement - updatedExp;

      showError(
        `${boss.name} does not provide enough EXP to level up from your current progress. You would still need ${numberFormatter.format(missingExp)} EXP.`
      );

      return;
    }


    // =========================================
    // Process Level Up + Overflow
    // =========================================

    while (
      currentLevel < MAX_LEVEL
    ) {
      const requirement =
        getLevelExp(currentLevel + 1);

      if (
        updatedExp <
        requirement
      ) {
        break;
      }

      updatedExp -=
        requirement;

      currentLevel +=
        1;
    }


    // =========================================
    // Save Updated Progress
    // =========================================

    elements.currentLevel.value =
      String(currentLevel);

    elements.currentExp.value =
      String(
        Math.floor(updatedExp)
      );

    saveSettings();

    closeLevelledModal();

    clearError();

    showLevelUpdatedMessage();

    recalculateIfReady();
  }


  function openLevelledModal() {
    if (!validateCurrentProgress()) {
      return;
    }

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
        "Select an active Boss 1 before using I Levelled."
      );

      return;
    }

    if (
      !boss2 ||
      boss2.exp <= 0
    ) {
      showError(
        "Select an active Boss 2 before using I Levelled."
      );

      return;
    }

    elements.levelledBoss1Name.textContent =
      boss1.name;

    elements.levelledBoss1Exp.textContent =
      `${numberFormatter.format(getBossActualExp(boss1))} EXP`;

    elements.levelledBoss2Name.textContent =
      boss2.name;

    elements.levelledBoss2Exp.textContent =
      `${numberFormatter.format(getBossActualExp(boss2))} EXP`;

    elements.levelledModal.hidden =
      false;
  }


  function closeLevelledModal() {
    if (!elements.levelledModal) {
      return;
    }

    elements.levelledModal.hidden =
      true;
  }


  function handleLevelledButton() {
    clearError();

    if (!validateCurrentProgress()) {
      return;
    }

    if (bossMode === 1) {
      const boss1 =
        getSelectedBoss(
          elements.boss1Group,
          elements.boss1
        );

      applyLevelUp(
        boss1
      );

      return;
    }

    openLevelledModal();
  }


  // =========================================
  // Death Preservation
  // =========================================

  function getDeathPreservation(level) {
    if (
      !Number.isInteger(level) ||
      level < 100
    ) {
      return 0;
    }

    const preservationPercent =
      Math.floor(level / 100) * 10;

    return Math.min(
      preservationPercent,
      90
    );
  }


  function getDeathCalculation() {
    const {
      currentLevel,
      currentExp
    } = getProgressValues();

    const preservationPercent =
      getDeathPreservation(
        currentLevel
      );

    const preservationRate =
      preservationPercent / 100;

    const expAfterDeath =
      Math.floor(
        currentExp * preservationRate
      );

    const expLost =
      Math.max(
        0,
        currentExp - expAfterDeath
      );

    return {
      level: currentLevel,
      expBefore: currentExp,
      preservationPercent,
      expPreserved: expAfterDeath,
      expLost,
      expAfter: expAfterDeath
    };
  }


  // =========================================
  // I Died
  // =========================================

  function openDeathModal() {
    if (!validateCurrentProgress()) {
      return;
    }

    pendingDeath =
      getDeathCalculation();

    elements.deathPreviewLevel.textContent =
      numberFormatter.format(
        pendingDeath.level
      );

    elements.deathPreviewBefore.textContent =
      numberFormatter.format(
        pendingDeath.expBefore
      );

    elements.deathPreviewPreservation.textContent =
      `${pendingDeath.preservationPercent}%`;

    elements.deathPreviewLost.textContent =
      numberFormatter.format(
        pendingDeath.expLost
      );

    elements.deathPreviewAfter.textContent =
      numberFormatter.format(
        pendingDeath.expAfter
      );

    elements.deathModal.hidden =
      false;
  }


  function closeDeathModal() {
    if (!elements.deathModal) {
      return;
    }

    elements.deathModal.hidden =
      true;

    pendingDeath =
      null;
  }


  function confirmDeath() {
    if (!pendingDeath) {
      closeDeathModal();

      return;
    }

    elements.currentExp.value =
      String(
        pendingDeath.expAfter
      );

    saveSettings();

    closeDeathModal();

    clearError();

    recalculateIfReady();
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
    () => {
      saveSettings();
      recalculateIfReady();
    }
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
      recalculateIfReady();
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
      recalculateIfReady();
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
      recalculateIfReady();
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
      recalculateIfReady();
    }
  );


  [
    elements.currentLevel,
    elements.currentExp,
    elements.targetLevel
  ].forEach((input) => {
    input.addEventListener(
      "input",
      () => {
        saveSettings();
        recalculateIfReady();
      }
    );
  });


  // =========================================
  // I Levelled Events
  // =========================================

  if (elements.levelledButton) {
    elements.levelledButton.addEventListener(
      "click",
      handleLevelledButton
    );
  }


  if (elements.levelledBoss1Button) {
    elements.levelledBoss1Button.addEventListener(
      "click",
      () => {
        const boss1 =
          getSelectedBoss(
            elements.boss1Group,
            elements.boss1
          );

        applyLevelUp(
          boss1
        );
      }
    );
  }


  if (elements.levelledBoss2Button) {
    elements.levelledBoss2Button.addEventListener(
      "click",
      () => {
        const boss2 =
          getSelectedBoss(
            elements.boss2Group,
            elements.boss2
          );

        applyLevelUp(
          boss2
        );
      }
    );
  }


  if (elements.levelledModalClose) {
    elements.levelledModalClose.addEventListener(
      "click",
      closeLevelledModal
    );
  }


  if (elements.levelledModalCancel) {
    elements.levelledModalCancel.addEventListener(
      "click",
      closeLevelledModal
    );
  }


  // =========================================
  // I Died Events
  // =========================================

  if (elements.diedButton) {
    elements.diedButton.addEventListener(
      "click",
      openDeathModal
    );
  }


  if (elements.deathModalClose) {
    elements.deathModalClose.addEventListener(
      "click",
      closeDeathModal
    );
  }


  if (elements.deathModalCancel) {
    elements.deathModalCancel.addEventListener(
      "click",
      closeDeathModal
    );
  }


  if (elements.confirmDeathButton) {
    elements.confirmDeathButton.addEventListener(
      "click",
      confirmDeath
    );
  }


  // =========================================
  // Modal Backdrop Click
  // =========================================

  if (elements.levelledModal) {
    elements.levelledModal.addEventListener(
      "click",
      (event) => {
        if (
          event.target ===
          elements.levelledModal
        ) {
          closeLevelledModal();
        }
      }
    );
  }


  if (elements.deathModal) {
    elements.deathModal.addEventListener(
      "click",
      (event) => {
        if (
          event.target ===
          elements.deathModal
        ) {
          closeDeathModal();
        }
      }
    );
  }


  // =========================================
  // Escape Key
  // =========================================

  document.addEventListener(
    "keydown",
    (event) => {
      if (
        event.key !==
        "Escape"
      ) {
        return;
      }

      closeLevelledModal();
      closeDeathModal();
    }
  );


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


    // =========================================
    // Restore Boss Groups
    // =========================================

    elements.boss1Group.value =
      isValidBossGroup(savedBoss1Group)
        ? savedBoss1Group
        : DEFAULT_BOSS_GROUP;

    elements.boss2Group.value =
      isValidBossGroup(savedBoss2Group)
        ? savedBoss2Group
        : DEFAULT_BOSS_GROUP;


    // =========================================
    // Restore Boss Selections
    // =========================================

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


    // =========================================
    // Restore 2x EXP
    // =========================================

    elements.doubleXp.checked =
      savedDoubleXp === "true";


    // =========================================
    // Restore Level Progress
    // =========================================

    elements.currentLevel.value =
      savedCurrentLevel || "";

    elements.currentExp.value =
      savedCurrentExp || "";

    elements.targetLevel.value =
      savedTargetLevel || "";


    // =========================================
    // Restore Boss Mode
    // =========================================

    setBossMode(
      savedMode === 2
        ? 2
        : 1,
      false
    );


    // =========================================
    // Restore Results
    // =========================================

    recalculateIfReady();
  }


  // =========================================
  // Initialization
  // =========================================

  loadSavedSettings();

})();
