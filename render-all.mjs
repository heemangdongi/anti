// products.json의 상품 목록을 읽어와 각각 MP4 동영상 파일로 대량 자동 렌더링하는 스크립트입니다.
// Windows 환경에서도 한글/특수문자 인코딩과 따옴표 깨짐 없이 안전하게 동작하도록 임시 JSON 파일 방식 적용

import { execSync } from "child_process";
import fs from "fs";
import path from "path";

// 1. products.json 파일 경로 읽기
const productsPath = path.resolve("./src/products.json");
const rawData = fs.readFileSync(productsPath, "utf-8");
const products = JSON.parse(rawData);

// 2. 결과물 영상이 저장될 out/ 폴더 확인 및 생성
const outDir = path.resolve("./out");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 임시 props 저장 파일 경로
const tempPropsPath = path.resolve("./temp-props.json");

console.log(`\n🚀 [쿠팡 파트너스 숏폼 자동 렌더러] 총 ${products.length}개 상품의 MP4 영상 대량 작성을 시작합니다!\n`);

// 3. 각 상품 정보를 순회하며 Remotion 렌더링 수행
products.forEach((product, index) => {
  const outputPath = path.join(outDir, `${product.id}.mp4`);

  // Windows 따옴표 오류를 방지하기 위해 임시 JSON 파일 생성 후 전달
  fs.writeFileSync(tempPropsPath, JSON.stringify(product, null, 2), "utf-8");

  console.log(`--------------------------------------------------`);
  console.log(`[${index + 1}/${products.length}] 🎥 렌더링 시작: ${product.productName}`);
  console.log(`📁 저장 경로: ${outputPath}`);
  console.log(`--------------------------------------------------`);

  // npx remotion render 실행 명령어 (임시 JSON 파일 경로 지정)
  const command = `npx remotion render src/index.ts CoupangProductShorts "${outputPath}" --props="${tempPropsPath}"`;

  try {
    execSync(command, { stdio: "inherit" });
    console.log(`\n✅ [성공] ${product.id}.mp4 영상 생성 완료!\n`);
  } catch (error) {
    console.error(`\n❌ [오류] ${product.productName} 렌더링 실패:`, error.message);
  }
});

// 사용 후 임시 파일 삭제
if (fs.existsSync(tempPropsPath)) {
  fs.unlinkSync(tempPropsPath);
}

console.log(`==================================================`);
console.log(`🎉 모든 숏폼 동영상 대량 자동 생성 작업이 완벽하게 완료되었습니다!`);
console.log(`📂 생성된 영상 파일 위치: ${outDir}`);
console.log(`==================================================\n`);
