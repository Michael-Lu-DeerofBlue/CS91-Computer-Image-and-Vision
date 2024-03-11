'use strict';

let fish_csv;
let fish = []

function preload() {
  fish_csv = loadTable('fish.csv', 'csv', 'header');
}

function setup() {
  createCanvas(800, 800);
  for (let line of fish_csv.getArray()) {
    let curve = [];
    for (let i = 0; i < line.length; i += 2) {
      curve.push(new p5.Vector(line[i], line[i + 1]));
    }
    fish.push(curve);
  }
}

function vscale(v, sx, sy) {
  let v1 = createVector(sx, 0, 0);
  let v2 = createVector(0, sy, 0);
  let v3 = createVector(0, 0, 1);
  let matrix = [v1, v2, v3]
  let new_v = new transform(v, matrix);
  return new_v;
}

function applyT(curves, t) {
  let newImg = [];
  for (let line of curves) {
    let newline = line.map(t);
    newImg.push(newline);
  }
  return newImg;
}

function shrink(curves) {
  // shrink the curve 20% in the X and 20% in the Y
  return applyT(curves, (v) => vscale(v, 0.2, 0.2));
}

function shift(curves) {
  // move the curve over to the bottom right
  return applyT(curves, (v) => vtranslate(v, 0.2, 0.2));
}

function vtranslate(v, tx, ty) {
  let v1 = createVector(1, 0, tx);
  let v2 = createVector(0, 1, ty);
  let v3 = createVector(0, 0, 1);
  let matrix = [v1, v2, v3]
  let new_v = new transform(v, matrix);
  return new_v;
}

function vrotate(v, angle) {
  let v1 = createVector(cos(angle), -sin(angle), 0);
  let v2 = createVector(sin(angle), cos(angle), 0);
  let v3 = createVector(0, 0, 1);
  let matrix = [v1, v2, v3]
  let new_v = new transform(v, matrix);
  return new_v;
}

function flip(curves) {
  let new_curves = applyT(curves, (v) => vscale(v, -1, 1));
  new_curves = applyT(new_curves, (v) => vtranslate(v, 1, 0));
  return new_curves;
}

function rot(curves) {
  let new_curves = applyT(curves, (v) => vrotate(v, -PI/2));
  new_curves = applyT(new_curves, (v) => vtranslate(v, 0, 1));
  return new_curves;
}

function rot45(curves) {
  let new_curves = applyT(curves, (v) => vrotate(v, -PI/4));
  new_curves = applyT(new_curves, (v) => vscale(v, 1 / sqrt(2), 1 / sqrt(2)));
  return new_curves;
}

function over(first, second) {
  // return a new curve as the union of two curves (first & second)
  let newImg = first.concat(second);
  return newImg;
}


function beside(leftc, rightc, l = 2/5, r = 3/5) {
  // stack two curves (`leftc` & `rightc`) next to each other
  // the left curve is scaled by `l` in the horizontal direction
  // the right curve is scaled by `r` and shifted by `l

  // starter code here is just a hint, feel free to erase

  let nl = [];
  let nr = [];
  for (let line of leftc) {
    let newline = []
    for (let v of line) {
      newline.push(vscale(v, l, 1)); // transform v
    }
    nl.push(newline);
  }
  for (let line of rightc) {
    let newline = line.map((v) => vtranslate(vscale(v, r,1),l,0));  // trasnform v
    nr.push(newline);
  }
  return nl.concat(nr);
}

function above(topc, bottomc, t = 0.5, b = 0.5) {
  // stack two curves (`topc` & `bottomc`) on top of each other
  // the top curve is scaled by `t` in the vertical direction
  // the bottom curve is scaled by `b` and shifted by `t`

  // starter code here is just a hint, feel free to erase
  let newImg = [];
  for (let line of topc) {
    let newline = []
    for (let v of line) {
      newline.push(vscale(v, 1, t)); // transform v
    }
    newImg.push(newline);
  }
  for (let line of bottomc) {
    let newline = line.map((v) => vtranslate(vscale(v, 1,b),0,t));  // trasnform v
    newImg.push(newline);
  }
  return newImg;
}

function transform(v, matrix) {
    // returns new vector transformed by multiplying it with matrix
    // takes v in inhomogeneous form and returns in the same
    let aug_v = new createVector(v.x, v.y, 1);
    let x = matrix[0].dot(aug_v);
    let y = matrix[1].dot(aug_v);
    let z = matrix[2].dot(aug_v);
  return new p5.Vector(x/z, y/z);
}

function drawCurve(curve) {
  // give a list of bezier curves, draw them
  // sc: controls how big by default the whole screen
  // get vscale to work otw you won't see the TINY curves
  noFill();
  stroke(24);
  let sc = width;
  for (let line of curve) {
    let newline = line.map((v) => vscale(v, sc, sc));
    const [v1, v2, v3, v4] = newline;
    bezier(v1.x, v1.y, v2.x, v2.y, v3.x, v3.y, v4.x, v4.y);
  }

}

function quartet(p, q, r, s) {
  return above(beside(p, q), beside(r, s));
}

function nonet(p, q, r, s, t, u, v, w, x) {
  return above(
    beside(p, beside(q, r), 1 / 3, 2 / 3),
    above(
      beside(s, beside(t, u), 1 / 3, 2 / 3),
      beside(v, beside(w, x), 1 / 3, 2 / 3),
    ),
    1 / 3, 2 / 3);
}


function side(n, t, u) {
  if (n == 0) return [];
  else return quartet(side(n - 1, t, u), side(n - 1, t, u), rot(t), t);
}

function corner(n, t, u) {
  if (n == 0) return [];
  else return quartet(corner(n - 1, t, u), side(n - 1, t, u), rot(side(n - 1, t, u)), u);
}

function squarelimit(n, t, u) {
  // should return a new vector
  // use your transform() to scale by (sx,sy)
  let new_curves = nonet(
    corner(n, t, u),
    side(n, t, u),
    rot(rot(rot(corner(n, t, u)))),
    rot(side(n, t, u)),
    u,
    rot(rot(rot(side(n, t, u)))),
    rot(corner(n, t, u)),
    rot(rot(side(n, t, u))),
    rot(rot(corner(n, t, u)))
  );
  return new_curves;
}

function draw() {
  background(240);
  let smallfish = flip(rot45(fish));
  let t = over(fish, over(smallfish, rot(rot(rot(smallfish)))))
  let u = over(over(over(smallfish, rot(smallfish)), rot(rot(smallfish))), rot(rot(rot(smallfish))))

  if (key == 'r') drawCurve(rot(fish));
  else if (key == 'f') drawCurve(flip(fish));
  else if (key == 'd') drawCurve(beside(flip(fish), fish, 2 / 5, 3 / 5));
  else if (key == 'b') drawCurve(beside(fish, fish));
  else if (key == 'a') drawCurve(above(fish, fish));
  else if (key == 's') drawCurve(smallfish);
  else if (key == 'q') drawCurve(over(fish, rot(rot(fish))));
  else if (key == 't') drawCurve(t);
  else if (key == 'u') drawCurve(u);
  else if (key == 'v') drawCurve(side(2, t, u));
  else if (key == 'c') drawCurve(corner(2, t, u));
  else if (key == 'e') drawCurve(squarelimit(3, t, u));
  else if (key == 'p') drawCurve(shrink(fish));
  else if (key == 'k') drawCurve(shift(fish));   
  else drawCurve(fish);
}
