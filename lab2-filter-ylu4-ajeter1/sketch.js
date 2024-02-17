'use strict'

let img, cap;
let filter = 0;
let toggle = false;
let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;
let v = 1.0 / 25.0;
let nameText = 'No filter';
let ycounter = 0;
let xcounter = 0;
// kernel is the 3x3 matrix of normalized values
let boxBlur = [
  [v, v, v, v, v],
  [v, v, v, v , v],
  [v, v, v, v , v],
  [v, v, v, v , v],
  [v, v, v, v , v]
];
let gaussianBlur = [
  [(1.0 / 256.0) *1, (1.0 / 256.0) *4, (1.0 / 256.0) *6, (1.0 / 256.0) *4, (1.0 / 256.0) *1],
  [(1.0 / 256.0) *4, (1.0 / 256.0) *16, (1.0 / 256.0) *24, (1.0 / 256.0) *16 , (1.0 / 256.0) *4],
  [(1.0 / 256.0) *6, (1.0 / 256.0) *24, (1.0 / 256.0) *36, (1.0 / 256.0) *24 , (1.0 / 256.0) *6],
  [(1.0 / 256.0) *4, (1.0 / 256.0) *16, (1.0 / 256.0) *24, (1.0 / 256.0) *16 , (1.0 / 256.0) *4],
  [(1.0 / 256.0) *1, (1.0 / 256.0) *4, (1.0 / 256.0) *6,(1.0 / 256.0) * 4 , (1.0 / 256.0) *1]
];

let vSobel = [
  [-1, -2, -1],
  [0, 0, 0],
  [1, 2, 1]
];

let hSobel = [
  [-1, 0, 1],
  [-2, 0, 2],
  [-1, 0, 1]
];

let hSobel_derivative = [
  [1],
  [2],
  [1]
];

let hSobel_blur = [
  [-1, 0, 1]
];

let kernelSize = 3;

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  img = createImage(width,height);
  cap = createCapture(VIDEO);
  cap.size(width, height);
  cap.hide();
  setInterval(incrementCounter, 100);
}

function draw() {
  setImage();
  image(img,0,0);
  textSize(32);
  fill(255);
  text(nameText, 50, 50);
}

function setImage() {
  img.loadPixels();   
  cap.loadPixels();
  for (let i = 0; i < img.pixels.length; i += 4){
    img.pixels[i] = cap.pixels[i];
    img.pixels[i+1] = cap.pixels[i+1];
    img.pixels[i+2] = cap.pixels[i+2];
    img.pixels[i+3] = cap.pixels[i+3];
    let [r,g,b] = [255, 255, 255];
    if (toggle){
      let y = Math.floor(Math.floor(i/4) / cap.width); // 1
      let x = Math.floor(i/4) % cap.width; // 2
      if (filter == 1) {
        [r,g,b] = convolution(x, y, boxBlur, 5, cap);
      } 
      else if (filter == 2) {
        [r,g,b] = convolution(x, y, gaussianBlur, 5, cap);
      } 
      else if (filter == 3) {
        [r,g,b] = convolution(x, y, hSobel, 3, cap);
        r = Math.abs(r);
        g = Math.abs(b);
        b = Math.abs(g);
      } 
      else if (filter == 4) {
        [r,g,b] = convolution(x, y, vSobel, 3, cap);
        r = Math.abs(r);
        g = Math.abs(b);
        b = Math.abs(g);
      } 
      else if (filter == 5) {
        let [r1,g1,b1] = convolution(x, y, hSobel, 3, cap);
        let [r2,g2,b2] = convolution(x, y, vSobel, 3, cap);
        r = sqrt(sq(r1)+sq(r2));
        g = sqrt(sq(g1)+sq(g2));
        b = sqrt(sq(b1)+sq(b2));
      } 
      else if (filter == 6) {
        if ( y <  ycounter && ycounter - 50 < y){
          [r,g,b] = convolution(x, y, hSobel, 3, cap);
          r = Math.abs(r);
          g = Math.abs(b);
          b = Math.abs(g);
        }
        else if ( x <  xcounter && xcounter - 50 < x){
          [r,g,b] = convolution(x, y, vSobel, 3, cap);
          r = Math.abs(r);
          g = Math.abs(b);
          b = Math.abs(g);
        }
        else{
          r = cap.pixels[i];
          g = cap.pixels[i+1];
          b = cap.pixels[i+2];
        }
        
      } 
      let loc = (x + y * img.width) * 4;
      img.pixels[loc] = r;
      img.pixels[loc + 1] = g;
      img.pixels[loc + 2] = b;
      img.pixels[loc + 3] = 255;
    }
    
  }
  img.updatePixels();
}


function convolution(x, y, matrix, matrixsize, img) {
  let rtotal = 0.0;
  let gtotal = 0.0;
  let btotal = 0.0;
  const offset = Math.floor(matrixsize / 2);
  for (let i = 0; i < matrixsize; i++) {
    for (let j = 0; j < matrixsize; j++) {
      // What pixel are we testing
      const xloc = x + i - offset;
      const yloc = y + j - offset;
      let loc = (xloc + img.width * yloc) * 4;

      // Make sure we haven't walked off our image, we could do better here
      loc = constrain(loc, 0, img.pixels.length - 1);

      // Calculate the convolution
      // retrieve RGB values
      rtotal += img.pixels[loc] * matrix[i][j];
      gtotal += img.pixels[loc + 1] * matrix[i][j];
      btotal += img.pixels[loc + 2] * matrix[i][j];
    }
  }
  // Make sure RGB is within range
  rtotal = constrain(rtotal, 0, 255);
  gtotal = constrain(gtotal, 0, 255);
  btotal = constrain(btotal, 0, 255);

  // Return the resulting color
  return [rtotal, gtotal, btotal];
}

function keyPressed(){
  if (keyCode ==  66){
    filter = 1;
    toggle = true;
    nameText = 'Box blur';
  } else if (keyCode ==  71){
    filter = 2;
    toggle = true;
    nameText = 'Gaussian blur';
  } else if (keyCode ==  72){
    filter = 3;
    toggle = true;
    nameText = 'Horizontal Sobel';
  } else if (keyCode ==  86){
    filter = 4;
    toggle = true;
    nameText = 'Vertical Sobel';
  } else if (keyCode ==  68){
    filter = 5;
    toggle = true;
    nameText = 'Sobel';
  } else if (keyCode ==  70){
    filter = 6;
    toggle = true;
    nameText = 'Funny Filter';
  } 
  else {
    filter = 0;
    toggle = false;
    nameText = 'No filter';
  }
}

function incrementCounter() {
  ycounter = ycounter + 5;
  if (ycounter > img.height){
    ycounter = 0;
  }
  xcounter = xcounter + 10;
  if (xcounter > img.width){
    xcounter = 0;
  }
}