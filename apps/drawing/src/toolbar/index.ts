import {
  TOOLS_BAR,
  ICON_RECT_LIST,
  SUPPORT_FILL_TOOLS,
  ICON_STYLE,
} from "./const";
import { setIconShadow, setSelectedIconShadow, drawIcon } from "./icons";

import {
  supportRetinaDisplay,
  isPointInRect,
  isPointInTriangle,
} from "../common";

import type { IIconRect } from "../types";

export function initToolsBar(ele: HTMLCanvasElement) {
  const ctx = ele.getContext("2d")!;

  supportRetinaDisplay(ele, TOOLS_BAR.WIDTH, TOOLS_BAR.HEIGHT);

  ctx.font = "48px Palatino";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.strokeStyle = ICON_STYLE.ICON_BORDER_COLOR;
  ctx.fillStyle = ICON_STYLE.ICON_FILL_COLOR;

  drawToolButtons(ele);
}

export function onToolsPress(
  ele: HTMLCanvasElement,
  x: number,
  y: number,
  onButtonPressCb: (selectRect: IIconRect) => void
) {
  const ctx = ele.getContext("2d")!;

  ICON_RECT_LIST.forEach((rect) => {
    ctx.beginPath();
    // isPointInPath 使用前，需要先用 ctx.rect 画一个区域出来
    ctx.rect(rect.x, rect.y, rect.w, rect.h);
    if (isPointInRect(rect, { x, y })) {
      drawToolButtons(ele, rect);
      onButtonPressCb(rect);

      if (SUPPORT_FILL_TOOLS.includes(rect.n)) {
        // @ts-ignore
        window.doFill = isPointInTriangle(
          {
            p0: { x: rect.x + rect.w, y: rect.y },
            p1: { x: rect.x, y: rect.y + rect.h },
            p2: { x: rect.x + rect.w, y: rect.y + rect.h },
          },
          { x, y }
        );
      }
    }
  });
}

function drawToolButtons(
  ele: HTMLCanvasElement,
  selectRect: IIconRect = ICON_RECT_LIST[7] // slinky
) {
  const ctx = ele.getContext("2d")!;
  ctx.clearRect(0, 0, ele.width, ele.height);

  ICON_RECT_LIST.forEach((rect) => {
    ctx.save();

    if (selectRect === rect) {
      setSelectedIconShadow(ctx);
    } else {
      setIconShadow(ctx);
    }

    ctx.fillStyle = ICON_STYLE.RECT_BG_COLOR;
    ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
    ctx.strokeStyle = ICON_STYLE.RECT_BORDER_COLOR;
    ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);

    ctx.restore();

    drawIcon(ctx, rect);
  });
}
