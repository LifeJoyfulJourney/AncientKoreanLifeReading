const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const readingForm = document.querySelector(".reading-form");
const premiumButton = document.querySelector(".premium-button");
const premiumCards = document.querySelectorAll(".premium-card");
const symbolGrid = document.querySelector("[data-symbol-grid]");
const symbolSearch = document.querySelector("#symbol-search");
const symbolCount = document.querySelector("[data-symbol-count]");
const resultCard = document.querySelector(".result-card");
const copyReadingButton = document.querySelector("[data-copy-reading]");
const tryAnotherButton = document.querySelector("[data-try-another]");
const scrollTopButton = document.querySelector("[data-scroll-top]");
const formMessage = document.querySelector("[data-form-message]");
const calendarInputs = document.querySelectorAll('input[name="calendarType"]');
const leapMonthLabel = document.querySelector(".checkbox-label");
const birthYearInput = document.querySelector('input[name="birthYear"]');
const birthMonthInput = document.querySelector('input[name="birthMonth"]');
const birthDayInput = document.querySelector('input[name="birthDay"]');
const leapMonthInput = document.querySelector('input[name="leapMonth"]');
const targetYearInput = document.querySelector('input[name="targetYear"]');
let tojeongData = [];
let selectedReading = null;
let observer;
let searchDebounceId;
let renderBatchId;

const STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const HEAVENLY_STEM_NUMBER = { 甲: 9, 乙: 8, 丙: 7, 丁: 6, 戊: 5, 己: 9, 庚: 8, 辛: 7, 壬: 6, 癸: 5 };
const TAESE_BRANCH_NUMBER = { 子: 11, 丑: 13, 寅: 10, 卯: 10, 辰: 13, 巳: 9, 午: 9, 未: 13, 申: 12, 酉: 12, 戌: 13, 亥: 11 };
const WOLGEON_BRANCH_NUMBER = { 子: 9, 丑: 8, 寅: 7, 卯: 6, 辰: 5, 巳: 4, 午: 9, 未: 8, 申: 7, 酉: 6, 戌: 5, 亥: 4 };
const ILJIN_BRANCH_NUMBER = { 子: 9, 丑: 11, 寅: 8, 卯: 8, 辰: 11, 巳: 7, 午: 7, 未: 11, 申: 10, 酉: 10, 戌: 11, 亥: 9 };

// Embedded Korean lunar calendar data, 1900-2050. This keeps Phase 3 static and offline.
const LUNAR_INFO = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
  0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
  0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
  0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0, 0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0,
  0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
  0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6,
  0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
  0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
  0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
  0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
  0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
  0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,
  0x14b63
];

function scrollToTarget(selector) {
  const target = document.querySelector(selector);
  if (!target) return;

  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

function formatDateParts({ year, month, day }) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function showMessage(message, type = "info") {
  formMessage.textContent = message;
  formMessage.dataset.type = type;
}

function storageGet(key) {
  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    return null;
  }
}

function storageSet(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch (error) {
    // Storage can be unavailable in private browsing; the app still works without it.
  }
}

function leapMonth(year) {
  return LUNAR_INFO[year - 1900] & 0xf;
}

function leapDays(year) {
  return leapMonth(year) ? (LUNAR_INFO[year - 1900] & 0x10000 ? 30 : 29) : 0;
}

function lunarMonthDays(year, month) {
  return LUNAR_INFO[year - 1900] & (0x10000 >> month) ? 30 : 29;
}

function lunarYearDays(year) {
  let sum = 348;
  for (let bit = 0x8000; bit > 0x8; bit >>= 1) {
    sum += LUNAR_INFO[year - 1900] & bit ? 1 : 0;
  }
  return sum + leapDays(year);
}

function isSupportedYear(year) {
  return Number.isInteger(year) && year >= 1900 && year <= 2050;
}

function solarToLunar(year, month, day) {
  if (!isSupportedYear(year)) return null;
  const entered = new Date(Date.UTC(year, month - 1, day));
  if (entered.getUTCFullYear() !== year || entered.getUTCMonth() + 1 !== month || entered.getUTCDate() !== day) {
    return null;
  }

  let offset = Math.floor((entered - Date.UTC(1900, 0, 31)) / 86400000);
  if (offset < 0) return null;

  let lunarYear = 1900;
  while (lunarYear <= 2050 && offset >= lunarYearDays(lunarYear)) {
    offset -= lunarYearDays(lunarYear);
    lunarYear += 1;
  }
  if (!isSupportedYear(lunarYear)) return null;

  const leap = leapMonth(lunarYear);
  let isLeap = false;
  let lunarMonth = 1;

  while (lunarMonth <= 12) {
    let days;
    if (leap > 0 && lunarMonth === leap + 1 && !isLeap) {
      lunarMonth -= 1;
      isLeap = true;
      days = leapDays(lunarYear);
    } else {
      days = lunarMonthDays(lunarYear, lunarMonth);
    }
    if (offset < days) break;
    offset -= days;
    if (isLeap && lunarMonth === leap) isLeap = false;
    lunarMonth += 1;
  }

  return { year: lunarYear, month: lunarMonth, day: offset + 1, isLeap };
}

function lunarToSolar(year, month, day, isLeap = false) {
  if (!isSupportedYear(year) || month < 1 || month > 12) return null;
  const leap = leapMonth(year);
  if (isLeap && leap !== month) return null;
  const maxDay = isLeap ? leapDays(year) : lunarMonthDays(year, month);
  if (day < 1 || day > maxDay) return null;

  let offset = 0;
  for (let y = 1900; y < year; y += 1) offset += lunarYearDays(y);
  for (let m = 1; m < month; m += 1) {
    offset += lunarMonthDays(year, m);
    if (m === leap) offset += leapDays(year);
  }
  if (isLeap) offset += lunarMonthDays(year, month);
  const date = new Date(Date.UTC(1900, 0, 31 + offset + day - 1));
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() };
}

function ganjiFromIndex(index) {
  const normalized = ((index % 60) + 60) % 60;
  return { stem: STEMS[normalized % 10], branch: BRANCHES[normalized % 12], label: `${STEMS[normalized % 10]}${BRANCHES[normalized % 12]}` };
}

function yearGanji(year) {
  return ganjiFromIndex(year - 4);
}

function monthGanji(year, lunarMonth) {
  const yearStemIndex = (year - 4) % 10;
  const firstMonthStemIndex = (yearStemIndex * 2 + 2) % 10;
  const stemIndex = (firstMonthStemIndex + lunarMonth - 1) % 10;
  const branchIndex = (lunarMonth + 1) % 12;
  return { stem: STEMS[stemIndex], branch: BRANCHES[branchIndex], label: `${STEMS[stemIndex]}${BRANCHES[branchIndex]}` };
}

function julianDayNumber(year, month, day) {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const century = Math.floor(y / 100);
  const correction = 2 - century + Math.floor(century / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + correction - 1524;
}

function dayGanji(solarDate) {
  return ganjiFromIndex(julianDayNumber(solarDate.year, solarDate.month, solarDate.day) + 49);
}

function calculateTojeong({ calendarType, birthYear, birthMonth, birthDay, isLeapMonth, targetYear }) {
  let lunarBirth;
  if (calendarType === "solar") {
    lunarBirth = solarToLunar(birthYear, birthMonth, birthDay);
    if (!lunarBirth) {
      throw new Error("Traditional Tojeong Bigyeol uses lunar birth dates. We could not convert this solar date safely. Please enter your lunar birthday directly.");
    }
  } else {
    if (!isSupportedYear(birthYear)) throw new Error("Please enter a lunar birth year from 1900 to 2050.");
    const monthLength = isLeapMonth ? leapDays(birthYear) : lunarMonthDays(birthYear, birthMonth);
    if (birthMonth < 1 || birthMonth > 12 || birthDay < 1 || birthDay > monthLength) throw new Error("Please enter a valid lunar birth date.");
    if (isLeapMonth && leapMonth(birthYear) !== birthMonth) throw new Error("That year does not have a leap lunar month for the selected month.");
    lunarBirth = { year: birthYear, month: birthMonth, day: birthDay, isLeap: isLeapMonth };
  }

  if (!isSupportedYear(targetYear)) throw new Error("Please enter a target year from 1900 to 2050.");
  const targetLeapMonth = lunarBirth.isLeap && leapMonth(targetYear) === lunarBirth.month;
  const targetMonthLength = targetLeapMonth ? leapDays(targetYear) : lunarMonthDays(targetYear, lunarBirth.month);
  const targetDay = Math.min(lunarBirth.day, targetMonthLength);
  const targetSolarDate = lunarToSolar(targetYear, lunarBirth.month, targetDay, targetLeapMonth);
  if (!targetSolarDate) throw new Error("We could not locate the matching lunar birthday in the target year.");

  const targetYearGanji = yearGanji(targetYear);
  const targetMonthGanji = monthGanji(targetYear, lunarBirth.month);
  const targetDayGanji = dayGanji(targetSolarDate);
  const taeSeNumber = HEAVENLY_STEM_NUMBER[targetYearGanji.stem] + TAESE_BRANCH_NUMBER[targetYearGanji.branch];
  const wolgeonNumber = HEAVENLY_STEM_NUMBER[targetMonthGanji.stem] + WOLGEON_BRANCH_NUMBER[targetMonthGanji.branch];
  const iljinNumber = HEAVENLY_STEM_NUMBER[targetDayGanji.stem] + ILJIN_BRANCH_NUMBER[targetDayGanji.branch];

  // Tojeong Bigyeol uses lunar birth date.
  // Korean age must use lunar birth year, not the entered solar year.
  const koreanAge = targetYear - lunarBirth.year + 1;
  // Upper gua uses Korean age and taeSeNumber.
  let upper = (koreanAge + taeSeNumber) % 8;
  // Middle gua uses lunar birth month length in the target year and wolgeonNumber.
  let middle = (targetMonthLength + wolgeonNumber) % 6;
  // Lower gua uses lunar birth day and iljinNumber.
  let lower = (lunarBirth.day + iljinNumber) % 3;
  if (upper === 0) upper = 8;
  if (middle === 0) middle = 6;
  if (lower === 0) lower = 3;

  return {
    calendarType,
    originalBirth: { year: birthYear, month: birthMonth, day: birthDay },
    lunarBirth,
    targetYear,
    targetDay,
    targetSolarDate,
    targetMonthLength,
    koreanAge,
    targetYearGanji,
    targetMonthGanji,
    targetDayGanji,
    taeSeNumber,
    wolgeonNumber,
    iljinNumber,
    upper,
    middle,
    lower,
    finalCode: `${upper}${middle}${lower}`
  };
}

function updateDayLimit() {
  const calendarType = document.querySelector('input[name="calendarType"]:checked').value;
  const year = Number(birthYearInput.value);
  const month = Number(birthMonthInput.value);
  leapMonthLabel.hidden = calendarType !== "lunar";
  leapMonthInput.disabled = calendarType !== "lunar";
  if (calendarType !== "lunar") leapMonthInput.checked = false;

  if (calendarType === "solar" && year && month) {
    birthDayInput.max = String(new Date(year, month, 0).getDate());
  } else if (calendarType === "lunar" && isSupportedYear(year) && month >= 1 && month <= 12) {
    const max = leapMonthInput.checked ? leapDays(year) : lunarMonthDays(year, month);
    birthDayInput.max = String(max || 30);
  } else {
    birthDayInput.max = "31";
  }

  if (Number(birthDayInput.value) > Number(birthDayInput.max)) {
    birthDayInput.value = birthDayInput.max;
  }
}

function createCard(record) {
  const card = document.createElement("article");
  card.className = "symbol-card reveal";
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", `Open reading ${record.code}, ${record.symbol_title_en}`);
  card.dataset.code = record.code;
  card.innerHTML = `
    <span>${record.code}</span>
    <h3>${record.symbol_title_en}</h3>
    <p class="hanja">${record.hanja}</p>
    <p>${record.core_theme_en}</p>
    <div class="tag-row">${record.tags.map((tag) => `<small>${tag}</small>`).join("")}</div>
  `;

  return card;
}

function readingToText(record) {
  const months = Object.entries(record.monthly_en)
    .map(([month, text]) => `${month}. ${text}`)
    .join("\n");

  return [
    `Ancient Korean Life Reading`,
    `Code: ${record.code}`,
    `Symbol: ${record.symbol_title_en}`,
    `Hanja: ${record.hanja}`,
    `Korean Reading: ${record.korean_reading}`,
    `Korean Meaning: ${record.korean_meaning}`,
    `Literal English: ${record.literal_en}`,
    `Theme: ${record.core_theme_en}`,
    "",
    record.full_reading_en,
    "",
    `Career: ${record.career_en}`,
    `Money: ${record.money_en}`,
    `Love: ${record.love_en}`,
    `Health: ${record.health_en}`,
    `Warning: ${record.warning_en}`,
    "",
    `Monthly Guide:`,
    months,
    "",
    record.disclaimer_en
  ].join("\n");
}

function setText(selector, value) {
  const target = document.querySelector(selector);
  if (target) target.textContent = value;
}

function setCalculationDetails(details) {
  const detailsPanel = document.querySelector("[data-calculation-details]");
  if (!details) {
    detailsPanel.hidden = true;
    return;
  }

  detailsPanel.hidden = false;
  setText("[data-calc-calendar]", details.calendarType === "solar" ? "Solar" : "Lunar");
  setText("[data-calc-original]", formatDateParts(details.originalBirth));
  setText("[data-calc-lunar]", formatDateParts(details.lunarBirth));
  setText("[data-calc-leap]", details.lunarBirth.isLeap ? "Yes" : "No");
  setText("[data-calc-target-year]", String(details.targetYear));
  setText("[data-calc-age]", String(details.koreanAge));
  setText("[data-calc-year-ganji]", details.targetYearGanji.label);
  setText("[data-calc-month-ganji]", details.targetMonthGanji.label);
  setText("[data-calc-day-ganji]", details.targetDayGanji.label);
  setText("[data-calc-taese]", String(details.taeSeNumber));
  setText("[data-calc-wolgeon]", String(details.wolgeonNumber));
  setText("[data-calc-iljin]", String(details.iljinNumber));
  setText("[data-calc-upper]", String(details.upper));
  setText("[data-calc-middle]", String(details.middle));
  setText("[data-calc-lower]", String(details.lower));
  setText("[data-calc-code]", details.finalCode);
}

function openReading(record, calculationDetails = null) {
  selectedReading = record;
  storageSet("aklr:lastSymbol", record.code);

  document.querySelectorAll(".symbol-card.is-selected").forEach((card) => {
    card.classList.remove("is-selected");
  });

  const selectedCard = document.querySelector(`.symbol-card[data-code="${record.code}"]`);
  if (selectedCard) selectedCard.classList.add("is-selected");

  setText("[data-result-code]", record.code);
  setText("[data-result-symbol]", record.symbol_title_en);
  setText("[data-result-hanja]", record.hanja);
  setText("[data-result-korean-reading]", record.korean_reading);
  setText("[data-result-korean-meaning]", record.korean_meaning);
  setText("[data-result-literal]", record.literal_en);
  setText("[data-result-theme]", record.core_theme_en);
  setText("[data-reading-summary]", record.short_summary_en);
  setText("[data-reading-full]", record.full_reading_en);
  setText("[data-reading-career]", record.career_en);
  setText("[data-reading-money]", record.money_en);
  setText("[data-reading-love]", record.love_en);
  setText("[data-reading-health]", record.health_en);
  setText("[data-reading-warning]", record.warning_en);
  setText("[data-reading-disclaimer]", record.disclaimer_en);

  const monthlyList = document.querySelector("[data-reading-monthly]");
  monthlyList.innerHTML = Object.entries(record.monthly_en)
    .map(([month, text]) => `<li><span>${month}</span>${text}</li>`)
    .join("");

  document.querySelector("[data-reading-detail]").hidden = false;
  setCalculationDetails(calculationDetails);
  resultCard.classList.remove("is-visible");
  window.setTimeout(() => {
    resultCard.classList.add("is-visible");
    scrollToTarget("#result");
  }, 120);
}

function matchesSearch(record, query) {
  if (!query) return true;

  const searchable = [
    record.code,
    record.hanja,
    record.korean_reading,
    record.symbol_title_en,
    record.core_theme_en,
    record.tags.join(" ")
  ]
    .join(" ")
    .toLowerCase();

  return searchable.includes(query.toLowerCase());
}

function renderSymbols(records) {
  symbolGrid.innerHTML = "";
  symbolCount.textContent = String(records.length);

  if (!records.length) {
    symbolGrid.innerHTML = '<p class="loading-message">No symbols match this search. Try a code, Hanja, Korean reading, English title, or tag.</p>';
    return;
  }

  window.cancelAnimationFrame(renderBatchId);
  let index = 0;
  const batchSize = 24;

  function renderBatch() {
    const fragment = document.createDocumentFragment();
    const limit = Math.min(index + batchSize, records.length);

    for (; index < limit; index += 1) {
      fragment.appendChild(createCard(records[index]));
    }

    symbolGrid.appendChild(fragment);
    observeRevealItems(symbolGrid.querySelectorAll(".symbol-card:not(.is-observed)"));

    if (index < records.length) {
      renderBatchId = window.requestAnimationFrame(renderBatch);
    }
  }

  renderBatch();
}

function filterSymbols() {
  const query = symbolSearch.value.trim();
  renderSymbols(tojeongData.filter((record) => matchesSearch(record, query)));
}

function debounceFilterSymbols() {
  window.clearTimeout(searchDebounceId);
  searchDebounceId = window.setTimeout(filterSymbols, 120);
}

async function loadTojeongData() {
  try {
    const response = await fetch("data/tojeong-gua.json");
    if (!response.ok) throw new Error("Unable to load Tojeong data.");
    tojeongData = await response.json();
    renderSymbols(tojeongData);
  } catch (error) {
    symbolGrid.innerHTML = '<p class="loading-message">The symbol database could not be loaded.</p>';
  }
}

function setActiveNav() {
  const sections = [...document.querySelectorAll("main section[id]")];
  const passedSections = sections.filter((section) => section.getBoundingClientRect().top <= 110);
  const active = passedSections[passedSections.length - 1];

  document.querySelectorAll(".site-nav a").forEach((link) => {
    link.classList.toggle("is-active", Boolean(active && link.getAttribute("href") === `#${active.id}`));
  });

  scrollTopButton.classList.toggle("is-visible", window.scrollY > 700);
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    if (!targetId || targetId === "#") return;

    event.preventDefault();
    scrollToTarget(targetId);
    siteNav.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

navToggle.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("is-open");
  document.body.classList.toggle("nav-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

readingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  showMessage("Calculating your traditional symbolic code...", "info");
  readingForm.classList.add("is-calculating");

  window.setTimeout(() => {
    try {
      if (!tojeongData.length) throw new Error("The symbolic reading database is still loading. Please try again in a moment.");

      const calculation = calculateTojeong({
        calendarType: document.querySelector('input[name="calendarType"]:checked').value,
        birthYear: Number(birthYearInput.value),
        birthMonth: Number(birthMonthInput.value),
        birthDay: Number(birthDayInput.value),
        isLeapMonth: leapMonthInput.checked,
        targetYear: Number(targetYearInput.value)
      });
      const record = tojeongData.find((item) => item.code === calculation.finalCode);
      if (!record) throw new Error(`The generated code ${calculation.finalCode} is not in the 144-symbol database.`);

      storageSet("aklr:lastTargetYear", String(calculation.targetYear));
      showMessage(`Calculated code ${calculation.finalCode}.`, "success");
      openReading(record, calculation);
    } catch (error) {
      showMessage(error.message, "error");
      scrollToTarget("#result");
    } finally {
      readingForm.classList.remove("is-calculating");
    }
  }, 160);
});

premiumCards.forEach((card) => {
  card.addEventListener("pointerenter", () => card.classList.add("is-active"));
  card.addEventListener("pointerleave", () => card.classList.remove("is-active"));
  card.addEventListener("click", () => card.classList.toggle("is-active"));
});

premiumButton.addEventListener("click", () => {
  window.alert("Payment integration coming soon.");
});

symbolGrid.addEventListener("click", (event) => {
  const card = event.target.closest(".symbol-card");
  if (!card) return;
  const record = tojeongData.find((item) => item.code === card.dataset.code);
  if (record) openReading(record);
});

symbolGrid.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const card = event.target.closest(".symbol-card");
  if (!card) return;
  event.preventDefault();
  const record = tojeongData.find((item) => item.code === card.dataset.code);
  if (record) openReading(record);
});

copyReadingButton.addEventListener("click", async () => {
  if (!selectedReading) {
    window.alert("Choose or calculate a symbol first.");
    return;
  }

  const text = readingToText(selectedReading);

  try {
    await navigator.clipboard.writeText(text);
    copyReadingButton.textContent = "Reading Copied";
    window.setTimeout(() => {
      copyReadingButton.textContent = "Copy My Reading";
    }, 1800);
  } catch (error) {
    window.prompt("Copy your reading:", text);
  }
});

tryAnotherButton.addEventListener("click", () => {
  scrollToTarget("#symbols");
  symbolSearch.focus({ preventScroll: true });
});

symbolSearch.addEventListener("input", debounceFilterSymbols);
calendarInputs.forEach((input) => input.addEventListener("change", updateDayLimit));
[birthYearInput, birthMonthInput, birthDayInput, leapMonthInput].forEach((input) => {
  input.addEventListener("input", updateDayLimit);
  input.addEventListener("change", updateDayLimit);
});
targetYearInput.addEventListener("change", () => storageSet("aklr:lastTargetYear", targetYearInput.value));
scrollTopButton.addEventListener("click", () => scrollToTarget("#hero"));
window.addEventListener("scroll", setActiveNav, { passive: true });

observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

function observeRevealItems(items) {
  items.forEach((item) => {
    item.classList.add("is-observed");
    observer.observe(item);
  });
}

// Reference checks for Phase 3:
// Test 1: Solar 2000-01-01 -> Lunar 1999-11-25, target 2023 -> Korean age 25.
// Test 2: Lunar 1988-06-09, target 2023 -> year ganji 癸卯, age 36, code 343.
// The calculation should be tested against multiple traditional reference examples before commercial launch.
window.tojeongPhase3SelfTest = function tojeongPhase3SelfTest() {
  const test1Lunar = solarToLunar(2000, 1, 1);
  const test1 = calculateTojeong({
    calendarType: "solar",
    birthYear: 2000,
    birthMonth: 1,
    birthDay: 1,
    isLeapMonth: false,
    targetYear: 2023
  });
  const test2 = calculateTojeong({
    calendarType: "lunar",
    birthYear: 1988,
    birthMonth: 6,
    birthDay: 9,
    isLeapMonth: false,
    targetYear: 2023
  });

  return {
    test1: {
      convertedLunar: formatDateParts(test1Lunar),
      expectedLunar: "1999-11-25",
      koreanAge: test1.koreanAge,
      expectedKoreanAge: 25,
      pass: formatDateParts(test1Lunar) === "1999-11-25" && test1.koreanAge === 25
    },
    test2: {
      targetYearGanji: test2.targetYearGanji.label,
      koreanAge: test2.koreanAge,
      upper: test2.upper,
      middle: test2.middle,
      lower: test2.lower,
      finalCode: test2.finalCode,
      pass:
        test2.targetYearGanji.label === "癸卯" &&
        test2.koreanAge === 36 &&
        test2.upper === 3 &&
        test2.middle === 4 &&
        test2.lower === 3 &&
        test2.finalCode === "343"
    }
  };
};

observeRevealItems(document.querySelectorAll(".reveal"));
targetYearInput.value = storageGet("aklr:lastTargetYear") || targetYearInput.value;
updateDayLimit();
setActiveNav();
loadTojeongData();
