let scale = 30;
let tiles = [];
let offsetX = 0;
let offsetY = 0;

function setup() {
    createCanvas(768, 432);
    createTiles(scale);
}

function draw() {
    background(220);
    noStroke();
    frameRate(10);

    // Calculate offset based on mouse position


    // Apply the offset
    offsetX = Math.ceil(constrain(mouseX,0,width));
    offsetY = Math.ceil(constrain(mouseY,0,height));
    push();
    translate(-offsetX, -offsetY);
    let count = 0;
    for (let y = Math.floor(offsetY/3); y < Math.ceil((offsetY + height)/3); y++) {
        for (let x = Math.floor(offsetX/3); x < Math.ceil((offsetX + width)/3); x++) {
          tiles[y][x].draw();  
          count++;
        }
    }
    pop();
    fill(0);
    textSize(16);
    text(`OffsetX: ${offsetX.toFixed(2)}, OffsetY: ${offsetY.toFixed(2)}, Number of Tiles Drawn: ${count}`, 10, 20);
    text(`MaxX: ${Math.ceil((offsetX + width)/3)}, MaxY: ${Math.ceil((offsetY + height)/3)}`,10,40);
    text(`MinX: ${Math.floor(offsetX/3)}, MinY: ${Math.floor(offsetY/3)}`,10,60);
}

function mouseWheel(event) {
    if (event.delta > 0) {
        // Increase scale on mouse wheel up
        scale *= 1.1;
    } else {
        // Decrease scale on mouse wheel down
        scale /= 1.1;
    }
    createTiles(scale);
}

function createTiles(scale) {
    for (let y = 0; y < height; y++) {
        tiles[y] = [];
        for (let x = 0; x < width; x++) {
            let n = noise(x / scale, y / scale);
            tiles[y][x] = new Tile(x, y, n);
        }
    }
}

function getColor(n) {
    let c = color(20, 120, 120);
    if (n > 0.3) c = color(70, 180, 180);
    if (n > 0.45) c = color(100, 200, 200);
    if (n > 0.5) c = color(220, 180, 50);
    if (n > 0.515) c = color(0, 150, 0);
    if (n > 0.65) c = color(0, 100, 0);
    if (n > 0.75) c = color(140, 140, 155);
    if (n > 0.83) c = color(80, 80, 95);
    if (n > 0.85) c = color(250, 25, 25);
    return c;
}

class Tile {
    constructor(x, y, n) {
        this.x = x;
        this.y = y;
        this.n = n;
        this.c = getColor(n);
    }
    draw() {
        fill(this.c);
        rect(this.x * 3, this.y * 3, 3, 3);
    }
}