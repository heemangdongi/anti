// ============================================================================
// 📊 data/trending_data.js
// 6대 플랫폼(도우인, 틱톡, 유튜브, 샤오홍슈, 인스타, 스레드) 인기 채널 & 떡상 키워드 DB
// ============================================================================

export const PLATFORMS_DATA = {
  douyin: {
    id: "douyin",
    name: "도우인 (抖音)",
    badge: "중국 원조 숏폼",
    color: "#FE2C55",
    gradient: "linear-gradient(135deg, #FE2C55 0%, #25F4EE 100%)",
    searchUrl: "https://www.douyin.com/search/{query}",
    tags: ["#变美秘籍 (예뻐지는비결)", "#好物推荐 (꿀템추천)", "#沉浸式护肤 (몰입스킨케어)", "#逆袭 (비포애프터대변신)", "#V脸神器 (V라인치트키)", "#带货榜 (커머스1등)"],
    channels: [
      {
        id: "dy_1",
        name: "疯狂小杨哥 (미친샤오양형제)",
        handle: "@xiaoyangge",
        followers: "1억+ 팔로워",
        category: "라이브커머스 / 유머",
        highlight: "도우인 역사상 최다 팔로워, 엽기 반전 연기로 상품 1초 완판 신화",
        url: "https://www.douyin.com/user/MS4wLjABAAAA_5w6kH3q_example",
        tags: ["완판신화", "반전개그", "폭풍리액션"]
      },
      {
        id: "dy_2",
        name: "刘畊宏 (류겅홍)",
        handle: "@liugenghong",
        followers: "6,800만",
        category: "홈트 / 헬스 / 뷰티",
        highlight: "중국 전역에 '본초강목' 홈트 신드롬, 역동적인 운동과 건강 라이프스타일",
        url: "https://www.douyin.com/search/%E5%88%98%E7%95%8A%E5%AE%8F",
        tags: ["본초강목홈트", "국민코치", "활력에너지"]
      },
      {
        id: "dy_3",
        name: "美妆老爸 (변신 메이크업 연구소)",
        handle: "@beauty_magic",
        followers: "2,400만",
        category: "뷰티 / 비포애프터",
        highlight: "리프팅 테이프와 윤곽 컨투어링을 이용한 10초 극적 페이스오프 연출 1등",
        url: "https://www.douyin.com/search/%E5%8F%98%E7%BE%8E%E7%A7%98%E7%B1%8D",
        tags: ["페이스리프팅", "3초변신", "비포애프터"]
      },
      {
        id: "dy_4",
        name: "董宇辉 (동방선발 / 지식커머스)",
        handle: "@dongyuhui",
        followers: "2,600만",
        category: "지식 / 인문학 쇼핑",
        highlight: "단순 물건 판매가 아닌 시적이고 철학적인 스토리텔링으로 감동을 주는 판매 혁명",
        url: "https://www.douyin.com/search/%E8%91%A3%E5%AE%87%E8%BE%89",
        tags: ["스토리텔링", "감성스피치", "지식쇼핑"]
      }
    ]
  },

  tiktok: {
    id: "tiktok",
    name: "틱톡 (TikTok)",
    badge: "글로벌 바이럴",
    color: "#00F2FE",
    gradient: "linear-gradient(135deg, #000000 0%, #FE2C55 50%, #00F2FE 100%)",
    searchUrl: "https://www.tiktok.com/search?q={query}",
    tags: ["#TikTokMadeMeBuyIt", "#BeautyHacks", "#SkinCare101", "#LifeHacks", "#AmazonFinds", "#Satisfying"],
    channels: [
      {
        id: "tt_1",
        name: "Khaby Lame",
        handle: "@khaby.lame",
        followers: "1.62억 팔로워",
        category: "라이프핵 / 무언 풍자",
        highlight: "말 한마디 없이 표정과 손짓만으로 복잡한 꿀팁을 간단하게 해결하는 세계 1등",
        url: "https://www.tiktok.com/@khaby.lame",
        tags: ["무언극", "시그니처손동작", "글로벌원탑"]
      },
      {
        id: "tt_2",
        name: "Mikayla Nogueira",
        handle: "@mikaylanogueira",
        followers: "1,580만",
        category: "뷰티 / 솔직 리뷰",
        highlight: "솔직하고 파워풀한 보스턴 악센트 발성과 초밀착 클로즈업 리뷰로 품절 대란 제조기",
        url: "https://www.tiktok.com/@mikaylanogueira",
        tags: ["솔직발색", "품절대란", "밀착클로즈업"]
      },
      {
        id: "tt_3",
        name: "Teresa Caruso (Amazon Finds)",
        handle: "@teresalauracaruso",
        followers: "380만",
        category: "아마존 꿀템 / 라이프스타일",
        highlight: "삶의 질을 수직 상승시키는 기발한 홈가젯 및 뷰티 툴 큐레이션 전문",
        url: "https://www.tiktok.com/@teresalauracaruso",
        tags: ["아마존꿀템", "삶의질상승", "감성가젯"]
      },
      {
        id: "tt_4",
        name: "Korean Skincare Secrets",
        handle: "@kbeautyofficial",
        followers: "520만",
        category: "K-뷰티 / 글래스스킨",
        highlight: "한국 화장품 꿀조합, 물광 피부 루틴, V라인 마사지법 글로벌 바이럴",
        url: "https://www.tiktok.com/search?q=korean%20skincare",
        tags: ["글래스스킨", "K뷰티루틴", "V라인관리"]
      }
    ]
  },

  youtube: {
    id: "youtube",
    name: "유튜브 (YouTube Shorts)",
    badge: "100만 쇼츠 랭킹",
    color: "#FF0000",
    gradient: "linear-gradient(135deg, #FF0000 0%, #8B0000 100%)",
    searchUrl: "https://www.youtube.com/results?search_query={query}&sp=EgIQAQ%253D%253D",
    tags: ["#쇼츠꿀팁", "#올리브영추천템", "#1분상식", "#다이소꿀템", "#생활정보", "#내돈내산"],
    channels: [
      {
        id: "yt_1",
        name: "1분만",
        handle: "@1minute_know",
        followers: "128만 구독자",
        category: "지식 / 생활 정보",
        highlight: "정확히 1분 안에 쾌속으로 전개되는 호기심 해결과 중독성 있는 나레이션",
        url: "https://www.youtube.com/@1minute_know",
        tags: ["1분완성", "속사포나레이션", "호기심유발"]
      },
      {
        id: "yt_2",
        name: "화장하는 청담언니",
        handle: "@makeup_sister",
        followers: "165만",
        category: "뷰티 / 홈케어 꿀팁",
        highlight: "연예인 메이크업 시크릿, 턱선 리프팅, 모공 커버 비법 30초 압축 전수",
        url: "https://www.youtube.com/results?search_query=%ED%99%94%EC%9E%A5%ED%95%98%EB%8A%94%EC%B2%AD%EB%8B%B4%EC%96%B8%EB%8B%88",
        tags: ["청담동비법", "모공실종", "연예인V라인"]
      },
      {
        id: "yt_3",
        name: "잡식공룡",
        handle: "@dinoknow",
        followers: "82만",
        category: "테크 / 가젯 / 꿀템",
        highlight: "신박한 아이디어 상품과 전자기기 실사용 팩트 체크 쇼츠 1인자",
        url: "https://www.youtube.com/results?search_query=%EC%9E%A1%EC%8B%9D%EA%B3%B5%EB%A3%A1",
        tags: ["신박한가젯", "팩트체크", "솔직후기"]
      },
      {
        id: "yt_4",
        name: "디에디트 라이프",
        handle: "@the_edit",
        followers: "54만",
        category: "트렌드 / 라이프스타일",
        highlight: "사는 재미가 없으면 사는 재미라도! 고감도 취향 큐레이션과 쇼핑 꿀템",
        url: "https://www.youtube.com/results?search_query=%EB%94%94%EC%97%90%EB%94%94%ED%8A%B8+%EC%87%BC%EC%B8%A0",
        tags: ["취향저격", "감성리뷰", "트렌드리포트"]
      }
    ]
  },

  xiaohongshu: {
    id: "xiaohongshu",
    name: "샤오홍슈 (小红书)",
    badge: "중국 감성 뷰티 성지",
    color: "#FE2442",
    gradient: "linear-gradient(135deg, #FE2442 0%, #FF6B8B 100%)",
    searchUrl: "https://www.xiaohongshu.com/search_result?keyword={query}",
    tags: ["#小红书爆款 (샤오홍슈떡상템)", "#抗老紧致 (탄력리프팅)", "#我的护肤日常 (내스킨케어루틴)", "#无滤镜原相机 (노필터기본캠)", "#干货分享 (핵심꿀팁)"],
    channels: [
      {
        id: "xhs_1",
        name: "成分控小徐 (성분전문가)",
        handle: "@skincare_expert",
        followers: "420만",
        category: "성분 분석 / 피부과 솔루션",
        highlight: "화장품 전성분 현미경 분석, 피부 장벽 복구 및 턱선 탄력 루틴 전문",
        url: "https://www.xiaohongshu.com/search_result?keyword=%E6%8A%97%E8%80%81%E7%B4%A7%E8%87%B4",
        tags: ["성분분석", "피부과꿀팁", "노필터인증"]
      },
      {
        id: "xhs_2",
        name: "氛围感制造机 (무드 메이커)",
        handle: "@mood_creator",
        followers: "360만",
        category: "메이크업 / 분위기 연출",
        highlight: "이목구비가 입체적으로 살아나는 섀딩과 미세 테이핑 윤곽 기법 1등",
        url: "https://www.xiaohongshu.com/search_result?keyword=%E6%B0%9B%E5%9B%B4%E6%84%9F%E5%A6%86%E5%AE%B9",
        tags: ["분위기여신", "입체윤곽", "감성셀카"]
      },
      {
        id: "xhs_3",
        name: "居家生活家 (라이프스타일 큐레이터)",
        handle: "@home_lifestyle",
        followers: "290만",
        category: "인테리어 / 미니멀 꿀템",
        highlight: "작은 원룸을 럭셔리 호텔처럼 바꿔주는 가성비 소품과 정리 정돈 팁",
        url: "https://www.xiaohongshu.com/search_result?keyword=%E5%B1%85%E5%AE%B6%E5%A5%BD%E7%89%A9",
        tags: ["원룸인테리어", "수납혁명", "가성비소품"]
      }
    ]
  },

  instagram: {
    id: "instagram",
    name: "인스타그램 (Reels)",
    badge: "감성 & 트렌드 릴스",
    color: "#E1306C",
    gradient: "linear-gradient(135deg, #833AB4 0%, #FD1D1D 50%, #FCB045 100%)",
    searchUrl: "https://www.instagram.com/explore/tags/{query}/",
    tags: ["#릴스떡상", "#인스타꿀템", "#홈케어루틴", "#올영세일", "#라이프스타일", "#감성리뷰"],
    channels: [
      {
        id: "ig_1",
        name: "오늘의 꿀템집",
        handle: "@today_gooditem",
        followers: "142만 팔로워",
        category: "쇼핑 / 생활 꿀템",
        highlight: "보고 나면 장바구니에 담을 수밖에 없는 마성의 15초 직관 릴스",
        url: "https://www.instagram.com/explore/tags/%EA%BF%80%ED%85%9C%EC%B6%94%EC%B2%9C/",
        tags: ["15초완판", "직관적시연", "시선강탈"]
      },
      {
        id: "ig_2",
        name: "글로우 스킨랩",
        handle: "@glow_skin_kr",
        followers: "98만",
        category: "에스테틱 / 페이스요가",
        highlight: "집에서 3분 만에 끝내는 V라인 괄사 마사지 & 리프팅 케어 릴스",
        url: "https://www.instagram.com/explore/tags/%ED%99%88%EC%BC%80%EC%96%B4%EB%A3%A8%ED%8B%B4/",
        tags: ["페이스요가", "괄사마사지", "윤곽케어"]
      },
      {
        id: "ig_3",
        name: "트렌드 캐처",
        handle: "@trend_catcher_kr",
        followers: "115만",
        category: "MZ 트렌드 / 바이럴 밈",
        highlight: "지금 인스타에서 가장 핫한 릴스 오디오 템플릿과 밈 실시간 큐레이션",
        url: "https://www.instagram.com/explore/tags/%EB%A6%B4%EC%8A%A4%EB%96%A1%EC%83%81/",
        tags: ["인기오디오", "바이럴밈", "릴스템플릿"]
      }
    ]
  },

  threads: {
    id: "threads",
    name: "스레드 (Threads)",
    badge: "텍스트 & 숏폼 인사이트",
    color: "#FFFFFF",
    gradient: "linear-gradient(135deg, #2D3748 0%, #1A202C 100%)",
    searchUrl: "https://www.threads.net/search?q={query}",
    tags: ["#스레드인사이트", "#숏폼마케팅", "#1인창업", "#알고리즘비밀", "#브랜딩꿀팁"],
    channels: [
      {
        id: "th_1",
        name: "숏폼 연구소 김소장",
        handle: "@shortform_lab",
        followers: "14.5만 팔로워",
        category: "숏폼 알고리즘 / 기획",
        highlight: "틱톡과 릴스 알고리즘의 최신 변화와 3초 후킹 공식 텍스트 분석 타래",
        url: "https://www.threads.net/search?q=%EC%87%BC%ED%8F%BC%EC%95%8C%EA%B3%A0%EB%A6%AC%EC%8A%B8",
        tags: ["알고리즘분석", "3초후킹법", "시청지속시간"]
      },
      {
        id: "th_2",
        name: "1인 비즈니스 부스터",
        handle: "@solo_biz_booster",
        followers: "9.8만",
        category: "AI 쇼츠 자동화 / 부업",
        highlight: "노코드와 AI 툴을 결합하여 월 100편 쇼츠 자동 제작하는 워크플로우 공유",
        url: "https://www.threads.net/search?q=%EC%87%BC%ED%8F%BC%EC%9E%90%EB%8F%99%ED%99%94",
        tags: ["AI자동화", "노코드쇼츠", "수익화루트"]
      },
      {
        id: "th_3",
        name: "커머스 떡상 치트키",
        handle: "@commerce_hack",
        followers: "11.2만",
        category: "이커머스 / 상품 소싱",
        highlight: "도우인에서 터진 뷰티/생활용품을 한국 쿠팡과 스마트스토어로 가져와 대박 내는 소싱 비법",
        url: "https://www.threads.net/search?q=%EC%83%81%ED%92%88%EC%86%8C%EC%8B%B1",
        tags: ["중국소싱", "도우인히트상품", "쿠팡로켓"]
      }
    ]
  }
};
