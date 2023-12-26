import { DPR } from "./const";

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
export function isPointInRect(
  rect: { x: number; y: number; w: number; h: number },
  point: { x: number; y: number }
) {
  const isXIn = point.x >= rect.x && point.x <= rect.x + rect.w;
  const isYIn = point.y >= rect.y && point.y <= rect.y + rect.h;

  return isXIn && isYIn;
}

export function getCross(
  p0x: number, p0y: number,
  p1x: number, p1y: number,
  px: number, py: number,
  ) {
  return (p1x - p0x) * (py - p0y) - (p1y - p0y) * (px - p0x);
}

export function isPointInTriangle(
  p0x: number, p0y: number,
  p1x: number, p1y: number,
  p2x: number, p2y: number,
  px: number, py: number,
) {
  const a = getCross(p0x, p0y, p1x, p1y, px, py) < 0;
  const b = getCross(p1x, p1y, p2x, p2y, px, py) < 0;
  const c = getCross(p2x, p2y, p0x, p0y, px, py) < 0;

  return a && b && c;
}
