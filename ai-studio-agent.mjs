// ============================================================================
// 🧠 ai-studio-agent.mjs
// Google AI Studio(Gemini)와 연동하여 도우인/틱톡 떡상 쇼츠를 자동 기획하는 엔진입니다.
// 상품명이나 주제만 전달하면 3초 후킹 대본부터 4단 멀티컷 연출 지시서까지 자동 출력합니다.
// ============================================================================

import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

// 1. .env 파일에서 GEMINI_API_KEY 로드
function loadEnv() {
  const envPath = path.resolve('.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        value = value.trim().replace(/^['"]|['"]$/g, '');
        process.env[key] = value;
      }
    }
  }
}

loadEnv();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.log('\n⚠️ [안내] GEMINI_API_KEY가 아직 등록되지 않았습니다.');
  console.log('구글 AI 스튜디오(https://aistudio.google.com/app/apikey)에서 무료 키를 발급받아 .env 파일에 입력해 주세요!\n');
  process.exit(0);
}

// 2. Google GenAI 클라이언트 초기화
const ai = new GoogleGenAI({ apiKey });

export async function planViralShorts(productName, category = '쇼핑/꿀템') {
  console.log(`\n🤖 Google AI Studio 두뇌 가동 중... [분석 상품: ${productName}]`);

  const prompt = `
당신은 틱톡, 도우인(중국 틱톡), 유튜브 쇼츠에서 수천만 조회수를 터뜨린 대한민국 최고의 숏폼 뷰티/커머스 바이럴 디렉터입니다.

[타겟 상품]: ${productName} (카테고리: ${category})

다음 4단계 떡상 공식에 맞춰 15~20초 분량의 쇼츠 대본과 연출 기획서를 JSON 형식으로 작성해 주세요:
1. 컷 1 (0~4초 후킹): 시청자의 스크롤을 멈추는 충격적 고민/상황 질문 (예: "아직도 ~하세요?")
2. 컷 2 (4~10초 쾌감 시연): 제품을 쓰자마자 즉각 드라마틱하게 변하는 비포&애프터
3. 컷 3 (10~15초 특장점): 초슬림, 무광, 방수, 편안함 등 소비자가 걱정하는 부분을 완벽 해소하는 인증 컷
4. 컷 4 (15~20초 특가 CTA): 품절 임박, 프로필 링크 단독 특가 행동 유도

반드시 유효한 JSON 형식으로만 응답하세요:
{
  "productName": "${productName}",
  "headline": "상단 3초 후킹 배지 문구",
  "fullScript": "전체 낭독 대본 한 문장",
  "scenes": [
    { "sceneNumber": 1, "duration": "0~4s", "visual": "화면 연출 설명", "script": "대사" },
    { "sceneNumber": 2, "duration": "4~10s", "visual": "화면 연출 설명", "script": "대사" },
    { "sceneNumber": 3, "duration": "10~15s", "visual": "화면 연출 설명", "script": "대사" },
    { "sceneNumber": 4, "duration": "15~20s", "visual": "화면 연출 설명", "script": "대사" }
  ]
}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const outputText = response.text.trim();
    console.log('✅ Google AI Studio 바이럴 기획 완료!\n');
    console.log(outputText);
    return outputText;
  } catch (error) {
    console.error('❌ AI Studio 호출 중 오류 발생:', error.message);
  }
}

// 직접 실행 시 테스트
const target = process.argv[2] || '스킨업 페이스 브이라인 리프팅 테이프';
planViralShorts(target);
