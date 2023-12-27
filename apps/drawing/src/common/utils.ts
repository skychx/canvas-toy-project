import { DPR } from "./const";

import type { IPoint, IRect, ITriangle } from "../types";

export function supportRetinaDisplay(
  ele: HTMLCanvasElement,
  width: number,
  height: number
) {
  const ctx = ele.getContext("2d")!;

  ele.width = width * DPR;
  ele.height = height * DPR;

  ele.style.width = `${width}px`;
  ele.style.height = `${height}px`;

  ctx.scale(DPR, DPR);
}

export function drawGrid(
  ctx: CanvasRenderingContext2D,
  color: string,
  stepx: number,
  stepy: number
) {
  ctx.save();

  ctx.strokeStyle = color;
  ctx.fillStyle = "#ffffff";
  ctx.lineWidth = 0.5;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.globalAlpha = 0.1;

  ctx.beginPath();
  for (let i = stepx + 0.5; i < ctx.canvas.width; i += stepx) {
    ctx.moveTo(i, 0);
    ctx.lineTo(i, ctx.canvas.height);
  }
  ctx.stroke();

  ctx.beginPath();
  for (let i = stepy + 0.5; i < ctx.canvas.height; i += stepy) {
    ctx.moveTo(0, i);
    ctx.lineTo(ctx.canvas.width, i);
  }
  ctx.stroke();

  ctx.restore();
}

// 只做纯数学计算，不做 ctx.rect，可以提升性能
export function isPointInRect(rect: IRect, point: IPoint) {
  const isXIn = point.x >= rect.x && point.x <= rect.x + rect.w;
  const isYIn = point.y >= rect.y && point.y <= rect.y + rect.h;

  return isXIn && isYIn;
}

// 这里的正负号表示和 p1 - p0, p - p0 这两个向量垂直的向量的方向
export function getCross(p0: IPoint, p1: IPoint, p: IPoint) {
  return (p1.x - p0.x) * (p.y - p0.y) - (p1.y - p0.y) * (p.x - p0.x);
}

export function isPointInTriangle(t: ITriangle, p: IPoint) {
  // 三个方向都相同且都小于 0，表示 p 在三角形内部
  const a = getCross(t.p0, t.p1, p) < 0;
  const b = getCross(t.p1, t.p2, p) < 0;
  const c = getCross(t.p2, t.p0, p) < 0;

  return a && b && c;
}
