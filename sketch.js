let scaleFactor = 0.05;
let tiles;
let offsetX = 0;
let offsetY = 0;
let selected;

function setup() {
    createCanvas(768, 432);
    tiles = new Array(height);

    for (let i = 0; i < height; i++) {
        tiles[i] = new Array(width);
    }
    createTiles();
    noStroke();
}

function draw() {
    background(220);


    // Calculate offset based on mouse position

    // Apply the offset
    offsetX = Math.ceil(constrain(mouseX,0,width));
    offsetY = Math.ceil(constrain(mouseY,0,height));
    push();
    // translate(width/2,height/2);
    translate(-offsetX, -offsetY);

    
    
    let count = 0;
    for (let y = Math.floor(offsetY/3); y < Math.ceil((offsetY + height)/3); y++) {
        for (let x = Math.floor((offsetX)/3); x < Math.ceil((offsetX + width)/3); x++) {
          tiles[y][x].draw();  
          count++;
        }
    }
    fill(0);
    text("0,0",0,0);
    pop();
    fill(0);
    textSize(16);
    text(`OffsetX: ${offsetX.toFixed(2)}, OffsetY: ${offsetY.toFixed(2)}, Number of Tiles Drawn: ${count}`, 10, 20);
    text(`MaxX: ${Math.ceil((offsetX + width)/3)}, MaxY: ${Math.ceil((offsetY + height)/3)}`,10,40);
    text(`MinX: ${Math.floor(offsetX/3)}, MinY: ${Math.floor(offsetY/3)}`,10,60);
    text(`MouseX: ${mouseX} MouseY: ${mouseY}`,10,80);
}



function mousePressed() {
    // Calculate tile coordinates based on mouse position and offset
    let x = Math.floor((mouseX + offsetX) / 3);
    let y = Math.floor((mouseY + offsetY) / 3);

    // Check if the coordinates are within the valid range
    if (x >= 0 && y >= 0 && x < width && y < height) {
        // Update the color of the tile under the mouse
        let temp = tiles[y][x];
        // Must select land
        if (temp.n > 0.5) {
            if (selected != null)
                selected.c = getColor(selected.n);
            // Highlight selected tile
            tiles[y][x].c = color(255, 0, 0);
            selected = tiles[y][x];
        }
    }
}
function keyPressed() {
    if (key = 'k') {
        if (selected != null) {
            offsetX = selected.x;
            offsetY = selected.y;
        }
    }
}


function createTiles() {
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let n = noise((x+y/4) * scaleFactor, (y) * scaleFactor);
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
    if (n > 85) c = color(220, 220, 250);
    if (n > 0.95) c = color(250, 25, 25);
    return c;
}

function getTileName(n) {       //Use later for conditionals
    let tn = "dw";              //deep water
    if (n > 0.3) tn = "w";      //water
    if (n > 0.45) tn = "sw";    //shallow water
    if (n > 0.5) tn = "b";      //beach
    if (n > 0.515) tn = "p";    //plains
    if (n > 0.65) tn = "ep";    //elevated plains
    if (n > 0.75) tn = "h";     //hill
    if (n > 0.83) tn = "m";     //mountain
    if (n > 85) tn = "s";       //summit
    if (n > 0.95) tn = "v";     //volcano
    return tn;
}

class Tile {
    constructor(x, y, n) {
        this.x = x;
        this.y = y;
        this.n = n;
        this.c = getColor(n);
        this.tn = getTileName(n);
    }
    draw() {
        fill(this.c);
        rect(this.x * 3, this.y * 3, 3, 3);
    }
}