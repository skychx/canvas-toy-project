const iconsCanvas = document.getElementById("iconCanvas") as HTMLCanvasElement;
const iconsContext = iconsCanvas.getContext("2d")!;

interface IIconRect {
  x: number;
  y: number;
  w: number;
  h: number;
  n:
    | "line"
    | "rect"
    | "circle"
    | "openPath"
    | "closedPath"
    | "curve"
    | "text"
    | "slinky"
    | "eraser";
}

const ICON_RECT_LIST: IIconRect[] = [
  { x: 13.5, y: 18.5, w: 48, h: 48, n: "line" },
  { x: 13.5, y: 78.5, w: 48, h: 48, n: "rect" },
  { x: 13.5, y: 138.5, w: 48, h: 48, n: "circle" },
  { x: 13.5, y: 198.5, w: 48, h: 48, n: "openPath" },
  { x: 13.5, y: 258.5, w: 48, h: 48, n: "closedPath" },
  { x: 13.5, y: 318.5, w: 48, h: 48, n: "curve" },
  { x: 13.5, y: 378.5, w: 48, h: 48, n: "text" },
  { x: 13.5, y: 438.5, w: 48, h: 48, n: "slinky" },
  { x: 13.5, y: 508.5, w: 48, h: 48, n: "eraser" },
];

const enum ICON {
  RECT_BG_COLOR = "#eeeeee",
  RECT_BORDER_COLOR = "rgba(100, 140, 230, 0.5)",
  ICON_BORDER_COLOR = "rgb(100, 140, 230)",
}

function drawIcons(selectRect: IIconRect) {
  iconsContext.clearRect(0, 0, iconsCanvas.width, iconsCanvas.height);

  ICON_RECT_LIST.forEach((rect) => {
    iconsContext.save();

    if (selectRect === rect) {
      setSelectedIconShadow();
    } else {
      setIconShadow();
    }

    iconsContext.fillStyle = ICON.RECT_BG_COLOR;
    iconsContext.fillRect(rect.x, rect.y, rect.w, rect.h);
    iconContext.strokeStyle = ICON.RECT_BORDER_COLOR;
    iconContext.strokeRect(rect.x, rect.y, rect.w, rect.h);

    iconsContext.restore();

    drawIcon(rect);
  });
}

function drawIcon(rect: IIconRect) {
  iconContext.save();

  iconContext.strokeStyle = ICON.ICON_BORDER_COLOR;

  if (rect.n === "line") {
    drawLineIcon(rect);
  } else if (rect.n === "rect") {
    drawRectIcon(rect);
  } else if (rect.n === "circle") {
    drawCircleIcon(rect);
  } else if (rect.n === "openPath") {
    drawOpenPathIcon(rect);
  } else if (rect.n === "closedPath") {
    drawClosedPathIcon(rect);
  } else if (rect.n === "curve") {
    drawCurveIcon(rect);
  } else if (rect.n === "text") {
    drawTextIcon(rect);
  } else if (rect.n === "slinky") {
    drawSlinkyIcon(rect);
  } else if (rect.n === "eraser") {
    drawEraserIcon(rect);
  }

  iconContext.restore();
}
