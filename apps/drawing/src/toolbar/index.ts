import { ICON_RECT_LIST, ICON_STYLE } from "./const";
import { setIconShadow, setSelectedIconShadow, drawIcon } from "./icons";

import type { IIconRect } from "../types";

export function drawToolButtons(
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
    if (ctx.isPointInPath(x, y)) {
      drawToolButtons(ele, rect);
      onButtonPressCb(rect);
    }
  });
}
