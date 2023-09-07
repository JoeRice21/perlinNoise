let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

function createGradientGrid(width, height) {
  let array = new Array(height);
  for (let i = 0; i < height; i++) {
    array[i] = new Array(width);
    for (let k = 0; k < width; k++) {
      array[i][k] = randomGradient();
    }
  }
  return array;
}

function randomGradient() {
  let angle = Math.random() * Math.PI * 2;
  return { x: Math.cos(angle), y: Math.sin(angle) };
}

function getTile(x, y) {
  let tileX = Math.floor(x / tileWidth);
  let tileY = Math.floor(y / tileHeight);
  return { x: tileX, y: tileY };
}

function dotProduct(a, b) {
  return a.x * b.x + a.y * b.y;
}

function interpolate(a, b, w) {
  return (b - a) * ((w * (w * 6.0 - 15.0) + 10.0) * w * w * w) + a;
}

function noise(x, y) {
  let tile = getTile(x, y);
  let cornerOff = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 0, y: 1 },
  ];
  let dotProducts = new Array(4);
  let gradientArray = createGradientGrid(2 * noOfTiles, 2 * noOfTiles);
  for (let i = 0; i < cornerOff.length; i++) {
    let gradientVector =
      gradientArray[cornerOff[i].y + tile.y][cornerOff[i].x + tile.x];
    let offset = {
      x: (x - (tile.x + cornerOff[i].x) * tileWidth) / tileWidth,
      y: (y - (tile.y + cornerOff[i].y) * tileHeight) / tileHeight,
    };
    dotProducts[i] = dotProduct(offset, gradientVector);
  }
  let percentX = (x - tile.x * tileWidth) / tileWidth;
  let percentY = (y - tile.y * tileHeight) / tileHeight;
  let inter1 = interpolate(dotProducts[0], dotProducts[1], percentX);
  let inter2 = interpolate(dotProducts[3], dotProducts[2], percentX);
  let value = interpolate(inter1, inter2, percentY);

  return value;
}

//number of tiles controls "zoom"
let noOfTiles = 100;
let tileWidth = canvas.width / noOfTiles;
let tileHeight = canvas.height / noOfTiles;

//drawing the perlin noise
for (let x = 0; x < canvas.width; x++) {
  for (let y = 0; y < canvas.height; y++) {
    let color = (noise(x, y) * 0.5 + 0.5) * 255;
    context.fillStyle = `rgb(${color}, ${color}, ${color})`;
    context.fillRect(x, y, 1, 1);
  }
}
