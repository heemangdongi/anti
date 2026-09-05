// ============================================================================
// 🎬 src/VoiceShorts.tsx
// AI 한국어 음성(TTS)과 100% 싱크되는 다이내믹 단어 자막 쇼츠 컴포넌트입니다.
// Remotion의 오디오 재생과 프레임 기반 자막 하이라이트 효과를 결합하였습니다.
// ============================================================================

import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Sparkles, Volume2, Flame, ArrowRight } from "lucide-react";
import subtitleData from "./subtitles.json";

// 자막 단어 데이터 타입 정의
interface SubtitleWord {
  id: number;
  text: string;
  startSec: number;
  endSec: number;
  startFrame: number;
  endFrame: number;
}

// 컴포넌트 Props 인터페이스 정의
export interface VoiceShortsProps {
  title?: string;
  badgeText?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export const VoiceShorts: React.FC<VoiceShortsProps> = ({
  title = "오늘의 핵심 특가 소식!",
  badgeText = "AI 스마트 브리핑",
  primaryColor = "#FF007A",
  secondaryColor = "#7928CA",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. 배경 은은한 펄스(숨쉬는 효과) 애니메이션
  const bgScale = interpolate(
    Math.sin(frame / 15),
    [-1, 1],
    [1.0, 1.05]
  );

  // 2. 상단 헤더 등장 스프링 애니메이션
  const headerSpring = spring({
    frame,
    fps,
    config: { damping: 12 },
  });

  // 3. 자막 데이터 가져오기
  const subtitles: SubtitleWord[] = subtitleData.subtitles;

  // 4. 현재 말하고 있는 단어 찾기
  const currentWord = subtitles.find(
    (w) => frame >= w.startFrame && frame <= w.endFrame
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0F172A",
        fontFamily: "'Pretendard', sans-serif",
        color: "#FFFFFF",
        overflow: "hidden",
      }}
    >
      {/* 🎧 생성된 AI 음성 파일 재생 (public/audio.mp3) */}
      <Audio src={staticFile("audio.mp3")} />

      {/* 🌌 은은하게 움직이는 배경 그라데이션 오브젝트 */}
      <div
        style={{
          position: "absolute",
          top: "-15%",
          left: "-15%",
          width: "800px",
          height: "800px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${primaryColor}44 0%, transparent 70%)`,
          transform: `scale(${bgScale})`,
          filter: "blur(60px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-15%",
          right: "-15%",
          width: "800px",
          height: "800px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${secondaryColor}44 0%, transparent 70%)`,
          transform: `scale(${bgScale})`,
          filter: "blur(60px)",
        }}
      />

      {/* 📌 메인 콘텐츠 영역 (세로형 쇼츠 9:16 레이아웃) */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          height: "100%",
          padding: "100px 60px",
          boxSizing: "border-box",
          zIndex: 1,
        }}
      >
        {/* 🔼 상단: 배지 및 타이틀 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transform: `scale(${headerSpring})`,
            opacity: headerSpring,
          }}
        >
          {/* 배지 (Lucide Icon 적용) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 28px",
              borderRadius: "50px",
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
              marginBottom: "30px",
            }}
          >
            <Sparkles size={28} color="#FFDF00" />
            <span style={{ fontSize: "28px", fontWeight: "bold", letterSpacing: "1px" }}>
              {badgeText}
            </span>
          </div>

          {/* 메인 타이틀 */}
          <h1
            style={{
              fontSize: "64px",
              fontWeight: 900,
              textAlign: "center",
              margin: 0,
              lineHeight: 1.3,
              background: `linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 4px 20px rgba(0,0,0,0.5)",
            }}
          >
            {title}
          </h1>
        </div>

        {/* 🎙️ 중앙: 실시간 AI 음성 파형 시각화 카드 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "40px 60px",
            background: "rgba(255, 255, 255, 0.05)",
            borderRadius: "32px",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(16px)",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.3)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginBottom: "24px",
            }}
          >
            <Volume2 size={36} color="#38BDF8" />
            <span style={{ fontSize: "32px", fontWeight: 600, color: "#38BDF8" }}>
              AI 성우 실시간 내레이션
            </span>
          </div>

          {/* 음성 웨이브 애니메이션 막대기들 */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", height: "80px" }}>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
              const barHeight = currentWord
                ? interpolate(Math.sin((frame + i * 5) / 3), [-1, 1], [20, 75])
                : 15;
              return (
                <div
                  key={i}
                  style={{
                    width: "12px",
                    height: `${barHeight}px`,
                    borderRadius: "8px",
                    background: `linear-gradient(to top, ${primaryColor}, ${secondaryColor})`,
                    transition: "height 0.05s ease",
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* 💬 하단: 실시간 단어 싱크 자막 영역 (핵심 기능!) */}
        <div
          style={{
            width: "100%",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: "16px 20px",
            padding: "36px",
            background: "rgba(15, 23, 42, 0.75)",
            borderRadius: "32px",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
            minHeight: "220px",
          }}
        >
          {subtitles.map((word) => {
            const isSpeakingNow = frame >= word.startFrame && frame <= word.endFrame;
            const hasSpoken = frame > word.endFrame;

            return (
              <span
                key={word.id}
                style={{
                  fontSize: isSpeakingNow ? "52px" : "44px",
                  fontWeight: isSpeakingNow ? 900 : 700,
                  padding: isSpeakingNow ? "10px 24px" : "6px 16px",
                  borderRadius: "20px",
                  background: isSpeakingNow
                    ? `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
                    : "transparent",
                  color: isSpeakingNow
                    ? "#FFFFFF"
                    : hasSpoken
                    ? "#94A3B8"
                    : "rgba(255, 255, 255, 0.35)",
                  transform: isSpeakingNow ? "scale(1.15)" : "scale(1.0)",
                  transition: "all 0.12s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  boxShadow: isSpeakingNow
                    ? "0 10px 30px rgba(255, 0, 122, 0.5)"
                    : "none",
                  display: "inline-block",
                }}
              >
                {word.text}
              </span>
            );
          })}
        </div>

        {/* 🎯 바닥 CTA (행동 유도 문구) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            color: "#CBD5E1",
            fontSize: "30px",
            fontWeight: 600,
          }}
        >
          <Flame size={32} color="#F97316" />
          <span>지금 바로 프로필 링크에서 만나보세요</span>
          <ArrowRight size={32} color="#F97316" />
        </div>
      </div>
    </AbsoluteFill>
  );
};
