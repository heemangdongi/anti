// ============================================================================
// 🎬 src/LiftingTapeShorts.tsx
// "스킨업 페이스 브이라인 리프팅 테이프" 쇼츠 컴포넌트 (모션 그래픽 업그레이드 버전)
//
// 💡 주요 개선 사항:
// 1. AI 비디오의 어색한 손동작/입모양 왜곡을 제거하고,
// 2. 홈쇼핑 및 틱톡 떡상 공식인 [Before vs After 분할 대비]와
// 3. 턱선을 끌어올리는 [네온 리프팅 화살표 3연타 모션(↑↑↑)]을 코드로 완벽 구현했습니다.
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
import {
  Sparkles,
  Zap,
  Flame,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
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
  // [컷 1: 0~150f] 거울 고민 컷 줌인
  const cut1Scale = interpolate(frame, [0, 150], [1.0, 1.15], {
    extrapolateRight: "clamp",
  });

  // [컷 2-1: 215f 슉! 효과음 시점 리프팅 화살표 3연타 애니메이션]
  const arrow1Progress = spring({
    frame: frame - 215,
    fps,
    config: { damping: 12, mass: 0.6 },
  });
  const arrow2Progress = spring({
    frame: frame - 222,
    fps,
    config: { damping: 12, mass: 0.6 },
  });
  const arrow3Progress = spring({
    frame: frame - 229,
    fps,
    config: { damping: 12, mass: 0.6 },
  });

  // [컷 3: 351~520f] 완성된 V라인 뷰티 컷 줌아웃
  const cut3Scale = interpolate(frame, [351, 520], [1.16, 1.02], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // [컷 4: 521~652f] 제품 카드 스프링 팝업
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
      {/* 🎵 [오디오 트랙]: 한국어 전문 AI 성우 + BGM + SFX 효과음 */}
      {/* ================================================================== */}
      <Audio src={staticFile("lifting_voice.mp3")} volume={1.0} />
      <Audio src={staticFile("bgm.wav")} volume={bgmVolume} />

      {/* 0초 쿵! 베이스 드롭 (후킹 임팩트) */}
      <Sequence from={0} durationInFrames={35}>
        <Audio src={staticFile("impact.wav")} volume={0.8} />
      </Sequence>
      {/* 7.1초 슉! 리프팅 화살표 발사 타이밍 (whoosh 효과음) */}
      <Sequence from={215} durationInFrames={20}>
        <Audio src={staticFile("whoosh.wav")} volume={0.9} />
      </Sequence>
      {/* 9.6초 띵! 리프팅 완료 확인 벨 */}
      <Sequence from={290} durationInFrames={30}>
        <Audio src={staticFile("ding.wav")} volume={0.75} />
      </Sequence>
      {/* 17.5초 띵! 특가 CTA 클릭음 */}
      <Sequence from={525} durationInFrames={30}>
        <Audio src={staticFile("ding.wav")} volume={0.9} />
      </Sequence>

      {/* ================================================================== */}
      {/* 🎬 [비주얼 레이어]: 4단계 멀티 컷 & 모션 그래픽 */}
      {/* ================================================================== */}

      {/* 🔴 [컷 1: 0~150f (0초~5초)] 후킹 - 거울 보며 턱살/볼살 고민 */}
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
              background:
                "linear-gradient(to top, rgba(5,7,13,0.95) 0%, rgba(5,7,13,0.3) 30%, transparent 60%)",
            }}
          />
        </AbsoluteFill>
      )}

      {/* 🟡 [컷 2: 151~350f (5초~11.6초)] 시연 및 BEFORE vs AFTER 분할 & 리프팅 화살표 */}
      {frame > 150 && frame <= 350 && (
        <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#080C16" }}>
          {/* 1) 좌우 Before / After 분할 화면 (홈쇼핑 대비 연출) */}
          <div
            style={{
              display: "flex",
              width: "100%",
              height: "100%",
              position: "relative",
            }}
          >
            {/* 좌측: BEFORE (고민 컷, 살짝 어둡게) */}
            <div
              style={{
                flex: 1,
                height: "100%",
                position: "relative",
                overflow: "hidden",
                borderRight: "3px solid rgba(255, 0, 122, 0.8)",
              }}
            >
              <Img
                src={staticFile("scene1_concern.jpg")}
                style={{
                  width: "200%",
                  height: "100%",
                  objectFit: "cover",
                  transform: "translateX(0%)",
                  filter: "brightness(0.75) contrast(0.95)",
                }}
              />
              {/* BEFORE 라벨 태그 */}
              <div
                style={{
                  position: "absolute",
                  top: "220px",
                  left: "40px",
                  padding: "10px 24px",
                  borderRadius: "14px",
                  background: "rgba(239, 68, 68, 0.9)",
                  color: "#FFFFFF",
                  fontSize: "26px",
                  fontWeight: 900,
                  boxShadow: "0 6px 20px rgba(239, 68, 68, 0.6)",
                }}
              >
                BEFORE (처진 라인)
              </div>
            </div>

            {/* 우측: AFTER (리프팅 후 완벽 V라인) */}
            <div
              style={{
                flex: 1,
                height: "100%",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Img
                src={staticFile("scene3_beauty.jpg")}
                style={{
                  width: "200%",
                  height: "100%",
                  objectFit: "cover",
                  transform: "translateX(-50%)",
                  filter: "brightness(1.05) contrast(1.08)",
                }}
              />
              {/* AFTER 라벨 태그 */}
              <div
                style={{
                  position: "absolute",
                  top: "220px",
                  right: "40px",
                  padding: "10px 24px",
                  borderRadius: "14px",
                  background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                  color: "#FFFFFF",
                  fontSize: "26px",
                  fontWeight: 900,
                  boxShadow: "0 6px 20px rgba(16, 185, 129, 0.6)",
                }}
              >
                AFTER (V라인 완성)
              </div>
            </div>

            {/* 중앙 구분선 네온 이펙트 */}
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: "50%",
                width: "4px",
                transform: "translateX(-50%)",
                background: "linear-gradient(to bottom, #FF007A, #00F5FF, #FF007A)",
                boxShadow: "0 0 25px #00F5FF, 0 0 10px #FF007A",
              }}
            />
          </div>

          {/* 2) 🏹 [네온 리프팅 화살표 3연타 모션] (215f whoosh 사운드 시점 발사) */}
          {frame >= 210 && frame <= 340 && (
            <div
              style={{
                position: "absolute",
                right: "80px",
                bottom: "380px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "18px",
                zIndex: 5,
              }}
            >
              {/* 화살표 3 (가장 위) */}
              <div
                style={{
                  transform: `translateY(${interpolate(
                    arrow3Progress,
                    [0, 1],
                    [60, -40]
                  )}px) scale(${interpolate(arrow3Progress, [0, 1], [0.4, 1.1])})`,
                  opacity: interpolate(arrow3Progress, [0, 0.3, 1], [0, 1, 0.9]),
                  filter: "drop-shadow(0 0 20px #00F5FF)",
                }}
              >
                <TrendingUp size={70} color="#00F5FF" strokeWidth={3.5} />
              </div>

              {/* 화살표 2 (중간) */}
              <div
                style={{
                  transform: `translateY(${interpolate(
                    arrow2Progress,
                    [0, 1],
                    [60, -20]
                  )}px) scale(${interpolate(arrow2Progress, [0, 1], [0.4, 1.2])})`,
                  opacity: interpolate(arrow2Progress, [0, 0.3, 1], [0, 1, 0.95]),
                  filter: "drop-shadow(0 0 25px #FF007A)",
                }}
              >
                <TrendingUp size={85} color="#FF007A" strokeWidth={4} />
              </div>

              {/* 화살표 1 (아래) */}
              <div
                style={{
                  transform: `translateY(${interpolate(
                    arrow1Progress,
                    [0, 1],
                    [60, 0]
                  )}px) scale(${interpolate(arrow1Progress, [0, 1], [0.4, 1.3])})`,
                  opacity: interpolate(arrow1Progress, [0, 0.3, 1], [0, 1, 1]),
                  filter: "drop-shadow(0 0 30px #FFD700)",
                }}
              >
                <TrendingUp size={100} color="#FFD700" strokeWidth={4.5} />
              </div>

              {/* 리프팅 텐션 안내 배지 */}
              <div
                style={{
                  padding: "12px 28px",
                  borderRadius: "30px",
                  background: "rgba(0, 245, 255, 0.9)",
                  color: "#05070D",
                  fontSize: "30px",
                  fontWeight: 900,
                  boxShadow: "0 10px 30px rgba(0, 245, 255, 0.8)",
                  marginTop: "10px",
                  letterSpacing: "-1px",
                }}
              >
                ⬆️ 강력 즉각 당김!
              </div>
            </div>
          )}

          {/* 하단 그라데이션 오버레이 */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(5,7,13,0.95) 0%, rgba(5,7,13,0.2) 30%, transparent 60%)",
            }}
          />
        </AbsoluteFill>
      )}

      {/* 🟢 [컷 3: 351~520f (11.7초~17.3초)] 뷰티 완성 컷 - 0.02mm 초슬림 무광 강조 */}
      {frame > 350 && frame <= 520 && (
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <Img
            src={staticFile("scene3_beauty.jpg")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${cut3Scale})`,
              filter: "contrast(1.06) brightness(1.03)",
            }}
          />

          {/* 0.02mm 무광 초밀착 안심 스탬프 */}
          <div
            style={{
              position: "absolute",
              top: "230px",
              right: "60px",
              padding: "16px 30px",
              borderRadius: "50px",
              background: "rgba(16, 185, 129, 0.92)",
              backdropFilter: "blur(12px)",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              boxShadow: "0 10px 35px rgba(16, 185, 129, 0.6)",
              border: "2px solid rgba(255, 255, 255, 0.4)",
            }}
          >
            <CheckCircle2 size={36} color="#FFFFFF" />
            <span style={{ fontSize: "30px", fontWeight: 900, color: "#FFFFFF" }}>
              0.02mm 완전 무광 티 안 남!
            </span>
          </div>

          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(5,7,13,0.95) 0%, rgba(5,7,13,0.3) 30%, transparent 60%)",
            }}
          />
        </AbsoluteFill>
      )}

      {/* 🟣 [컷 4: 521~652f (17.4초~21.7초)] 엔딩 특가 CTA 팝업 */}
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
              background:
                "radial-gradient(circle, rgba(255, 0, 122, 0.3) 0%, transparent 70%)",
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
              background:
                "radial-gradient(circle, rgba(121, 40, 202, 0.3) 0%, transparent 70%)",
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
              boxShadow:
                "0 30px 80px rgba(0,0,0,0.8), 0 0 50px rgba(255, 0, 122, 0.3)",
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
      {/* 📱 [포그라운드 오버레이 UI]: 상단 배지, 단어 싱크 자막, 하단 CTA 바 */}
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 28px",
              borderRadius: "50px",
              background:
                frame <= 150
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
                <span
                  style={{ fontSize: "28px", fontWeight: 900, color: "#FCA5A5" }}
                >
                  🚨 턱선 실종 비상!
                </span>
              </>
            ) : frame <= 350 ? (
              <>
                <Zap size={26} color="#FF007A" />
                <span
                  style={{ fontSize: "28px", fontWeight: 900, color: "#FF69B4" }}
                >
                  ⚡ 즉각 V라인 끌어올림!
                </span>
              </>
            ) : frame <= 520 ? (
              <>
                <ShieldCheck size={26} color="#10B981" />
                <span
                  style={{ fontSize: "28px", fontWeight: 900, color: "#6EE7B7" }}
                >
                  ✨ 0.02mm 초슬림 무광 방수
                </span>
              </>
            ) : (
              <>
                <Flame size={26} color="#F59E0B" />
                <span
                  style={{ fontSize: "28px", fontWeight: 900, color: "#FCD34D" }}
                >
                  🔥 단독 48% 특가 세일
                </span>
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
            const isSpeakingNow =
              frame >= word.startFrame && frame <= word.endFrame;
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
            background:
              frame > 520
                ? "linear-gradient(135deg, #FF0055 0%, #FF6600 100%)"
                : "rgba(255, 255, 255, 0.12)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.25)",
            boxShadow:
              frame > 520
                ? "0 14px 40px rgba(255, 0, 85, 0.6)"
                : "0 8px 25px rgba(0, 0, 0, 0.3)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Flame size={32} color="#FFD700" />
            <span
              style={{ fontSize: "28px", fontWeight: 900, color: "#FFFFFF" }}
            >
              {frame > 520
                ? "🔥 지금 프로필 링크 클릭!"
                : "👉 3초 만에 턱선 복구 치트키"}
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

