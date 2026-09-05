// ============================================================================
// 🎬 src/Root.tsx
// Remotion의 Root 컴포넌트입니다.
// 이 파일에서는 만드는 모든 비디오의 설정(ID, 해상도, 초당 프레임 수(FPS), 전체 길이 등)을 Composition으로 등록합니다.
// ============================================================================

import React from "react";
import { Composition } from "remotion";
import { MainComposition } from "./Composition";
import { ProductShorts } from "./ProductShorts";
import { VoiceShorts } from "./VoiceShorts";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 1. 기본 예제 컴포지션 (가로형 16:9 - 1920x1080, 5초/150프레임) */}
      <Composition<any, any>
        id="MainComposition"
        component={MainComposition}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          titleText: "Remotion에 오신 것을 환영합니다!",
          titleColor: "#61dafb",
        }}
      />

      {/* 2. 쿠팡 파트너스 / 쇼핑 홍보 숏폼 컴포지션 (세로형 9:16 - 1080x1920, 15초/450프레임) */}
      <Composition<any, any>
        id="CoupangProductShorts"
        component={ProductShorts}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          headlineText: "🔥 3일간 진행되는 역대급 파격 특가!",
          productName: "프리미엄 무선 노이즈캔슬링 헤드폰 PRO",
          imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
          originalPrice: "299,000원",
          discountPrice: "189,000원",
          discountRate: "36% OFF",
          features: [
            "🎧 노이즈 캔슬링으로 완벽 소음 차단",
            "🔋 40시간 연속 재생 대용량 배터리",
            "☁️ 초경량 메모리폼의 편안한 착용감",
          ],
          ctaText: "👉 프로필 링크 누르고 최저가 혜택 받기!",
          primaryColor: "#FF385C",
        }}
      />

      {/* 3. 🎙️ AI 한국어 음성(TTS) & 단어별 실시간 자막 싱크 쇼츠 (세로형 9:16 - 1080x1920, 약 9초/270프레임) */}
      <Composition<any, any>
        id="VoiceShorts"
        component={VoiceShorts}
        durationInFrames={270}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          title: "오늘의 핵심 특가 소식!",
          badgeText: "AI 스마트 브리핑",
          primaryColor: "#FF007A",
          secondaryColor: "#7928CA",
        }}
      />
    </>
  );
};
