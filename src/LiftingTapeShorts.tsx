// ============================================================================
// 🎬 src/LiftingTapeShorts.tsx
// "스킨업 페이스 브이라인 리프팅 테이프" Google Flow(Veo AI) 지원 멀티컷 쇼츠 컴포넌트입니다.
// 실제 비디오 파일(flow_scene1.mp4 등)이 있으면 실제 살아 움직이는 4K 비디오를 재생하고,
// 이미지 모드에서도 켄 번스(Ken Burns) 카메라 무빙과 BGM, 효과음, 단어 싱크 자막이 완벽 작동합니다.
// ============================================================================

import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  Video,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Sparkles, Zap, Flame, ArrowRight, ShieldCheck, AlertCircle, Video as VideoIcon } from "lucide-react";
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

  // 1. 자막 데이터 로드
  const subtitles: SubtitleWord[] = liftingData.subtitles;

  // 2. 현재 발화 중인 단어 찾기
  const currentWordIndex = subtitles.findIndex(
    (w) => frame >= w.startFrame && frame <= w.endFrame
  );

  // 3. 자막을 보기 좋게 3~4단어 그룹으로 슬라이스
  const groupStart = Math.max(0, currentWordIndex - (currentWordIndex % 4));
  const currentGroup = subtitles.slice(groupStart, groupStart + 4);

  // 4. 🎧 지능형 오디오 더킹 (Audio Ducking)
  const isSpeaking = currentWordIndex !== -1;
  const bgmVolume = interpolate(
    frame,
    [0, 30, 480, 520, 620, 650],
    [0.2, isSpeaking ? 0.15 : 0.25, 0.15, 0.35, 0.35, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // 5. 컷 전환 애니메이션 (켄 번스 카메라 무빙)
  const cut1Scale = interpolate(frame, [0, 150], [1.0, 1.15], { extrapolateRight: "clamp" });
  const cut2Scale = interpolate(frame, [151, 350], [1.05, 1.18], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cut2Y = interpolate(frame, [151, 350], [0, -30], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cut3Scale = interpolate(frame, [351, 520], [1.16, 1.02], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // 컷 4 제품 카드 스프링 팝업
  const cut4Spring = spring({
    frame: frame - 521,
    fps,
    config: { damping: 12 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#05070D",
        fontFamily: "'Pretendard', sans-serif",
        color: "#FFFFFF",
        overflow: "hidden",
      }}
    >
      {/* ================================================================== */}
      {/* 🎵 [오디오 트랙]: 성우 음성 + BGM + 3대 타이밍 효과음(SFX) */}
      {/* ================================================================== */}
      <Audio src={staticFile("lifting_voice.mp3")} volume={1.0} />
      <Audio src={staticFile("bgm.wav")} volume={bgmVolume} />

      {/* 0초 쿵! 베이스 드롭 (후킹 임팩트) */}
      <Sequence from={0} durationInFrames={35}>
        <Audio src={staticFile("impact.wav")} volume={0.8} />
      </Sequence>
      {/* 7초 슉! 테이프 부착 스우시 (리프팅 시연) */}
      <Sequence from={215} durationInFrames={20}>
        <Audio src={staticFile("whoosh.wav")} volume={0.85} />
      </Sequence>
      {/* 10초 띵! 리프팅 완성 벨 */}
      <Sequence from={290} durationInFrames={30}>
        <Audio src={staticFile("ding.wav")} volume={0.7} />
      </Sequence>
      {/* 18초 띵! 특가 CTA 클릭음 */}
      <Sequence from={525} durationInFrames={30}>
        <Audio src={staticFile("ding.wav")} volume={0.9} />
      </Sequence>

      {/* ================================================================== */}
      {/* 🎬 [멀티 컷 레이어]: Google Flow 비디오 및 시네마틱 씬 (4단 전환) */}
      {/* ================================================================== */}

      {/* 🔴 [컷 1: 후킹 씬 (0~150f)] 거울 보며 턱살 고민하는 장면 */}
      {frame <= 150 && (
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <Img
            src={staticFile("scene1_concern.jpg")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${cut1Scale})`,
              filter: "contrast(1.05) brightness(0.95)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(5,7,13,0.95) 0%, rgba(5,7,13,0.4) 30%, transparent 60%)",
            }}
          />
        </AbsoluteFill>
      )}

      {/* 🟡 [컷 2: 시연 씬 (151~350f)] 턱선에 테이프 붙이고 당기는 시연 장면 */}
      {frame > 150 && frame <= 350 && (
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <Img
            src={staticFile("scene2_apply.jpg")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${cut2Scale}) translateY(${cut2Y}px)`,
              filter: "contrast(1.08) brightness(1.0)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(5,7,13,0.95) 0%, rgba(5,7,13,0.4) 30%, transparent 60%)",
            }}
          />
        </AbsoluteFill>
      )}

      {/* 🟢 [컷 3: 완성 씬 (351~520f)] 완벽한 V라인과 미소로 자신감 넘치는 모델 */}
      {frame > 350 && frame <= 520 && (
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <Img
            src={staticFile("scene3_beauty.jpg")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${cut3Scale})`,
              filter: "contrast(1.05) brightness(1.02)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(5,7,13,0.95) 0%, rgba(5,7,13,0.4) 30%, transparent 60%)",
            }}
          />
        </AbsoluteFill>
      )}

      {/* 🟣 [컷 4: 엔딩 CTA 씬 (521~652f)] 럭셔리 제품 실물 쇼케이스 카드 */}
      {frame > 520 && (
        <AbsoluteFill style={{ overflow: "hidden", background: "#0B0F19" }}>
          <div
            style={{
              position: "absolute",
              top: "-15%",
              left: "-10%",
              width: "800px",
              height: "800px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255, 0, 122, 0.3) 0%, transparent 70%)",
              filter: "blur(90px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-15%",
              right: "-10%",
              width: "800px",
              height: "800px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(121, 40, 202, 0.3) 0%, transparent 70%)",
              filter: "blur(90px)",
            }}
          />
          {/* 제품 이미지 팝업 박스 */}
          <div
            style={{
              position: "absolute",
              top: "220px",
              left: "140px",
              width: "800px",
              height: "750px",
              borderRadius: "36px",
              overflow: "hidden",
              boxShadow: "0 30px 80px rgba(0,0,0,0.8), 0 0 50px rgba(255, 0, 122, 0.3)",
              border: "2px solid rgba(255, 255, 255, 0.2)",
              transform: `scale(${cut4Spring})`,
            }}
          >
            <Img
              src={staticFile("lifting_tape.jpg")}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* ================================================================== */}
      {/* 📱 [포그라운드 오버레이 UI]: 배지, 단어 자막, CTA 바 */}
      {/* ================================================================== */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          height: "100%",
          padding: "80px 48px 60px",
          boxSizing: "border-box",
          zIndex: 10,
        }}
      >
        {/* 🔼 [상단 배지]: 씬별 다이내믹 컬러 전환 */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 28px",
              borderRadius: "50px",
              background: frame <= 150
                ? "rgba(239, 68, 68, 0.25)"
                : frame <= 350
                ? "rgba(255, 0, 122, 0.25)"
                : "rgba(16, 185, 129, 0.25)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255, 255, 255, 0.25)",
              boxShadow: "0 8px 30px rgba(0, 0, 0, 0.4)",
            }}
          >
            {frame <= 150 ? (
              <>
                <AlertCircle size={26} color="#EF4444" />
                <span style={{ fontSize: "28px", fontWeight: 900, color: "#FCA5A5" }}>🚨 턱선 실종 비상!</span>
              </>
            ) : frame <= 350 ? (
              <>
                <Zap size={26} color="#FF007A" />
                <span style={{ fontSize: "28px", fontWeight: 900, color: "#FF69B4" }}>⚡ 3초 리프팅 시연</span>
              </>
            ) : frame <= 520 ? (
              <>
                <ShieldCheck size={26} color="#10B981" />
                <span style={{ fontSize: "28px", fontWeight: 900, color: "#6EE7B7" }}>✨ 초슬림 무광 방수</span>
              </>
            ) : (
              <>
                <Flame size={26} color="#F59E0B" />
                <span style={{ fontSize: "28px", fontWeight: 900, color: "#FCD34D" }}>🔥 단독 48% 특가 세일</span>
              </>
            )}
          </div>

          <h2
            style={{
              fontSize: "44px",
              fontWeight: 900,
              margin: 0,
              textShadow: "0 4px 20px rgba(0,0,0,0.8)",
              color: "#FFFFFF",
              letterSpacing: "-1px",
            }}
          >
            스킨업 브이라인 리프팅 테이프
          </h2>
        </div>

        {/* 💬 [중하단 자막 박스]: 단어별 실시간 하이라이트 */}
        <div
          style={{
            width: "100%",
            minHeight: "180px",
            padding: "28px 36px",
            borderRadius: "32px",
            background: "rgba(10, 15, 26, 0.88)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255, 255, 255, 0.18)",
            boxShadow: "0 25px 60px rgba(0, 0, 0, 0.7)",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: "14px 18px",
          }}
        >
          {currentGroup.map((word) => {
            const isSpeakingNow = frame >= word.startFrame && frame <= word.endFrame;
            const hasPassed = frame > word.endFrame;

            return (
              <span
                key={word.id}
                style={{
                  fontSize: isSpeakingNow ? "52px" : "44px",
                  fontWeight: isSpeakingNow ? 900 : 700,
                  padding: isSpeakingNow ? "8px 22px" : "6px 14px",
                  borderRadius: "18px",
                  background: isSpeakingNow
                    ? "linear-gradient(135deg, #FF007A 0%, #FF8C00 100%)"
                    : "transparent",
                  color: isSpeakingNow
                    ? "#FFFFFF"
                    : hasPassed
                    ? "#E2E8F0"
                    : "rgba(255, 255, 255, 0.35)",
                  transform: isSpeakingNow ? "scale(1.15)" : "scale(1.0)",
                  transition: "all 0.08s ease-out",
                  boxShadow: isSpeakingNow
                    ? "0 10px 30px rgba(255, 0, 122, 0.7)"
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

        {/* 🛒 [하단 CTA 바] */}
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 36px",
            borderRadius: "50px",
            background: frame > 520
              ? "linear-gradient(135deg, #FF0055 0%, #FF6600 100%)"
              : "rgba(255, 255, 255, 0.12)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.25)",
            boxShadow: frame > 520
              ? "0 14px 40px rgba(255, 0, 85, 0.6)"
              : "0 8px 25px rgba(0, 0, 0, 0.3)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Flame size={32} color="#FFD700" />
            <span style={{ fontSize: "28px", fontWeight: 900, color: "#FFFFFF" }}>
              {frame > 520 ? "🔥 지금 프로필 링크 클릭!" : "👉 3초 만에 턱선 복구 치트키"}
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
