import { ICON_STYLE } from "./const";
import { drawGrid } from "../common";

import type { IIconRect } from "../types";


export function setIconShadow(ctx: CanvasRenderingContext2D) {
  ctx.shadowColor = ICON_STYLE.RECT_SHADOW_COLOR;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;
  ctx.shadowBlur = 2;
}

export function setSelectedIconShadow(ctx: CanvasRenderingContext2D) {
  ctx.shadowColor = ICON_STYLE.RECT_SHADOW_COLOR;
  ctx.shadowOffsetX = 4;
  ctx.shadowOffsetY = 4;
  ctx.shadowBlur = 5;
}

export function drawIcon(ctx: CanvasRenderingContext2D, rect: IIconRect) {
  ctx.save();

  if (rect.n === "line") {
    drawLineIcon(ctx, rect);
  } else if (rect.n === "rectangle") {
    drawRectIcon(ctx, rect);
  } else if (rect.n === "circle") {
    drawCircleIcon(ctx, rect);
  } else if (rect.n === "openPath") {
    drawOpenPathIcon(ctx, rect);
  } else if (rect.n === "closedPath") {
    drawClosedPathIcon(ctx, rect);
  } else if (rect.n === "curve") {
    drawCurveIcon(ctx, rect);
  } else if (rect.n === "text") {
    drawTextIcon(ctx, rect);
  } else if (rect.n === "slinky") {
    drawSlinkyIcon(ctx, rect);
  } else if (rect.n === "eraser") {
    drawEraserIcon(ctx, rect);
  }

  ctx.restore();
}

function drawLineIcon(ctx: CanvasRenderingContext2D, rect: IIconRect) {
  ctx.beginPath();
  ctx.moveTo(rect.x + 5, rect.y + 5);
  ctx.lineTo(rect.x + rect.w - 5, rect.y + rect.h - 5);
  ctx.stroke();
}

function drawRectIcon(ctx: CanvasRenderingContext2D, rect: IIconRect) {
  ctx.strokeRect(rect.x + 5, rect.y + 5, rect.w - 10, rect.h - 10);
}

function drawCircleIcon(ctx: CanvasRenderingContext2D, rect: IIconRect) {
  ctx.beginPath();
  ctx.arc(rect.x + rect.w / 2, rect.y + rect.h / 2, 20, 0, Math.PI * 2, false);
  ctx.stroke();
}

/** ⬇️ open path / close path start */

function drawOpenPathIconLines(ctx: CanvasRenderingContext2D, rect: IIconRect) {
  ctx.lineTo(rect.x + 13, rect.y + 19);
  ctx.lineTo(rect.x + 15, rect.y + 17);
  ctx.lineTo(rect.x + 25, rect.y + 12);
  ctx.lineTo(rect.x + 35, rect.y + 13);
  ctx.lineTo(rect.x + 38, rect.y + 15);
  ctx.lineTo(rect.x + 40, rect.y + 17);
  ctx.lineTo(rect.x + 39, rect.y + 23);
  ctx.lineTo(rect.x + 36, rect.y + 25);
  ctx.lineTo(rect.x + 32, rect.y + 27);
  ctx.lineTo(rect.x + 28, rect.y + 29);
  ctx.lineTo(rect.x + 26, rect.y + 31);
  ctx.lineTo(rect.x + 24, rect.y + 33);
  ctx.lineTo(rect.x + 22, rect.y + 35);
  ctx.lineTo(rect.x + 20, rect.y + 37);
  ctx.lineTo(rect.x + 18, rect.y + 39);
  ctx.lineTo(rect.x + 16, rect.y + 39);
  ctx.lineTo(rect.x + 13, rect.y + 36);
  ctx.lineTo(rect.x + 11, rect.y + 34);
}

function drawOpenPathIcon(ctx: CanvasRenderingContext2D, rect: IIconRect) {
  ctx.beginPath();

  drawOpenPathIconLines(ctx, rect);

  ctx.stroke();
}

function drawClosedPathIcon(ctx: CanvasRenderingContext2D, rect: IIconRect) {
  ctx.beginPath();

  drawOpenPathIconLines(ctx, rect);
  ctx.closePath(); // 闭合标签

  ctx.stroke();
}

/** ⬆️ open path / close path end */

function drawCurveIcon(ctx: CanvasRenderingContext2D, rect: IIconRect) {
  ctx.beginPath();

  ctx.moveTo(rect.x + rect.w - 10, rect.y + 5);
  ctx.quadraticCurveTo(
    rect.x - 10,
    rect.y,
    rect.x + rect.w - 10,
    rect.y + rect.h - 5
  );

  ctx.stroke();
}

function drawTextIcon(ctx: CanvasRenderingContext2D, rect: IIconRect) {
  const text = "T";

  ctx.fillText(text, rect.x + rect.w / 2, rect.y + rect.h / 2 + 5);
  ctx.strokeText(text, rect.x + rect.w / 2, rect.y + rect.h / 2 + 5);
}

function drawSlinkyIcon(ctx: CanvasRenderingContext2D, rect: IIconRect) {
  ctx.save();

  for (let i = -2; i < rect.w / 3 + 2; i += 1.5) {
    let x: number;
    let y: number;
  
    if (i < rect.w / 6) {
      x = rect.x + rect.w / 3 + i + rect.w / 8;
    } else {
      x = rect.x + rect.w / 3 + (rect.w / 3 - i) + rect.w / 8;
    }

    y = rect.y + rect.w / 3 + i;

    ctx.beginPath();
    ctx.arc(x, y, 12, 0, Math.PI * 2, false);
    ctx.stroke();
  }

  ctx.restore();
}

function drawEraserIcon(ctx: CanvasRenderingContext2D, rect: IIconRect) {
  ctx.save();

  ctx.beginPath();
  ctx.arc(
    rect.x + rect.w / 2,
    rect.y + rect.h / 2,
    20,
    0,
    Math.PI * 2,
    false
  );

  ctx.stroke();

  ctx.clip(); // restrict drawGrid() to the circle

  drawGrid(ctx, ICON_STYLE.ERASER_ICON_GRID_COLOR, 5, 5);

  ctx.restore();
}
