// ============================================================================
// ⚡ trend_analytics_app/app.js
// 글로벌 숏폼 떡상 채널 정밀 다중 필터 & 통계 분석 엔진
// ============================================================================

import { INITIAL_CHANNELS_DB } from "./channels_db.js";

// ============================================================================
// 1. 상태 관리 (State)
// ============================================================================
let allChannels = [];
let activeTags = ["리프팅"]; // 기본 탐색 태그
let tagSearchMode = "OR"; // "AND" 또는 "OR"
let currentViewMode = "card"; // "card" 또는 "table"
let currentSort = "ratio_desc";

// 필터 상태
const filterState = {
  platforms: {
    douyin: true,
    tiktok: true,
    youtube: true,
    xiaohongshu: true,
    instagram: true,
    threads: true
  },
  minSubs: 0,
  minViews: 0,
  minLikes: 0,
  minComments: 0,
  minRatio: 100 // 최소 100% (구독자 대비 1배 이상)
};

// DOM 요소 참조
const platformCheckboxes = document.querySelectorAll(".platform-check");
const tagContainer = document.getElementById("tagContainer");
const tagInput = document.getElementById("tagInput");
const tagModeRadios = document.querySelectorAll("input[name='tagMode']");
const quickTagChips = document.querySelectorAll(".chip-quick");

// 슬라이더 및 인풋
const sliderRatio = document.getElementById("sliderRatio");
const valRatio = document.getElementById("valRatio");
const sliderViews = document.getElementById("sliderViews");
const valViews = document.getElementById("valViews");
const sliderSubs = document.getElementById("sliderSubs");
const valSubs = document.getElementById("valSubs");
const sliderLikes = document.getElementById("sliderLikes");
const valLikes = document.getElementById("valLikes");
const btnResetFilters = document.getElementById("btnResetFilters");

// 상단 요약 통계
const statTotalChannels = document.getElementById("statTotalChannels");
const statAvgRatio = document.getElementById("statAvgRatio");
const statTopChannel = document.getElementById("statTopChannel");
const statTopSub = document.getElementById("statTopSub");

// 툴바 컨트롤러
const resultCountEl = document.getElementById("resultCount");
const selectSort = document.getElementById("selectSort");
const btnViewCard = document.getElementById("btnViewCard");
const btnViewTable = document.getElementById("btnViewTable");
const btnExportCsv = document.getElementById("btnExportCsv");
const btnOpenAddModal = document.getElementById("btnOpenAddModal");

// 리스트 뷰 영역
const channelsGrid = document.getElementById("channelsGrid");
const tableContainer = document.getElementById("tableContainer");
const tableBody = document.getElementById("tableBody");
const emptyResults = document.getElementById("emptyResults");

// 모달 요소
const addModal = document.getElementById("addModal");
const btnCloseModal = document.getElementById("btnCloseModal");
const formAddChannel = document.getElementById("formAddChannel");

// ============================================================================
// 2. 초기화 (Init)
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
  // 로컬 스토리지에 저장된 커스텀 채널 로드
  const savedCustom = localStorage.getItem("custom_channels");
  const customChannels = savedCustom ? JSON.parse(savedCustom) : [];

  // 초기 DB와 커스텀 채널 병합 및 떡상 비율 계산
  allChannels = [...INITIAL_CHANNELS_DB, ...customChannels].map((ch) => {
    const ratio = ch.subscribers > 0 ? Math.round((ch.avgViews / ch.subscribers) * 100) : 0;
    return { ...ch, ratio };
  });

  // 이벤트 리스너 바인딩
  bindEvents();

  // 초기 렌더링
  renderTags();
  applyFiltersAndRender();
});

// ============================================================================
// 3. 이벤트 리스너 바인딩
// ============================================================================
function bindEvents() {
  // 1) 플랫폼 체크박스 변경
  platformCheckboxes.forEach((cb) => {
    cb.addEventListener("change", (e) => {
      filterState.platforms[e.target.value] = e.target.checked;
      applyFiltersAndRender();
    });
  });

  // 2) 태그 입력 (Enter 또는 쉼표)
  tagInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTagFromInput();
    }
  });

  // 3) 태그 검색 모드 (AND / OR)
  tagModeRadios.forEach((r) => {
    r.addEventListener("change", (e) => {
      tagSearchMode = e.target.value;
      applyFiltersAndRender();
    });
  });

  // 4) 추천 빠른 태그 클릭
  quickTagChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const tagText = chip.dataset.tag;
      if (!activeTags.includes(tagText)) {
        activeTags.push(tagText);
        renderTags();
        applyFiltersAndRender();
      }
    });
  });

  // 5) 슬라이더 컨트롤러 (떡상 비율, 조회수, 구독자, 좋아요)
  sliderRatio.addEventListener("input", (e) => {
    const val = Number(e.target.value);
    filterState.minRatio = val;
    valRatio.textContent = `${val}% 이상`;
    applyFiltersAndRender();
  });

  sliderViews.addEventListener("input", (e) => {
    const val = Number(e.target.value);
    filterState.minViews = val;
    valViews.textContent = formatCompactNumber(val) + "회 이상";
    applyFiltersAndRender();
  });

  sliderSubs.addEventListener("input", (e) => {
    const val = Number(e.target.value);
    filterState.minSubs = val;
    valSubs.textContent = formatCompactNumber(val) + "명 이상";
    applyFiltersAndRender();
  });

  sliderLikes.addEventListener("input", (e) => {
    const val = Number(e.target.value);
    filterState.minLikes = val;
    valLikes.textContent = formatCompactNumber(val) + "개 이상";
    applyFiltersAndRender();
  });

  // 6) 필터 초기화
  btnResetFilters.addEventListener("click", resetAllFilters);

  // 7) 정렬 변경
  selectSort.addEventListener("change", (e) => {
    currentSort = e.target.value;
    applyFiltersAndRender();
  });

  // 8) 뷰 전환 (카드 vs 테이블)
  btnViewCard.addEventListener("click", () => setViewMode("card"));
  btnViewTable.addEventListener("click", () => setViewMode("table"));

  // 9) CSV 엑셀 내보내기
  btnExportCsv.addEventListener("click", exportToCsv);

  // 10) 새 채널 등록 모달
  btnOpenAddModal.addEventListener("click", () => addModal.classList.remove("hidden"));
  btnCloseModal.addEventListener("click", () => addModal.classList.add("hidden"));
  addModal.addEventListener("click", (e) => {
    if (e.target === addModal) addModal.classList.add("hidden");
  });

  // 새 채널 제출
  formAddChannel.addEventListener("submit", handleAddChannel);
}

// ============================================================================
// 4. 태그 관리
// ============================================================================
function addTagFromInput() {
  const val = tagInput.value.trim().replace(/^#/, "");
  if (val && !activeTags.includes(val)) {
    activeTags.push(val);
    tagInput.value = "";
    renderTags();
    applyFiltersAndRender();
  }
}

function removeTag(tagToRemove) {
  activeTags = activeTags.filter((t) => t !== tagToRemove);
  renderTags();
  applyFiltersAndRender();
}

function renderTags() {
  tagContainer.querySelectorAll(".active-tag").forEach((el) => el.remove());

  activeTags.forEach((tag) => {
    const tagEl = document.createElement("span");
    tagEl.className = "active-tag";
    tagEl.innerHTML = `
      #${escapeHtml(tag)}
      <span class="tag-remove" title="삭제">&times;</span>
    `;
    tagEl.querySelector(".tag-remove").addEventListener("click", () => removeTag(tag));
    tagContainer.insertBefore(tagEl, tagInput);
  });
}

function resetAllFilters() {
  activeTags = [];
  renderTags();

  sliderRatio.value = 0;
  filterState.minRatio = 0;
  valRatio.textContent = "0% 이상";

  sliderViews.value = 0;
  filterState.minViews = 0;
  valViews.textContent = "0회 이상";

  sliderSubs.value = 0;
  filterState.minSubs = 0;
  valSubs.textContent = "0명 이상";

  sliderLikes.value = 0;
  filterState.minLikes = 0;
  valLikes.textContent = "0개 이상";

  platformCheckboxes.forEach((cb) => {
    cb.checked = true;
    filterState.platforms[cb.value] = true;
  });

  applyFiltersAndRender();
}

// ============================================================================
// 5. 정밀 필터링 & 정렬 연산
// ============================================================================
function applyFiltersAndRender() {
  // 1) 필터링
  const filtered = allChannels.filter((ch) => {
    // 플랫폼 체크
    if (!filterState.platforms[ch.platform]) return false;

    // 수치 필터
    if (ch.subscribers < filterState.minSubs) return false;
    if (ch.avgViews < filterState.minViews) return false;
    if (ch.likes < filterState.minLikes) return false;
    if (ch.ratio < filterState.minRatio) return false;

    // 다중 키워드 태그 필터 (AND / OR)
    if (activeTags.length > 0) {
      const channelSearchBlob = (
        ch.name +
        " " +
        ch.category +
        " " +
        ch.highlight +
        " " +
        ch.tags.join(" ")
      ).toLowerCase();

      if (tagSearchMode === "AND") {
        const allMatch = activeTags.every((tag) =>
          channelSearchBlob.includes(tag.toLowerCase())
        );
        if (!allMatch) return false;
      } else {
        const anyMatch = activeTags.some((tag) =>
          channelSearchBlob.includes(tag.toLowerCase())
        );
        if (!anyMatch) return false;
      }
    }

    return true;
  });

  // 2) 정렬
  filtered.sort((a, b) => {
    switch (currentSort) {
      case "ratio_desc":
        return b.ratio - a.ratio; // 떡상 비율 높은 순
      case "views_desc":
        return b.avgViews - a.avgViews; // 조회수 높은 순
      case "sub_asc":
        return a.subscribers - b.subscribers; // 구독자 적은 순
      case "sub_desc":
        return b.subscribers - a.subscribers; // 구독자 많은 순
      case "likes_desc":
        return b.likes - a.likes; // 좋아요 많은 순
      default:
        return b.ratio - a.ratio;
    }
  });

  // 3) 통계 요약 갱신
  updateStats(filtered);

  // 4) 뷰 렌더링
  renderResults(filtered);
}

// ============================================================================
// 6. 상단 요약 통계 갱신
// ============================================================================
function updateStats(channels) {
  resultCountEl.textContent = channels.length;
  statTotalChannels.textContent = `${channels.length}개`;

  if (channels.length === 0) {
    statAvgRatio.textContent = "0%";
    statTopChannel.textContent = "-";
    statTopSub.textContent = "0%";
    return;
  }

  // 평균 떡상 지수 계산
  const totalRatio = channels.reduce((sum, ch) => sum + ch.ratio, 0);
  const avgRatio = Math.round(totalRatio / channels.length);
  statAvgRatio.textContent = `${avgRatio.toLocaleString()}%`;

  // 최고 떡상 채널 탐색
  const topRatioChannel = [...channels].sort((a, b) => b.ratio - a.ratio)[0];
  statTopChannel.textContent = topRatioChannel.name;
  statTopSub.textContent = `🔥 떡상 비율: ${topRatioChannel.ratio.toLocaleString()}% (조회수 ${formatCompactNumber(topRatioChannel.avgViews)})`;
}

// ============================================================================
// 7. 결과 렌더링 (카드 뷰 vs 테이블 뷰)
// ============================================================================
function renderResults(channels) {
  if (channels.length === 0) {
    channelsGrid.style.display = "none";
    tableContainer.style.display = "none";
    emptyResults.style.display = "flex";
    return;
  }

  emptyResults.style.display = "none";

  if (currentViewMode === "card") {
    channelsGrid.style.display = "grid";
    tableContainer.style.display = "none";
    renderCardView(channels);
  } else {
    channelsGrid.style.display = "none";
    tableContainer.style.display = "block";
    renderTableView(channels);
  }
}

function renderCardView(channels) {
  channelsGrid.innerHTML = "";

  channels.forEach((ch) => {
    // 떡상 화력 단계 (1000% 이상: 극강, 300% 이상: 중상, 기본)
    let fireClass = "normal";
    let gaugeColor = "linear-gradient(90deg, #10B981, #059669)";
    if (ch.ratio >= 1000) {
      fireClass = "high-fire";
      gaugeColor = "linear-gradient(90deg, #FF5722 0%, #FE2C55 100%)";
    } else if (ch.ratio >= 300) {
      fireClass = "mid-fire";
      gaugeColor = "linear-gradient(90deg, #F59E0B 0%, #FF8C00 100%)";
    }

    // 게이지 퍼센트 폭 (최대 2000% 기준)
    const gaugeWidth = Math.min(100, Math.max(8, (ch.ratio / 2000) * 100));

    const card = document.createElement("div");
    card.className = "channel-card-item";
    card.innerHTML = `
      <div class="card-header-row">
        <div class="avatar-and-info">
          <div class="channel-avatar">${ch.avatar || "📱"}</div>
          <div class="card-title-col">
            <h4 class="card-channel-name">${escapeHtml(ch.name)}</h4>
            <span class="card-channel-handle">${escapeHtml(ch.handle)}</span>
          </div>
        </div>
        <span class="platform-badge-chip">
          <span>${ch.platformIcon}</span> ${escapeHtml(ch.platformName)}
        </span>
      </div>

      <!-- 🔥 구독자 대비 조회수 비율 게이지 (핵심 떡상 지표) -->
      <div class="ratio-gauge-box">
        <div class="gauge-header">
          <span class="gauge-title">🔥 구독자 대비 조회수 (떡상 지수)</span>
          <span class="gauge-percent ${fireClass}">
            ${ch.ratio >= 500 ? "⚡" : ""} ${ch.ratio.toLocaleString()}%
          </span>
        </div>
        <div class="gauge-track">
          <div class="gauge-fill" style="width: ${gaugeWidth}%; background: ${gaugeColor};"></div>
        </div>
      </div>

      <!-- 4대 정량 지표 칩 -->
      <div class="metrics-chips-grid">
        <div class="metric-chip-col">
          <span class="chip-label">👥 구독자</span>
          <span class="chip-val">${formatCompactNumber(ch.subscribers)}</span>
        </div>
        <div class="metric-chip-col">
          <span class="chip-label">👁️ 평균조회수</span>
          <span class="chip-val" style="color: #25F4EE;">${formatCompactNumber(ch.avgViews)}</span>
        </div>
        <div class="metric-chip-col">
          <span class="chip-label">❤️ 좋아요</span>
          <span class="chip-val">${formatCompactNumber(ch.likes)}</span>
        </div>
        <div class="metric-chip-col">
          <span class="chip-label">💬 댓글</span>
          <span class="chip-val">${formatCompactNumber(ch.comments)}</span>
        </div>
      </div>

      <!-- 떡상 비결 설명 -->
      <div class="highlight-text-box">
        💡 <strong>핵심 떡상 공식:</strong> ${escapeHtml(ch.highlight)}
      </div>

      <!-- 태그 및 바로가기 -->
      <div class="card-bottom-row">
        <div class="channel-tag-chips">
          ${ch.tags.map((t) => `<span class="tag-mini">#${escapeHtml(t)}</span>`).join("")}
        </div>
        <a href="${ch.url}" target="_blank" class="btn-visit">채널 탐색 ↗</a>
      </div>
    `;

    channelsGrid.appendChild(card);
  });
}

function renderTableView(channels) {
  tableBody.innerHTML = "";

  channels.forEach((ch, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${idx + 1}</strong></td>
      <td>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span>${ch.platformIcon}</span>
          <div>
            <div style="font-weight: 800; color: #FFF;">${escapeHtml(ch.name)}</div>
            <div style="font-size: 10px; color: #94A3B8;">${escapeHtml(ch.handle)}</div>
          </div>
        </div>
      </td>
      <td>${escapeHtml(ch.category)}</td>
      <td>${formatCompactNumber(ch.subscribers)}</td>
      <td style="color: #25F4EE; font-weight: 800;">${formatCompactNumber(ch.avgViews)}</td>
      <td>
        <strong style="color: ${ch.ratio >= 1000 ? '#FF5722' : ch.ratio >= 300 ? '#F59E0B' : '#10B981'};">
          🔥 ${ch.ratio.toLocaleString()}%
        </strong>
      </td>
      <td>${formatCompactNumber(ch.likes)}</td>
      <td>${formatCompactNumber(ch.comments)}</td>
      <td>
        <a href="${ch.url}" target="_blank" class="btn-visit" style="padding: 4px 10px; font-size: 10px;">바로가기 ↗</a>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

function setViewMode(mode) {
  currentViewMode = mode;
  if (mode === "card") {
    btnViewCard.classList.add("active");
    btnViewTable.classList.remove("active");
  } else {
    btnViewTable.classList.add("active");
    btnViewCard.classList.remove("active");
  }
  applyFiltersAndRender();
}

// ============================================================================
// 8. CSV 엑셀 내보내기
// ============================================================================
function exportToCsv() {
  const filtered = allChannels.filter((ch) => filterState.platforms[ch.platform]);
  if (filtered.length === 0) {
    alert("내보낼 데이터가 없습니다.");
    return;
  }

  const headers = ["플랫폼", "채널명", "핸들", "카테고리", "구독자수", "평균조회수", "구독자대비조회수비율(%)", "좋아요", "댓글", "태그", "떡상비결", "URL"];
  const rows = filtered.map((ch) => [
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
// 9. 새 채널 직접 등록
// ============================================================================
function handleAddChannel(e) {
  e.preventDefault();

  const name = document.getElementById("newChName").value.trim();
  const handle = document.getElementById("newChHandle").value.trim();
  const platform = document.getElementById("newChPlatform").value;
  const category = document.getElementById("newChCategory").value.trim() || "기타";
  const subs = Number(document.getElementById("newChSubs").value) || 1;
  const views = Number(document.getElementById("newChViews").value) || 0;
  const likes = Number(document.getElementById("newChLikes").value) || 0;
  const comments = Number(document.getElementById("newChComments").value) || 0;
  const tagsStr = document.getElementById("newChTags").value.trim();
  const highlight = document.getElementById("newChHighlight").value.trim() || "직접 등록한 벤치마킹 채널";
  const url = document.getElementById("newChUrl").value.trim() || "https://google.com";

  const platformNames = {
    douyin: "도우인",
    tiktok: "틱톡",
    youtube: "유튜브",
    xiaohongshu: "샤오홍슈",
    instagram: "인스타",
    threads: "스레드"
  };

  const platformIcons = {
    douyin: "🇨🇳",
    tiktok: "🌍",
    youtube: "▶️",
    xiaohongshu: "📕",
    instagram: "📸",
    threads: "🧵"
  };

  const newChannel = {
    id: "custom_" + Date.now(),
    name,
    handle,
    platform,
    platformName: platformNames[platform] || "기타",
    platformIcon: platformIcons[platform] || "📱",
    category,
    subscribers: subs,
    avgViews: views,
    likes,
    comments,
    ratio: Math.round((views / subs) * 100),
    tags: tagsStr ? tagsStr.split(",").map((s) => s.trim()) : ["커스텀"],
    highlight,
    url,
    avatar: "⭐️"
  };

  allChannels.unshift(newChannel);

  // 로컬 스토리지에 저장
  const savedCustom = localStorage.getItem("custom_channels");
  const customChannels = savedCustom ? JSON.parse(savedCustom) : [];
  customChannels.unshift(newChannel);
  localStorage.setItem("custom_channels", JSON.stringify(customChannels));

  addModal.classList.add("hidden");
  formAddChannel.reset();
  applyFiltersAndRender();
  alert(`🎉 '${name}' 채널이 성공적으로 등록되었습니다!`);
}

// ============================================================================
// 10. 유틸리티 (수치 포맷팅 & XSS 방지)
// ============================================================================
function formatCompactNumber(num) {
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
