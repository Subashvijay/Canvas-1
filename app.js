var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
canvasWidth = canvas.offsetWidth;
canvasHeight = canvas.offsetHeight;
let isdrawResizeRect = false;
let clickMOuseObj;
let isDrawCord = false;
let objList = [];
let selectedObj = null;
let isPencilMode = false;
var gridImg = new Image();
gridImg.src = './assets/grid.svg';
var destImg = new Image();
destImg.src = './assets/destination.svg';
let agvList = [];

//agvList.push(new Agv(10, 10, 100, 100));
clickedPos = { x: 0, y: 0 };
//agvList[0].velocity = 5;

document.addEventListener("mousedown", mouseDownHandle, false);
document.addEventListener("mouseup", mouseUpHandle, false);
document.addEventListener("mousemove", mouseMoveHandle, false);
document.addEventListener("keydown", keyDownHandler, false);

function mouseDownHandle(e) {

  // console.log(e, "down")
  if (checkWithinCanvas(e)) {
    clickHandler(e);
    // clickMOuseObj = e;
    // isDrawCord = true;
    isdrawResizeRect = true;
    rectResize.x = e.offsetX;
    rectResize.y = e.offsetY;

    if (selectedObj) {
      isDragSelObj = true;
    }
  }

}
function mouseUpHandle(e) {
  // console.log(e)
  if (checkWithinCanvas(e)) {
    isdrawResizeRect = false;
    isDrawCord = false;
    if (rectResize.w != 0 && rectResize.h != 0) {
      objList.push({ ...rectResize });
      rectResize = new WallBlock(0, 0, 0, 0);
    }

    if (selectedObj && isDragSelObj) {
      isDragSelObj = false;
      // selectedObj = null;
    }
  }
}

let copiedObj = null;
function keyDownHandler(e) {
  let obj = selectedObj ? selectedObj : agvList[0]
  if (obj || copiedObj) {
    if (e.key == "Right" || e.key == "ArrowRight") {
      move('l', obj);
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
      move('r', obj);
    }
    if (e.key == "Up" || e.key == "ArrowUp") {
      move('t', obj);
    }
    else if (e.key == "Down" || e.key == "ArrowDown") {
      move('b', obj);
    }

    if ((e.key == "c" || e.key == "keyC") && e.ctrlKey) {
      copiedObj = { ...selectedObj };
      console.log(copiedObj);
    }
    // console.log(e);
    if ((e.key == "v" || e.key == "keyV") && e.ctrlKey) {
      if (copiedObj) {
        copiedObj.x = clickedPos.x; copiedObj.y = clickedPos.y;
        objList.push({ ...copiedObj });
      }
    }
    if ((e.key == "Delete") && e.shiftKey) {
      let index = objList.findIndex(o => o.x == selectedObj.x && o.y == selectedObj.y);
      objList.splice(index, 1);
      selectedObj = null;
    }
  }
}

let previousMouseE = null;

function mouseMoveHandle(e) {
  // console.log(e);
  if (checkWithinCanvas(e)) {
    clickMOuseObj = e;
    isDrawCord = true;
    if (isdrawResizeRect && !selectedObj) {
      rectResize.w = e.offsetX - rectResize.x;
      rectResize.h = e.offsetY - rectResize.y;
      // isDrawCord = true;
      // clickMOuseObj = e;
    }

    if (isDragSelObj && previousMouseE) {
      selectedObj.x = (e.offsetX - previousMouseE.offsetX) + selectedObj.x;
      selectedObj.y = (e.offsetY - previousMouseE.offsetY) + selectedObj.y;
    }
    previousMouseE = e;
  }
}

destPos = null;
function clickHandler(e) {
  let x = e.offsetX; let y = e.offsetY;
  selectedObj = null;
  clickedPos = { x, y };
  if (e.shiftKey) {
    document.getElementById("desX").value = x;
    document.getElementById("desY").value = y;
    destPos = { x, y };
  }
  selectedObj = collidedWithObj(x, y);
}

function collidedWithObj(x, y) {
  let result = null;
  objList.forEach((o, i) => {
    if (x > o.x && x < (o.x + o.w) && y < (o.y + o.h) && y > o.y) {
      result = o;
      // document.getElementById("objRemove").value = i;
    }
  });
  return result;
}

function drawCordinate(x, y) {
  ctx.strokeStyle = "black";
  ctx.setLineDash([5, 15]);
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(canvas.offsetWidth, y);
  ctx.stroke();
  ctx.moveTo(x, 0);
  ctx.lineTo(x, canvas.offsetHeight);
  ctx.stroke();
  ctx.fillStyle = "black";
  ctx.font = "15px Arial";
  ctx.fillText(`(x:${x},y:${y})`, x + 5, y);
  ctx.setLineDash([]);
}

rectResize = new WallBlock(0, 0, 0, 0);

function drawResizeRect() {
  ctx.beginPath();
  ctx.rect(rectResize.x, rectResize.y, rectResize.w, rectResize.h);
  // ctx.fill()
  ctx.strokeStyle = "#0095DD";
  ctx.stroke();
  ctx.fillStyle = "blue";
  ctx.font = "15px Arial";
  ctx.fillText(`w:${rectResize.w},h:${rectResize.h}`, clickMOuseObj.offsetX + 10, clickMOuseObj.offsetY - 20);
}

function checkWithinCanvas(e) {
  // return e.offsetX < canvasWidth && e.offsetY < canvasHeight;
  return e.srcElement == canvas;
}

function drawRect(x, y, w, h, name) {
  ctx.beginPath();
  ctx.fillStyle = "#0095DD";
  ctx.rect(x, y, w, h);
  ctx.fill();
  ctx.closePath();
  let offsetX = 10;
  let offsetY = 20;
  if (w < 0) {
    offsetX = -30;
  }
  if (h < 0) {
    offsetY = -10;
  }
  ctx.fillStyle = "white";
  ctx.font = "13px Arial";
  ctx.fillText(`id:${name}`, x + offsetX, y + offsetY);
  ctx.fillStyle = "black";
  ctx.font = "13px Arial";
  if (offsetX < 0 || offsetY < 0) {
    ctx.fillText(`(h:${h},w:${w})`, x + 1.2 * offsetX, y - 1.2 * offsetY);
  } else {
    ctx.fillText(`(h:${h},w:${w})`, x + w / 2 - 40, y + h / 2);
  }
  // ctx.stroke();
  // ctx.fill();
  ctx.closePath();
}


function drawAgv(agv = new Agv(), id) {
  ctx.beginPath();
  ctx.fillStyle = agv.color;
  ctx.rect(agv.x, agv.y, agv.w, agv.h);
  ctx.fill();
  ctx.fillStyle = "white";
  ctx.font = "13px Arial";
  ctx.fillText(`AGV:${id}`, agv.x + agv.w / 2 - 14, agv.y + agv.h / 2);
  ctx.closePath();
}
isDragSelObj = false;

function highlightSelectedObj() {
  ctx.beginPath();
  ctx.strokeStyle = "black";
  ctx.rect(selectedObj.x, selectedObj.y, selectedObj.w, selectedObj.h);
  // ctx.fill()
  ctx.stroke();
}

function draw100DGraph() {
  for (let i = 0; i * 100 < canvasHeight; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * 100);
    ctx.fillStyle = "black";
    ctx.font = "13px Arial";
    ctx.fillText(i * 100, 0, i * 100);
    ctx.lineTo(canvas.offsetWidth, i * 100);
    ctx.strokeStyle = "black"
    ctx.stroke();
  }
  for (let j = 0; j * 100 < canvasWidth; j++) {
    ctx.beginPath();
    ctx.moveTo(j * 100, 0);
    ctx.fillStyle = "black";
    ctx.font = "13px Arial";
    ctx.fillText(j * 100, j * 100, 10);
    ctx.lineTo(j * 100, canvas.offsetHeight);
    ctx.strokeStyle = "black"
    ctx.stroke();
  }
}

showGridLines = true;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  draw100DGraph();
  if (showGridLines) {
    //  drawGrid()
    ctx.drawImage(gridImg, 0, 0)
  }

  if (isdrawResizeRect) {
    drawResizeRect();
  }
  objList.forEach((x, i) => {
    drawRect(x.x, x.y, x.w, x.h, i);
  });
  agvList.forEach((x, i) => {
    drawAgv(x, i)
  })

  if (selectedObj) {
    highlightSelectedObj();
    drawCordinate(selectedObj.x + selectedObj.w, selectedObj.y + selectedObj.h)
    drawCordinate(selectedObj.x, selectedObj.y)

  }


  if (isDrawCord && !selectedObj) {
    drawCordinate(clickMOuseObj.offsetX, clickMOuseObj.offsetY);
  }

  if (destPos) {
    ctx.drawImage(destImg, destPos.x - 14, destPos.y - 40, 30, 40)
  }

}


setInterval(draw, 10);
