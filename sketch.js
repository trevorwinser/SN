let scaleFactor = 0.05;
let tiles;
let offsetX = 0;
let offsetY = 0;
let selected;
let zoom = 1;

function setup() {
    createCanvas(768, 432);
    noStroke();
    tiles = new Array(height);

    for (let i = 0; i < height; i++) {
        tiles[i] = new Array(width);
    }
    createTiles();

    for (let i = 0; i < 200; i++) {
        generateRiver();
    }

    tiles[250][700].c = color(255,0,0);
    
}

function draw() {
    background(220);

    // Calculate offset based on mouse position
    offsetX = ceil(map(constrain(mouseX,0,width),0,width,0,width*2));
    offsetY = ceil(map(constrain(mouseY,0,height),0,height,0,height*2));
    
    
    push();
    translate(-offsetX, -offsetY);
    for (let y = floor(offsetY/3); y < ceil((offsetY + height)/3); y++) {
        for (let x = floor((offsetX)/3); x < ceil((offsetX + width)/3); x++) {
          tiles[y][x].draw();  
        }
    }
    pop();

    fill(0);
    if (selected != null)
        text(`SelectedX: ${selected.x} SelectedY: ${selected.y}`,10,20);
    text(`Width: ${width} Height: ${height}`,10,40);
    text(`mouseX: ${offsetX} mouseY: ${offsetY}`,10,60);
}



function mousePressed() {
    // Calculate tile coordinates based on mouse position and offset
    let x = floor((mouseX + offsetX) / 3);
    let y = floor((mouseY + offsetY) / 3);

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

function mouseWheel(event) {
    if (event.delta > 0) {
        // Mouse wheel up
        zoom *= 1.1; // You can adjust the zoom factor as needed
    } else {
        // Mouse wheel down
        zoom /= 1.1; // You can adjust the zoom factor as needed
    }
    
    // Recreate tiles with the updated zoom value
    createTiles();
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
            let n = round(noise(((x+y/4) * scaleFactor)/zoom, ((y) * scaleFactor)/zoom),2);
            tiles[y][x] = new Tile(x, y, n);
        }
    }
}

function generateRiver() {
    let x = floor(random(width));
    let y = floor(random(height));

    // Check if the starting tile is within the valid range
    if (x < 0 || x >= tiles[0].length || y < 0 || y >= tiles.length) {
        console.error("Invalid starting point");
        return;
    }

    // Initialize tilesVisited list with the first tile
    let tilesVisited = [tiles[y][x]];

    while (tiles[y] && tiles[y][x] && tiles[y][x].n > 0.5) {
        tiles[y][x].c = color(100, 200, 200);

        let ns = [
            (tiles[y + 1] && tiles[y + 1][x] != null && !tilesVisited.includes(tiles[y + 1][x])) ? tiles[y + 1][x].n : null,
            (tiles[y - 1] && tiles[y - 1][x] != null && !tilesVisited.includes(tiles[y - 1][x])) ? tiles[y - 1][x].n : null,
            (tiles[y][x + 1] != null && !tilesVisited.includes(tiles[y][x + 1])) ? tiles[y][x + 1].n : null,
            (tiles[y][x - 1] != null && !tilesVisited.includes(tiles[y][x - 1])) ? tiles[y][x - 1].n : null
        ];

        // Filter out null values from ns
        ns = ns.filter(value => value !== null);

        // Empty array -> no new tiles
        if (ns.length === 0) {
            break;
        }

        // Introduce randomness in selecting the next direction
        let randomIndex = floor(random(ns.length));
        let nextIndex = ns.length > 1 ? randomIndex : 0; // If there's only one direction, choose it directly

        let minN = ns[nextIndex];

        // Find the index of the minimum value in ns
        let minIndex = ns.indexOf(minN);

        // Update x and y accordingly
        if (minIndex === 0) {
            y++;
        } else if (minIndex === 1) {
            y--;
        } else if (minIndex === 2) {
            x++;
        } else if (minIndex === 3) {
            x--;
        }

        // Check if the updated coordinates are within the valid range
        if (y < 0 || y >= tiles.length || x < 0 || x >= tiles[0].length) {
            console.error("Coordinates out of range");
            break;
        }

        // Add the current tile to the tilesVisited list
        tilesVisited.push(tiles[y][x]);
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
    if (n > 0.85) c = color(220, 220, 250);
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