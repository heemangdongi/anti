// Remotion의 진입점(Entry point) 파일입니다.
// registerRoot 함수를 통해 Root 컴포넌트를 Remotion 실행 환경에 등록합니다.
import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root";

// Remotion 비디오의 가장 뿌리가 되는 Root 컴포넌트를 등록합니다.
registerRoot(RemotionRoot);
