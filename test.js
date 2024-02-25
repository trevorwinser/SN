let tileSize = 3;
let rows, cols;
let viewX = 0, viewY = 0;
let zoom = 0.06;
let tiles = [];

function setup() {
    createCanvas(600, 600);
    noStroke();
    for (let i = -width / tileSize / 2; i < width / tileSize / 2; i++) {
        for (let j = -width / tileSize / 2; j < height / tileSize / 2; j++) {
          let noiseValue = noise(i * 0.05, j * 0.05);
          tiles.push(new Tile(i, j, tileSize, noiseValue));
        }
    }
}

function draw() {
    background(255);
    translate(width/2,height/2);
    for (let tile of tiles) {
        tile.display();
    }
  }

function mouseMoved() {
    viewX += (mouseX - pmouseX) * 0.01;
    viewY += (mouseY - pmouseY)  * 0.01;
  }
  
  function mouseWheel(event) {
    // Adjust zoom factor based on the direction of mouse wheel scrolling
    if (event.delta > 0) {
      // Zoom out
      zoom /= 1.1;
    } else {
      // Zoom in
      zoom *= 1.1;
    }
    // Ensure zoomFactor stays within a reasonable range
  
  }

class Tile {
  constructor(x, y, size, n) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.n = n;
    this.c = getTileColor(x,y);
  }

  display() {
    // Map the noise value to determine the color
    this.c = getTileColor(this.x,this.y);
    fill(this.c);
    rect(this.x*this.size, this.y*this.size, this.size, this.size);
  }
}


function getTileColor(x, y) {
    let xOff = (x + mouseX) * zoom + viewX;
    let yOff = (y + mouseY) * zoom + viewY;
    print(xOff,yOff);
    let n = noise(xOff, yOff);
    let c = color(20, 120, 120);
    if (n > 0.3) c = color(70, 180, 180);
    if (n > 0.45) c = color(100, 200, 200);
    if (n > 0.5) c = color(220, 180, 50);
    if (n > 0.515) c = color(0, 150, 0);
    if (n > 0.65) c = color(0, 100, 0);
    if (n > 0.75) c = color(140, 140, 155);
    if (n > 0.83) c = color(80, 80, 95);
    if (n > 0.85) c = color(220, 220, 250);
    return c;
  }

