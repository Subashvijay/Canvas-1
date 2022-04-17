


class WallBlock {
    constructor(x, y, w, h) {
        this.x = x; this.y = y; this.w = w; this.h = h;
    }

    w = 0;
    h = 0;
    isSelected = false;
    velocity = 1;
}


class Agv {
    constructor(x, y, w, h) {
        this.x = x; this.y = y; this.w = w; this.h = h;
    }
    x = 10; y = 10; w = 50;
    h = 50; color = 'red';
    velocity = 10;
}

function move(dir, obj) {
    switch (dir) {
        case 'l':
            obj.x = obj.x + obj.velocity;
            break;
        case 'r':
            obj.x = obj.x - obj.velocity;
            break;
        case 't':
            obj.y = obj.y - obj.velocity;
            break;
        case 'b':
            obj.y = obj.y + obj.velocity;
            break;
        default:
            break;
    }
}

