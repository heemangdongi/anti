// 시험 삼아 만드는 예제 영상 컴포넌트입니다.
// Remotion에서는 시간이 "프레임(frame)" 단위로 흐릅니다. (30 FPS 기준, 30 프레임 = 1초)
import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// 영상에 전달할 데이터의 종류를 지정합니다.
interface MainCompositionProps {
  titleText: string;
  titleColor: string;
}

export const MainComposition: React.FC<MainCompositionProps> = ({
  titleText,
  titleColor,
}) => {
  // 1. 현재 재생 중인 프레임 번호를 읽어옵니다. (0, 1, 2, 3...)
  const frame = useCurrentFrame();

  // 2. 비디오의 전체 설정(초당 프레임 수 fps = 30)을 읽어옵니다.
  const { fps } = useVideoConfig();

  // -------------------------------------------------------------
  // [애니메이션 로직 1] 3초 카운트다운 (0초~3초 : 0~90 프레임)
  // -------------------------------------------------------------
  // 30 프레임마다 카운트 수가 3 -> 2 -> 1로 달라집니다.
  const countdownNumber = Math.max(3 - Math.floor(frame / 30), 1);

  // 카운트다운이 표시될 프레임 구간(0 ~ 90 프레임 = 0~3초)
  const isCountdownPhase = frame < 90;

  // 카운트다운 숫자가 등장할 때 튀어오르는 통통 튀는 애니메이션 효과
  const countScale = spring({
    fps,
    frame: frame % 30, // 매 초(30프레임)마다 애니메이션이 리셋되도록 합니다.
    config: {
      damping: 10, // 숫자가 커질수록 덜 튕깁니다.
      stiffness: 200,
    },
  });

  // -------------------------------------------------------------
  // [애니메이션 로직 2] 메인 타이틀 등장 (3초 이후 : 90 프레임~)
  // -------------------------------------------------------------
  // 90 프레임 시점부터 텍스트 크기(scale)가 0에서 1로 부드럽게 확대됩니다.
  const titleScale = spring({
    fps,
    frame: frame - 90, // 90프레임을 0으로 간주하고 애니메이션 시작
    config: {
      damping: 12,
    },
  });

  // 90 프레임 시점부터 110 프레임까지 불투명도(opacity)가 0 -> 1 로 증가합니다.
  const titleOpacity = interpolate(frame, [90, 110], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // -------------------------------------------------------------
  // [화면 렌더링 (HTML + CSS)]
  // -------------------------------------------------------------
  return (
    <div
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        // 모던한 네이비/자주빛 그라디언트 배경 설정
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #311042 100%)",
        fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif",
        color: "white",
      }}
    >
      {isCountdownPhase ? (
        /* --- [단계 1] 카운트다운 화면 (0초 ~ 3초) --- */
        <div
          style={{
            transform: `scale(${countScale})`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 160,
              fontWeight: 900,
              color: "#f43f5e",
              textShadow: "0 0 40px rgba(244, 63, 94, 0.6)",
            }}
          >
            {countdownNumber}
          </div>
          <p style={{ fontSize: 32, color: "#94a3b8", marginTop: -20 }}>
            영상이 시작됩니다...
          </p>
        </div>
      ) : (
        /* --- [단계 2] 메인 메세지 화면 (3초 ~ 5초) --- */
        <div
          style={{
            transform: `scale(${titleScale})`,
            opacity: titleOpacity,
            textAlign: "center",
            padding: "0 40px",
          }}
        >
          {/* 하이라이트 배지 */}
          <span
            style={{
              background: "rgba(255, 255, 255, 0.15)",
              padding: "10px 24px",
              borderRadius: 30,
              fontSize: 24,
              letterSpacing: 2,
              fontWeight: 600,
              border: "1px solid rgba(255, 255, 255, 0.3)",
              display: "inline-block",
              marginBottom: 24,
            }}
          >
            🚀 REMOTION VIDEO LESSON
          </span>

          {/* 메인 타이틀 */}
          <h1
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: titleColor,
              marginBottom: 20,
              wordBreak: "keep-all",
              textShadow: "0 10px 30px rgba(97, 218, 251, 0.4)",
            }}
          >
            {titleText}
          </h1>

          {/* 서브 설명 문구 */}
          <p
            style={{
              fontSize: 32,
              color: "#cbd5e1",
              fontWeight: 400,
            }}
          >
            React 코드로 만든 멋진 애니메이션 비디오입니다!
          </p>
        </div>
      )}
    </div>
  );
};
