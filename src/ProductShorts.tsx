// 쿠팡 파트너스 및 쇼핑 홍보 전용 숏폼(9:16) Remotion 컴포넌트입니다.
// 시간이 프레임(frame) 단위로 흐르며, 30 FPS 기준 450 프레임(15초) 영상입니다.

import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Img,
} from "remotion";

// 상품 홍보 영상에 전달할 데이터 구조(Props)를 정의합니다.
export interface ProductShortsProps {
  headlineText: string;    // 상단 호기심 유발 문구 (예: "🔥 3일간만 진행되는 파격 특가!")
  productName: string;     // 상품명 (예: "프리미엄 무선 노이즈캔슬링 헤드폰")
  imageUrl: string;        // 상품 이미지 주소 (URL 또는 로컬 이미지)
  originalPrice: string;   // 정가 (예: "299,000원")
  discountPrice: string;   // 할인가 (예: "189,000원")
  discountRate: string;    // 할인율 (예: "36% OFF")
  features: string[];      // 핵심 장점 3가지 배열
  ctaText: string;         // 하단 구매 유도 문구 (예: "👉 프로필 링크에서 최저가 구매하기")
  primaryColor?: string;   // 포인트 테마 색상
}

export const ProductShorts: React.FC<ProductShortsProps> = ({
  headlineText = "🔥 3일간 진행되는 역대급 파격 특가!",
  productName = "프리미엄 무선 노이즈캔슬링 헤드폰 PRO",
  imageUrl = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
  originalPrice = "299,000원",
  discountPrice = "189,000원",
  discountRate = "36% OFF",
  features = [
    "🎧 노이즈 캔슬링으로 완벽 소음 차단",
    "🔋 40시간 연속 재생 대용량 배터리",
    "☁️ 초경량 메모리폼의 편안한 착용감",
  ],
  ctaText = "👉 프로필 링크 누르고 할인 혜택 받기!",
  primaryColor = "#FF385C",
}) => {
  // 1. 현재 재생 프레임과 비디오 설정값(FPS) 가져오기
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // -------------------------------------------------------------
  // [애니메이션 1] 상단 헤드라인 등장 (0프레임~)
  // -------------------------------------------------------------
  const headlineScale = spring({
    fps,
    frame,
    config: { damping: 12, stiffness: 180 },
  });

  // -------------------------------------------------------------
  // [애니메이션 2] 상품 이미지 줌인 및 등장 (15프레임~)
  // -------------------------------------------------------------
  const imageScale = spring({
    fps,
    frame: frame - 15,
    config: { damping: 14, stiffness: 120 },
  });
  // 연속적 줌인 효과 (천천히 커짐)
  const imageZoom = interpolate(frame, [15, 450], [1, 1.15], {
    extrapolateRight: "clamp",
  });

  // -------------------------------------------------------------
  // [애니메이션 3] 특징 태그 3가지 차례대로 팝업 등장 (60프레임부터 30프레임 간격)
  // -------------------------------------------------------------
  const feature1Scale = spring({
    fps,
    frame: frame - 60,
    config: { damping: 12 },
  });
  const feature2Scale = spring({
    fps,
    frame: frame - 90,
    config: { damping: 12 },
  });
  const feature3Scale = spring({
    fps,
    frame: frame - 120,
    config: { damping: 12 },
  });

  // -------------------------------------------------------------
  // [애니메이션 4] 하단 가격 및 할인율 팝업 등장 (180프레임 = 6초 시점~)
  // -------------------------------------------------------------
  const priceSpring = spring({
    fps,
    frame: frame - 180,
    config: { damping: 10, stiffness: 200 },
  });

  // -------------------------------------------------------------
  // [애니메이션 5] 하단 구매 유도 CTA 버튼 펄스(통통 튀기) 효과 (240프레임~)
  // -------------------------------------------------------------
  const ctaPulse = frame > 240 ? Math.sin((frame - 240) / 5) * 0.05 + 1 : 1;
  const ctaOpacity = interpolate(frame, [240, 260], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        backgroundColor: "#0f172a",
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #311042 100%)",
        fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif",
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "80px 50px 100px 50px",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 배경 장식 동그라미 빛 효과 */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "600px",
          background: `radial-gradient(circle, ${primaryColor}44 0%, transparent 70%)`,
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      {/* 1. 상단 호기심 유발 배너 */}
      <div
        style={{
          transform: `scale(${Math.max(0, headlineScale)})`,
          backgroundColor: primaryColor,
          color: "#ffffff",
          padding: "20px 40px",
          borderRadius: "50px",
          fontSize: "38px",
          fontWeight: "800",
          textAlign: "center",
          boxShadow: `0 10px 30px ${primaryColor}88`,
          zIndex: 10,
          marginTop: "40px",
        }}
      >
        {headlineText}
      </div>

      {/* 2. 중앙 상품 카드 영역 (이미지 + 상품명) */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          zIndex: 5,
        }}
      >
        {/* 상품 이미지 박스 */}
        <div
          style={{
            width: "550px",
            height: "550px",
            borderRadius: "36px",
            overflow: "hidden",
            backgroundColor: "#ffffff",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            transform: `scale(${Math.max(0, imageScale) * imageZoom})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            boxSizing: "border-box",
          }}
        >
          <Img
            src={imageUrl}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </div>

        {/* 상품명 */}
        <h1
          style={{
            fontSize: "44px",
            fontWeight: "900",
            textAlign: "center",
            marginTop: "35px",
            marginBottom: "10px",
            lineHeight: "1.3",
            textShadow: "0 4px 10px rgba(0,0,0,0.5)",
            wordBreak: "keep-all",
          }}
        >
          {productName}
        </h1>
      </div>

      {/* 3. 핵심 특징 태그 3개 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "18px",
          width: "100%",
          maxWidth: "850px",
          zIndex: 5,
        }}
      >
        {features[0] && (
          <div
            style={{
              transform: `scale(${Math.max(0, feature1Scale)})`,
              backgroundColor: "rgba(255, 255, 255, 0.12)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              padding: "22px 30px",
              borderRadius: "20px",
              fontSize: "34px",
              fontWeight: "600",
              boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
            }}
          >
            {features[0]}
          </div>
        )}
        {features[1] && (
          <div
            style={{
              transform: `scale(${Math.max(0, feature2Scale)})`,
              backgroundColor: "rgba(255, 255, 255, 0.12)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              padding: "22px 30px",
              borderRadius: "20px",
              fontSize: "34px",
              fontWeight: "600",
              boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
            }}
          >
            {features[1]}
          </div>
        )}
        {features[2] && (
          <div
            style={{
              transform: `scale(${Math.max(0, feature3Scale)})`,
              backgroundColor: "rgba(255, 255, 255, 0.12)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              padding: "22px 30px",
              borderRadius: "20px",
              fontSize: "34px",
              fontWeight: "600",
              boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
            }}
          >
            {features[2]}
          </div>
        )}
      </div>

      {/* 4. 가격 영역 & CTA 하단 레이아웃 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          zIndex: 5,
        }}
      >
        {/* 할인율 & 가격 정보 */}
        <div
          style={{
            transform: `scale(${Math.max(0, priceSpring)})`,
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "30px",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            padding: "20px 40px",
            borderRadius: "30px",
            border: `2px solid ${primaryColor}`,
          }}
        >
          {/* 할인율 태그 */}
          <span
            style={{
              backgroundColor: primaryColor,
              color: "#ffffff",
              fontSize: "40px",
              fontWeight: "900",
              padding: "8px 20px",
              borderRadius: "16px",
            }}
          >
            {discountRate}
          </span>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {/* 정가 (취소선) */}
            <span
              style={{
                fontSize: "28px",
                color: "#94a3b8",
                textDecoration: "line-through",
                fontWeight: "500",
              }}
            >
              {originalPrice}
            </span>
            {/* 할인가 */}
            <span
              style={{
                fontSize: "52px",
                color: "#facc15",
                fontWeight: "900",
              }}
            >
              {discountPrice}
            </span>
          </div>
        </div>

        {/* 5. 구매 유도 CTA 버튼 */}
        <div
          style={{
            opacity: ctaOpacity,
            transform: `scale(${ctaPulse})`,
            width: "100%",
            maxWidth: "850px",
            backgroundColor: "#22c55e",
            color: "#ffffff",
            padding: "28px 20px",
            borderRadius: "25px",
            fontSize: "36px",
            fontWeight: "800",
            textAlign: "center",
            boxShadow: "0 15px 35px rgba(34, 197, 94, 0.5)",
          }}
        >
          {ctaText}
        </div>
      </div>
    </div>
  );
};
