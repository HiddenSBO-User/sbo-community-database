// =========================================
// SBO EXP Calculator
// =========================================

(() => {
  "use strict";

  const MAX_LEVEL = 10000;
  const DEFAULT_BOSS_GROUP = "floors2to10";

  const numberFormatter =
    new Intl.NumberFormat("en-US");

  const elements = {
    doubleXp:
      document.getElementById("doubleXp"),

    boss1Group:
      document.getElementById("boss-1-group"),

    boss1:
      document.getElementById("boss-1"),

    boss1Exp:
      document.getElementById("boss-1-exp"),

    boss2Card:
      document.getElementById("boss-2-card"),

    boss2Group:
      document.getElementById("boss-2-group"),

    boss2:
      document.getElementById("boss-2"),

    boss2Exp:
      document.getElementById("boss-2-exp"),

    currentLevel:
      document.getElementById("current-level"),

    currentExp:
      document.getElementById("current-exp"),

    targetLevel:
      document.getElementById("target-level"),

    error:
      document.getElementById("exp-error"),

    preservationPercent:
      document.getElementById("preservation-percent"),

    preservationFloor:
      document.getElementById("preservation-floor"),

    levelledButton:
      document.getElementById("levelled-button"),

    diedButton:
      document.getElementById("died-button"),

    trackBoss1:
      document.getElementById("track-boss-1"),

    trackBoss1Name:
      document.getElementById("track-boss-1-name"),

    trackBoss1Exp:
      document.getElementById("track-boss-1-exp"),

    trackBoss2:
      document.getElementById("track-boss-2"),

    trackBoss2Name:
      document.getElementById("track-boss-2-name"),

    trackBoss2Exp:
      document.getElementById("track-boss-2-exp"),

    results:
      document.getElementById("exp-results"),

    resultExpRemaining:
      document.getElementById("result-exp-remaining"),

    resultNextLevel:
      document.getElementById("result-next-level"),

    resultExpLabel:
      document.getElementById("result-exp-label"),

    resultExpPerRotation:
      document.getElementById("result-exp-per-rotation"),

    resultCountCard:
      document.getElementById("result-count-card"),

    resultCountLabel:
      document.getElementById("result-count-label"),

    resultCount:
      document.getElementById("result-count"),

    resultTotalCard:
      document.getElementById("result-total-card"),

    resultTotalKills:
      document.getElementById("result-total-kills"),

    resultDetails:
      document.getElementById("result-details"),

    levelledModal:
      document.getElementById("levelled-modal"),

    levelledModalClose:
      document.getElementById("levelled-modal-close"),

    levelledModalCancel:
      document.getElementById("levelled-modal-cancel"),

    levelledBoss1Button:
      document.getElementById("levelled-boss-1"),

    levelledBoss1Name:
      document.getElementById("levelled-boss-1-name"),

    levelledBoss1Exp:
      document.getElementById("levelled-boss-1-exp"),

    levelledBoss2Button:
      document.getElementById("levelled-boss-2"),

    levelledBoss2Name:
      document.getElementById("levelled-boss-2-name"),

    levelledBoss2Exp:
      document.getElementById("levelled-boss-2-exp"),

    deathModal:
      document.getElementById("death-modal"),

    deathModalClose:
      document.getElementById("death-modal-close"),

    deathModalCancel:
      document.getElementById("death-modal-cancel"),

    confirmDeathButton:
      document.getElementById("confirm-death-button"),

    deathPreviewLevel:
      document.getElementById("death-preview-level"),

    deathPreviewBefore:
      document.getElementById("death-preview-before"),

    deathPreviewPreservation:
      document.getElementById("death-preview-preservation"),

    deathPreviewLost:
      document.getElementById("death-preview-lost"),

    deathPreviewAfter:
      document.getElementById("death-preview-after"),

    activityBossKills:
      document.getElementById("activity-boss-kills"),
    activityExpGained:
      document.getElementById("activity-exp-gained"),
    activityLevelsGained:
      document.getElementById("activity-levels-gained"),
    activityDeaths:
      document.getElementById("activity-deaths"),
    activityExpLost:
      document.getElementById("activity-exp-lost"),
    activitySessionStarted:
      document.getElementById("activity-session-started"),
    activityLastActivity:
      document.getElementById("activity-last-activity"),
    activityRecentEmpty:
      document.getElementById("activity-recent-empty"),
    activityRecentList:
      document.getElementById("activity-recent-list"),
    activitySessionEmpty:
      document.getElementById("activity-session-empty"),
    activitySessionList:
      document.getElementById("activity-session-list"),
    activityDeathsEmpty:
      document.getElementById("activity-deaths-empty"),
    activityDeathsList:
      document.getElementById("activity-deaths-list"),
    activityDeathCount:
      document.getElementById("activity-death-count"),
    activityKillsEmpty:
      document.getElementById("activity-kills-empty"),
    activityKillsList:
      document.getElementById("activity-kills-list"),
    activityKillCount:
      document.getElementById("activity-kill-count")
  };

  let bossMode = 1;
  let pendingDeath = null;

  // =========================================
  // Session Tracking
  // =========================================

  const sessionState = {
    bossKills: 0,
    expGained: 0,
    levelsGained: 0,
    deaths: 0,
    expLost: 0,
    startedAt: null,
    lastActivityAt: null,
    events: []
  };

  function formatActivityTime(timestamp) {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  }

  function ensureSessionStarted(timestamp) {
    if (!sessionState.startedAt) {
      sessionState.startedAt = timestamp;
    }
    sessionState.lastActivityAt = timestamp;
  }

  function escapeActivityHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function makeActivityEntry(event) {
    const valueClass =
      event.value < 0 ? "negative" :
      event.value > 0 ? "positive" : "";

    const valueText =
      event.value === null || event.value === undefined
        ? ""
        : `${event.value > 0 ? "+" : ""}${numberFormatter.format(event.value)} EXP`;

    return `
      <div class="exp-activity-entry">
        <span class="exp-activity-entry-time">${escapeActivityHtml(formatActivityTime(event.timestamp))}</span>
        <span class="exp-activity-entry-type">${escapeActivityHtml(event.typeLabel)}</span>
        <div class="exp-activity-entry-main">
          <strong>${escapeActivityHtml(event.title)}</strong>
          <span>${escapeActivityHtml(event.detail || "")}</span>
        </div>
        <span class="exp-activity-entry-value ${valueClass}">${escapeActivityHtml(valueText)}</span>
      </div>
    `;
  }

  function renderActivityList(listElement, emptyElement, events) {
    if (!listElement || !emptyElement) {
      return;
    }

    if (events.length === 0) {
      listElement.innerHTML = "";
      listElement.classList.add("hidden");
      emptyElement.classList.remove("hidden");
      return;
    }

    emptyElement.classList.add("hidden");
    listElement.classList.remove("hidden");
    listElement.innerHTML = events.map(makeActivityEntry).join("");
  }

  function renderSessionTracking() {
    if (elements.activityBossKills) {
      elements.activityBossKills.textContent =
        numberFormatter.format(sessionState.bossKills);
    }

    if (elements.activityExpGained) {
      elements.activityExpGained.textContent =
        numberFormatter.format(sessionState.expGained);
    }

    if (elements.activityLevelsGained) {
      elements.activityLevelsGained.textContent =
        numberFormatter.format(sessionState.levelsGained);
    }

    if (elements.activityDeaths) {
      elements.activityDeaths.textContent =
        numberFormatter.format(sessionState.deaths);
    }

    if (elements.activityExpLost) {
      elements.activityExpLost.textContent =
        numberFormatter.format(sessionState.expLost);
    }

    if (elements.activitySessionStarted) {
      elements.activitySessionStarted.textContent =
        sessionState.startedAt
          ? formatActivityTime(sessionState.startedAt)
          : "—";
    }

    if (elements.activityLastActivity) {
      elements.activityLastActivity.textContent =
        sessionState.lastActivityAt
          ? formatActivityTime(sessionState.lastActivityAt)
          : "—";
    }

    const newestFirst = [...sessionState.events].reverse();

    renderActivityList(
      elements.activityRecentList,
      elements.activityRecentEmpty,
      newestFirst.slice(0, 5)
    );

    renderActivityList(
      elements.activitySessionList,
      elements.activitySessionEmpty,
      newestFirst
    );

    const deathEvents = newestFirst.filter(
      (event) => event.category === "death"
    );

    renderActivityList(
      elements.activityDeathsList,
      elements.activityDeathsEmpty,
      deathEvents
    );

    if (elements.activityDeathCount) {
      elements.activityDeathCount.textContent =
        `${deathEvents.length} ${deathEvents.length === 1 ? "Death" : "Deaths"}`;
    }

    const killLevelEvents = newestFirst.filter(
      (event) =>
        event.category === "kill" ||
        event.category === "level"
    );

    renderActivityList(
      elements.activityKillsList,
      elements.activityKillsEmpty,
      killLevelEvents
    );

    if (elements.activityKillCount) {
      elements.activityKillCount.textContent =
        `${killLevelEvents.length} ${killLevelEvents.length === 1 ? "Event" : "Events"}`;
    }
  }

  function recordSessionEvent(event) {
    const timestamp = Date.now();
    ensureSessionStarted(timestamp);

    sessionState.events.push({
      ...event,
      timestamp
    });

    renderSessionTracking();
  }

  function recordKill(boss, gainedExp, levelBefore, levelAfter, doubleXpUsed) {
    sessionState.bossKills += 1;
    sessionState.expGained += gainedExp;

    recordSessionEvent({
      category: "kill",
      typeLabel: "Kill",
      title: boss.name,
      detail:
        `Level ${numberFormatter.format(levelBefore)} → ${numberFormatter.format(levelAfter)}` +
        (doubleXpUsed ? " · 2× EXP" : ""),
      value: gainedExp
    });

    const levelsGained = Math.max(0, levelAfter - levelBefore);

    if (levelsGained > 0) {
      sessionState.levelsGained += levelsGained;

      recordSessionEvent({
        category: "level",
        typeLabel: "Level Up",
        title:
          levelsGained === 1
            ? `Level ${numberFormatter.format(levelBefore)} → ${numberFormatter.format(levelAfter)}`
            : `${numberFormatter.format(levelsGained)} Levels Gained`,
        detail: `Triggered by ${boss.name}`,
        value: null
      });
    }
  }

  function recordManualLevelUp(boss, gainedExp, levelBefore, levelAfter, doubleXpUsed) {
    sessionState.bossKills += 1;
    sessionState.expGained += gainedExp;

    const levelsGained = Math.max(0, levelAfter - levelBefore);
    sessionState.levelsGained += levelsGained;

    recordSessionEvent({
      category: "kill",
      typeLabel: "Kill",
      title: boss.name,
      detail:
        `Level ${numberFormatter.format(levelBefore)} → ${numberFormatter.format(levelAfter)}` +
        (doubleXpUsed ? " · 2× EXP" : ""),
      value: gainedExp
    });

    recordSessionEvent({
      category: "level",
      typeLabel: "Level Up",
      title:
        levelsGained === 1
          ? `Level ${numberFormatter.format(levelBefore)} → ${numberFormatter.format(levelAfter)}`
          : `${numberFormatter.format(levelsGained)} Levels Gained`,
      detail: `Confirmed with I Levelled · ${boss.name}`,
      value: null
    });
  }

  function recordDeath(death) {
    sessionState.deaths += 1;
    sessionState.expLost += death.expLost;

    recordSessionEvent({
      category: "death",
      typeLabel: "Death",
      title: `Level ${numberFormatter.format(death.level)}`,
      detail:
        `${death.preservationPercent}% preservation · ` +
        `${numberFormatter.format(death.expBefore)} → ${numberFormatter.format(death.expAfter)} EXP`,
      value: -death.expLost
    });
  }


  // =========================================
  // Saved Settings
  // =========================================

  const STORAGE_KEYS = {
    bossMode:
      "sboExpBossMode",

    doubleXp:
      "sboExpDoubleXp",

    boss1Group:
      "sboExpBoss1Group",

    boss1Boss:
      "sboExpBoss1Boss",

    boss2Group:
      "sboExpBoss2Group",

    boss2Boss:
      "sboExpBoss2Boss",

    currentLevel:
      "sboExpCurrentLevel",

    currentExp:
      "sboExpCurrentExp",

    targetLevel:
      "sboExpTargetLevel"
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
    return (
      (3 * level * level) +
      (9 * level) -
      3
    );
  }


  function getRemainingExp(
    currentLevel,
    currentExp,
    targetLevel
  ) {
    let requiredExp = 0;

    for (
      let level =
        currentLevel;

      level < targetLevel;

      level += 1
    ) {
      requiredExp +=
        getLevelExp(level);
    }

    return Math.max(
      0,
      requiredExp - currentExp
    );
  }


  // =========================================
  // Boss Data
  // =========================================

  function getBossGroup(
    groupName
  ) {
    if (
      groupName ===
      "event"
    ) {
      return (
        window.SBO_EVENT_BOSSES ||
        []
      );
    }

    return (
      (window.SBO_BOSSES || {})[
        groupName
      ] ||
      []
    );
  }


  function isValidBossGroup(
    groupName
  ) {
    if (
      groupName ===
      "event"
    ) {
      return true;
    }

    return Object
      .prototype
      .hasOwnProperty
      .call(
        window.SBO_BOSSES || {},
        groupName
      );
  }


  function getSelectedBoss(
    groupSelect,
    bossSelect
  ) {
    const bossList =
      getBossGroup(
        groupSelect.value
      );

    const bossIndex =
      Number(
        bossSelect.value
      );

    return (
      bossList[bossIndex] ||
      null
    );
  }


  function getBossActualExp(
    boss
  ) {
    if (!boss) {
      return 0;
    }

    const multiplier =
      elements.doubleXp.checked
        ? 2
        : 1;

    return (
      boss.exp *
      multiplier
    );
  }


  function populateBossDropdown(
    groupSelect,
    bossSelect,
    expDisplay,
    savedBossIndex = 0
  ) {
    const bossList =
      getBossGroup(
        groupSelect.value
      );

    bossSelect.innerHTML =
      "";

    bossList.forEach(
      (boss, index) => {
        const option =
          document.createElement(
            "option"
          );

        option.value =
          String(index);

        const floorText =
          boss.floor
            ? `Floor ${boss.floor} · `
            : "";

        option.textContent =
          `${floorText}${boss.name} — ${numberFormatter.format(boss.exp)} EXP`;

        bossSelect.appendChild(
          option
        );
      }
    );

    const validBossIndex =
      Number.isInteger(
        savedBossIndex
      ) &&
      savedBossIndex >= 0 &&
      savedBossIndex <
        bossList.length
        ? savedBossIndex
        : 0;

    bossSelect.value =
      String(
        validBossIndex
      );

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
  // Boss Kill Trackers
  // =========================================

  function updateKillTrackers() {
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
      elements.trackBoss1 &&
      elements.trackBoss1Name &&
      elements.trackBoss1Exp
    ) {
      if (boss1) {
        const boss1ActualExp =
          getBossActualExp(
            boss1
          );

        elements
          .trackBoss1Name
          .textContent =
            boss1.name;

        elements
          .trackBoss1Exp
          .textContent =
            `+${numberFormatter.format(boss1ActualExp)} EXP`;

        elements
          .trackBoss1
          .title =
            `Add ${numberFormatter.format(boss1ActualExp)} EXP`;
      } else {
        elements
          .trackBoss1Name
          .textContent =
            "No Boss";

        elements
          .trackBoss1Exp
          .textContent =
            "+0 EXP";
      }
    }

    if (elements.trackBoss2) {
      elements
        .trackBoss2
        .classList
        .toggle(
          "hidden",
          bossMode !== 2
        );
    }

    if (
      elements.trackBoss2 &&
      elements.trackBoss2Name &&
      elements.trackBoss2Exp
    ) {
      if (boss2) {
        const boss2ActualExp =
          getBossActualExp(
            boss2
          );

        elements
          .trackBoss2Name
          .textContent =
            boss2.name;

        elements
          .trackBoss2Exp
          .textContent =
            `+${numberFormatter.format(boss2ActualExp)} EXP`;

        elements
          .trackBoss2
          .title =
            `Add ${numberFormatter.format(boss2ActualExp)} EXP`;
      } else {
        elements
          .trackBoss2Name
          .textContent =
            "No Boss";

        elements
          .trackBoss2Exp
          .textContent =
            "+0 EXP";
      }
    }
  }


  function addBossKillExp(
    boss
  ) {
    clearError();

    if (
      !boss ||
      boss.exp <= 0
    ) {
      showError(
        "Select a valid boss before adding a kill."
      );

      return;
    }

    if (
      !validateCurrentProgress()
    ) {
      return;
    }

    let {
      currentLevel,
      currentExp
    } =
      getProgressValues();

    const levelBefore =
      currentLevel;

    const doubleXpUsed =
      elements.doubleXp.checked;

    const gainedExp =
      getBossActualExp(
        boss
      );

    let updatedExp =
      currentExp +
      gainedExp;

    while (
      currentLevel <
      MAX_LEVEL
    ) {
      const levelRequirement =
        getLevelExp(
          currentLevel
        );

      if (
        updatedExp <
        levelRequirement
      ) {
        break;
      }

      updatedExp -=
        levelRequirement;

      currentLevel +=
        1;
    }

    elements
      .currentLevel
      .value =
        String(
          currentLevel
        );

    elements
      .currentExp
      .value =
        String(
          Math.floor(
            updatedExp
          )
        );

    saveSettings();

    recordKill(
      boss,
      gainedExp,
      levelBefore,
      currentLevel,
      doubleXpUsed
    );

    updatePreservationDisplay();

    recalculateIfReady();
  }


  // =========================================
  // Auto Calculation
  // =========================================

  function canAutoCalculate() {
    return (
      elements.currentLevel.value !==
        "" &&
      elements.targetLevel.value !==
        ""
    );
  }


  function recalculateIfReady() {
    if (
      !canAutoCalculate()
    ) {
      return;
    }

    const currentLevel =
      Number(
        elements.currentLevel.value
      );

    const targetLevel =
      Number(
        elements.targetLevel.value
      );

    if (
      Number.isInteger(
        currentLevel
      ) &&
      Number.isInteger(
        targetLevel
      ) &&
      targetLevel >
        currentLevel
    ) {
      calculateExp();

      return;
    }

    if (
      Number.isInteger(
        currentLevel
      ) &&
      Number.isInteger(
        targetLevel
      ) &&
      currentLevel >=
        targetLevel
    ) {
      clearError();

      if (
        elements.results
      ) {
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
      .querySelectorAll(
        ".exp-mode-button"
      )
      .forEach(
        (button) => {
          const buttonMode =
            Number(
              button.dataset.mode
            );

          button
            .classList
            .toggle(
              "active",
              buttonMode ===
                bossMode
            );
        }
      );

    elements.boss2Card
      .classList
      .toggle(
        "hidden",
        bossMode !== 2
      );

    elements.resultCountCard
      .classList
      .toggle(
        "hidden",
        bossMode === 2
      );

    elements.resultTotalCard
      .classList
      .toggle(
        "hidden",
        bossMode !== 2
      );

    elements.resultExpLabel
      .textContent =
        bossMode === 2
          ? "EXP Per Rotation"
          : "EXP Per Kill";

    elements.resultCountLabel
      .textContent =
        "Bosses Required";

    updateKillTrackers();

    if (shouldSave) {
      saveSettings();
      recalculateIfReady();
    }
  }


  // =========================================
  // Validation
  // =========================================

  function showError(
    message
  ) {
    if (
      !elements.error
    ) {
      return;
    }

    elements.error.textContent =
      message;
  }


  function clearError() {
    if (
      !elements.error
    ) {
      return;
    }

    elements.error.textContent =
      "";
  }


  function getProgressValues() {
    return {
      currentLevel:
        Number(
          elements
            .currentLevel
            .value
        ),

      currentExp:
        Number(
          elements
            .currentExp
            .value ||
          0
        ),

      targetLevel:
        Number(
          elements
            .targetLevel
            .value
        )
    };
  }


  function validateCurrentProgress() {
    clearError();

    const {
      currentLevel,
      currentExp
    } =
      getProgressValues();

    if (
      !Number.isInteger(
        currentLevel
      ) ||
      currentLevel < 1 ||
      currentLevel >
        MAX_LEVEL
    ) {
      showError(
        `Enter a valid Current Level between 1 and ${MAX_LEVEL}.`
      );

      return false;
    }

    const nextLevelRequirement =
      getLevelExp(
        currentLevel
      );

    if (
      !Number.isFinite(
        currentExp
      ) ||
      currentExp < 0 ||
      currentExp >=
        nextLevelRequirement
    ) {
      showError(
        `Current EXP must be between 0 and ${numberFormatter.format(nextLevelRequirement - 1)}.`
      );

      return false;
    }

    return true;
  }


  // =========================================
  // Death Preservation
  // =========================================

  function getDeathPreservation(
    level
  ) {
    if (
      !Number.isInteger(level) ||
      level < 100
    ) {
      return 0;
    }

    return Math.min(
      Math.floor(
        level / 100
      ) * 10,
      90
    );
  }


  function getPreservationData(
    level
  ) {
    if (
      !Number.isInteger(
        level
      ) ||
      level < 1
    ) {
      return {
        percentage: 0,
        floor: 0
      };
    }

    const percentage =
      getDeathPreservation(
        level
      );

    const levelRequirement =
      getLevelExp(
        level
      );

    const floor =
      Math.floor(
        levelRequirement *
        (percentage / 100)
      );

    return {
      percentage,
      floor
    };
  }


  function updatePreservationDisplay() {
    if (
      !elements
        .preservationPercent ||
      !elements
        .preservationFloor
    ) {
      return;
    }

    const currentLevel =
      Number(
        elements
          .currentLevel
          .value
      );

    const preservation =
      getPreservationData(
        currentLevel
      );

    elements
      .preservationPercent
      .textContent =
        `${preservation.percentage}%`;

    elements
      .preservationFloor
      .textContent =
        `${numberFormatter.format(preservation.floor)} EXP`;
  }


  function getDeathCalculation() {
  const {
    currentLevel,
    currentExp
  } =
    getProgressValues();

  const preservation =
    getPreservationData(
      currentLevel
    );

  let expAfterDeath;

  if (
    currentExp <=
    preservation.floor
  ) {
    expAfterDeath =
      currentExp;
  } else {
    expAfterDeath =
      preservation.floor;
  }

  const expLost =
    Math.max(
      0,
      currentExp -
        expAfterDeath
    );

  return {
    level:
      currentLevel,

    expBefore:
      currentExp,

    preservationPercent:
      preservation.percentage,

    preservationFloor:
      preservation.floor,

    expLost,

    expAfter:
      expAfterDeath
  };
}


  // =========================================
  // Main Calculation
  // =========================================

  function calculateExp() {
    clearError();

    const {
      currentLevel,
      currentExp,
      targetLevel
    } =
      getProgressValues();

    if (
      !Number.isInteger(
        currentLevel
      ) ||
      currentLevel < 1 ||
      currentLevel >
        MAX_LEVEL
    ) {
      showError(
        `Enter a valid Current Level between 1 and ${MAX_LEVEL}.`
      );

      return false;
    }

    if (
      !Number.isInteger(
        targetLevel
      ) ||
      targetLevel <=
        currentLevel ||
      targetLevel >
        MAX_LEVEL
    ) {
      showError(
        `Target Level must be higher than Current Level and no higher than ${MAX_LEVEL}.`
      );

      return false;
    }

    const nextLevelRequirement =
      getLevelExp(
        currentLevel
      );

    if (
      !Number.isFinite(
        currentExp
      ) ||
      currentExp < 0 ||
      currentExp >=
        nextLevelRequirement
    ) {
      showError(
        `Current EXP must be between 0 and ${numberFormatter.format(nextLevelRequirement - 1)}.`
      );

      return false;
    }

    const expTillNextLevel =
      Math.max(
        0,
        nextLevelRequirement -
          currentExp
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
      (
        !boss2 ||
        boss2.exp <= 0
      )
    ) {
      showError(
        "Select an active Boss 2 with an EXP value above 0."
      );

      return false;
    }

    const boss1Exp =
      getBossActualExp(
        boss1
      );

    const boss2Exp =
      bossMode === 2
        ? getBossActualExp(
            boss2
          )
        : 0;

    const expPerRotation =
      boss1Exp +
      boss2Exp;

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
      requiredRotations *
      bossMode;

    let nextLevelBossKills;

    if (bossMode === 1) {
      nextLevelBossKills =
        Math.ceil(
          expTillNextLevel /
          boss1Exp
        );
    } else {
      function calculateKillsFromBoss(
        firstBossExp,
        secondBossExp
      ) {
        let expNeeded =
          expTillNextLevel;

        let kills = 0;

        while (
          expNeeded > 0
        ) {
          const killExp =
            kills % 2 === 0
              ? firstBossExp
              : secondBossExp;

          expNeeded -=
            killExp;

          kills +=
            1;
        }

        return kills;
      }

      const startingWithBoss1 =
        calculateKillsFromBoss(
          boss1Exp,
          boss2Exp
        );

      const startingWithBoss2 =
        calculateKillsFromBoss(
          boss2Exp,
          boss1Exp
        );

      nextLevelBossKills =
        Math.min(
          startingWithBoss1,
          startingWithBoss2
        );
    }


    // =========================================
    // Results
    // =========================================

    elements
      .resultExpRemaining
      .textContent =
        numberFormatter.format(
          remainingExp
        );

    elements
      .resultNextLevel
      .textContent =
        `${numberFormatter.format(expTillNextLevel)} / ${numberFormatter.format(nextLevelBossKills)}`;

    elements
      .resultExpPerRotation
      .textContent =
        numberFormatter.format(
          expPerRotation
        );

    elements
      .resultCount
      .textContent =
        numberFormatter.format(
          requiredRotations
        );

    elements
      .resultTotalKills
      .textContent =
        numberFormatter.format(
          totalBossKills
        );

    let detailsHtml = `
      <strong>${boss1.name}</strong>
      — ${numberFormatter.format(boss1Exp)} EXP per kill
      — ${numberFormatter.format(requiredRotations)} kills
    `;

    if (
      bossMode === 2
    ) {
      detailsHtml += `
        <br>
        <strong>${boss2.name}</strong>
        — ${numberFormatter.format(boss2Exp)} EXP per kill
        — ${numberFormatter.format(requiredRotations)} kills
      `;
    }

    elements
      .resultDetails
      .innerHTML =
        detailsHtml;

    elements
      .results
      .hidden =
        false;

    return true;
  }


  // =========================================
  // I Levelled
  // =========================================

  function showLevelUpdatedMessage() {
    if (
      !elements
        .levelledButton
    ) {
      return;
    }

    elements
      .levelledButton
      .textContent =
        "Level Updated ✓";

    window.setTimeout(
      () => {
        elements
          .levelledButton
          .textContent =
            "I Levelled";
      },
      1200
    );
  }


  function applyLevelUp(
    boss
  ) {
    if (
      !validateCurrentProgress()
    ) {
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
    } =
      getProgressValues();

    const levelBefore =
      currentLevel;

    const doubleXpUsed =
      elements.doubleXp.checked;

    if (
      currentLevel >=
      MAX_LEVEL
    ) {
      showError(
        `Level ${MAX_LEVEL} is the maximum supported calculator level.`
      );

      return;
    }

    const bossExp =
      getBossActualExp(
        boss
      );

    let updatedExp =
      currentExp +
      bossExp;

    const firstRequirement =
      getLevelExp(
        currentLevel
      );

    if (
      updatedExp <
      firstRequirement
    ) {
      const missingExp =
        firstRequirement -
        updatedExp;

      showError(
        `${boss.name} does not provide enough EXP to level up. You would still need ${numberFormatter.format(missingExp)} EXP.`
      );

      return;
    }

    while (
      currentLevel <
      MAX_LEVEL
    ) {
      const requirement =
        getLevelExp(
          currentLevel
        );

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

    elements
      .currentLevel
      .value =
        String(
          currentLevel
        );

    elements
      .currentExp
      .value =
        String(
          Math.floor(
            updatedExp
          )
        );

    saveSettings();

    recordManualLevelUp(
      boss,
      bossExp,
      levelBefore,
      currentLevel,
      doubleXpUsed
    );

    closeLevelledModal();

    clearError();

    updatePreservationDisplay();

    showLevelUpdatedMessage();

    recalculateIfReady();
  }


  function openLevelledModal() {
    if (
      !validateCurrentProgress()
    ) {
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

    elements
      .levelledBoss1Name
      .textContent =
        boss1.name;

    elements
      .levelledBoss1Exp
      .textContent =
        `${numberFormatter.format(getBossActualExp(boss1))} EXP`;

    elements
      .levelledBoss2Name
      .textContent =
        boss2.name;

    elements
      .levelledBoss2Exp
      .textContent =
        `${numberFormatter.format(getBossActualExp(boss2))} EXP`;

    elements
      .levelledModal
      .hidden =
        false;
  }


  function closeLevelledModal() {
    if (
      elements
        .levelledModal
    ) {
      elements
        .levelledModal
        .hidden =
          true;
    }
  }


  function handleLevelledButton() {
    clearError();

    if (
      !validateCurrentProgress()
    ) {
      return;
    }

    if (
      bossMode === 1
    ) {
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
  // I Died
  // =========================================

  function openDeathModal() {
    if (
      !validateCurrentProgress()
    ) {
      return;
    }

    pendingDeath =
      getDeathCalculation();

    elements
      .deathPreviewLevel
      .textContent =
        numberFormatter.format(
          pendingDeath.level
        );

    elements
      .deathPreviewBefore
      .textContent =
        numberFormatter.format(
          pendingDeath.expBefore
        );

    elements
      .deathPreviewPreservation
      .textContent =
        `${pendingDeath.preservationPercent}%`;

    elements
      .deathPreviewLost
      .textContent =
        numberFormatter.format(
          pendingDeath.expLost
        );

    elements
      .deathPreviewAfter
      .textContent =
        numberFormatter.format(
          pendingDeath.expAfter
        );

    elements
      .deathModal
      .hidden =
        false;
  }


  function closeDeathModal() {
    if (
      elements
        .deathModal
    ) {
      elements
        .deathModal
        .hidden =
          true;
    }

    pendingDeath =
      null;
  }


  function confirmDeath() {
    if (
      !pendingDeath
    ) {
      closeDeathModal();

      return;
    }

    const confirmedDeath = {
      ...pendingDeath
    };

    elements
      .currentExp
      .value =
        String(
          confirmedDeath.expAfter
        );

    saveSettings();

    recordDeath(
      confirmedDeath
    );

    closeDeathModal();

    clearError();

    updatePreservationDisplay();

    recalculateIfReady();
  }


// =========================================
// Main Event Listeners
// =========================================

document
  .querySelectorAll(
    ".exp-mode-button"
  )
  .forEach(
    (button) => {
      button.addEventListener(
        "click",
        () => {
          setBossMode(
            Number(
              button.dataset.mode
            )
          );

          updateKillTrackers();
        }
      );
    }
  );


// =========================================
// 2x EXP
// =========================================

elements.doubleXp
  .addEventListener(
    "change",
    () => {
      updateKillTrackers();

      saveSettings();

      recalculateIfReady();
    }
  );


// =========================================
// Boss 1 Floor Range
// =========================================

elements.boss1Group
  .addEventListener(
    "change",
    () => {
      populateBossDropdown(
        elements.boss1Group,
        elements.boss1,
        elements.boss1Exp
      );

      updateKillTrackers();

      saveSettings();

      recalculateIfReady();
    }
  );


// =========================================
// Boss 1 Selection
// =========================================

elements.boss1
  .addEventListener(
    "change",
    () => {
      updateBossExpDisplay(
        elements.boss1Group,
        elements.boss1,
        elements.boss1Exp
      );

      updateKillTrackers();

      saveSettings();

      recalculateIfReady();
    }
  );


// =========================================
// Boss 2 Floor Range
// =========================================

elements.boss2Group
  .addEventListener(
    "change",
    () => {
      populateBossDropdown(
        elements.boss2Group,
        elements.boss2,
        elements.boss2Exp
      );

      updateKillTrackers();

      saveSettings();

      recalculateIfReady();
    }
  );


// =========================================
// Boss 2 Selection
// =========================================

elements.boss2
  .addEventListener(
    "change",
    () => {
      updateBossExpDisplay(
        elements.boss2Group,
        elements.boss2,
        elements.boss2Exp
      );

      updateKillTrackers();

      saveSettings();

      recalculateIfReady();
    }
  );


// =========================================
// Level Progress Inputs
// =========================================

[
  elements.currentLevel,
  elements.currentExp,
  elements.targetLevel
].forEach(
  (input) => {
    input.addEventListener(
      "input",
      () => {
        saveSettings();

        updatePreservationDisplay();

        recalculateIfReady();
      }
    );
  }
);


// =========================================
// Add Kill Tracker Events
// =========================================

if (
  elements.trackBoss1
) {
  elements.trackBoss1
    .addEventListener(
      "click",
      () => {
        const boss1 =
          getSelectedBoss(
            elements.boss1Group,
            elements.boss1
          );

        addBossKillExp(
          boss1
        );
      }
    );
}


if (
  elements.trackBoss2
) {
  elements.trackBoss2
    .addEventListener(
      "click",
      () => {
        const boss2 =
          getSelectedBoss(
            elements.boss2Group,
            elements.boss2
          );

        addBossKillExp(
          boss2
        );
      }
    );
}

  // =========================================
  // I Levelled Events
  // =========================================

  if (
    elements
      .levelledButton
  ) {
    elements
      .levelledButton
      .addEventListener(
        "click",
        handleLevelledButton
      );
  }


  if (
    elements
      .levelledBoss1Button
  ) {
    elements
      .levelledBoss1Button
      .addEventListener(
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


  if (
    elements
      .levelledBoss2Button
  ) {
    elements
      .levelledBoss2Button
      .addEventListener(
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


  if (
    elements
      .levelledModalClose
  ) {
    elements
      .levelledModalClose
      .addEventListener(
        "click",
        closeLevelledModal
      );
  }


  if (
    elements
      .levelledModalCancel
  ) {
    elements
      .levelledModalCancel
      .addEventListener(
        "click",
        closeLevelledModal
      );
  }


  // =========================================
  // I Died Events
  // =========================================

  if (
    elements
      .diedButton
  ) {
    elements
      .diedButton
      .addEventListener(
        "click",
        openDeathModal
      );
  }


  if (
    elements
      .deathModalClose
  ) {
    elements
      .deathModalClose
      .addEventListener(
        "click",
        closeDeathModal
      );
  }


  if (
    elements
      .deathModalCancel
  ) {
    elements
      .deathModalCancel
      .addEventListener(
        "click",
        closeDeathModal
      );
  }


  if (
    elements
      .confirmDeathButton
  ) {
    elements
      .confirmDeathButton
      .addEventListener(
        "click",
        confirmDeath
      );
  }


  // =========================================
  // Modal Backdrop Click
  // =========================================

  if (
    elements
      .levelledModal
  ) {
    elements
      .levelledModal
      .addEventListener(
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


  if (
    elements
      .deathModal
  ) {
    elements
      .deathModal
      .addEventListener(
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
      isValidBossGroup(
        savedBoss1Group
      )
        ? savedBoss1Group
        : DEFAULT_BOSS_GROUP;

    elements.boss2Group.value =
      isValidBossGroup(
        savedBoss2Group
      )
        ? savedBoss2Group
        : DEFAULT_BOSS_GROUP;


    // =========================================
    // Restore Boss Selections
    // =========================================

    populateBossDropdown(
      elements.boss1Group,
      elements.boss1,
      elements.boss1Exp,
      Number.isInteger(
        savedBoss1Boss
      )
        ? savedBoss1Boss
        : 0
    );

    populateBossDropdown(
      elements.boss2Group,
      elements.boss2,
      elements.boss2Exp,
      Number.isInteger(
        savedBoss2Boss
      )
        ? savedBoss2Boss
        : 0
    );


    // =========================================
    // Restore 2x EXP
    // =========================================

    elements.doubleXp.checked =
      savedDoubleXp ===
      "true";


    // =========================================
    // Restore Level Progress
    // =========================================

    elements.currentLevel.value =
      savedCurrentLevel ||
      "";

    elements.currentExp.value =
      savedCurrentExp ||
      "";

    elements.targetLevel.value =
      savedTargetLevel ||
      "";


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
    // Restore Preservation + Results
    // =========================================

    updatePreservationDisplay();

    updateKillTrackers();

    recalculateIfReady();
  }



// =========================================
// Initialization
// =========================================

loadSavedSettings();

renderSessionTracking();

})();