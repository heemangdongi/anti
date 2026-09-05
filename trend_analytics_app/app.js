// ============================================================================
// ⚡ trend_analytics_app/app.js
// 글로벌 숏폼 떡상 채널 정밀 분석기 - 상단 박스형 필터, 자동완성, 테마 연동 엔진
// ============================================================================

import { INITIAL_CHANNELS_DB } from "./channels_db.js";

// ============================================================================
// 1. 상태 변수
// ============================================================================
let allChannels = [];
let currentViewMode = "card";
let currentSort = "ratio_desc";

// 키워드 자동완성 풀(Pool)
let keywordPool = [];

// DOM 요소 참조
const htmlRoot = document.documentElement;
const btnThemeToggle = document.getElementById("btnThemeToggle");
const themeIcon = document.getElementById("themeIcon");
const themeText = document.getElementById("themeText");

const platformCheckboxes = document.querySelectorAll(".platform-check");
const keywordInput = document.getElementById("keywordInput");
const btnClearKeyword = document.getElementById("btnClearKeyword");
const autocompleteDropdown = document.getElementById("autocompleteDropdown");
const dropdownItemsList = document.getElementById("dropdownItemsList");
const quickKeywords = document.querySelectorAll(".chip-keyword");

const inputMinRatio = document.getElementById("inputMinRatio");
const inputMinViews = document.getElementById("inputMinViews");
const inputMinSubs = document.getElementById("inputMinSubs");
const inputMinLikes = document.getElementById("inputMinLikes");
const inputLimitCount = document.getElementById("inputLimitCount");

const btnSearchTrigger = document.getElementById("btnSearchTrigger");
const btnResetFilters = document.getElementById("btnResetFilters");

const resultCount = document.getElementById("resultCount");
const avgRatioVal = document.getElementById("avgRatioVal");
const selectSort = document.getElementById("selectSort");
const btnViewCard = document.getElementById("btnViewCard");
const btnViewTable = document.getElementById("btnViewTable");
const btnExportCsv = document.getElementById("btnExportCsv");

const channelsGrid = document.getElementById("channelsGrid");
const tableWrapper = document.getElementById("tableWrapper");
const tableBody = document.getElementById("tableBody");
const emptyBox = document.getElementById("emptyBox");

// ============================================================================
// 2. 초기화 (Init)
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
  // 1) 테마 초기화 (시스템 밝기 감지 + 저장된 설정 로드)
  initTheme();

  // 2) 채널 DB 로드 및 떡상 비율 계산
  allChannels = INITIAL_CHANNELS_DB.map((ch) => {
    const ratio = ch.subscribers > 0 ? Math.round((ch.avgViews / ch.subscribers) * 100) : 0;
    return { ...ch, ratio };
  });

  // 3) 추천 키워드 풀 구축
  buildKeywordPool();

  // 4) 이벤트 리스너 등록
  bindEvents();

  // 5) 초기 1회 탐색 렌더링
  executeSearch();
});

// ============================================================================
// 3. 테마 관리 (시스템 밝기 연동 + 수동 토글)
// ============================================================================
function initTheme() {
  const savedTheme = localStorage.getItem("app_theme");

  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    // 시스템 OS 밝기 설정 감지
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");
  }

  // 시스템 밝기 변경 실시간 리스너
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!localStorage.getItem("app_theme")) {
      setTheme(e.matches ? "dark" : "light");
    }
  });

  // 테마 토글 버튼 클릭
  btnThemeToggle.addEventListener("click", () => {
    const currentTheme = htmlRoot.getAttribute("data-theme");
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("app_theme", nextTheme);
  });
}

function setTheme(theme) {
  htmlRoot.setAttribute("data-theme", theme);
  if (theme === "dark") {
    themeIcon.textContent = "☀️";
    themeText.textContent = "밝은 모드";
  } else {
    themeIcon.textContent = "🌙";
    themeText.textContent = "다크 모드";
  }
}

// ============================================================================
// 4. 키워드 풀 구축 & 실시간 자동완성 추천
// ============================================================================
function buildKeywordPool() {
  const set = new Set();
  allChannels.forEach((ch) => {
    ch.tags.forEach((t) => set.add(t));
    set.add(ch.category);
    // 주요 키워드 추출
    if (ch.name) set.add(ch.name.split(" ")[0]);
  });
  keywordPool = Array.from(set).filter((k) => k && k.length >= 2);
}

function handleKeywordInput() {
  const rawText = keywordInput.value;
  btnClearKeyword.style.display = rawText ? "block" : "none";

  if (!rawText.trim()) {
    closeAutocomplete();
    return;
  }

  // 쉼표로 구분된 마지막 단어 추출
  const tokens = rawText.split(",").map((s) => s.trim());
  const lastToken = tokens[tokens.length - 1].toLowerCase();

  if (!lastToken) {
    closeAutocomplete();
    return;
  }

  // 매칭되는 키워드 필터링 (최대 7개)
  const matches = keywordPool
    .filter((kw) => kw.toLowerCase().includes(lastToken))
    .slice(0, 7);

  if (matches.length > 0) {
    renderAutocomplete(matches, tokens);
  } else {
    closeAutocomplete();
  }
}

function renderAutocomplete(matches, currentTokens) {
  dropdownItemsList.innerHTML = "";

  matches.forEach((kw) => {
    const item = document.createElement("div");
    item.className = "dropdown-item";
    item.innerHTML = `
      <span>💡 <strong>${escapeHtml(kw)}</strong></span>
      <span class="dropdown-item-meta">추천 키워드</span>
    `;

    item.addEventListener("click", () => {
      // 마지막 토큰을 클릭한 추천어로 교체
      currentTokens[currentTokens.length - 1] = kw;
      keywordInput.value = currentTokens.join(", ") + ", ";
      keywordInput.focus();
      closeAutocomplete();
    });

    dropdownItemsList.appendChild(item);
  });

  autocompleteDropdown.classList.add("active");
}

function closeAutocomplete() {
  autocompleteDropdown.classList.remove("active");
}

// ============================================================================
// 5. 이벤트 리스너 등록
// ============================================================================
function bindEvents() {
  // 키워드 입력 실시간 감지
  keywordInput.addEventListener("input", handleKeywordInput);

  // 키워드 지우기 버튼
  btnClearKeyword.addEventListener("click", () => {
    keywordInput.value = "";
    btnClearKeyword.style.display = "none";
    closeAutocomplete();
    keywordInput.focus();
  });

  // 키워드 입력창에서 엔터 시 탐색 실행
  keywordInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      closeAutocomplete();
      executeSearch();
    }
  });

  // 바깥 영역 클릭 시 자동완성 닫기
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".keyword-input-wrapper")) {
      closeAutocomplete();
    }
  });

  // 추천 키워드 칩 클릭 (입력창에 쉼표로 자동 추가)
  quickKeywords.forEach((chip) => {
    chip.addEventListener("click", () => {
      const kw = chip.dataset.kw;
      const currentVal = keywordInput.value.trim();
      if (!currentVal) {
        keywordInput.value = kw + ", ";
      } else if (!currentVal.includes(kw)) {
        keywordInput.value = currentVal.replace(/,\s*$/, "") + ", " + kw + ", ";
      }
      btnClearKeyword.style.display = "block";
      keywordInput.focus();
    });
  });

  // 🔍 [조건에 맞는 채널 탐색하기] 버튼 클릭
  btnSearchTrigger.addEventListener("click", executeSearch);

  // 설정 초기화 버튼
  btnResetFilters.addEventListener("click", resetFilters);

  // 정렬 셀렉트 변경
  selectSort.addEventListener("change", (e) => {
    currentSort = e.target.value;
    executeSearch();
  });

  // 카드 / 테이블 뷰 토글
  btnViewCard.addEventListener("click", () => setViewMode("card"));
  btnViewTable.addEventListener("click", () => setViewMode("table"));

  // 엑셀(CSV) 저장
  btnExportCsv.addEventListener("click", exportToCsv);
}

// ============================================================================
// 6. 핵심 탐색 및 정렬 실행 (Search Execution)
// ============================================================================
function executeSearch() {
  closeAutocomplete();

  // 1) 선택된 플랫폼 목록 수집
  const selectedPlatforms = Array.from(platformCheckboxes)
    .filter((cb) => cb.checked)
    .map((cb) => cb.value);

  // 2) 키워드 파싱 (쉼표 또는 공백으로 분리)
  const rawKeywords = keywordInput.value
    .split(",")
    .map((s) => s.trim().replace(/^#/, ""))
    .filter(Boolean);

  // 3) 숫자 인풋 파싱
  const minRatio = Number(inputMinRatio.value) || 0;
  const minViews = Number(inputMinViews.value) || 0;
  const minSubs = Number(inputMinSubs.value) || 0;
  const minLikes = Number(inputMinLikes.value) || 0;
  const limitCount = Number(inputLimitCount.value) || 20;

  // 4) 필터링
  let results = allChannels.filter((ch) => {
    // 플랫폼 체크
    if (!selectedPlatforms.includes(ch.platform)) return false;

    // 수치 필터
    if (ch.ratio < minRatio) return false;
    if (ch.avgViews < minViews) return false;
    if (ch.subscribers < minSubs) return false;
    if (ch.likes < minLikes) return false;

    // 키워드 중복 필터 (입력된 키워드 중 하나라도 포함되면 통과)
    if (rawKeywords.length > 0) {
      const searchBlob = (
        ch.name +
        " " +
        ch.category +
        " " +
        ch.highlight +
        " " +
        ch.tags.join(" ")
      ).toLowerCase();

      const matched = rawKeywords.some((kw) => searchBlob.includes(kw.toLowerCase()));
      if (!matched) return false;
    }

    return true;
  });

  // 5) 정렬
  results.sort((a, b) => {
    switch (currentSort) {
      case "ratio_desc":
        return b.ratio - a.ratio; // 떡상 비율 높은 순
      case "views_desc":
        return b.avgViews - a.avgViews; // 조회수 높은 순
      case "sub_asc":
        return a.subscribers - b.subscribers; // 구독자 적은 순 (소형 떡상)
      case "sub_desc":
        return b.subscribers - a.subscribers; // 구독자 많은 순
      case "likes_desc":
        return b.likes - a.likes; // 좋아요 많은 순
      default:
        return b.ratio - a.ratio;
    }
  });

  // 6) 통계 갱신
  resultCount.textContent = results.length;
  if (results.length > 0) {
    const avg = Math.round(results.reduce((sum, c) => sum + c.ratio, 0) / results.length);
    avgRatioVal.textContent = `${avg.toLocaleString()}%`;
  } else {
    avgRatioVal.textContent = "0%";
  }

  // 7) 개수 제한(Limit) 적용 후 렌더링
  const limitedResults = results.slice(0, limitCount);
  renderResults(limitedResults);
}

// ============================================================================
// 7. 결과 렌더링 (카드 뷰 vs 테이블 뷰)
// ============================================================================
function renderResults(channels) {
  if (channels.length === 0) {
    channelsGrid.style.display = "none";
    tableWrapper.style.display = "none";
    emptyBox.style.display = "flex";
    return;
  }

  emptyBox.style.display = "none";

  if (currentViewMode === "card") {
    channelsGrid.style.display = "grid";
    tableWrapper.style.display = "none";
    renderCards(channels);
  } else {
    channelsGrid.style.display = "none";
    tableWrapper.style.display = "block";
    renderTable(channels);
  }
}

function renderCards(channels) {
  channelsGrid.innerHTML = "";

  channels.forEach((ch) => {
    // 떡상 게이지 폭 계산 (최대 2000% 기준)
    const gaugeWidth = Math.min(100, Math.max(10, (ch.ratio / 2000) * 100));

    const card = document.createElement("div");
    card.className = "channel-card";
    card.innerHTML = `
      <div class="card-top">
        <div class="channel-profile-row">
          <div class="channel-avatar">${ch.avatar || "📱"}</div>
          <div class="channel-titles">
            <h3 class="channel-name">${escapeHtml(ch.name)}</h3>
            <span class="channel-handle">${escapeHtml(ch.handle)} · ${escapeHtml(ch.category)}</span>
          </div>
        </div>
        <span class="platform-badge">
          <span>${ch.platformIcon}</span> ${escapeHtml(ch.platformName)}
        </span>
      </div>

      <!-- 🔥 구독자 대비 조회수 (떡상 지수) -->
      <div class="ratio-box">
        <div class="ratio-label-row">
          <span class="ratio-label-text">🔥 구독자 대비 조회수 (떡상 지수)</span>
          <span class="ratio-value-text">
            ${ch.ratio >= 500 ? "⚡" : ""} ${ch.ratio.toLocaleString()}%
          </span>
        </div>
        <div class="ratio-bar-track">
          <div class="ratio-bar-fill" style="width: ${gaugeWidth}%;"></div>
        </div>
      </div>

      <!-- 4대 정량 지표 (선명한 고대비 수치) -->
      <div class="metrics-grid-card">
        <div class="metric-col">
          <span class="col-label">👥 구독자</span>
          <span class="col-val">${formatNumber(ch.subscribers)}</span>
        </div>
        <div class="metric-col">
          <span class="col-label">👁️ 평균조회수</span>
          <span class="col-val views">${formatNumber(ch.avgViews)}</span>
        </div>
        <div class="metric-col">
          <span class="col-label">❤️ 좋아요</span>
          <span class="col-val">${formatNumber(ch.likes)}</span>
        </div>
        <div class="metric-col">
          <span class="col-label">💬 댓글</span>
          <span class="col-val">${formatNumber(ch.comments)}</span>
        </div>
      </div>

      <!-- 떡상 비결 설명 -->
      <div class="highlight-box">
        💡 <strong>떡상 공식:</strong> ${escapeHtml(ch.highlight)}
      </div>

      <!-- 하단 태그 및 바로가기 -->
      <div class="card-bottom">
        <div class="tags-wrap">
          ${ch.tags.map((t) => `<span class="tag-badge">#${escapeHtml(t)}</span>`).join("")}
        </div>
        <a href="${ch.url}" target="_blank" class="btn-visit">채널 탐색 ↗</a>
      </div>
    `;

    channelsGrid.appendChild(card);
  });
}

function renderTable(channels) {
  tableBody.innerHTML = "";

  channels.forEach((ch, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong style="color: var(--text-primary);">${idx + 1}</strong></td>
      <td>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 20px;">${ch.platformIcon}</span>
          <div>
            <div style="font-weight: 900; color: var(--text-primary); font-size: 14.5px;">${escapeHtml(ch.name)}</div>
            <div style="font-size: 11px; color: var(--text-highlight); font-weight: 700;">${escapeHtml(ch.handle)}</div>
          </div>
        </div>
      </td>
      <td style="font-weight: 700;">${escapeHtml(ch.category)}</td>
      <td style="font-weight: 800; color: var(--text-primary);">${formatNumber(ch.subscribers)}</td>
      <td style="font-weight: 900; color: var(--text-highlight); font-size: 14px;">${formatNumber(ch.avgViews)}</td>
      <td>
        <strong style="color: var(--accent-fire); font-size: 16px;">
          🔥 ${ch.ratio.toLocaleString()}%
        </strong>
      </td>
      <td style="font-weight: 800;">${formatNumber(ch.likes)}</td>
      <td style="font-weight: 800;">${formatNumber(ch.comments)}</td>
      <td>
        <a href="${ch.url}" target="_blank" class="btn-visit" style="padding: 6px 12px; font-size: 11px;">채널 ↗</a>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

// ============================================================================
// 8. 뷰 모드 전환 & 초기화 & 엑셀 다운로드
// ============================================================================
function setViewMode(mode) {
  currentViewMode = mode;
  if (mode === "card") {
    btnViewCard.classList.add("active");
    btnViewTable.classList.remove("active");
  } else {
    btnViewTable.classList.add("active");
    btnViewCard.classList.remove("active");
  }
  executeSearch();
}

function resetFilters() {
  keywordInput.value = "";
  btnClearKeyword.style.display = "none";
  closeAutocomplete();

  inputMinRatio.value = 100;
  inputMinViews.value = 0;
  inputMinSubs.value = 0;
  inputMinLikes.value = 0;
  inputLimitCount.value = 20;

  platformCheckboxes.forEach((cb) => (cb.checked = true));

  executeSearch();
}

function exportToCsv() {
  const selectedPlatforms = Array.from(platformCheckboxes)
    .filter((cb) => cb.checked)
    .map((cb) => cb.value);

  const targets = allChannels.filter((c) => selectedPlatforms.includes(c.platform));
  if (targets.length === 0) {
    alert("내보낼 채널 데이터가 없습니다.");
    return;
  }

  const headers = ["플랫폼", "채널명", "핸들", "카테고리", "구독자수", "평균조회수", "구독자대비조회수비율(%)", "좋아요", "댓글", "태그", "떡상비결", "URL"];
  const rows = targets.map((ch) => [
    `"${ch.platformName}"`,
    `"${ch.name.replace(/"/g, '""')}"`,
    `"${ch.handle}"`,
    `"${ch.category}"`,
    ch.subscribers,
    ch.avgViews,
    ch.ratio,
    ch.likes,
    ch.comments,
    `"${ch.tags.join(", ")}"`,
    `"${ch.highlight.replace(/"/g, '""')}"`,
    `"${ch.url}"`
  ]);

  const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `숏폼_떡상채널_분석리포트_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ============================================================================
// 9. 유틸리티 (수치 포맷 & XSS 방지)
// ============================================================================
function formatNumber(num) {
  if (num >= 100000000) {
    return (num / 100000000).toFixed(1) + "억";
  }
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + "만";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "천";
  }
  return num.toLocaleString();
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
