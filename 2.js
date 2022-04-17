// objList

function removeObj() {
    let id = +document.getElementById("objRemove").value;
    if (id >= 0) {
        objList.splice(id, 1);
    }
}

function setPencilMode() {
    isPencilMode = !isPencilMode;
}
function addObj() {
    let x = +document.getElementById("objX").value;
    let y = +document.getElementById("objY").value;
    let w = +document.getElementById("objW").value;
    let h = +document.getElementById("objH").value;
    objList.push(new WallBlock(x, y, w, h));
}

function addAGV() {
    let x = +document.getElementById("agvX").value;
    let y = +document.getElementById("agvY").value;
    let w = +document.getElementById("agvW").value;
    let h = +document.getElementById("agvH").value;
    agvList.push(new Agv(x, y, w, h));
}

let selectedAgv = null;
function moveToDes() {
    selectedAgv = agvList[0];
    let desX = +document.getElementById("desX").value;
    let desY = +document.getElementById("desY").value;
    let SourX = selectedAgv.x;
    let SourY = selectedAgv.y;
    let dy = desY - SourY;
    let dx = desX - SourX;
    if (dx == 0) {
        moveVer(dy, desY);
    } else if (dy == 0) {
        moveHoriz(dx, desX);
    } else {
        let slope = dy / dx;
        let x = SourX;
        let y = SourY;
        //direction = desX - SourX : ;
        let interval = setInterval(() => {
            y = slope * (x - SourX) + SourY;
            if (dx > 0) {
                if (x > desX) {
                    selectedAgv.x = desX;
                    selectedAgv.y = desY;
                    clearInterval(interval);
                    return;
                }
            }
            else {
                if (x < desX) {
                    selectedAgv.x = desX;
                    selectedAgv.y = desY;
                    clearInterval(interval);
                    return;
                }
            }
            x = dx > 0 ? x + selectedAgv.velocity : x - selectedAgv.velocity;
            selectedAgv.x = Math.round(x);
            selectedAgv.y = Math.round(y);
        }, 10);
    }
}

function moveHoriz(dx, desX) {
    if (dx > 0) {
        let interval = setInterval(() => {
            let x = selectedAgv.x + selectedAgv.velocity;
            if (selectedAgv.x > desX || collidedWithObj((selectedAgv.x + selectedAgv.w), selectedAgv.y)) {
                selectedAgv.x = desX;
                clearInterval(interval);
            } else {
                selectedAgv.x = x;
            }
        }, 10);
    }
    else {
        let interval = setInterval(() => {
            let x = selectedAgv.x - selectedAgv.velocity;
            if (selectedAgv.x < desX || collidedWithObj(selectedAgv.x, selectedAgv.y)) {
                selectedAgv.x = desX;
                clearInterval(interval)
            } else {
                selectedAgv.x = x;
            }
        }, 10);
    }
}

function moveVer(dy, desY) {
    if (dy > 0) {
        let interval = setInterval(() => {
            let y = selectedAgv.y + selectedAgv.velocity;
            if (selectedAgv.y > desY || collidedWithObj(selectedAgv.x, selectedAgv.y)) {
                selectedAgv.y = desY;
                clearInterval(interval);
            } else {
                selectedAgv.y = y;
            }
        }, 10);
    }
    else {
        let interval = setInterval(() => {
            let y = selectedAgv.y - selectedAgv.velocity;
            if (selectedAgv.y < desY || collidedWithObj(selectedAgv.x, selectedAgv.y)) {
                selectedAgv.y = desY;
                clearInterval(interval);
            } else {
                selectedAgv.y = y;
            }
        }, 10);
    }
}