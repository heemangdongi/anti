import fs from "fs";
import path from "path";

const htmlPath = "trend_analytics_app/index.html";
const cssPath = "trend_analytics_app/styles.css";
const dbPath = "trend_analytics_app/channels_db.js";
const jsPath = "trend_analytics_app/app.js";

let html = fs.readFileSync(htmlPath, "utf-8");
const css = fs.readFileSync(cssPath, "utf-8");
const db = fs.readFileSync(dbPath, "utf-8");
const js = fs.readFileSync(jsPath, "utf-8");

// CSS 인라인 치환
html = html.replace('<link rel="stylesheet" href="styles.css">', `<style>\n${css}\n</style>`);

// JS 합치기: db에서 export 문을 const로 치환하고, js에서 import 문 제거
let combinedJs = db.replace("export const INITIAL_CHANNELS_DB", "const INITIAL_CHANNELS_DB");
combinedJs += "\n\n" + js.replace('import { INITIAL_CHANNELS_DB } from "./channels_db.js";', "// DB 로드 완료");

// script 태그 인라인 치환
html = html.replace('<script type="module" src="app.js"></script>', `<script>\n${combinedJs}\n</script>`);

const desktopPath = "C:\\Users\\aman2\\OneDrive\\바탕 화면\\숏폼_채널_정밀탐색기.html";
fs.writeFileSync(desktopPath, html, "utf-8");
console.log(`✅ 바탕화면 단독 실행 대시보드 배포 완료: ${desktopPath} (${html.length} 바이트)`);
