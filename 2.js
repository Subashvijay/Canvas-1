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
    if (!selectedAgv) {
        return;
    }
    //selectedAgv = agvList[0];
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

let collidedAt = null;
function moveHoriz(dx, desX) {
    if (dx > 0) {
        let interval = setInterval(() => {
            let x = selectedAgv.x + selectedAgv.velocity;
            console.log('moving x', x)
            if (detectCollisionWithWall()) {
                console.log('collision', x)
                selectedAgv.x = collidedAt.x - selectedAgv.velocity;
                clearInterval(interval);
            } else if (selectedAgv.x > desX) {
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
            if (detectCollisionWithWall()) {
                selectedAgv.x = collidedAt.x + selectedAgv.velocity;
                clearInterval(interval);
            } else if (selectedAgv.x < desX) {
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
            if (detectCollisionWithWall()) {
                selectedAgv.y = collidedAt.y - selectedAgv.velocity;
                clearInterval(interval);
                return;
            }
            if (selectedAgv.y > desY) {
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
            if (detectCollisionWithWall()) {
                selectedAgv.y = collidedAt.y + selectedAgv.velocity;
                clearInterval(interval);
                return;
            }
            if (selectedAgv.y < desY) {
                selectedAgv.y = desY;
                clearInterval(interval);
            } else {
                selectedAgv.y = y;
            }
        }, 10);
    }
}

function detectCollisionWithWall() {
    let rect1 = selectedAgv;
    let result = false;
    objList.forEach(rect2 => {
        if (rect1.x < rect2.x + rect2.w &&
            rect1.x + rect1.w > rect2.x &&
            rect1.y < rect2.y + rect2.h &&
            rect1.h + rect1.y > rect2.y) {
            result = true;
            return true;
        }
    });
    if (result) {
        console.log('colllide at ', rect1.x);
        collidedAt = { ...rect1 };
    }
    return result;
}