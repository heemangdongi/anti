// ============================================================================
// 🎬 src/LiftingTapeShorts.tsx
// "스킨업 페이스 브이라인 리프팅 테이프" 전용 바이럴 쇼츠 컴포넌트입니다.
// 도우인/틱톡 뷰티 떡상 공식(후킹 -> 시연 효과 -> 초슬림 특장점 -> 특가 CTA)에
// 신나는 비트 BGM(오디오 더킹)과 3대 타이밍 효과음(SFX)을 완벽 결합하였습니다.
// ============================================================================

import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Sparkles, Zap, Flame, ArrowRight, ShieldCheck, Heart } from "lucide-react";
import liftingData from "./subtitles_lifting.json";

// 자막 단어 인터페이스 정의
interface SubtitleWord {
  id: number;
  text: string;
  startSec: number;
  endSec: number;
  startFrame: number;
  endFrame: number;
}

export const LiftingTapeShorts: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. 메인 자막 데이터
  const subtitles: SubtitleWord[] = liftingData.subtitles;

  // 2. 현재 말하고 있는 단어 인덱스 찾기
  const currentWordIndex = subtitles.findIndex(
    (w) => frame >= w.startFrame && frame <= w.endFrame
  );

  // 3. 자막을 보기 좋게 3~4단어씩 그룹화해서 화면에 띄우기 (쇼츠 가독성 극대화)
  const groupStart = Math.max(0, currentWordIndex - (currentWordIndex % 4));
  const currentGroup = subtitles.slice(groupStart, groupStart + 4);

  // 4. 제품 이미지 부드러운 플로팅(둥실둥실) 애니메이션
  const floatY = Math.sin(frame / 12) * 12;
  const imageScale = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.8 },
  });

  // 5. 프레임 구간별 상태 감지 (0~140: 후킹, 141~350: 리프팅 효과, 351~520: 무광 방수 특장점, 521~: 특가 CTA)
  const isHooking = frame < 150;
  const isFeature = frame >= 350 && frame < 520;
  const isCta = frame >= 520;

  // 6. 🎧 지능형 오디오 더킹(Audio Ducking) 볼륨 계산
  // 성우가 말을 할 때는 BGM 볼륨을 0.15로 낮춰 대사가 또렷하게 들리고,
  // 말이 쉬는 구간(500프레임 이후)에서는 0.35로 올려 신나게 분위기를 살립니다.
  const isSpeaking = currentWordIndex !== -1;
  const bgmVolume = interpolate(
    frame,
    [0, 30, 480, 520, 620, 650],
    [0.2, isSpeaking ? 0.15 : 0.25, 0.15, 0.35, 0.35, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0B0F19",
        fontFamily: "'Pretendard', sans-serif",
        color: "#FFFFFF",
        overflow: "hidden",
      }}
    >
      {/* ================================================================== */}
      {/* 🎵 [오디오 트랙]: 목소리 + BGM + 3대 타이밍 효과음(SFX) */}
      {/* ================================================================== */}
      
      {/* 1. 메인 AI 성우 내레이션 음성 */}
      <Audio src={staticFile("lifting_voice.mp3")} volume={1.0} />

      {/* 2. 트렌디 숏폼 미니멀 비트 BGM (오디오 더킹 적용) */}
      <Audio src={staticFile("bgm.wav")} volume={bgmVolume} />

      {/* 3. [0초 후킹] 묵직한 베이스 드롭 임팩트 사운드 (쿵!) */}
      <Sequence from={0} durationInFrames={35}>
        <Audio src={staticFile("impact.wav")} volume={0.8} />
      </Sequence>

      {/* 4. [7초 215프레임] 테이프 당겨 붙이는 쾌감 스우시 사운드 (슉!) */}
      <Sequence from={215} durationInFrames={20}>
        <Audio src={staticFile("whoosh.wav")} volume={0.85} />
      </Sequence>

      {/* 5. [10초 290프레임] 3초 만에 리프팅 완성 반짝임 사운드 (띵!) */}
      <Sequence from={290} durationInFrames={30}>
        <Audio src={staticFile("ding.wav")} volume={0.7} />
      </Sequence>

      {/* 6. [18초 525프레임] 프로필 링크 특가 유도 클릭 팝 사운드 (띵!) */}
      <Sequence from={525} durationInFrames={30}>
        <Audio src={staticFile("ding.wav")} volume={0.9} />
      </Sequence>

      {/* 🌸 은은하게 퍼지는 럭셔리 핑크 & 퍼플 네온 오로라 배경 */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          left: "-10%",
          width: "900px",
          height: "900px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255, 105, 180, 0.25) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-10%",
          right: "-10%",
          width: "900px",
          height: "900px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* 📌 메인 9:16 쇼츠 레이아웃 (세로 1920px) */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          height: "100%",
          padding: "90px 50px 70px",
          boxSizing: "border-box",
          zIndex: 2,
        }}
      >
        {/* ================================================================== */}
        {/* 🔼 [상단 섹션]: 후킹 뱃지 및 메인 카피 */}
        {/* ================================================================== */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
          {/* 상단 포인트 태그 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 28px",
              borderRadius: "50px",
              background: "rgba(255, 255, 255, 0.12)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255, 255, 255, 0.25)",
              boxShadow: "0 8px 30px rgba(255, 105, 180, 0.3)",
            }}
          >
            <Sparkles size={26} color="#FF69B4" />
            <span style={{ fontSize: "28px", fontWeight: 800, color: "#FFFFFF", letterSpacing: "1px" }}>
              {isHooking ? "🚨 턱선 실종 비상!" : isFeature ? "✨ 초슬림 무광 방수" : "🔥 오늘 단 하루 특가"}
            </span>
          </div>

          {/* 메인 제품 타이틀 */}
          <h1
            style={{
              fontSize: "58px",
              fontWeight: 900,
              textAlign: "center",
              margin: 0,
              lineHeight: 1.25,
              background: "linear-gradient(135deg, #FFFFFF 0%, #FFD1DC 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 4px 25px rgba(0,0,0,0.6)",
            }}
          >
            스킨업 브이라인 리프팅 테이프
          </h1>
        </div>

        {/* ================================================================== */}
        {/* 🖼️ [중앙 섹션]: AI 생성 초고화질 제품 쇼케이스 카드 */}
        {/* ================================================================== */}
        <div
          style={{
            position: "relative",
            width: "680px",
            height: "680px",
            borderRadius: "40px",
            overflow: "hidden",
            boxShadow: "0 25px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(255, 105, 180, 0.25)",
            border: "2px solid rgba(255, 255, 255, 0.2)",
            transform: `scale(${imageScale}) translateY(${floatY}px)`,
          }}
        >
          {/* AI 생성 제품 이미지 */}
          <Img
            src={staticFile("lifting_tape.jpg")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

          {/* 3초 만에 올라가는 쾌감 플로팅 배지 */}
          <div
            style={{
              position: "absolute",
              top: "24px",
              right: "24px",
              padding: "10px 22px",
              borderRadius: "20px",
              background: "rgba(255, 0, 90, 0.85)",
              backdropFilter: "blur(10px)",
              color: "#FFFFFF",
              fontSize: "24px",
              fontWeight: 900,
              boxShadow: "0 6px 20px rgba(255, 0, 90, 0.5)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Zap size={22} color="#FFF" />
            <span>3초 리프팅 완성</span>
          </div>

          {/* 하단 투명 무광 안내 오버레이 */}
          <div
            style={{
              position: "absolute",
              bottom: "0",
              left: "0",
              right: "0",
              padding: "24px 30px",
              background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <ShieldCheck size={26} color="#10B981" />
              <span style={{ fontSize: "24px", fontWeight: 700, color: "#E2E8F0" }}>
                초밀착 무광 • 완벽 방수
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#FF69B4" }}>
              <Heart size={22} fill="#FF69B4" />
              <span style={{ fontSize: "22px", fontWeight: 800 }}>실시간 인기 1위</span>
            </div>
          </div>
        </div>

        {/* ================================================================== */}
        {/* 💬 [중하단 섹션]: 노래방 스타일 단어 싱크 자막 박스 (핵심 떡상 포인트!) */}
        {/* ================================================================== */}
        <div
          style={{
            width: "100%",
            minHeight: "180px",
            padding: "30px 40px",
            borderRadius: "32px",
            background: "rgba(15, 23, 42, 0.85)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.18)",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: "16px 20px",
          }}
        >
          {currentGroup.map((word) => {
            const isSpeakingNow = frame >= word.startFrame && frame <= word.endFrame;
            const hasPassed = frame > word.endFrame;

            return (
              <span
                key={word.id}
                style={{
                  fontSize: isSpeakingNow ? "54px" : "46px",
                  fontWeight: isSpeakingNow ? 900 : 700,
                  padding: isSpeakingNow ? "8px 24px" : "6px 14px",
                  borderRadius: "18px",
                  background: isSpeakingNow
                    ? "linear-gradient(135deg, #FF1493 0%, #FF8C00 100%)"
                    : "transparent",
                  color: isSpeakingNow
                    ? "#FFFFFF"
                    : hasPassed
                    ? "#CBD5E1"
                    : "rgba(255, 255, 255, 0.35)",
                  transform: isSpeakingNow ? "scale(1.15)" : "scale(1.0)",
                  transition: "all 0.08s ease-out",
                  boxShadow: isSpeakingNow
                    ? "0 10px 30px rgba(255, 20, 147, 0.6)"
                    : "none",
                  display: "inline-block",
                  letterSpacing: "-0.5px",
                }}
              >
                {word.text}
              </span>
            );
          })}
        </div>

        {/* ================================================================== */}
        {/* 🛒 [하단 CTA 섹션]: 구매 유도 및 프로필 링크 안내 버튼 */}
        {/* ================================================================== */}
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 36px",
            borderRadius: "50px",
            background: isCta
              ? "linear-gradient(135deg, #FF0055 0%, #FF6600 100%)"
              : "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            boxShadow: isCta
              ? "0 12px 40px rgba(255, 0, 85, 0.6)"
              : "0 8px 24px rgba(0, 0, 0, 0.3)",
            transition: "all 0.3s ease",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Flame size={32} color="#FFD700" />
            <span style={{ fontSize: "28px", fontWeight: 900, color: "#FFFFFF" }}>
              {isCta ? "🔥 지금 바로 프로필 링크 클릭!" : "👉 중요한 날 3초 만에 턱선 복구"}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "#FFFFFF",
              color: "#0F172A",
              padding: "10px 22px",
              borderRadius: "40px",
              fontSize: "22px",
              fontWeight: 900,
            }}
          >
            <span>최저가 보러가기</span>
            <ArrowRight size={22} color="#0F172A" />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
