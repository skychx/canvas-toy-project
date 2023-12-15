import { initToolsBar, onToolsPress } from "./toolbar";

import { IIconRect } from "./types";

const toolButtonsCanvas = document.getElementById(
  "iconCanvas"
) as HTMLCanvasElement;
const drawingCanvas2 = document.getElementById(
  "drawingCanvas"
) as HTMLCanvasElement;

/** ToolBar */

function onToolButtonPress(rect: IIconRect) {
  // 暂时用 window 传递变量，后续重构会改掉
  // @ts-ignore
  window.selectedFunction = rect.n;

  if (rect.n === 'text') {
    drawingCanvas2.style.cursor = "text";
  } else {
    drawingCanvas2.style.cursor = "crosshair";
  }
}

toolButtonsCanvas.addEventListener('mousedown', (e) => {
  e.preventDefault();

  onToolsPress(toolButtonsCanvas, e.offsetX, e.offsetY, onToolButtonPress);
})

/**
 * init project
 */
function initDrawing() {
  initToolsBar(toolButtonsCanvas);
}

initDrawing();