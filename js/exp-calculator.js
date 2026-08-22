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
    activityActiveTime:
      document.getElementById("activity-active-time"),
    activityExpHour:
      document.getElementById("activity-exp-hour"),
    activityKillsHour:
      document.getElementById("activity-kills-hour"),
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
      document.getElementById("activity-kill-count"),
    activityLevelCount:
      document.getElementById("activity-level-count"),
    activityKillExpGain:
      document.getElementById("activity-kill-exp-gain"),
    activityDeathExpLoss:
      document.getElementById("activity-death-exp-loss"),
    sessionHistorySummary:
      document.getElementById("session-history-summary"),
    sessionExpSummary:
      document.getElementById("session-exp-summary"),
    sessionProfitSummary:
      document.getElementById("session-profit-summary"),
    activitySessionHeader:
      document.getElementById("activity-session-header"),
    activityDeathsHeader:
      document.getElementById("activity-deaths-header"),
    activityKillsHeader:
      document.getElementById("activity-kills-header"),

    lifetimeStatsButton:
      document.getElementById("lifetime-stats-button"),
    undoActivityButton:
      document.getElementById("undo-activity-button"),
    saveSessionButton:
      document.getElementById("save-session-button"),
    resetSessionButton:
      document.getElementById("reset-session-button"),

    lifetimeStatsModal:
      document.getElementById("lifetime-stats-modal"),
    lifetimeStatsClose:
      document.getElementById("lifetime-stats-close"),
    lifetimeStatsCancel:
      document.getElementById("lifetime-stats-cancel"),
    lifetimeBossKills:
      document.getElementById("lifetime-boss-kills"),
    lifetimeExpGained:
      document.getElementById("lifetime-exp-gained"),
    lifetimeLevelsGained:
      document.getElementById("lifetime-levels-gained"),
    lifetimeDeaths:
      document.getElementById("lifetime-deaths"),
    lifetimeExpLost:
      document.getElementById("lifetime-exp-lost"),
    lifetimeProfit:
      document.getElementById("lifetime-profit"),
    lifetimeActiveTime:
      document.getElementById("lifetime-active-time"),
    lifetimeTotalSessions:
      document.getElementById("lifetime-total-sessions"),

    undoActivityModal:
      document.getElementById("undo-activity-modal"),
    undoActivityClose:
      document.getElementById("undo-activity-close"),
    undoActivityCancel:
      document.getElementById("undo-activity-cancel"),
    undoActivityEmpty:
      document.getElementById("undo-activity-empty"),
    undoActivityList:
      document.getElementById("undo-activity-list"),
    undoActivityShowMore:
      document.getElementById("undo-activity-show-more"),

    resetSessionModal:
      document.getElementById("reset-session-modal"),
    resetSessionClose:
      document.getElementById("reset-session-close"),
    resetSessionCancel:
      document.getElementById("reset-session-cancel"),
    saveAndResetButton:
      document.getElementById("save-and-reset-button"),
    confirmResetSessionButton:
      document.getElementById("confirm-reset-session-button")
  };

  let bossMode = 1;
  let pendingDeath = null;

  // =========================================
  // Session Tracking
  // =========================================

  const ACTIVE_GAP_LIMIT_MS =
    15 * 60 * 1000;

  const sessionState = {
    bossKills: 0,
    expGained: 0,
    levelsGained: 0,
    deaths: 0,
    expLost: 0,
    activeTimeMs: 0,
    startedAt: null,
    lastActivityAt: null,
    events: []
  };

  const lifetimeState = {
    bossKills: 0,
    expGained: 0,
    levelsGained: 0,
    deaths: 0,
    expLost: 0,
    activeTimeMs: 0,
    totalSessions: 0
  };

  let undoVisibleCount = 20;

  function formatActivityTime(timestamp) {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  }

  function trackSessionActivity(timestamp) {
    if (!sessionState.startedAt) {
      sessionState.startedAt = timestamp;
      sessionState.lastActivityAt = timestamp;
      return;
    }

    if (sessionState.lastActivityAt) {
      const activityGap =
        timestamp -
        sessionState.lastActivityAt;

      if (
        activityGap >= 0 &&
        activityGap <=
          ACTIVE_GAP_LIMIT_MS
      ) {
        sessionState.activeTimeMs +=
          activityGap;
      }
    }

    sessionState.lastActivityAt =
      timestamp;
  }

  function formatActiveDuration(milliseconds) {
    const totalSeconds =
      Math.floor(
        Math.max(0, milliseconds) /
        1000
      );

    const hours =
      Math.floor(
        totalSeconds / 3600
      );

    const minutes =
      Math.floor(
        (totalSeconds % 3600) /
        60
      );

    const seconds =
      totalSeconds % 60;

    return [
      String(hours).padStart(2, "0"),
      String(minutes).padStart(2, "0"),
      String(seconds).padStart(2, "0")
    ].join(":");
  }

  function getSessionHours() {
    return (
      sessionState.activeTimeMs /
      3600000
    );
  }

  function createActivityId() {
    return (
      "activity-" +
      Date.now() +
      "-" +
      Math.random()
        .toString(36)
        .slice(2, 8)
    );
  }

  function getVisibleEvents() {
    return sessionState.events.filter(
      (event) => !event.undone
    );
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


  function makeDeathHistoryEntry(event) {
    const death =
      event.deathData || {};

    return `
      <div class="exp-history-row exp-death-row">
        <span class="exp-history-time">${escapeActivityHtml(formatActivityTime(event.timestamp))}</span>
        <strong>${escapeActivityHtml(numberFormatter.format(death.level ?? 0))}</strong>
        <span>${escapeActivityHtml(numberFormatter.format(death.expBefore ?? 0))}</span>
        <span>${escapeActivityHtml(`${death.preservationPercent ?? 0}%`)}</span>
        <span class="negative">-${escapeActivityHtml(numberFormatter.format(death.expLost ?? Math.abs(event.value || 0)))} EXP</span>
        <span>${escapeActivityHtml(numberFormatter.format(death.expAfter ?? 0))}</span>
      </div>
    `;
  }

  function makeKillLevelHistoryEntry(event) {
    const valueText =
      event.value === null || event.value === undefined
        ? "—"
        : `${event.value > 0 ? "+" : ""}${numberFormatter.format(event.value)} EXP`;

    return `
      <div class="exp-history-row exp-kill-row">
        <span class="exp-history-time">${escapeActivityHtml(formatActivityTime(event.timestamp))}</span>
        <span class="exp-activity-entry-type">${escapeActivityHtml(event.typeLabel)}</span>
        <div class="exp-history-main">
          <strong>${escapeActivityHtml(event.title)}</strong>
          ${event.doubleXpUsed ? '<small class="exp-history-badge">2× EXP</small>' : ""}
        </div>
        <span class="${event.value > 0 ? "positive" : ""}">${escapeActivityHtml(valueText)}</span>
        <span class="exp-history-result">${escapeActivityHtml(event.resultText || event.detail || "")}</span>
      </div>
    `;
  }

  function renderCustomActivityList(listElement, emptyElement, headerElement, events, maker) {
    if (!listElement || !emptyElement) {
      return;
    }

    const hasEvents =
      events.length > 0;

    if (headerElement) {
      headerElement.classList.toggle(
        "hidden",
        !hasEvents
      );
    }

    if (!hasEvents) {
      listElement.innerHTML =
        "";

      listElement.classList.add(
        "hidden"
      );

      emptyElement.classList.remove(
        "hidden"
      );

      return;
    }

    emptyElement.classList.add(
      "hidden"
    );

    listElement.classList.remove(
      "hidden"
    );

    listElement.innerHTML =
      events.map(maker).join("");
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

    if (elements.activityActiveTime) {
      elements.activityActiveTime.textContent =
        formatActiveDuration(
          sessionState.activeTimeMs
        );
    }

    const activeHours =
      getSessionHours();

    const expPerHour =
      activeHours > 0
        ? sessionState.expGained /
          activeHours
        : 0;

    const killsPerHour =
      activeHours > 0
        ? sessionState.bossKills /
          activeHours
        : 0;

    if (elements.activityExpHour) {
      elements.activityExpHour.textContent =
        numberFormatter.format(
          Math.round(expPerHour)
        );
    }

    if (elements.activityKillsHour) {
      elements.activityKillsHour.textContent =
        killsPerHour > 0
          ? killsPerHour.toFixed(1)
          : "0";
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

    const newestFirst = [...getVisibleEvents()].reverse();

    renderActivityList(
      elements.activityRecentList,
      elements.activityRecentEmpty,
      newestFirst.slice(0, 5)
    );

    renderCustomActivityList(
      elements.activitySessionList,
      elements.activitySessionEmpty,
      elements.activitySessionHeader,
      newestFirst,
      makeActivityEntry
    );

    const deathEvents = newestFirst.filter(
      (event) => event.category === "death"
    );

    renderCustomActivityList(
      elements.activityDeathsList,
      elements.activityDeathsEmpty,
      elements.activityDeathsHeader,
      deathEvents,
      makeDeathHistoryEntry
    );

    if (elements.activityDeathCount) {
      elements.activityDeathCount.textContent =
        `${sessionState.deaths} ${sessionState.deaths === 1 ? "Death" : "Deaths"}`;
    }

    if (elements.activityDeathExpLoss) {
      elements.activityDeathExpLoss.textContent =
        `${numberFormatter.format(sessionState.expLost)} EXP`;
    }

    const killLevelEvents = newestFirst.filter(
      (event) =>
        event.category === "kill" ||
        event.category === "level"
    );

    renderCustomActivityList(
      elements.activityKillsList,
      elements.activityKillsEmpty,
      elements.activityKillsHeader,
      killLevelEvents,
      makeKillLevelHistoryEntry
    );

    if (elements.activityKillCount) {
      elements.activityKillCount.textContent =
        `${sessionState.bossKills} ${sessionState.bossKills === 1 ? "Kill" : "Kills"}`;
    }

    if (elements.activityLevelCount) {
      elements.activityLevelCount.textContent =
        `${sessionState.levelsGained} ${sessionState.levelsGained === 1 ? "Level" : "Levels"}`;
    }

    if (elements.activityKillExpGain) {
      elements.activityKillExpGain.textContent =
        `${numberFormatter.format(sessionState.expGained)} EXP`;
    }

    if (elements.sessionHistorySummary) {
      elements.sessionHistorySummary.textContent =
        `${sessionState.deaths} ${sessionState.deaths === 1 ? "Death" : "Deaths"} · ` +
        `${sessionState.bossKills} ${sessionState.bossKills === 1 ? "Kill" : "Kills"} · ` +
        `${sessionState.levelsGained} ${sessionState.levelsGained === 1 ? "Level" : "Levels"}`;
    }

    if (elements.sessionExpSummary) {
      elements.sessionExpSummary.textContent =
        `+${numberFormatter.format(sessionState.expGained)} EXP · ` +
        `-${numberFormatter.format(sessionState.expLost)} EXP`;
    }

    if (elements.sessionProfitSummary) {
      const profit =
        sessionState.expGained -
        sessionState.expLost;

      elements.sessionProfitSummary.textContent =
        `Profit ${profit >= 0 ? "+" : "-"}${numberFormatter.format(Math.abs(profit))} EXP`;

      elements.sessionProfitSummary.classList.toggle(
        "negative",
        profit < 0
      );

      elements.sessionProfitSummary.classList.toggle(
        "positive",
        profit >= 0
      );
    }
  }

 function recordSessionEvent(event) {
  const timestamp =
    event.timestamp || Date.now();

  trackSessionActivity(
    timestamp
  );

  sessionState.events.push({
    ...event,
    activityId:
      event.activityId ||
      createActivityId(),
    timestamp,
    undone:
      false
  });

  saveSession();

  renderSessionTracking();
}
  
  function recordKill(
    boss,
    gainedExp,
    levelBefore,
    levelAfter,
    doubleXpUsed,
    expBefore,
    expAfter
  ) {
    const activityId =
      createActivityId();

    const levelsGained =
      Math.max(
        0,
        levelAfter - levelBefore
      );

    sessionState.bossKills += 1;
    sessionState.expGained += gainedExp;

    if (levelsGained > 0) {
      sessionState.levelsGained +=
        levelsGained;
    }

    recordSessionEvent({
      activityId,
      category: "kill",
      typeLabel: "Kill",
      title: boss.name,
      detail:
        `Level ${numberFormatter.format(levelBefore)} → ${numberFormatter.format(levelAfter)}` +
        (doubleXpUsed ? " · 2× EXP" : ""),
      value: gainedExp,
      doubleXpUsed,
      resultText:
        `Level ${numberFormatter.format(levelAfter)} · ${numberFormatter.format(expAfter)} EXP`,
      primaryAction: true,
      actionType: "kill",
      snapshotBefore: {
        level: levelBefore,
        exp: expBefore
      },
      statDelta: {
        bossKills: 1,
        expGained: gainedExp,
        levelsGained
      }
    });

    if (levelsGained > 0) {
      recordSessionEvent({
        activityId,
        category: "level",
        typeLabel: "Level Up",
        title:
          levelsGained === 1
            ? `Level ${numberFormatter.format(levelBefore)} → ${numberFormatter.format(levelAfter)}`
            : `${numberFormatter.format(levelsGained)} Levels Gained`,
        detail: `Triggered by ${boss.name}`,
        value: null,
        resultText:
          `${numberFormatter.format(expAfter)} EXP carried`,
        primaryAction: false,
        actionType: "level"
      });
    }
  }

  function recordManualLevelUp(
    boss,
    gainedExp,
    levelBefore,
    levelAfter,
    doubleXpUsed,
    expBefore,
    expAfter
  ) {
    const activityId =
      createActivityId();

    const levelsGained =
      Math.max(
        0,
        levelAfter - levelBefore
      );

    sessionState.bossKills += 1;
    sessionState.expGained += gainedExp;
    sessionState.levelsGained += levelsGained;

    recordSessionEvent({
      activityId,
      category: "kill",
      typeLabel: "Kill",
      title: boss.name,
      detail:
        `Level ${numberFormatter.format(levelBefore)} → ${numberFormatter.format(levelAfter)}` +
        (doubleXpUsed ? " · 2× EXP" : ""),
      value: gainedExp,
      doubleXpUsed,
      resultText:
        `Level ${numberFormatter.format(levelAfter)} · ${numberFormatter.format(expAfter)} EXP`,
      primaryAction: true,
      actionType: "manual-level",
      snapshotBefore: {
        level: levelBefore,
        exp: expBefore
      },
      statDelta: {
        bossKills: 1,
        expGained: gainedExp,
        levelsGained
      }
    });

    recordSessionEvent({
      activityId,
      category: "level",
      typeLabel: "Level Up",
      title:
        levelsGained === 1
          ? `Level ${numberFormatter.format(levelBefore)} → ${numberFormatter.format(levelAfter)}`
          : `${numberFormatter.format(levelsGained)} Levels Gained`,
      detail: `Confirmed with I Levelled · ${boss.name}`,
      value: null,
      resultText:
        `${numberFormatter.format(expAfter)} EXP carried`,
      primaryAction: false,
      actionType: "level"
    });
  }

  function recordDeath(death) {
    const activityId =
      createActivityId();

    sessionState.deaths += 1;
    sessionState.expLost += death.expLost;

    recordSessionEvent({
      activityId,
      category: "death",
      typeLabel: "Death",
      title: `Level ${numberFormatter.format(death.level)}`,
      detail:
        `${death.preservationPercent}% preservation · ` +
        `${numberFormatter.format(death.expBefore)} → ${numberFormatter.format(death.expAfter)} EXP`,
      value: -death.expLost,
      primaryAction: true,
      actionType: "death",
      snapshotBefore: {
        level: death.level,
        exp: death.expBefore
      },
      statDelta: {
        deaths: 1,
        expLost: death.expLost
      },
      deathData: {
        level: death.level,
        expBefore: death.expBefore,
        preservationPercent: death.preservationPercent,
        expLost: death.expLost,
        expAfter: death.expAfter
      }
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
    "sboExpTargetLevel",

  session:
    "sboExpSessionV1",

  lifetime:
    "sboExpLifetimeV1"
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
      doubleXpUsed,
      currentExp,
      Math.floor(updatedExp)
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
      doubleXpUsed,
      currentExp,
      Math.floor(updatedExp)
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
      closeLifetimeStatsModal();
      closeUndoActivityModal();
      closeResetSessionModal();
    }
  );



  // =========================================
  // Activity Header Actions
  // =========================================

  if (elements.lifetimeStatsButton) {
    elements.lifetimeStatsButton.addEventListener(
      "click",
      openLifetimeStatsModal
    );
  }

  if (elements.undoActivityButton) {
    elements.undoActivityButton.addEventListener(
      "click",
      openUndoActivityModal
    );
  }

  if (elements.saveSessionButton) {
    elements.saveSessionButton.addEventListener(
      "click",
      saveCurrentSession
    );
  }

  if (elements.resetSessionButton) {
    elements.resetSessionButton.addEventListener(
      "click",
      openResetSessionModal
    );
  }

  if (elements.lifetimeStatsClose) {
    elements.lifetimeStatsClose.addEventListener(
      "click",
      closeLifetimeStatsModal
    );
  }

  if (elements.lifetimeStatsCancel) {
    elements.lifetimeStatsCancel.addEventListener(
      "click",
      closeLifetimeStatsModal
    );
  }

  if (elements.undoActivityClose) {
    elements.undoActivityClose.addEventListener(
      "click",
      closeUndoActivityModal
    );
  }

  if (elements.undoActivityCancel) {
    elements.undoActivityCancel.addEventListener(
      "click",
      closeUndoActivityModal
    );
  }

  if (elements.undoActivityShowMore) {
    elements.undoActivityShowMore.addEventListener(
      "click",
      () => {
        undoVisibleCount += 20;
        renderUndoActivityList();
      }
    );
  }

  if (elements.resetSessionClose) {
    elements.resetSessionClose.addEventListener(
      "click",
      closeResetSessionModal
    );
  }

  if (elements.resetSessionCancel) {
    elements.resetSessionCancel.addEventListener(
      "click",
      closeResetSessionModal
    );
  }

  if (elements.saveAndResetButton) {
    elements.saveAndResetButton.addEventListener(
      "click",
      () => {
        confirmResetSession(true);
      }
    );
  }

  if (elements.confirmResetSessionButton) {
    elements.confirmResetSessionButton.addEventListener(
      "click",
      () => {
        confirmResetSession(false);
      }
    );
  }

  [
    elements.lifetimeStatsModal,
    elements.undoActivityModal,
    elements.resetSessionModal
  ].forEach((modal) => {
    if (!modal) {
      return;
    }

    modal.addEventListener(
      "click",
      (event) => {
        if (event.target !== modal) {
          return;
        }

        closeLifetimeStatsModal();
        closeUndoActivityModal();
        closeResetSessionModal();
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
// Lifetime Stats, Save, Reset, Undo
// =========================================

function getLifetimeTotals() {
  return {
    bossKills:
      lifetimeState.bossKills +
      sessionState.bossKills,
    expGained:
      lifetimeState.expGained +
      sessionState.expGained,
    levelsGained:
      lifetimeState.levelsGained +
      sessionState.levelsGained,
    deaths:
      lifetimeState.deaths +
      sessionState.deaths,
    expLost:
      lifetimeState.expLost +
      sessionState.expLost,
    activeTimeMs:
      lifetimeState.activeTimeMs +
      sessionState.activeTimeMs,
    totalSessions:
      lifetimeState.totalSessions
  };
}


function renderLifetimeStats() {
  const totals =
    getLifetimeTotals();

  const profit =
    totals.expGained -
    totals.expLost;

  if (elements.lifetimeBossKills) {
    elements.lifetimeBossKills.textContent =
      numberFormatter.format(totals.bossKills);
  }

  if (elements.lifetimeExpGained) {
    elements.lifetimeExpGained.textContent =
      numberFormatter.format(totals.expGained);
  }

  if (elements.lifetimeLevelsGained) {
    elements.lifetimeLevelsGained.textContent =
      numberFormatter.format(totals.levelsGained);
  }

  if (elements.lifetimeDeaths) {
    elements.lifetimeDeaths.textContent =
      numberFormatter.format(totals.deaths);
  }

  if (elements.lifetimeExpLost) {
    elements.lifetimeExpLost.textContent =
      numberFormatter.format(totals.expLost);
  }

  if (elements.lifetimeProfit) {
    elements.lifetimeProfit.textContent =
      `${profit >= 0 ? "+" : "-"}${numberFormatter.format(Math.abs(profit))}`;

    elements.lifetimeProfit.classList.toggle(
      "negative",
      profit < 0
    );
  }

  if (elements.lifetimeActiveTime) {
    elements.lifetimeActiveTime.textContent =
      formatActiveDuration(totals.activeTimeMs);
  }

  if (elements.lifetimeTotalSessions) {
    elements.lifetimeTotalSessions.textContent =
      numberFormatter.format(totals.totalSessions);
  }
}


function openLifetimeStatsModal() {
  renderLifetimeStats();

  if (elements.lifetimeStatsModal) {
    elements.lifetimeStatsModal.hidden =
      false;
  }
}


function closeLifetimeStatsModal() {
  if (elements.lifetimeStatsModal) {
    elements.lifetimeStatsModal.hidden =
      true;
  }
}


function openResetSessionModal() {
  if (elements.resetSessionModal) {
    elements.resetSessionModal.hidden =
      false;
  }
}


function closeResetSessionModal() {
  if (elements.resetSessionModal) {
    elements.resetSessionModal.hidden =
      true;
  }
}


function getSessionFilename(extension) {
  const date =
    new Date()
      .toISOString()
      .slice(0, 10);

  return `SBO-Farming-Session-${date}.${extension}`;
}


function downloadTextFile(filename, content, type) {
  const blob =
    new Blob(
      [content],
      { type }
    );

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}


function csvValue(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}


function saveCurrentSession() {
  const events =
    getVisibleEvents();

  const rows = [
    ["Section", "Field", "Value"],
    ["Overview", "Boss Kills", sessionState.bossKills],
    ["Overview", "EXP Gained", sessionState.expGained],
    ["Overview", "Levels Gained", sessionState.levelsGained],
    ["Overview", "Deaths", sessionState.deaths],
    ["Overview", "EXP Lost", sessionState.expLost],
    ["Overview", "Profit", sessionState.expGained - sessionState.expLost],
    ["Overview", "Active Time", formatActiveDuration(sessionState.activeTimeMs)],
    ["Overview", "Session Started", sessionState.startedAt ? formatActivityTime(sessionState.startedAt) : ""],
    ["Overview", "Last Activity", sessionState.lastActivityAt ? formatActivityTime(sessionState.lastActivityAt) : ""],
    [],
    ["Time", "Type", "Activity", "Detail", "EXP Change"]
  ];

  events.forEach((event) => {
    rows.push([
      formatActivityTime(event.timestamp),
      event.typeLabel,
      event.title,
      event.detail || "",
      event.value === null || event.value === undefined
        ? ""
        : event.value
    ]);
  });

  const csv =
    rows
      .map((row) =>
        row.map(csvValue).join(",")
      )
      .join("\n");

  downloadTextFile(
    getSessionFilename("csv"),
    csv,
    "text/csv;charset=utf-8"
  );

  if (elements.saveSessionButton) {
    const originalText =
      elements.saveSessionButton.textContent;

    elements.saveSessionButton.textContent =
      "Saved ✓";

    window.setTimeout(
      () => {
        elements.saveSessionButton.textContent =
          originalText;
      },
      1200
    );
  }
}


function hasSessionActivity() {
  return (
    sessionState.events.length > 0 ||
    sessionState.bossKills > 0 ||
    sessionState.expGained > 0 ||
    sessionState.deaths > 0 ||
    sessionState.expLost > 0 ||
    sessionState.levelsGained > 0
  );
}


function addSessionToLifetime() {
  if (!hasSessionActivity()) {
    return;
  }

  lifetimeState.bossKills +=
    sessionState.bossKills;

  lifetimeState.expGained +=
    sessionState.expGained;

  lifetimeState.levelsGained +=
    sessionState.levelsGained;

  lifetimeState.deaths +=
    sessionState.deaths;

  lifetimeState.expLost +=
    sessionState.expLost;

  lifetimeState.activeTimeMs +=
    sessionState.activeTimeMs;

  lifetimeState.totalSessions +=
    1;

  saveLifetime();
}


function resetCurrentSession() {
  sessionState.bossKills = 0;
  sessionState.expGained = 0;
  sessionState.levelsGained = 0;
  sessionState.deaths = 0;
  sessionState.expLost = 0;
  sessionState.activeTimeMs = 0;
  sessionState.startedAt = null;
  sessionState.lastActivityAt = null;
  sessionState.events = [];

  saveSession();

  renderSessionTracking();
  renderLifetimeStats();
}


function confirmResetSession(shouldSaveFirst = false) {
  if (shouldSaveFirst) {
    saveCurrentSession();
  }

  addSessionToLifetime();
  resetCurrentSession();
  closeResetSessionModal();
}


function subtractSessionDelta(delta) {
  if (!delta) {
    return;
  }

  sessionState.bossKills =
    Math.max(0, sessionState.bossKills - (Number(delta.bossKills) || 0));

  sessionState.expGained =
    Math.max(0, sessionState.expGained - (Number(delta.expGained) || 0));

  sessionState.levelsGained =
    Math.max(0, sessionState.levelsGained - (Number(delta.levelsGained) || 0));

  sessionState.deaths =
    Math.max(0, sessionState.deaths - (Number(delta.deaths) || 0));

  sessionState.expLost =
    Math.max(0, sessionState.expLost - (Number(delta.expLost) || 0));
}


function applyExpToProgress(level, exp, gainedExp) {
  let currentLevel =
    level;

  let currentExp =
    exp + gainedExp;

  while (
    currentLevel < MAX_LEVEL
  ) {
    const requirement =
      getLevelExp(currentLevel);

    if (
      currentExp <
      requirement
    ) {
      break;
    }

    currentExp -= requirement;
    currentLevel += 1;
  }

  return {
    level: currentLevel,
    exp: Math.floor(currentExp)
  };
}


function recalculateProgressFromActivities() {
  const primaryEvents =
    sessionState.events
      .filter(
        (event) =>
          event.primaryAction &&
          event.snapshotBefore
      )
      .sort(
        (a, b) =>
          a.timestamp - b.timestamp
      );

  if (primaryEvents.length === 0) {
    return;
  }

  let progress = {
    level:
      Number(primaryEvents[0].snapshotBefore.level) || 1,
    exp:
      Number(primaryEvents[0].snapshotBefore.exp) || 0
  };

  primaryEvents.forEach((event) => {
    if (event.undone) {
      return;
    }

    if (
      event.actionType === "kill" ||
      event.actionType === "manual-level"
    ) {
      progress =
        applyExpToProgress(
          progress.level,
          progress.exp,
          Number(event.value) || 0
        );

      return;
    }

    if (event.actionType === "death") {
      const preservation =
        getPreservationData(
          progress.level
        );

      progress.exp =
        Math.min(
          progress.exp,
          preservation.floor
        );
    }
  });

  elements.currentLevel.value =
    String(progress.level);

  elements.currentExp.value =
    String(progress.exp);

  saveSettings();
  updatePreservationDisplay();
  recalculateIfReady();
}


function undoActivity(activityId) {
  const matchingEvents =
    sessionState.events.filter(
      (event) =>
        event.activityId === activityId
    );

  if (matchingEvents.length === 0) {
    return;
  }

  const primaryEvent =
    matchingEvents.find(
      (event) => event.primaryAction
    ) ||
    matchingEvents[0];

  if (
    primaryEvent.undone ||
    !primaryEvent.primaryAction
  ) {
    return;
  }

  subtractSessionDelta(
    primaryEvent.statDelta
  );

  matchingEvents.forEach((event) => {
    event.undone = true;
    event.undoneAt = Date.now();
  });

  recalculateProgressFromActivities();

  saveSession();

  renderSessionTracking();
  renderUndoActivityList();
}


function makeUndoActivityEntry(event) {
  const valueText =
    event.value === null || event.value === undefined
      ? ""
      : `${event.value > 0 ? "+" : ""}${numberFormatter.format(event.value)} EXP`;

  const canUndo =
    event.activityId &&
    !event.undone &&
    event.primaryAction;

  return `
    <div class="exp-undo-entry ${event.undone ? "undone" : ""}">
      <div>
        <span class="exp-undo-time">${escapeActivityHtml(formatActivityTime(event.timestamp))}</span>
        <strong>${escapeActivityHtml(event.typeLabel)}</strong>
        <span>${escapeActivityHtml(event.title)}</span>
      </div>

      <span class="${event.value < 0 ? "negative" : event.value > 0 ? "positive" : ""}">
        ${escapeActivityHtml(valueText)}
      </span>

      <button
        type="button"
        class="exp-undo-entry-button"
        data-undo-activity-id="${escapeActivityHtml(event.activityId || "")}"
        ${canUndo ? "" : "disabled"}
      >
        ${event.undone ? "Undone" : canUndo ? "Undo" : "Locked"}
      </button>
    </div>
  `;
}


function renderUndoActivityList() {
  if (
    !elements.undoActivityList ||
    !elements.undoActivityEmpty
  ) {
    return;
  }

  const newestFirst =
    [...sessionState.events]
      .reverse();

  if (newestFirst.length === 0) {
    elements.undoActivityList.innerHTML =
      "";

    elements.undoActivityEmpty.classList.remove(
      "hidden"
    );

    if (elements.undoActivityShowMore) {
      elements.undoActivityShowMore.hidden =
        true;
    }

    return;
  }

  elements.undoActivityEmpty.classList.add(
    "hidden"
  );

  const visible =
    newestFirst.slice(
      0,
      undoVisibleCount
    );

  elements.undoActivityList.innerHTML =
    visible
      .map(makeUndoActivityEntry)
      .join("");

  elements
    .undoActivityList
    .querySelectorAll(
      ".exp-undo-entry-button"
    )
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          undoActivity(
            button.dataset.undoActivityId
          );
        }
      );
    });

  if (elements.undoActivityShowMore) {
    elements.undoActivityShowMore.hidden =
      undoVisibleCount >=
      newestFirst.length;
  }
}


function openUndoActivityModal() {
  undoVisibleCount =
    20;

  renderUndoActivityList();

  if (elements.undoActivityModal) {
    elements.undoActivityModal.hidden =
      false;
  }
}


function closeUndoActivityModal() {
  if (elements.undoActivityModal) {
    elements.undoActivityModal.hidden =
      true;
  }
}


// =========================================
// Session Persistence
// =========================================

function saveSession() {
  try {
    localStorage.setItem(
      STORAGE_KEYS.session,
      JSON.stringify(sessionState)
    );
  } catch (error) {
    console.warn(
      "Could not save session:",
      error
    );
  }
}


function loadSession() {
  try {
    const saved =
      localStorage.getItem(
        STORAGE_KEYS.session
      );

    if (!saved) {
      return;
    }

    const data =
      JSON.parse(saved);

    sessionState.bossKills =
      Number(data.bossKills) || 0;

    sessionState.expGained =
      Number(data.expGained) || 0;

    sessionState.levelsGained =
      Number(data.levelsGained) || 0;

    sessionState.deaths =
      Number(data.deaths) || 0;

    sessionState.expLost =
      Number(data.expLost) || 0;

    sessionState.activeTimeMs =
      Number(data.activeTimeMs) || 0;

    sessionState.startedAt =
      data.startedAt || null;

    sessionState.lastActivityAt =
      data.lastActivityAt || null;

    sessionState.events =
      Array.isArray(data.events)
        ? data.events
        : [];

  } catch (error) {
    console.warn(
      "Could not load session:",
      error
    );
  }
}
  


function saveLifetime() {
  try {
    localStorage.setItem(
      STORAGE_KEYS.lifetime,
      JSON.stringify(lifetimeState)
    );
  } catch (error) {
    console.warn(
      "Could not save lifetime stats:",
      error
    );
  }
}


function loadLifetime() {
  try {
    const saved =
      localStorage.getItem(
        STORAGE_KEYS.lifetime
      );

    if (!saved) {
      return;
    }

    const data =
      JSON.parse(saved);

    lifetimeState.bossKills =
      Number(data.bossKills) || 0;

    lifetimeState.expGained =
      Number(data.expGained) || 0;

    lifetimeState.levelsGained =
      Number(data.levelsGained) || 0;

    lifetimeState.deaths =
      Number(data.deaths) || 0;

    lifetimeState.expLost =
      Number(data.expLost) || 0;

    lifetimeState.activeTimeMs =
      Number(data.activeTimeMs) || 0;

    lifetimeState.totalSessions =
      Number(data.totalSessions) || 0;

  } catch (error) {
    console.warn(
      "Could not load lifetime stats:",
      error
    );
  }
}


// =========================================
// Initialization
// =========================================

loadSavedSettings();

loadLifetime();

loadSession();

renderSessionTracking();

renderLifetimeStats();

})();