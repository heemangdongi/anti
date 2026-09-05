// ============================================================================
// ⚙️ background/service-worker.js
// 크롬 확장 프로그램 백그라운드 서비스 워커 (Manifest V3)
// ============================================================================

chrome.runtime.onInstalled.addListener(async (details) => {
  console.log("🚀 6대 숏폼 인기 채널 탐색기 확장 프로그램이 설치되었습니다!", details);

  // 초기 저장소(storage) 기본값 확인 및 초기화
  const { bookmarks } = await chrome.storage.local.get("bookmarks");
  if (!bookmarks) {
    await chrome.storage.local.set({
      bookmarks: [
        {
          id: "init_1",
          title: "疯狂小杨哥 (미친샤오양형제)",
          platform: "douyin",
          platformName: "도우인",
          followers: "1억+ 팔로워",
          highlight: "도우인 역사상 최다 팔로워, 엽기 반전 연기 완판 신화",
          url: "https://www.douyin.com",
          createdAt: Date.now()
        },
        {
          id: "init_2",
          title: "1분만",
          platform: "youtube",
          platformName: "유튜브",
          followers: "128만 구독자",
          highlight: "1분 안에 쾌속으로 전개되는 호기심 해결 쇼츠",
          url: "https://www.youtube.com/@1minute_know",
          createdAt: Date.now()
        }
      ]
    });
    console.log("📦 기본 북마크 샘플 2개가 초기화되었습니다.");
  }
});
