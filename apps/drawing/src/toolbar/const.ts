import type { IIconRect } from "../types";

export const enum TOOLS_BAR {
  WIDTH = 75,
  HEIGHT = 670,
}

export const ICON_RECT_LIST: IIconRect[] = [
  { x: 13.5, y: 18.5, w: 48, h: 48, n: "line" },
  { x: 13.5, y: 78.5, w: 48, h: 48, n: "rectangle" },
  { x: 13.5, y: 138.5, w: 48, h: 48, n: "circle" },
  { x: 13.5, y: 198.5, w: 48, h: 48, n: "openPath" },
  { x: 13.5, y: 258.5, w: 48, h: 48, n: "closedPath" },
  { x: 13.5, y: 318.5, w: 48, h: 48, n: "curve" },
  { x: 13.5, y: 378.5, w: 48, h: 48, n: "text" },
  { x: 13.5, y: 438.5, w: 48, h: 48, n: "slinky" },
  { x: 13.5, y: 508.5, w: 48, h: 48, n: "eraser" },
];

export const SUPPORT_FILL_TOOLS = [
  "rectangle",
  "circle",
  "closedPath",
  "text",
  "slinky",
];

export const enum ICON_STYLE {
  RECT_BG_COLOR = "#eeeeee",
  RECT_BORDER_COLOR = "rgba(100, 140, 230, 0.5)",
  RECT_SHADOW_COLOR = "rgba(0, 0, 0, 0.7)",
  ICON_FILL_COLOR = "#dddddd",
  ICON_BORDER_COLOR = "rgb(100, 140, 230)",
  ERASER_ICON_GRID_COLOR = "rgb(0, 0, 200)",
}