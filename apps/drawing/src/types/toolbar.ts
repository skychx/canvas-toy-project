export interface IIconRect {
  x: number;
  y: number;
  w: number;
  h: number;
  n:
    | "line"
    | "rectangle"
    | "circle"
    | "openPath"
    | "closedPath"
    | "curve"
    | "text"
    | "slinky"
    | "eraser";
}
