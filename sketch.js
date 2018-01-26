let dot

function setup() {
  let canvas = createCanvas(320, 460)
  canvas.parent("sketch")
  ellipseMode(RADIUS)
  rectMode(CORNERS)
  dot = new DotGenerator(20, 20, 300, 440)
  dot.init(5, 40, 60)
  // noLoop()
  frameRate(24)
}

function draw() {
  background("white")
  dot.drawAnimDot(8)
}