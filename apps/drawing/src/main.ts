import { DPR } from "./common";
import { initToolsBar, onToolsPress } from "./toolbar";

import type { IIconRect } from "./types";

const toolsBarCanvas = document.getElementById(
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

  if (rect.n === "text") {
    drawingCanvas2.style.cursor = "text";
  } else {
    drawingCanvas2.style.cursor = "crosshair";
  }
}

toolsBarCanvas.addEventListener("mousedown", (e) => {
  e.preventDefault();

  onToolsPress(
    toolsBarCanvas,
    e.offsetX * DPR,
    e.offsetY * DPR,
    onToolButtonPress
  );
});

/**
 * init project
 */
function initDrawing() {
  initToolsBar(toolsBarCanvas);
}

initDrawing();
