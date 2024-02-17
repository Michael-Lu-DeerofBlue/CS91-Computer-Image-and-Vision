let capture;
let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;
let filter = 0;
let toggle = false;

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  // Create the video capture and hide the element.
  capture = createCapture(VIDEO);
  capture.size(width, height);
  capture.hide();
  describe('A video stream from the webcam with inverted colors.');
}

function draw() {
  // Draw the video capture within the canvas.
  background(255);
  showEffect();
}

function keyPressed(){
  if (keyCode ==  72){
    filter = 1;
    toggle = !toggle;
  } else if (keyCode ==  71){
    filter = 2;
    toggle = !toggle;
  } else if (keyCode ==  87){
    filter = 3;
    toggle = !toggle;
  } else if (keyCode ==  84){
    filter = 4;
    toggle = !toggle;
  } else if (keyCode ==  68){
    filter = 5;
    toggle = !toggle;
  } else {
    filter = 0;
    toggle = false;
  }
}

function showEffect(){
  if (toggle){
    capture.loadPixels();
    for (let i = 0; i < capture.pixels.length; i += 4){
      let r = capture.pixels[i];
      let g = capture.pixels[i+1];
      let b = capture.pixels[i+2];
      let avg = rgb2avg(r, g, b);
      if (filter == 1) {
        if (i % 2000 == 0) {
          let n = map(avg, 0, 255, 0, 40);
          fill(0);
          let y = Math.floor(Math.floor(i/4) / capture.width); // 1
          let x = Math.floor(i/4) % capture.width; // 2
          ellipse(x, y, n, n);
        }
      } else if (filter == 2){
        capture.pixels[i] = capture.pixels[i+1] = capture.pixels[i+2] = avg;
      } else if (filter == 3){
        avg = 0.3 * r + 0.59* g + 0.11 * b;
        capture.pixels[i] = capture.pixels[i+1] = capture.pixels[i+2] = avg;
      } else if (filter == 4){
        if (avg > 127) {
          capture.pixels[i] = capture.pixels[i+1] = capture.pixels[i+2] = 255;
        } else {
          capture.pixels[i] = capture.pixels[i+1] = capture.pixels[i+2] = 0;
        }
      } else if (filter == 5){
        let new_r = round(r / 255);
        let new_g = round(g / 255);
        let new_b = round(b / 255);
        capture.pixels[i] = new_r * 225;
        capture.pixels[i+1] = new_g * 225;
        capture.pixels[i+2] = new_b * 225;
        let quant_error_r = r - new_r * 225;
        let quant_error_g = r - new_g * 225;
        let quant_error_b = r - new_b * 225;
        let y = Math.floor(Math.floor(i/4) / capture.width); // 1
        let x = Math.floor(i/4) % capture.width; // 2
        dither(x, y, 1, 0, 7/16, quant_error_r, quant_error_g, quant_error_b);
        dither(x, y, -1, 1, 3/16, quant_error_r, quant_error_g, quant_error_b);
        dither(x, y, 0, 1, 5/16, quant_error_r, quant_error_g, quant_error_b);
        dither(x, y, 1 , 1, 1/16, quant_error_r, quant_error_g, quant_error_b);
      } 

      
    }
    capture.updatePixels();
    if (filter != 1) {
      image(capture, 0, 0, width, width * capture.height / capture.width);
    }
  } else {
    image(capture, 0, 0, width, width * capture.height / capture.width);
  }
}

function rgb2avg(r, g, b){
  return (r + g + b) / 3;
}

function dither(x, y, delta_x, delta_y, weight, quant_error_r, quant_error_g, quant_error_b){
  let cord = ((y + delta_y) * capture.width + (x + delta_x)) * 4
  capture.pixels[cord] = capture.pixels[cord] + quant_error_r * weight;
  capture.pixels[cord+1] = capture.pixels[cord+1] + quant_error_g * weight;
  capture.pixels[cord+2] = capture.pixels[cord+2] + quant_error_b * weight;
}