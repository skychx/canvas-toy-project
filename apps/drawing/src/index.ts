import "./main";

var drawingCanvas = document.getElementById("drawingCanvas"),
  drawingContext = drawingCanvas.getContext("2d"),
  backgroundContext = document.createElement("canvas").getContext("2d"),
  strokeStyleSelect = document.getElementById("strokeStyleSelect"),
  fillStyleSelect = document.getElementById("fillStyleSelect"),
  lineWidthSelect = document.getElementById("lineWidthSelect"),
  eraseAllButton = document.getElementById("eraseAllButton"),
  snapshotButton = document.getElementById("snapshotButton"),
  controls = document.getElementById("controls"),
  curveInstructions = document.getElementById("curveInstructions"),
  curveInstructionsOkayButton = document.getElementById(
    "curveInstructionsOkayButton"
  ),
  curveInstructionsNoMoreButton = document.getElementById(
    "curveInstructionsNoMoreButton"
  ),
  showCurveInstructions = true,
  drawingSurfaceImageData,
  rubberbandW,
  rubberbandH,
  rubberbandUlhc = {},
  dragging = false,
  mousedown = {},
  lastRect = {},
  lastX,
  lastY,
  controlPoint = {},
  editingCurve = false,
  draggingControlPoint = false,
  curveStart = {},
  curveEnd = {},
  doFill = false,
  editingText = false,
  currentText,
  CONTROL_POINT_RADIUS = 20,
  CONTROL_POINT_FILL_STYLE = "rgba(255,255,0,0.5)",
  CONTROL_POINT_STROKE_STYLE = "rgba(0, 0, 255, 0.8)",
  RUBBERBAND_LINE_WIDTH = 1,
  RUBBERBAND_STROKE_STYLE = "green",
  GRID_LINE_COLOR = "rgb(0, 0, 200)",
  SLINKY_SHADOW_OFFSET = -5,
  SLINKY_SHADOW_BLUR = 20,
  ERASER_LINE_WIDTH = 1,
  ERASER_SHADOW_STYLE = "blue",
  ERASER_STROKE_STYLE = "rgba(0,0,255,0.6)",
  ERASER_SHADOW_OFFSET = -5,
  ERASER_SHADOW_BLUR = 20,
  ERASER_RADIUS = 40;

// Grid..........................................................

function drawGrid(context, color, stepx, stepy) {
  context.save();

  context.strokeStyle = color;
  context.fillStyle = "#ffffff";
  context.lineWidth = 0.5;
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);
  context.globalAlpha = 0.1;

  context.beginPath();
  for (var i = stepx + 0.5; i < context.canvas.width; i += stepx) {
    context.moveTo(i, 0);
    context.lineTo(i, context.canvas.height);
  }
  context.stroke();

  context.beginPath();
  for (var i = stepy + 0.5; i < context.canvas.height; i += stepy) {
    context.moveTo(0, i);
    context.lineTo(context.canvas.width, i);
  }
  context.stroke();

  context.restore();
}

// Saving/Restoring the drawing surface..........................

function saveDrawingSurface() {
  drawingSurfaceImageData = drawingContext.getImageData(
    0,
    0,
    drawingCanvas.width,
    drawingCanvas.height
  );
}

function restoreDrawingSurface() {
  drawingContext.putImageData(drawingSurfaceImageData, 0, 0);
}

// Rubberbands...................................................

function updateRubberbandRectangle(loc) {
  rubberbandW = Math.abs(loc.x - mousedown.x);
  rubberbandH = Math.abs(loc.y - mousedown.y);

  if (loc.x > mousedown.x) rubberbandUlhc.x = mousedown.x;
  else rubberbandUlhc.x = loc.x;

  if (loc.y > mousedown.y) rubberbandUlhc.y = mousedown.y;
  else rubberbandUlhc.y = loc.y;
}

function drawRubberbandRectangle() {
  drawingContext.strokeRect(
    rubberbandUlhc.x,
    rubberbandUlhc.y,
    rubberbandW,
    rubberbandH
  );
}

function drawRubberbandLine(loc) {
  drawingContext.beginPath();
  drawingContext.moveTo(mousedown.x, mousedown.y);
  drawingContext.lineTo(loc.x, loc.y);
  drawingContext.stroke();
}

function drawRubberbandCircle(loc) {
  var angle = Math.atan(rubberbandH / rubberbandW);
  var radius = rubberbandH / Math.sin(angle);

  if (mousedown.y === loc.y) {
    radius = Math.abs(loc.x - mousedown.x);
  }

  drawingContext.beginPath();
  drawingContext.arc(mousedown.x, mousedown.y, radius, 0, Math.PI * 2, false);
  drawingContext.stroke();
}

function drawRubberband(loc) {
  drawingContext.save();

  drawingContext.strokeStyle = RUBBERBAND_STROKE_STYLE;
  drawingContext.lineWidth = RUBBERBAND_LINE_WIDTH;

  if (window.selectedFunction === "rectangle") {
    drawRubberbandRectangle();
  } else if (window.selectedFunction === "line" || window.selectedFunction === "curve") {
    drawRubberbandLine(loc);
  } else if (window.selectedFunction === "circle") {
    drawRubberbandCircle(loc);
  }

  drawingContext.restore();
}

// Eraser........................................................

function setPathForEraser() {
  drawingContext.beginPath();
  drawingContext.moveTo(lastX, lastY);
  drawingContext.arc(
    lastX,
    lastY,
    ERASER_RADIUS + ERASER_LINE_WIDTH,
    0,
    Math.PI * 2,
    false
  );
}

function setSlinkyAttributes() {
  drawingContext.lineWidth = lineWidthSelect.value;
  drawingContext.shadowColor = strokeStyleSelect.value;
  drawingContext.shadowOffsetX = SLINKY_SHADOW_OFFSET;
  drawingContext.shadowOffsetY = SLINKY_SHADOW_OFFSET;
  drawingContext.shadowBlur = SLINKY_SHADOW_BLUR;
  drawingContext.strokeStyle = strokeStyleSelect.value;
}

function setEraserAttributes() {
  drawingContext.lineWidth = ERASER_LINE_WIDTH;
  drawingContext.shadowColor = ERASER_SHADOW_STYLE;
  drawingContext.shadowOffsetX = ERASER_SHADOW_OFFSET;
  drawingContext.shadowOffsetY = ERASER_SHADOW_OFFSET;
  drawingContext.shadowBlur = ERASER_SHADOW_BLUR;
  drawingContext.strokeStyle = ERASER_STROKE_STYLE;
}

function eraseLast() {
  var x = lastX - ERASER_RADIUS - ERASER_LINE_WIDTH,
    y = lastY - ERASER_RADIUS - ERASER_LINE_WIDTH,
    w = ERASER_RADIUS * 2 + ERASER_LINE_WIDTH * 2,
    h = w,
    cw = drawingContext.canvas.width,
    ch = drawingContext.canvas.height;

  drawingContext.save();

  setPathForEraser();
  drawingContext.clip();

  if (x + w > cw) w = cw - x;
  if (y + h > ch) h = ch - y;

  if (x < 0) {
    x = 0;
  }
  if (y < 0) {
    y = 0;
  }

  drawingContext.drawImage(backgroundContext.canvas, x, y, w, h, x, y, w, h);

  drawingContext.restore();
}

function drawEraser(loc) {
  drawingContext.save();
  setEraserAttributes();

  drawingContext.beginPath();
  drawingContext.arc(loc.x, loc.y, ERASER_RADIUS, 0, Math.PI * 2, false);
  drawingContext.clip();
  drawingContext.stroke();

  drawingContext.restore();
}

function drawSlinky(loc) {
  drawingContext.save();
  setSlinkyAttributes();

  drawingContext.beginPath();
  drawingContext.arc(loc.x, loc.y, ERASER_RADIUS, 0, Math.PI * 2, false);
  drawingContext.clip();

  drawingContext.strokeStyle = strokeStyleSelect.value;
  drawingContext.stroke();

  if (doFill) {
    drawingContext.shadowColor = undefined;
    drawingContext.shadowOffsetX = 0;
    drawingContext.globalAlpha = 0.2;
    drawingContext.fill();
  }
  drawingContext.restore();
}

// Finish drawing lines, circles, and rectangles.................

function finishDrawingLine(loc) {
  drawingContext.beginPath();
  drawingContext.moveTo(mousedown.x, mousedown.y);
  drawingContext.lineTo(loc.x, loc.y);
  drawingContext.stroke();
}

function finishDrawingCircle(loc) {
  var angle = Math.atan(rubberbandH / rubberbandW),
    radius = rubberbandH / Math.sin(angle);

  if (mousedown.y === loc.y) {
    radius = Math.abs(loc.x - mousedown.x);
  }

  drawingContext.beginPath();
  drawingContext.arc(mousedown.x, mousedown.y, radius, 0, Math.PI * 2, false);

  if (doFill) {
    drawingContext.fill();
  }

  drawingContext.stroke();
}

function finishDrawingRectangle() {
  if (rubberbandW > 0 && rubberbandH > 0) {
    if (doFill) {
      drawingContext.fillRect(
        rubberbandUlhc.x,
        rubberbandUlhc.y,
        rubberbandW,
        rubberbandH
      );
    }
    drawingContext.strokeRect(
      rubberbandUlhc.x,
      rubberbandUlhc.y,
      rubberbandW,
      rubberbandH
    );
  }
}

// Drawing curves................................................

function drawControlPoint() {
  drawingContext.save();

  drawingContext.strokeStyle = CONTROL_POINT_STROKE_STYLE;
  drawingContext.fillStyle = CONTROL_POINT_FILL_STYLE;
  drawingContext.lineWidth = 1.0;

  drawingContext.beginPath();
  drawingContext.arc(
    controlPoint.x,
    controlPoint.y,
    CONTROL_POINT_RADIUS,
    0,
    Math.PI * 2,
    false
  );
  drawingContext.stroke();
  drawingContext.fill();

  drawingContext.restore();
}

function startEditingCurve(loc) {
  if (loc.x != mousedown.x || loc.y != mousedown.y) {
    drawingCanvas.style.cursor = "pointer";

    curveStart.x = mousedown.x;
    curveStart.y = mousedown.y;

    curveEnd.x = loc.x;
    curveEnd.y = loc.y;

    controlPoint.x = (curveStart.x + curveEnd.x) / 2;
    controlPoint.y = (curveStart.y + curveEnd.y) / 2;

    drawControlPoint();

    editingCurve = true;

    if (showCurveInstructions) curveInstructions.style.display = "inline";
  }
}

function drawCurve() {
  drawingContext.beginPath();
  drawingContext.moveTo(curveStart.x, curveStart.y);
  drawingContext.quadraticCurveTo(
    controlPoint.x,
    controlPoint.y,
    curveEnd.x,
    curveEnd.y
  );
  drawingContext.stroke();
}

function finishDrawingCurve() {
  drawingCanvas.style.cursor = "crosshair";
  restoreDrawingSurface();
  drawCurve();

  if (doFill) {
    drawingContext.fill();
  }
}

// Guidewires....................................................

function drawHorizontalLine(y) {
  drawingContext.beginPath();
  drawingContext.moveTo(0, y + 0.5);
  drawingContext.lineTo(drawingCanvas.width, y + 0.5);
  drawingContext.stroke();
}

function drawVerticalLine(x) {
  drawingContext.beginPath();
  drawingContext.moveTo(x + 0.5, 0);
  drawingContext.lineTo(x + 0.5, drawingCanvas.height);
  drawingContext.stroke();
}

function drawGuidewires(x, y) {
  drawingContext.save();
  drawingContext.strokeStyle = "rgba(0,0,230,0.4)";
  drawingContext.lineWidth = 0.5;
  drawVerticalLine(x);
  drawHorizontalLine(y);
  drawingContext.restore();
}

// Event handling functions......................................

function windowToCanvas(canvas, x, y) {
  var bbox = canvas.getBoundingClientRect();
  return {
    x: x - bbox.left * (canvas.width / bbox.width),
    y: y - bbox.top * (canvas.height / bbox.height),
  };
}

function mouseDownOrTouchStartInControlCanvas(loc) {
  if (editingText) {
    editingText = false;
    eraseTextCursor();
  } else if (editingCurve) {
    editingCurve = false;
    restoreDrawingSurface();
  }
}

// Key event handlers............................................

function backspace() {
  restoreDrawingSurface();
  currentText = currentText.slice(0, -1);
  eraseTextCursor();
}

function enter() {
  finishDrawingText();
  mousedown.y += drawingContext.measureText("W").width;
  saveDrawingSurface();
  startDrawingText();
}

function insert(key) {
  currentText += key;
  restoreDrawingSurface();
  drawCurrentText();
  drawTextCursor();
}

document.onkeydown = function (e) {
  if (e.ctrlKey || e.metaKey || e.altKey) return;

  if (e.keyCode === 8) {
    // backspace
    e.preventDefault();
    backspace();
  } else if (e.keyCode === 13) {
    // enter
    e.preventDefault();
    enter();
  }
};

document.onkeypress = function (e) {
  var key = String.fromCharCode(e.which);

  if (e.ctrlKey || e.metaKey || e.altKey) return;

  if (editingText && e.keyCode !== 8) {
    e.preventDefault();
    insert(key);
  }
};

function eraseTextCursor() {
  restoreDrawingSurface();
  drawCurrentText();
}

function drawCurrentText() {
  if (doFill) drawingContext.fillText(currentText, mousedown.x, mousedown.y);

  drawingContext.strokeText(currentText, mousedown.x, mousedown.y);
}

function drawTextCursor() {
  var widthMetric = drawingContext.measureText(currentText),
    heightMetric = drawingContext.measureText("W"),
    cursorLoc = {
      x: mousedown.x + widthMetric.width,
      y: mousedown.y - heightMetric.width + 5,
    };

  drawingContext.beginPath();
  drawingContext.moveTo(cursorLoc.x, cursorLoc.y);
  drawingContext.lineTo(cursorLoc.x, cursorLoc.y + heightMetric.width - 12);
  drawingContext.stroke();
}

function startDrawingText() {
  editingText = true;
  currentText = "";
  drawTextCursor();
}

function finishDrawingText() {
  restoreDrawingSurface();
  drawCurrentText();
}

function mouseDownOrTouchStartInDrawingCanvas(loc) {
  dragging = true;

  if (editingText) {
    finishDrawingText();
  } else if (editingCurve) {
    if (drawingContext.isPointInPath(loc.x, loc.y)) {
      draggingControlPoint = true;
    } else {
      restoreDrawingSurface();
    }
    editingCurve = false;
  }

  if (!draggingControlPoint) {
    saveDrawingSurface();
    mousedown.x = loc.x;
    mousedown.y = loc.y;

    if (window.selectedFunction === "openPath" || window.selectedFunction === "closedPath") {
      drawingContext.beginPath();
      drawingContext.moveTo(loc.x, loc.y);
    } else if (window.selectedFunction === "text") {
      startDrawingText();
    } else {
      editingText = false;
    }

    lastX = loc.x;
    lastY = loc.y;
  }
}

function moveControlPoint(loc) {
  controlPoint.x = loc.x;
  controlPoint.y = loc.y;
}

function mouseMoveOrTouchMoveInDrawingCanvas(loc) {
  if (draggingControlPoint) {
    restoreDrawingSurface();

    moveControlPoint(loc);

    drawingContext.save();

    drawingContext.strokeStyle = RUBBERBAND_STROKE_STYLE;
    drawingContext.lineWidth = RUBBERBAND_LINE_WIDTH;

    drawCurve();
    drawControlPoint();

    drawingContext.restore();
  } else if (dragging) {
    if (window.selectedFunction === "eraser") {
      eraseLast();
      drawEraser(loc);
    } else if (window.selectedFunction === "slinky") {
      drawSlinky(loc);
    } else if (
      window.selectedFunction === "openPath" ||
      window.selectedFunction === "closedPath"
    ) {
      drawingContext.lineTo(loc.x, loc.y);
      drawingContext.stroke();
    } else {
      // For lines, circles, rectangles, and curves, draw rubberbands
      restoreDrawingSurface();
      updateRubberbandRectangle(loc);
      drawRubberband(loc);
    }

    lastX = loc.x;
    lastY = loc.y;

    lastRect.w = rubberbandW;
    lastRect.h = rubberbandH;
  }

  if (dragging || draggingControlPoint) {
    if (
      window.selectedFunction === "line" ||
      window.selectedFunction === "rectangle" ||
      window.selectedFunction === "circle"
    ) {
      drawGuidewires(loc.x, loc.y);
    }
  }
}

function endPath(loc) {
  drawingContext.lineTo(loc.x, loc.y);
  drawingContext.stroke();

  if (window.selectedFunction === "closedPath") {
    drawingContext.closePath();

    if (doFill) {
      drawingContext.fill();
    }
    drawingContext.stroke();
  }
}

function mouseUpOrTouchEndInDrawingCanvas(loc) {
  if (window.selectedFunction !== "eraser" && window.selectedFunction !== "slinky") {
    restoreDrawingSurface();
  }

  if (draggingControlPoint) {
    moveControlPoint(loc);
    finishDrawingCurve();
    draggingControlPoint = false;
  } else if (dragging) {
    if (window.selectedFunction === "eraser") {
      eraseLast();
    } else if (
      window.selectedFunction === "openPath" ||
      window.selectedFunction === "closedPath"
    ) {
      endPath(loc);
    } else {
      if (window.selectedFunction === "line") finishDrawingLine(loc);
      else if (window.selectedFunction === "rectangle") finishDrawingRectangle();
      else if (window.selectedFunction === "circle") finishDrawingCircle(loc);
      else if (window.selectedFunction === "curve") startEditingCurve(loc);
    }
  }
  dragging = false;
}

// Drawing canvas event handlers.................................

drawingCanvas.onmousedown = function (e) {
  var x = e.x || e.clientX,
    y = e.y || e.clientY;

  e.preventDefault();
  mouseDownOrTouchStartInDrawingCanvas(windowToCanvas(drawingCanvas, x, y));
};

drawingCanvas.ontouchstart = function (e) {
  if (e.touches.length === 1) {
    e.preventDefault();
    mouseDownOrTouchStartInDrawingCanvas(
      windowToCanvas(drawingCanvas, e.touches[0].clientX, e.touches[0].clientY)
    );
  }
};

drawingCanvas.ontouchmove = function (e) {
  if (e.touches.length === 1) {
    mouseMoveOrTouchMoveInDrawingCanvas(
      windowToCanvas(drawingCanvas, e.touches[0].clientX, e.touches[0].clientY)
    );
  }
};

drawingCanvas.ontouchend = function (e) {
  var loc;

  if (e.changedTouches.length === 1) {
    loc = windowToCanvas(
      drawingCanvas,
      e.changedTouches[0].clientX,
      e.changedTouches[0].clientY
    );
    mouseUpOrTouchEndInDrawingCanvas(loc);
  }
};

drawingCanvas.onmousemove = function (e) {
  var x = e.x || e.clientX,
    y = e.y || e.clientY,
    loc = windowToCanvas(drawingCanvas, x, y);

  e.preventDefault();
  mouseMoveOrTouchMoveInDrawingCanvas(loc);
};

drawingCanvas.onmouseup = function (e) {
  var x = e.x || e.clientX,
    y = e.y || e.clientY,
    loc = windowToCanvas(drawingCanvas, x, y);

  e.preventDefault();
  mouseUpOrTouchEndInDrawingCanvas(loc);
};

// Control event handlers........................................

strokeStyleSelect.onchange = function (e) {
  drawingContext.strokeStyle = strokeStyleSelect.value;
};

fillStyleSelect.onchange = function (e) {
  drawingContext.fillStyle = fillStyleSelect.value;
};

lineWidthSelect.onchange = function (e) {
  drawingContext.lineWidth = lineWidthSelect.value;
  /*
var c = drawingContext.canvas,
    sw = c.width,
    sh = c.height,
    dw = sw * lineWidthSelect.value,
    dh = sh * lineWidthSelect.value;

drawingContext.scale(lineWidthSelect.value, lineWidthSelect.value);
drawingContext.drawImage(c, 0, 0);
*/
};

eraseAllButton.onclick = function (e) {
  drawingContext.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
  drawGrid(drawingContext, GRID_LINE_COLOR, 10, 10);
  saveDrawingSurface();
  rubberbandW = rubberbandH = 0;
};

curveInstructionsOkayButton.onclick = function (e) {
  curveInstructions.style.display = "none";
};

curveInstructionsNoMoreButton.onclick = function (e) {
  curveInstructions.style.display = "none";
  showCurveInstructions = false;
};

snapshotButton.onclick = function (e) {
  var dataUrl;

  if (snapshotButton.value === "Take snapshot") {
    dataUrl = drawingCanvas.toDataURL();
    snapshotImageElement.src = dataUrl;
    snapshotImageElement.style.display = "inline";
    snapshotInstructions.style.display = "inline";
    drawingCanvas.style.display = "none";
    controls.style.display = "none";
    snapshotButton.value = "Back to Paint";
  } else {
    snapshotButton.value = "Take snapshot";
    drawingCanvas.style.display = "inline";
    controls.style.display = "inline";
    snapshotImageElement.style.display = "none";
    snapshotInstructions.style.display = "none";
  }
};

function drawBackground() {
  backgroundContext.canvas.width = drawingContext.canvas.width;
  backgroundContext.canvas.height = drawingContext.canvas.height;

  drawGrid(backgroundContext, GRID_LINE_COLOR, 10, 10);
}

drawingContext.font = "48px Palatino";
drawingContext.textBaseline = "bottom";

drawingContext.strokeStyle = strokeStyleSelect.value;
drawingContext.fillStyle = fillStyleSelect.value;
drawingContext.lineWidth = lineWidthSelect.value;

drawGrid(drawingContext, GRID_LINE_COLOR, 10, 10);
window.selectedFunction = "slinky";

// This event listener prevents touch devices from
// scrolling the visible viewport.

document.body.addEventListener(
  "touchmove",
  function (e) {
    e.preventDefault();
  },
  false
);

drawBackground();
