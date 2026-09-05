import fs from "fs";
import path from "path";

// 1. 순수 CSS 정의 (트루 블랙 다크모드 & 초선명 박스 라이트모드)
const cssContent = `
/* ========================================================================== */
/* 🌙 1. 다크 모드 (칠흑 같은 리얼 딥 블랙 #000000) */
/* ========================================================================== */
:root, [data-theme="dark"] {
  --bg-body: #000000;          /* 완전한 리얼 블랙 */
  --bg-panel: #111111;         /* 상단 설정 박스 짙은 차콜 */
  --bg-card: #181818;          /* 채널 카드 박스 */
  --bg-card-hover: #222222;    /* 카드 호버 */
  --bg-input: #080808;         /* 입력창 블랙 */

  --border-box: 2px solid #2E2E2E;  /* 눈에 또렷이 보이는 그레이 테두리 */
  --border-focus: #FE2C55;

  --text-main: #FFFFFF;        /* 완전 쨍한 화이트 */
  --text-sub: #D1D5DB;         /* 밝은 연회색 */
  --text-muted: #9CA3AF;       /* 설명 회색 */
  --text-accent: #38BDF8;      /* 네온 스카이블루 */

  --accent-pink: #FE2C55;
  --accent-cyan: #00F2FE;
  --accent-fire: #FF4500;
  --accent-gold: #FBBF24;

  --shadow-box: 0 10px 30px rgba(0, 0, 0, 0.9);
}

/* ========================================================================== */
/* ☀️ 2. 라이트 모드 (박스 외곽선이 100% 튀어나오는 고대비 화이트/그레이) */
/* ========================================================================== */
[data-theme="light"] {
  --bg-body: #E2E8F0;          /* 바탕 배경: 확실하게 어두운 소프트 그레이 (흰색 박스와 100% 대비) */
  --bg-panel: #FFFFFF;         /* 상단 설정 박스: 새하얀 퓨어 화이트 */
  --bg-card: #FFFFFF;          /* 채널 카드: 새하얀 퓨어 화이트 */
  --bg-card-hover: #F8FAFC;    /* 카드 호버 */
  --bg-input: #F1F5F9;         /* 입력창 배경 */

  --border-box: 2.5px solid #64748B; /* 검정에 가까운 진하고 두꺼운 외곽선 (박스 확실히 보임!) */
  --border-focus: #2563EB;

  --text-main: #000000;        /* 완전 짙은 블랙 */
  --text-sub: #1E293B;         /* 진한 먹색 */
  --text-muted: #475569;       /* 설명 짙은 슬레이트 */
  --text-accent: #0284C7;      /* 선명한 블루 */

  --accent-pink: #E11D48;
  --accent-cyan: #0284C7;
  --accent-fire: #EA580C;
  --accent-gold: #D97706;

  --shadow-box: 0 10px 25px rgba(0, 0, 0, 0.18), 0 2px 6px rgba(0, 0, 0, 0.12);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: var(--bg-body);
  color: var(--text-main);
  font-family: -apple-system, BlinkMacSystemFont, "Pretendard", "Segoe UI", Roboto, sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  transition: background-color 0.2s ease, color 0.2s ease;
}

/* ========================================================================== */
/* 🚀 헤더 */
/* ========================================================================== */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 36px;
  background: var(--bg-panel);
  border-bottom: var(--border-box);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: var(--shadow-box);
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-logo {
  font-size: 32px;
}

.brand-title {
  font-size: 22px;
  font-weight: 900;
  color: var(--text-main);
}

.brand-desc {
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 700;
}

.header-tools {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* ☀️/🌙 테마 토글 버튼 (확실하게 눈에 띔) */
.btn-theme-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-input);
  border: var(--border-box);
  color: var(--text-main);
  padding: 10px 20px;
  border-radius: 9999px;
  font-size: 14px;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  transition: all 0.2s;
}

.btn-theme-toggle:hover {
  transform: translateY(-2px);
  border-color: var(--accent-pink);
}

.btn-action {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 9999px;
  font-size: 14px;
  font-weight: 900;
  cursor: pointer;
  border: var(--border-box);
  background: var(--bg-input);
  color: var(--text-main);
  transition: all 0.2s;
}

.btn-action:hover {
  transform: translateY(-2px);
}

.btn-primary {
  background: linear-gradient(135deg, var(--accent-pink) 0%, #FF5722 100%);
  border: none;
  color: #FFFFFF;
  box-shadow: 0 6px 18px rgba(254, 44, 85, 0.4);
}

/* ========================================================================== */
/* 📱 메인 래퍼 */
/* ========================================================================== */
.main-wrapper {
  width: 100%;
  max-width: 1560px;
  margin: 0 auto;
  padding: 26px 32px 60px;
  display: flex;
  flex-direction: column;
  gap: 26px;
}

/* ========================================================================== */
/* 🎛️ 상단 통합 설정 박스 (Top Filter Box) - 박스 경계선 완벽 분리 */
/* ========================================================================== */
.top-filter-panel {
  background: var(--bg-panel);
  border: var(--border-box);
  border-radius: 20px;
  padding: 26px 30px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  box-shadow: var(--shadow-box);
}

.panel-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: var(--border-box);
  padding-bottom: 14px;
}

.panel-title {
  font-size: 19px;
  font-weight: 900;
  color: var(--text-main);
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-reset {
  background: var(--bg-input);
  border: var(--border-box);
  color: var(--text-main);
  font-size: 12px;
  font-weight: 900;
  padding: 6px 14px;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-reset:hover {
  color: var(--accent-pink);
  border-color: var(--accent-pink);
}

/* 1. 플랫폼 선택 바 */
.filter-row {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.row-label {
  font-size: 15px;
  font-weight: 900;
  color: var(--text-main);
  display: flex;
  align-items: center;
  gap: 6px;
}

.platform-chips-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.platform-chip-label {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-input);
  border: var(--border-box);
  border-radius: 10px;
  padding: 10px 16px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 900;
  color: var(--text-main);
  transition: all 0.15s;
}

.platform-chip-label:hover {
  border-color: var(--accent-pink);
}

.platform-chip-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: var(--accent-pink);
  cursor: pointer;
}

/* 2. 키워드 입력 & 자동완성 추천창 */
.keyword-input-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.keyword-input-box {
  display: flex;
  align-items: center;
  background: var(--bg-input);
  border: var(--border-box);
  border-radius: 14px;
  padding: 12px 18px;
  transition: border-color 0.2s;
}

.keyword-input-box:focus-within {
  border-color: var(--accent-pink);
}

.search-icon {
  font-size: 20px;
  margin-right: 10px;
  color: var(--text-muted);
}

.keyword-input-field {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 16px;
  font-weight: 900;
  color: var(--text-main);
}

.keyword-input-field::placeholder {
  color: var(--text-muted);
  font-weight: 600;
}

.btn-clear-keyword {
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 20px;
  cursor: pointer;
  padding: 0 6px;
}

/* 자동완성 드롭다운 */
.autocomplete-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 6px;
  background: var(--bg-panel);
  border: var(--border-box);
  border-radius: 14px;
  box-shadow: var(--shadow-box);
  max-height: 260px;
  overflow-y: auto;
  z-index: 50;
  display: none;
}

.autocomplete-dropdown.active {
  display: block;
}

.dropdown-header {
  padding: 10px 16px;
  font-size: 12px;
  font-weight: 900;
  color: var(--text-muted);
  background: var(--bg-input);
  border-bottom: var(--border-box);
}

.dropdown-item {
  padding: 12px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: background-color 0.15s;
  font-size: 14.5px;
  font-weight: 900;
  color: var(--text-main);
  border-bottom: 1px solid rgba(128, 128, 128, 0.2);
}

.dropdown-item:hover {
  background: rgba(254, 44, 85, 0.2);
  color: var(--accent-pink);
}

.dropdown-item-meta {
  font-size: 11px;
  font-weight: 900;
  color: var(--text-muted);
  background: var(--bg-input);
  padding: 2px 8px;
  border-radius: 9999px;
  border: 1px solid rgba(128, 128, 128, 0.2);
}

/* 빠른 추천 키워드 칩 */
.quick-keywords-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 13px;
}

.quick-label {
  color: var(--text-muted);
  font-weight: 900;
  margin-right: 4px;
}

.chip-keyword {
  background: var(--bg-input);
  border: var(--border-box);
  color: var(--text-main);
  font-size: 12.5px;
  font-weight: 900;
  padding: 4px 12px;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.15s;
}

.chip-keyword:hover {
  background: var(--accent-pink);
  color: #FFFFFF;
  border-color: var(--accent-pink);
}

/* ========================================================================== */
/* 🔢 3, 4, 5, 6, 7번 숫자 직접 입력창 그리드 (선명한 외곽선 박스) */
/* ========================================================================== */
.numeric-filters-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}

.numeric-box {
  background: var(--bg-input);
  border: var(--border-box);
  border-radius: 14px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: border-color 0.2s;
}

.numeric-box:focus-within {
  border-color: var(--accent-pink);
}

.numeric-label {
  font-size: 13.5px;
  font-weight: 900;
  color: var(--text-main);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.numeric-unit {
  font-size: 12px;
  font-weight: 900;
  color: var(--accent-fire);
}

.numeric-input {
  width: 100%;
  background: var(--bg-panel);
  border: var(--border-box);
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 17px;
  font-weight: 900;
  color: var(--text-main);
  outline: none;
  font-family: Consolas, -apple-system, sans-serif;
}

.numeric-input:focus {
  border-color: var(--accent-pink);
}

.numeric-hint {
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 800;
}

/* ========================================================================== */
/* 🔍 [조건에 맞는 채널 탐색하기] 메인 버튼 */
/* ========================================================================== */
.search-trigger-area {
  display: flex;
  justify-content: center;
  padding-top: 6px;
}

.btn-search-trigger {
  width: 100%;
  max-width: 620px;
  background: linear-gradient(135deg, #FE2C55 0%, #FF5722 100%);
  color: #FFFFFF;
  border: none;
  border-radius: 14px;
  padding: 18px 30px;
  font-size: 20px;
  font-weight: 900;
  letter-spacing: -0.3px;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(254, 44, 85, 0.5);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.btn-search-trigger:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 38px rgba(254, 44, 85, 0.7);
}

/* ========================================================================== */
/* 📊 탐색 결과 섹션 */
/* ========================================================================== */
.results-section {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.results-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--bg-panel);
  border: var(--border-box);
  border-radius: 14px;
  padding: 16px 24px;
  box-shadow: var(--shadow-box);
}

.toolbar-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.result-badge {
  font-size: 16.5px;
  font-weight: 900;
  color: var(--text-main);
}

.result-badge span {
  color: var(--accent-pink);
}

.avg-ratio-badge {
  font-size: 14px;
  font-weight: 900;
  color: var(--accent-fire);
  background: rgba(255, 87, 34, 0.15);
  padding: 5px 14px;
  border-radius: 9999px;
  border: 1.5px solid rgba(255, 87, 34, 0.4);
}

.toolbar-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.select-sort {
  background: var(--bg-input);
  border: var(--border-box);
  color: var(--text-main);
  padding: 9px 16px;
  border-radius: 8px;
  font-size: 13.5px;
  font-weight: 900;
  outline: none;
  cursor: pointer;
}

.view-toggle-group {
  display: flex;
  background: var(--bg-input);
  border: var(--border-box);
  border-radius: 8px;
  overflow: hidden;
}

.btn-view-toggle {
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 13.5px;
  font-weight: 900;
  padding: 9px 16px;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-view-toggle.active {
  background: var(--accent-pink);
  color: #FFFFFF;
}

/* ========================================================================== */
/* 🏆 고대비 채널 카드 그리드 (글자/숫자 선명화 및 뚜렷한 외곽선) */
/* ========================================================================== */
.channels-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 22px;
}

.channel-card {
  background: var(--bg-card);
  border: var(--border-box);
  border-radius: 20px;
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: var(--shadow-box);
  transition: all 0.2s;
}

.channel-card:hover {
  background: var(--bg-card-hover);
  border-color: var(--accent-pink);
  transform: translateY(-3px);
}

.card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.channel-profile-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.channel-avatar {
  font-size: 26px;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--bg-input);
  border: var(--border-box);
  display: flex;
  align-items: center;
  justify-content: center;
}

.channel-titles {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.channel-name {
  font-size: 17px;
  font-weight: 900;
  color: var(--text-main);
}

.channel-handle {
  font-size: 13px;
  font-weight: 900;
  color: var(--text-accent);
}

.platform-badge {
  font-size: 12px;
  font-weight: 900;
  padding: 5px 12px;
  border-radius: 9999px;
  background: var(--bg-input);
  border: var(--border-box);
  color: var(--text-main);
}

/* 🔥 구독자 대비 조회수 게이지 (초고대비 박스) */
.ratio-box {
  background: var(--bg-input);
  border: var(--border-box);
  border-radius: 14px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ratio-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ratio-label-text {
  font-size: 13.5px;
  font-weight: 900;
  color: var(--text-main);
}

.ratio-value-text {
  font-size: 24px;
  font-weight: 900;
  color: var(--accent-fire);
  letter-spacing: -0.5px;
}

.ratio-bar-track {
  width: 100%;
  height: 10px;
  background: rgba(128, 128, 128, 0.25);
  border-radius: 5px;
  overflow: hidden;
}

.ratio-bar-fill {
  height: 100%;
  border-radius: 5px;
  background: linear-gradient(90deg, #FE2C55, #FF5722);
}

/* 4대 정량 지표 */
.metrics-grid-card {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  background: var(--bg-input);
  border: var(--border-box);
  border-radius: 12px;
  padding: 12px 10px;
}

.metric-col {
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: center;
}

.col-label {
  font-size: 11.5px;
  font-weight: 900;
  color: var(--text-muted);
}

.col-val {
  font-size: 15px;
  font-weight: 900;
  color: var(--text-main);
}

.col-val.views {
  color: var(--text-accent);
}

/* 떡상 비결 설명 (가독성 박스) */
.highlight-box {
  font-size: 13.5px;
  line-height: 1.55;
  color: var(--text-sub);
  background: var(--bg-input);
  padding: 12px 14px;
  border-radius: 8px;
  border: var(--border-box);
  border-left: 5px solid var(--accent-pink);
}

/* 카드 하단 태그 & 바로가기 */
.card-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  gap: 8px;
}

.tags-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.tag-badge {
  font-size: 11.5px;
  font-weight: 900;
  padding: 4px 9px;
  border-radius: 4px;
  background: var(--bg-input);
  border: 1px solid rgba(128, 128, 128, 0.3);
  color: var(--text-main);
}

.btn-visit {
  background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
  color: #FFFFFF;
  text-decoration: none;
  font-size: 13px;
  font-weight: 900;
  padding: 9px 18px;
  border-radius: 8px;
  white-space: nowrap;
  transition: all 0.15s;
}

.btn-visit:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* ========================================================================== */
/* 📋 테이블 뷰 */
/* ========================================================================== */
.table-wrapper {
  background: var(--bg-panel);
  border: var(--border-box);
  border-radius: 20px;
  overflow-x: auto;
  box-shadow: var(--shadow-box);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 14px;
}

.data-table th {
  background: var(--bg-input);
  color: var(--text-main);
  font-weight: 900;
  padding: 16px 20px;
  border-bottom: var(--border-box);
}

.data-table td {
  padding: 16px 20px;
  border-bottom: 1px solid rgba(128, 128, 128, 0.2);
  color: var(--text-sub);
  font-weight: 900;
}

.data-table tr:hover td {
  background: var(--bg-card-hover);
}

/* 검색 결과 없음 */
.empty-box {
  background: var(--bg-panel);
  border: var(--border-box);
  border-radius: 20px;
  padding: 60px 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.empty-icon {
  font-size: 48px;
}

.empty-title {
  font-size: 19px;
  font-weight: 900;
  color: var(--text-main);
}

.empty-desc {
  font-size: 13.5px;
  color: var(--text-muted);
}
`;

// 2. JS 코드 읽기 (DB + App 로직)
const dbCode = fs.readFileSync("trend_analytics_app/channels_db.js", "utf-8");
const appCode = fs.readFileSync("trend_analytics_app/app.js", "utf-8");

// JS 합치기: export 문 및 import 문 제거
let combinedJs = dbCode.replace("export const INITIAL_CHANNELS_DB", "const INITIAL_CHANNELS_DB");
combinedJs += "\n\n" + appCode.replace('import { INITIAL_CHANNELS_DB } from "./channels_db.js";', "// DB 로드 완료");

// 3. 순수 HTML 템플릿 구조
const fullHtml = `<!DOCTYPE html>
<html lang="ko" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🚀 글로벌 숏폼 떡상 채널 정밀 분석기</title>
  <style>
${cssContent}
  </style>
</head>
<body>
  <!-- 1. 상단 네비게이션 헤더 -->
  <header class="navbar">
    <div class="brand">
      <span class="brand-logo">🚀</span>
      <div>
        <h1 class="brand-title">글로벌 숏폼 떡상 채널 정밀 분석기</h1>
        <p class="brand-desc">도우인 · 틱톡 · 유튜브 쇼츠 · 샤오홍슈 · 인스타 릴스 · 스레드</p>
      </div>
    </div>
    <div class="header-tools">
      <!-- ☀️/🌙 테마 토글 버튼 (시스템 연동 + 수동 선택) -->
      <button id="btnThemeToggle" class="btn-theme-toggle" title="화면 밝기 전환">
        <span id="themeIcon">☀️</span>
        <span id="themeText">밝은 모드</span>
      </button>
      <button id="btnExportCsv" class="btn-action btn-primary" title="엑셀로 다운로드">
        <span>📥</span> 엑셀(CSV) 저장
      </button>
    </div>
  </header>

  <!-- 2. 메인 컨테이너 -->
  <div class="main-wrapper">
    <!-- 🎛️ 상단 통합 설정 패널 (Top Filter Box) -->
    <section class="top-filter-panel">
      <div class="panel-header-row">
        <div class="panel-title">
          <span>🎛️</span> 채널 발굴 조건 설정
        </div>
        <button id="btnResetFilters" class="btn-reset">설정 초기화 ↺</button>
      </div>

      <!-- 1. 탐색 플랫폼 선택 (유지) -->
      <div class="filter-row">
        <label class="row-label">
          <span>1. 탐색 플랫폼 선택 (중복 체크)</span>
        </label>
        <div class="platform-chips-container">
          <label class="platform-chip-label">
            <input type="checkbox" class="platform-check" value="douyin" checked>
            <span>🇨🇳 도우인 (Douyin)</span>
          </label>
          <label class="platform-chip-label">
            <input type="checkbox" class="platform-check" value="tiktok" checked>
            <span>🌍 틱톡 (TikTok)</span>
          </label>
          <label class="platform-chip-label">
            <input type="checkbox" class="platform-check" value="youtube" checked>
            <span>▶️ 유튜브 (YouTube)</span>
          </label>
          <label class="platform-chip-label">
            <input type="checkbox" class="platform-check" value="xiaohongshu" checked>
            <span>📕 샤오홍슈 (小红书)</span>
          </label>
          <label class="platform-chip-label">
            <input type="checkbox" class="platform-check" value="instagram" checked>
            <span>📸 인스타그램 (Reels)</span>
          </label>
          <label class="platform-chip-label">
            <input type="checkbox" class="platform-check" value="threads" checked>
            <span>🧵 스레드 (Threads)</span>
          </label>
        </div>
      </div>

      <!-- 2. 키워드 중복 탐색 (태그 없이 자연스러운 텍스트 입력 + 자동완성 추천창) -->
      <div class="filter-row">
        <label class="row-label">
          <span>2. 키워드 중복 탐색 (글자 입력 시 아래에 연관 추천 키워드가 자동으로 뜹니다)</span>
        </label>
        <div class="keyword-input-wrapper">
          <div class="keyword-input-box">
            <span class="search-icon">🔍</span>
            <input 
              type="text" 
              id="keywordInput" 
              class="keyword-input-field" 
              placeholder="탐색할 키워드를 적어보세요 (예: 뷰티, 리프팅, 올리브영, 홈케어, 가젯...)" 
              autocomplete="off"
            />
            <button id="btnClearKeyword" class="btn-clear-keyword" title="지우기" style="display: none;">&times;</button>
          </div>

          <!-- 💡 실시간 자동완성 추천창 -->
          <div id="autocompleteDropdown" class="autocomplete-dropdown">
            <div class="dropdown-header">💡 추천 연관 키워드 (클릭하면 바로 추가됩니다)</div>
            <div id="dropdownItemsList"></div>
          </div>
        </div>

        <!-- 빠른 선택 추천 키워드 -->
        <div class="quick-keywords-row">
          <span class="quick-label">추천 키워드:</span>
          <button class="chip-keyword" data-kw="리프팅">#리프팅</button>
          <button class="chip-keyword" data-kw="뷰티">#뷰티</button>
          <button class="chip-keyword" data-kw="올리브영">#올리브영</button>
          <button class="chip-keyword" data-kw="홈케어">#홈케어</button>
          <button class="chip-keyword" data-kw="생활꿀템">#생활꿀템</button>
          <button class="chip-keyword" data-kw="가성비">#가성비</button>
          <button class="chip-keyword" data-kw="쿠팡소싱">#쿠팡소싱</button>
          <button class="chip-keyword" data-kw="비포애프터">#비포애프터</button>
          <button class="chip-keyword" data-kw="AI자동화">#AI자동화</button>
        </div>
      </div>

      <!-- 3, 4, 5, 6번 + 탐색채널 개수 (숫자 직접 타이핑 입력창) -->
      <div class="numeric-filters-grid">
        <!-- 3. 최소 떡상 비율 -->
        <div class="numeric-box">
          <label class="numeric-label">
            <span>3. 최소 떡상 비율</span>
            <span class="numeric-unit">% 이상</span>
          </label>
          <input type="number" id="inputMinRatio" class="numeric-input" value="100" min="0" step="50" placeholder="100">
          <span class="numeric-hint">🔥 구독자 대비 조회수 배율</span>
        </div>

        <!-- 4. 최소 평균 조회수 -->
        <div class="numeric-box">
          <label class="numeric-label">
            <span>4. 최소 평균 조회수</span>
            <span class="numeric-unit">회 이상</span>
          </label>
          <input type="number" id="inputMinViews" class="numeric-input" value="0" min="0" step="10000" placeholder="0">
          <span class="numeric-hint">👁️ 영상 1편당 평균치</span>
        </div>

        <!-- 5. 최소 구독자 수 -->
        <div class="numeric-box">
          <label class="numeric-label">
            <span>5. 최소 구독자 수</span>
            <span class="numeric-unit">명 이상</span>
          </label>
          <input type="number" id="inputMinSubs" class="numeric-input" value="0" min="0" step="5000" placeholder="0">
          <span class="numeric-hint">👥 채널 팔로워 규모</span>
        </div>

        <!-- 6. 최소 좋아요 수 -->
        <div class="numeric-box">
          <label class="numeric-label">
            <span>6. 최소 좋아요 수</span>
            <span class="numeric-unit">개 이상</span>
          </label>
          <input type="number" id="inputMinLikes" class="numeric-input" value="0" min="0" step="1000" placeholder="0">
          <span class="numeric-hint">❤️ 영상 평균 좋아요</span>
        </div>

        <!-- 7. 탐색 채널 개수 (신규) -->
        <div class="numeric-box" style="border-color: var(--accent-pink);">
          <label class="numeric-label">
            <span>7. 탐색 채널 개수</span>
            <span class="numeric-unit">개 표시</span>
          </label>
          <input type="number" id="inputLimitCount" class="numeric-input" value="20" min="1" max="100" placeholder="20">
          <span class="numeric-hint">🎯 화면에 노출할 최대 개수</span>
        </div>
      </div>

      <!-- 🔍 [조건에 맞는 채널 탐색하기] 메인 탐색 실행 버튼 -->
      <div class="search-trigger-area">
        <button id="btnSearchTrigger" class="btn-search-trigger">
          <span>🔍</span> 조건에 맞는 숏폼 채널 탐색하기
        </button>
      </div>
    </section>

    <!-- 📊 탐색 결과 섹션 -->
    <section class="results-section">
      <!-- 결과 툴바 -->
      <div class="results-toolbar">
        <div class="toolbar-info">
          <div class="result-badge">
            발굴 결과: <span id="resultCount">0</span>개 채널
          </div>
          <div id="avgRatioBadge" class="avg-ratio-badge">
            🔥 평균 떡상 지수: <strong id="avgRatioVal">0%</strong>
          </div>
        </div>

        <div class="toolbar-controls">
          <label style="font-size: 13.5px; font-weight: 900; color: var(--text-muted);">정렬 기준:</label>
          <select id="selectSort" class="select-sort">
            <option value="ratio_desc">🔥 떡상 비율 높은 순 (추천)</option>
            <option value="views_desc">👁️ 조회수 많은 순</option>
            <option value="sub_asc">🌱 소형 채널 떡상 순 (구독자 적은순)</option>
            <option value="sub_desc">👥 대형 채널 순 (구독자 많은순)</option>
            <option value="likes_desc">❤️ 좋아요 많은 순</option>
          </select>

          <div class="view-toggle-group">
            <button id="btnViewCard" class="btn-view-toggle active" title="카드 뷰">🎴 카드형</button>
            <button id="btnViewTable" class="btn-view-toggle" title="테이블 뷰">📋 표형태</button>
          </div>
        </div>
      </div>

      <!-- 채널 카드 그리드 (카드 뷰) -->
      <div id="channelsGrid" class="channels-grid"></div>

      <!-- 채널 데이터 테이블 (테이블 뷰) -->
      <div id="tableWrapper" class="table-wrapper" style="display: none;">
        <table class="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>채널명 & 플랫폼</th>
              <th>카테고리</th>
              <th>구독자수</th>
              <th>평균조회수</th>
              <th>🔥 떡상비율</th>
              <th>좋아요</th>
              <th>댓글</th>
              <th>채널 바로가기</th>
            </tr>
          </thead>
          <tbody id="tableBody"></tbody>
        </table>
      </div>

      <!-- 검색 결과 없음 안내 -->
      <div id="emptyBox" class="empty-box" style="display: none;">
        <span class="empty-icon">🔍</span>
        <h3 class="empty-title">조건에 일치하는 채널이 없습니다</h3>
        <p class="empty-desc">키워드를 줄이거나 상단 숫자 수치(조회수, 떡상비율 등)를 낮추고 다시 [탐색하기]를 눌러보세요.</p>
      </div>
    </section>
  </div>

  <script>
${combinedJs}
  </script>
</body>
</html>`;

// 4. 세 군데 목적지에 확실하게 쓰기
const dest1 = "C:\\Users\\aman2\\OneDrive\\바탕 화면\\숏폼_채널_정밀탐색기.html";
const dest2 = "C:\\Users\\aman2\\Desktop\\숏폼_채널_정밀탐색기.html";
const dest3 = "trend_analytics_app/index.html";

fs.writeFileSync(dest1, fullHtml, "utf-8");
console.log("✅ 1. OneDrive 바탕화면 배포 완료:", dest1);

try {
  fs.writeFileSync(dest2, fullHtml, "utf-8");
  console.log("✅ 2. 로컬 Desktop 배포 완료:", dest2);
} catch (e) {
  console.log("로컬 Desktop 쓰기 스킵 (경로 없음)");
}

fs.writeFileSync(dest3, fullHtml, "utf-8");
console.log("✅ 3. trend_analytics_app/index.html 갱신 완료");
