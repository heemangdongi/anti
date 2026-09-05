// ============================================================================
// 🎵 create-sfx.mjs
// 순수 자바스크립트 오디오 합성기로 도우인/틱톡 스타일의 효과음과 BGM을 생성합니다.
// 외부 다운로드나 저작권 걱정이 전혀 없는 100% 오리지널 사운드 에셋을 만듭니다.
// ============================================================================

import fs from 'fs';
import path from 'path';

const SAMPLE_RATE = 44100;

// 표준 16-bit Mono WAV 버퍼를 생성하는 헬퍼 함수
function createWavBuffer(samples) {
  const numSamples = samples.length;
  const buffer = Buffer.alloc(44 + numSamples * 2);

  // RIFF 청크
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + numSamples * 2, 4);
  buffer.write('WAVE', 8);

  // fmt 서브청크
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // PCM 청크 크기
  buffer.writeUInt16LE(1, 20);  // 오디오 포맷 1 = PCM
  buffer.writeUInt16LE(1, 22);  // 모노 채널 (1)
  buffer.writeUInt32LE(SAMPLE_RATE, 24); // 샘플 레이트
  buffer.writeUInt32LE(SAMPLE_RATE * 2, 28); // 바이트 레이트 (모노 16비트 = 2바이트)
  buffer.writeUInt16LE(2, 32);  // 블록 얼라인
  buffer.writeUInt16LE(16, 34); // 샘플당 비트 수

  // data 서브청크
  buffer.write('data', 36);
  buffer.writeUInt32LE(numSamples * 2, 40);

  // 샘플 데이터 기록 (-1.0 ~ 1.0 -> -32768 ~ 32767)
  for (let i = 0; i < numSamples; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    const val = s < 0 ? s * 32768 : s * 32767;
    buffer.writeInt16LE(Math.floor(val), 44 + i * 2);
  }

  return buffer;
}

// 1. 묵직한 베이스 드롭 임팩트 사운드 (0초 후킹용 - 쿵!)
function generateImpactSound(durationSec = 1.0) {
  const numSamples = Math.floor(SAMPLE_RATE * durationSec);
  const samples = new Float32Array(numSamples);

  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    // 주파수가 120Hz에서 35Hz로 빠르게 떨어지는 베이스 드롭
    const freq = 120 * Math.exp(-t * 6) + 35;
    const env = Math.exp(-t * 3.5); // 지수 감쇠 엔벨로프
    // 사인파 + 서브베이스 하모닉스
    const wave = Math.sin(2 * Math.PI * freq * t) + 0.3 * Math.sin(4 * Math.PI * freq * t);
    samples[i] = wave * env * 0.85;
  }
  return createWavBuffer(samples);
}

// 2. 바람을 가르는 빠른 스우시 효과음 (리프팅 순간 - 슉!)
function generateWhooshSound(durationSec = 0.45) {
  const numSamples = Math.floor(SAMPLE_RATE * durationSec);
  const samples = new Float32Array(numSamples);

  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    const progress = t / durationSec;
    // 피크 엔벨로프 (중간에서 소리가 가장 커짐)
    const env = Math.sin(progress * Math.PI);
    // 화이트 노이즈 기반 + 스위핑 주파수 필터링 느낌
    const noise = (Math.random() * 2 - 1) * 0.7;
    const sweep = Math.sin(2 * Math.PI * (200 + 800 * progress) * t) * 0.4;
    samples[i] = (noise + sweep) * env * 0.75;
  }
  return createWavBuffer(samples);
}

// 3. 맑고 청아한 차임/벨 효과음 (반짝임 및 클릭 - 띵!)
function generateDingSound(durationSec = 0.8) {
  const numSamples = Math.floor(SAMPLE_RATE * durationSec);
  const samples = new Float32Array(numSamples);

  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    const env = Math.exp(-t * 4); // 감쇠
    // 아름다운 메이저 화음 (1046Hz - C6, 1318Hz - E6, 1568Hz - G6)
    const wave =
      0.5 * Math.sin(2 * Math.PI * 1046 * t) +
      0.35 * Math.sin(2 * Math.PI * 1318 * t) +
      0.25 * Math.sin(2 * Math.PI * 1568 * t);
    samples[i] = wave * env * 0.8;
  }
  return createWavBuffer(samples);
}

// 4. 영상 전체를 받쳐주는 세련된 22초 숏폼 미니멀 비트 (BGM)
function generateBgmTrack(durationSec = 22.0) {
  const numSamples = Math.floor(SAMPLE_RATE * durationSec);
  const samples = new Float32Array(numSamples);
  const bpm = 124;
  const beatSec = 60 / bpm;

  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    const beatPos = (t % beatSec) / beatSec;
    const barPos = (t % (beatSec * 4)) / (beatSec * 4);

    // 킥 드럼 (비트마다 쿵)
    const kickEnv = Math.exp(-beatPos * 12);
    const kickFreq = 110 * Math.exp(-beatPos * 25) + 40;
    const kick = Math.sin(2 * Math.PI * kickFreq * beatPos) * kickEnv * 0.4;

    // 하이햇 (박자 사이 칙)
    const offbeat = ((t + beatSec / 2) % beatSec) / beatSec;
    const hatEnv = Math.exp(-offbeat * 35);
    const hat = (Math.random() * 2 - 1) * hatEnv * 0.15;

    // 부드러운 배경 패드 코드
    const pad =
      0.08 * Math.sin(2 * Math.PI * 220 * t) +
      0.06 * Math.sin(2 * Math.PI * 330 * t) +
      0.05 * Math.sin(2 * Math.PI * 440 * t);

    // 전체 페이드 인/아웃
    let masterFade = 1.0;
    if (t < 0.5) masterFade = t / 0.5;
    if (t > durationSec - 1.0) masterFade = (durationSec - t) / 1.0;

    samples[i] = (kick + hat + pad) * masterFade * 0.7;
  }
  return createWavBuffer(samples);
}

// 파일 저장 실행
const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

fs.writeFileSync(path.join(publicDir, 'impact.wav'), generateImpactSound());
fs.writeFileSync(path.join(publicDir, 'whoosh.wav'), generateWhooshSound());
fs.writeFileSync(path.join(publicDir, 'ding.wav'), generateDingSound());
fs.writeFileSync(path.join(publicDir, 'bgm.wav'), generateBgmTrack(22.0));

console.log('✅ 모든 사운드 에셋(impact, whoosh, ding, bgm)이 성공적으로 생성되었습니다!');
