// ============================================================================
// ⚡ popup/popup.js
// 6대 숏폼 인기 채널 탐색기 - 팝업 인터랙션 & 데이터 바인딩 모듈
// ============================================================================

import { PLATFORMS_DATA } from "../data/trending_data.js";

// 현재 상태
let currentPlatformKey = "douyin";
let currentBookmarks = [];

// DOM 요소 참조
const tabExplorer = document.getElementById("tabExplorer");
const tabBookmarks = document.getElementById("tabBookmarks");
const viewExplorer = document.getElementById("viewExplorer");
const viewBookmarks = document.getElementById("viewBookmarks");
const bookmarkCount = document.getElementById("bookmarkCount");

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const platformTabs = document.getElementById("platformTabs");

const currentPlatformName = document.getElementById("currentPlatformName");
const currentPlatformBadge = document.getElementById("currentPlatformBadge");
const tagsContainer = document.getElementById("tagsContainer");
const channelList = document.getElementById("channelList");

const bookmarksList = document.getElementById("bookmarksList");
const emptyBookmarkNotice = document.getElementById("emptyBookmarkNotice");
const clearBookmarksBtn = document.getElementById("clearBookmarksBtn");
const toast = document.getElementById("toast");

// ============================================================================
// 1. 초기화 (Init)
// ============================================================================
document.addEventListener("DOMContentLoaded", async () => {
  // 저장된 북마크 로드
  await loadBookmarks();

  // 기본 플랫폼(도우인) 렌더링
  renderPlatform(currentPlatformKey);

  // 이벤트 리스너 등록
  initEventListeners();
});

// ============================================================================
// 2. 이벤트 리스너 등록
// ============================================================================
function initEventListeners() {
  // 네비게이션 탭 전환 (탐색 vs 보관함)
  tabExplorer.addEventListener("click", () => switchTab("explorer"));
  tabBookmarks.addEventListener("click", () => switchTab("bookmarks"));

  // 6대 플랫폼 칩 클릭
  platformTabs.addEventListener("click", (e) => {
    const chip = e.target.closest(".platform-chip");
    if (!chip) return;

    const platformKey = chip.dataset.platform;
    if (!platformKey || platformKey === currentPlatformKey) return;

    // 활성 칩 스타일 변경
    document.querySelectorAll(".platform-chip").forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");

    currentPlatformKey = platformKey;
    renderPlatform(currentPlatformKey);
  });

  // 검색 버튼 클릭
  searchBtn.addEventListener("click", handleSearch);

  // 검색창 Enter 키 이벤트
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  });

  // 북마크 전체 비우기
  clearBookmarksBtn.addEventListener("click", async () => {
    if (confirm("정말 모든 북마크를 비우시겠습니까?")) {
      currentBookmarks = [];
      await chrome.storage.local.set({ bookmarks: [] });
      updateBookmarkBadge();
      renderBookmarks();
      renderPlatform(currentPlatformKey);
      showToast("🗑️ 북마크가 모두 삭제되었습니다.");
    }
  });
}

// ============================================================================
// 3. 탭 전환
// ============================================================================
function switchTab(tabName) {
  if (tabName === "explorer") {
    tabExplorer.classList.add("active");
    tabBookmarks.classList.remove("active");
    viewExplorer.classList.add("active");
    viewBookmarks.classList.remove("active");
  } else {
    tabBookmarks.classList.add("active");
    tabExplorer.classList.remove("active");
    viewBookmarks.classList.add("active");
    viewExplorer.classList.remove("active");
    renderBookmarks();
  }
}

// ============================================================================
// 4. 플랫폼 데이터 렌더링 (탐색 탭)
// ============================================================================
function renderPlatform(platformKey) {
  const platform = PLATFORMS_DATA[platformKey];
  if (!platform) return;

  // 헤더 정보 갱신
  currentPlatformName.textContent = platform.name;
  currentPlatformBadge.textContent = platform.badge;

  // 트렌딩 태그 렌더링
  tagsContainer.innerHTML = "";
  platform.tags.forEach((tag) => {
    const tagSpan = document.createElement("span");
    tagSpan.className = "tag-badge";
    tagSpan.textContent = tag;
    tagSpan.title = "클릭하여 복사";
    tagSpan.addEventListener("click", () => {
      // 태그에서 실제 검색 키워드 추출 (# 제외)
      const cleanKeyword = tag.split(" ")[0].replace("#", "");
      navigator.clipboard.writeText(cleanKeyword);
      showToast(`📋 '${cleanKeyword}' 복사 완료!`);
      searchInput.value = cleanKeyword;
    });
    tagsContainer.appendChild(tagSpan);
  });

  // 인기 채널 카드 목록 렌더링
  channelList.innerHTML = "";
  platform.channels.forEach((channel) => {
    const isBookmarked = currentBookmarks.some((b) => b.id === channel.id);

    const card = document.createElement("div");
    card.className = "channel-card";
    card.innerHTML = `
      <div class="card-top">
        <div class="channel-main-info">
          <div class="channel-name">${escapeHtml(channel.name)}</div>
          <div class="channel-meta">
            <span class="channel-followers">${escapeHtml(channel.followers)}</span>
            <span class="channel-cat">• ${escapeHtml(channel.category)}</span>
          </div>
        </div>
        <div class="card-actions">
          <button class="btn-star ${isBookmarked ? "bookmarked" : ""}" title="보관함에 저장">
            ${isBookmarked ? "★" : "☆"}
          </button>
          <a href="${channel.url}" target="_blank" class="btn-link">채널 ↗</a>
        </div>
      </div>
      <div class="card-desc">💡 ${escapeHtml(channel.highlight)}</div>
      <div class="card-tags">
        ${channel.tags.map((t) => `<span class="chip-mini">#${escapeHtml(t)}</span>`).join("")}
      </div>
    `;

    // 별표(북마크) 토글 이벤트
    const starBtn = card.querySelector(".btn-star");
    starBtn.addEventListener("click", () => toggleBookmark(channel, platform));

    // 바로가기 링크 클릭 이벤트
    const linkBtn = card.querySelector(".btn-link");
    linkBtn.addEventListener("click", (e) => {
      e.preventDefault();
      chrome.tabs.create({ url: channel.url });
    });

    channelList.appendChild(card);
  });
}

// ============================================================================
// 5. 검색 실행 (새 탭 열기)
// ============================================================================
function handleSearch() {
  const query = searchInput.value.trim();
  const platform = PLATFORMS_DATA[currentPlatformKey];

  if (!query) {
    // 키워드가 없으면 플랫폼 기본 홈/탐색 페이지 열기
    const baseUrl = platform.searchUrl.replace("{query}", "");
    chrome.tabs.create({ url: baseUrl });
    return;
  }

  // 플랫폼별 검색 URL 생성 후 새 탭 열기
  const targetUrl = platform.searchUrl.replace("{query}", encodeURIComponent(query));
  chrome.tabs.create({ url: targetUrl });
  showToast(`🔍 ${platform.name}에서 '${query}' 검색 중...`);
}

// ============================================================================
// 6. 북마크 관리 (Storage 연동)
// ============================================================================
async function loadBookmarks() {
  try {
    const data = await chrome.storage.local.get("bookmarks");
    currentBookmarks = data.bookmarks || [];
    updateBookmarkBadge();
  } catch (err) {
    console.error("북마크 로드 실패:", err);
    currentBookmarks = [];
  }
}

async function toggleBookmark(channel, platform) {
  const existingIndex = currentBookmarks.findIndex((b) => b.id === channel.id);

  if (existingIndex !== -1) {
    // 이미 있으면 삭제
    currentBookmarks.splice(existingIndex, 1);
    showToast("⭐️ 북마크에서 제거되었습니다.");
  } else {
    // 없으면 추가
    currentBookmarks.unshift({
      id: channel.id,
      title: channel.name,
      platform: platform.id,
      platformName: platform.name,
      followers: channel.followers,
      highlight: channel.highlight,
      url: channel.url,
      createdAt: Date.now()
    });
    showToast("⭐️ 보관함에 추가되었습니다!");
  }

  // 스토리지에 영구 저장
  await chrome.storage.local.set({ bookmarks: currentBookmarks });
  updateBookmarkBadge();
  renderPlatform(currentPlatformKey);
}

function updateBookmarkBadge() {
  bookmarkCount.textContent = currentBookmarks.length;
}

function renderBookmarks() {
  bookmarksList.innerHTML = "";

  if (currentBookmarks.length === 0) {
    emptyBookmarkNotice.classList.remove("hidden");
    return;
  }

  emptyBookmarkNotice.classList.add("hidden");

  currentBookmarks.forEach((b) => {
    const card = document.createElement("div");
    card.className = "channel-card";
    card.innerHTML = `
      <div class="card-top">
        <div class="channel-main-info">
          <div class="channel-name">${escapeHtml(b.title)}</div>
          <div class="channel-meta">
            <span class="channel-followers">${escapeHtml(b.followers)}</span>
            <span class="channel-cat">• [${escapeHtml(b.platformName)}]</span>
          </div>
        </div>
        <div class="card-actions">
          <button class="btn-star bookmarked" title="보관함에서 삭제">★</button>
          <a href="${b.url}" target="_blank" class="btn-link">채널 ↗</a>
        </div>
      </div>
      <div class="card-desc">💡 ${escapeHtml(b.highlight)}</div>
    `;

    // 삭제 버튼
    const starBtn = card.querySelector(".btn-star");
    starBtn.addEventListener("click", async () => {
      currentBookmarks = currentBookmarks.filter((item) => item.id !== b.id);
      await chrome.storage.local.set({ bookmarks: currentBookmarks });
      updateBookmarkBadge();
      renderBookmarks();
      renderPlatform(currentPlatformKey);
      showToast("🗑️ 보관함에서 삭제되었습니다.");
    });

    // 바로가기 링크
    const linkBtn = card.querySelector(".btn-link");
    linkBtn.addEventListener("click", (e) => {
      e.preventDefault();
      chrome.tabs.create({ url: b.url });
    });

    bookmarksList.appendChild(card);
  });
}

// ============================================================================
// 7. 유틸리티 함수 (Toast & XSS 방지)
// ============================================================================
let toastTimer = null;
function showToast(msg) {
  if (toastTimer) clearTimeout(toastTimer);
  toast.textContent = msg;
  toast.classList.remove("hidden");

  toastTimer = setTimeout(() => {
    toast.classList.add("hidden");
  }, 1800);
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
