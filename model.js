

class obj {
    x = 0;
    y = 0;
    velocity = 1;
    move(dir) {
        switch (dir) {
            case 'l':
                this.x = this.x + this.velocity;
                break;
            case 'r':
                this.x = this.x - this.velocity;
                break;
            case 't':
                this.y = this.y - this.velocity;
                break;
            case 'b':
                this.y = this.y + this.velocity;
                break;
            default:
                break;
        }
    }
}

class WallBlock extends obj {
    constructor(x, y, w, h) {
        super();
        this.x = x; this.y = y; this.w = w; this.h = h;
    }

    w = 0;
    h = 0;
    isSelected = false;


}


class Agv extends obj {
    constructor(x, y, w, h) {
        super();
        this.x = x; this.y = y; this.w = w; this.h = h;
    }
    x = 10; y = 10; w = 50;
    h = 50; color = '#fb8c00';
    velocity = 10;


}


