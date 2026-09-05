// ============================================================================
// 🎙️ generate-tts.mjs
// 대본을 입력받아 고품질 한국어 AI 음성(mp3)과 단어별 자막 타이밍(json)을 자동 생성하는 스크립트입니다.
// Microsoft Edge TTS를 사용하여 완전 무료이며 별도의 API 키가 필요하지 않습니다.
// ============================================================================

import { EdgeTTS } from 'edge-tts-universal';
import fs from 'fs/promises';
import path from 'path';

// 1. 영상에서 읽어줄 대본 텍스트를 설정합니다. (원하시는 문장으로 자유롭게 바꿔보세요!)
const SCRIPT_TEXT = "안녕하세요! 오늘 단 하루만 진행되는 파격 특가 소식입니다. 지금 프로필 링크를 확인해 보세요!";

// 2. 사용할 AI 성우 목소리를 설정합니다.
// - 'ko-KR-SunHiNeural': 맑고 신뢰감 있는 여성 아나운서/쇼츠 톤 (추천!)
// - 'ko-KR-InJoonNeural': 차분하고 또렷한 남성 설명 톤
const VOICE_NAME = "ko-KR-SunHiNeural";

async function generateVoiceAndSubtitles() {
  console.log("🎙️ AI 음성 및 자막 싱크 생성을 시작합니다...");
  console.log(`📝 대본: "${SCRIPT_TEXT}"`);
  console.log(`🗣️ 성우: ${VOICE_NAME}`);

  try {
    // 3. EdgeTTS 객체 생성 및 음성 합성 요청
    const tts = new EdgeTTS(SCRIPT_TEXT, VOICE_NAME, {
      rate: "+0%", // 말하기 속도 (예: 빠른 쇼츠는 "+10%" 추천)
      pitch: "+0Hz", // 목소리 톤
      volume: "+0%", // 음량
    });

    const result = await tts.synthesize();

    // 4. public 폴더 확인 및 생성 (Remotion이 오디오를 불러올 위치)
    const publicDir = path.resolve('public');
    await fs.mkdir(publicDir, { recursive: true });

    // 5. 오디오 파일 저장 (public/audio.mp3)
    const audioPath = path.join(publicDir, 'audio.mp3');
    const audioBuffer = Buffer.from(await result.audio.arrayBuffer());
    await fs.writeFile(audioPath, audioBuffer);
    console.log(`✅ 오디오 저장 완료: ${audioPath} (${(audioBuffer.length / 1024).toFixed(1)} KB)`);

    // 6. 자막 타이밍 데이터를 초(seconds) 및 프레임(30fps 기준) 단위로 계산
    // Edge TTS의 offset/duration은 100나노초(10^-7초) 단위이므로 10,000,000으로 나누면 초(seconds)가 됩니다.
    const FPS = 30;
    const subtitles = (result.subtitle || []).map((sub, index) => {
      const startSec = sub.offset / 10000000;
      const durationSec = sub.duration / 10000000;
      const endSec = startSec + durationSec;

      return {
        id: index + 1,
        text: sub.text,
        startSec,
        endSec,
        startFrame: Math.round(startSec * FPS),
        endFrame: Math.round(endSec * FPS),
      };
    });

    // 7. 자막 JSON 파일 저장 (src/subtitles.json)
    const subtitlePath = path.resolve('src', 'subtitles.json');
    await fs.writeFile(subtitlePath, JSON.stringify({ script: SCRIPT_TEXT, fps: FPS, subtitles }, null, 2), 'utf-8');
    console.log(`✅ 자막 데이터 저장 완료: ${subtitlePath} (총 ${subtitles.length}개 단어 싱크)`);

    console.log("\n🎉 모든 생성이 성공적으로 완료되었습니다!");
    console.log("이제 Remotion 컴포넌트에서 이 음성과 자막을 자동으로 불러와 재생합니다.");
  } catch (error) {
    console.error("❌ 음성 생성 중 오류가 발생했습니다:", error);
  }
}

generateVoiceAndSubtitles();
