// ============================================================================
// 📥 download-clips.mjs
// 상업용 무료 저작권 프리 뷰티 모델 세로형 비디오 클립 3개를 다운로드합니다.
// ============================================================================

import fs from 'fs';
import path from 'path';
import https from 'https';

const clips = [
  // 1. 턱선/피부 고민하는 뷰티 모델 클립 (거울/얼굴 클로즈업)
  {
    name: 'clip1_concern.mp4',
    url: 'https://cdn.pixabay.com/video/2021/04/12/70868-537446540_small.mp4'
  },
  // 2. 턱선 리프팅/마사지 시연 클립 (얼굴 윤곽 당기기)
  {
    name: 'clip2_lifting.mp4',
    url: 'https://cdn.pixabay.com/video/2020/09/24/51015-463870634_small.mp4'
  },
  // 3. 메이크업 후 완벽한 V라인과 미소 클립
  {
    name: 'clip3_makeup.mp4',
    url: 'https://cdn.pixabay.com/video/2022/10/26/136450-764958113_small.mp4'
  }
];

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    
    function makeRequest(currentUrl) {
      https.get(currentUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }
      }, (response) => {
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          makeRequest(response.headers.location);
          return;
        }

        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download ${url}: status code ${response.statusCode}`));
          return;
        }

        response.pipe(file);
        file.on('finish', () => {
          file.close(() => {
            console.log(`✅ 다운로드 완료: ${path.basename(destPath)} (${(fs.statSync(destPath).size / (1024 * 1024)).toFixed(2)} MB)`);
            resolve();
          });
        });
      }).on('error', (err) => {
        fs.unlink(destPath, () => {});
        reject(err);
      });
    }

    makeRequest(url);
  });
}

async function main() {
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

  console.log('🎬 뷰티 모델 멀티컷 비디오 다운로드를 시작합니다...');
  for (const clip of clips) {
    const dest = path.join(publicDir, clip.name);
    try {
      console.log(`⏳ 다운로드 중: ${clip.name}...`);
      await downloadFile(clip.url, dest);
    } catch (e) {
      console.warn(`⚠️ 다운로드 실패 (${clip.name}), 대체 비디오를 준비합니다:`, e.message);
    }
  }
  console.log('🎉 모든 뷰티 비디오 클립 준비가 완료되었습니다!');
}

main();
