// different binary thresholding functions using histograms
//
// (1) complete the missing functions:
//      - calchist
//      - calcmode
//      - calcmean 
//      - calcminotsu 
//      - calcmaxotsu 
//
// (2) For the report:
//      - show results (binary images) for the different thresholds
//      - find an image where otsu fails; reflect on why it failed? 
//      - describe another way to pick the threshold 
//

let cam;
let test;
let thresh = 128;
let size = 0;

function setup() {
  test = loadImage('test.jpg')
  createCanvas(640, 480);
  cam = createCapture(VIDEO);
  cam.size(width / 2, height / 2);
  cam.hide();
}

function mousePressed() {
  print("thresh = " + thresh);
}

function keyPressed() {
  if (key == 's') saveCanvas("otsu.png");
}

function drawhist(h) {
  // given a histogram draw the PDF & CDF on the screen
  let sum = 0;
  noStroke();
  for (let i = 0; i < h.length; i++) {
    // draw pdf
    fill(i);
    rect(i, height / 2, 1, h[i] / 10);
    // draw cdf
    sum += h[i];
    rect(width / 2 + i, height / 2, 1, sum / 300);
  }
}

function calchist(img) {
  // TODO: returns a histogram (256 bins) of the grayscale `img`
  img.loadPixels();
  size = img.pixels.length;
  let h = [];
  for (let i = 0; i < 256; i++) {
    h[i] = 0;
  }
  for (let j = 0; j < img.pixels.length; j+= 4) {
    h[img.pixels[j]] += 1;
  }
  return h;
}

function calcmode(h) {
  // TODO: given a histogram return the mode\
  let max = 0;
  let max_f = 0;
  for (let i = 0; i < h.length; i++) {
    if (h[i] > max_f) {
      max_f = h[i]; 
      max = i;
    }
  }
  return max;
}

function calcmean(h, min, max) {
  let mean = 0;
  let sum = 0;

  for (let i = min; i < max; i++) {
    sum += h[i]; // summing up frequencies 
  }
  if (sum === 0) return 0; // to handle division by zero error 
  for (let i = min; i < max; i++) {
    mean += (h[i] * i) / sum // summing up weighted values
  }
  
  return mean;
}

function calcsum(h){
  let sum = 0;
  for (let i = 0; i < h.length; i++) {
    sum += h[i];
  }
  return sum;
}

function calcweight(h, min, max, sum){
  if (sum === 0) return 0; // to handle division by zero error 
  let weight = 0
  for (let i = min; i < max; i++) {
    weight += h[i] / sum // summing up weighted values
  }
  return weight;
}

function calcmaxotsu(h) {
  // given a histogram return the otsu threshold
  let max = 0;
  let top = 256;
  let threshold = 0;
  let sum = calcsum(h);
  for (let i = 0; i <= 256; i++) {
    let mean_1 = calcmean(h, 0 , i);
    //console.log("first var: " + vari_1);
    let mean_2 = calcmean(h, i, top);
    //console.log("second var: " + vari_2);
    let weight_1 = calcweight(h, 0 , i, sum);
    //console.log("first weight: " + weight_1);
    let weight_2 = calcweight(h, i, top, sum);
    //console.log("second weight: " + weight_2);
    let h_max = weight_1 * weight_2 * (sq(mean_1 - mean_2));
    if (h_max > max){
      max = h_max;
      threshold = i;
    }
  }
  //console.log("threshold: " + threshold);
  return threshold;
}


function calcminotsu(h) {
   // given a histogram return the otsu threshold
   let min = 0;
   let top = 256;
   let threshold = 0;
   let sum = calcsum(h);
   for (let i = 0; i <= 256; i++) {
     let vari_1 = calcvariance(h, 0 , i);
     //console.log("first var: " + vari_1);
     let vari_2 = calcvariance(h, i, top);
     //console.log("second var: " + vari_2);
     let weight_1 = calcweight(h, 0 , i, sum);
     //console.log("first weight: " + weight_1);
     let weight_2 = calcweight(h, i, top, sum);
     //console.log("second weight: " + weight_2);
     let h_min = weight_1 * vari_1 + weight_2 * vari_2;
     //console.log("min difference: " + h_min);
     if (i == 0){
      min = h_min;
     }
     if (h_min < min){
       min = h_min;
       threshold = i;
     }
   }
   //console.log("threshold: " + threshold);
   return threshold;
}

function calcmaxent(h) {
  // TODO: challenge
  // given a histogram return maximum entropy trehshold
  return 0;
}


function calcvariance(h, min, max) {
  let mean = calcmean(h, min, max);
  let sq_dif = 0;
  let total = 0;

  for (let i = min; i < max; i++) {
    sq_dif += Math.pow(i - mean, 2) * h[i]; // square of differences * frequency
    total += h[i]; // sum of frequencies
  }
  //console.log(total);
  if (total == 0) return 0;
  return sq_dif / total; // return sum of squared differences divided by total
}


function calcmedian(h) {
  // given a histogram return the median
  let tsum = 0;
  for (let i = 0; i < h.length; i++) {
    tsum += h[i];
  }
  let sum = 0;
  for (let i = 0; i < h.length; i++) {
    sum += h[i];
    if (sum >= tsum / 2) return i;
  }
  return -1;
}

function rgb2gray(img) {
  // convert an p5.Image to grayscale
  let nimg = img.get(); // alternatively createImage(img.width, img.height)
  nimg.loadPixels();
  for (let i = 0; i < nimg.pixels.length; i += 4) {
    //const [r, g, b, a] = nimg.pixels.slice(i, i + 4);
    //const Y = 0.3 * r + 0.59 * g + 0.11 * b;
    const Y = 0.3 * nimg.pixels[i] + 0.59 * nimg.pixels[i + 1] + 0.11 * nimg.pixels[i + 2];
    nimg.pixels[i] = nimg.pixels[i + 1] = nimg.pixels[i + 2] = Y;
  }
  nimg.updatePixels();
  return nimg;
}

function gray2bin(img, thresh) {
  // convert a grayscale p5.Image to black/white based on theshold
  let frame = img.get();
  frame.loadPixels();
  for (let i = 0; i < frame.pixels.length; i += 4) {
    // to gamma correct or not?
    let value = frame.pixels[i];
    //value = pow(ivalue/255.0, 1/2.2)*255;f
    if (value > thresh) {
      frame.pixels[i] = 255;
      frame.pixels[i + 1] = 255;
      frame.pixels[i + 2] = 255;
    }
    else {
      frame.pixels[i] = 0;
      frame.pixels[i + 1] = 0;
      frame.pixels[i + 2] = 0;
    }
  }
  frame.updatePixels();
  return frame;
}

function draw() {
  let frame = rgb2gray(cam);
  background(0, 64, 0);

  image(frame, 0, 0);
  thresh = mouseX % (width / 2);

  
  let hist = calchist(frame);
  drawhist(hist);

  let e = calcmaxent(hist);
  stroke(255, 255, 255);
  line(e, height / 2, e, height);
  line(e + width / 2, height / 2, e + width / 2, height);

  stroke(255, 255, 0);
  let o1 = calcmaxotsu(hist);
  line(o1, height / 2, o1, height);
  line(o1 + width / 2, height / 2, o1 + width / 2, height);
 
  stroke(255, 255, 0);
  let o2 = calcminotsu(hist);
  line(o2, height / 2, o2, height);
  line(o2 + width / 2, height / 2, o2 + width / 2, height);

    
  stroke(0, 255, 0);
  let m = calcmedian(hist);
  line(m, height / 2, m, height);
  line(m + width / 2, height / 2, m + width / 2, height);

  stroke(0, 255, 255);
  let u = calcmean(hist);
  line(u, height / 2, u, height);
  line(u + width / 2, height / 2, u + width / 2, height);

  stroke(0, 0, 255);
  let c = calcmode(hist);
  line(u, height / 2, u, height);
  line(u + width / 2, height / 2, u + width / 2, height);

  if (key == 'e') thresh = e;
  if (key == 'u') thresh = u;
  if (key == 'm') thresh = m;
  if (key == 'o') thresh = o1;
  if (key == 'p') thresh = o2;
  if (key == 'c') thresh = c;

  image(gray2bin(frame, thresh), width / 2, 0);

  stroke(0, 0, 255);
  fill(0, 0, 255);
  rect(thresh - 3, height - 100, 6, 45);
  rect(thresh + width / 2 - 3, height - 100, 6, 45);
}
