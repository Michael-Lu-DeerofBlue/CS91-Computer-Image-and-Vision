# Assignment 2: Filtering

*DUE February 12th at 11:55 PM*

## Part One: Implementation

As part of a p5 sketch, implement the following filters using
convolution.  Each filter should be written as a function that takes a
`p5.Image` and returns a new `p5.Image`. Use your grayscale conversion
from last lab. **I'll do some demos in the beginning of lab so be there
on time!**

### Blur Two Ways (using the box and gaussian kernels)
$$
\frac{1}{25}\begin{bmatrix}
1 & 1 & 1 & 1 & 1\\
1 & 1 & 1 & 1 & 1\\
1 & 1 & 1 & 1 & 1\\
1 & 1 & 1 & 1 & 1\\
1 & 1 & 1 & 1 & 1\\
\end{bmatrix}
\hspace{1cm}
\frac{1}{256}
\begin{bmatrix}
1 & 4 & 6 & 4 & 1 \\
4 & 16 & 24 & 16 & 4 \\
6 & 24 & 36 & 24 & 6 \\
4 & 16 & 24 & 16 & 4 \\
1 & 4 & 6 & 4 & 1 \\
\end{bmatrix}\\
$$

### Horizontal Sobel 

The resulting values may be negative, so either add an offset or use the
absolute value.
  
$$
\begin{bmatrix}
-1 & -2 & -1\\
0 & 0 & 0\\
1 & 2 & 1
\end{bmatrix}
$$

### Vertical Sobel

The resulting values may be negative, so either add an offset or use the
absolute value.

$$
\begin{bmatrix}
-1 & 0 & 1\\
-2 & 0 & 2\\
-1 & 0 & 1
\end{bmatrix}
$$

### Sobel 

Combine the magnitude of the gradient from the horizontal and vertical
sobel: `sqrt(sq(x) + sq(y))`.

\newpage

## Part Two: Evaluation

Reimplement your blur filter as two one-dimensional filters.  Compare
the computation time spent with the standard $k^2$ filter and the $2k$
implementation that exploits the linear separability of the
filter. You can use `millis()` to calculate the run-time of the filtering
operation. Write about it in `refelection.md`.

$$
\frac{1}{25}\begin{bmatrix}
1 & 1 & 1 & 1 & 1\\
1 & 1 & 1 & 1 & 1\\
1 & 1 & 1 & 1 & 1\\
1 & 1 & 1 & 1 & 1\\
1 & 1 & 1 & 1 & 1\\
\end{bmatrix}=
\frac{1}{25}\begin{bmatrix}
1\\
1\\
1\\
1\\
1
\end{bmatrix}
\begin{bmatrix}
1& 1 & 1 & 1 & 1\\
\end{bmatrix} 
\hspace{2cm}
\begin{bmatrix}
-1 & 0 & 1\\
-2 & 0 & 2\\
-1 & 0 & 1
\end{bmatrix}=
\begin{bmatrix}
1\\
2\\
 1
\end{bmatrix}
\begin{bmatrix}
-1 & 0 & 1\\
\end{bmatrix} 
$$

## Part Three: Have fun!

Use your filters to display the webcam's images in a creative
manner. Some possible ideas:

  - use a sequence of filters in some creative way;
  - filter RGB images;
  - use the blur idea on the hue (or S or V) in another color space;
  - use different filters in different parts of the image;
  - use a sequence of filters overlayed using an alpha layer on the original image.
  - combine multiple images by adding/averaging/compositing them:
      - `nimg.pixels[i] = 0.5 * img1.pixels[i] + 0.5 * img2.pixels[i]`
  
## Learning Objectives

- filter images using convolution;
- implement blurring using linear separability;
- evaluate the run-time of similar algorithms.


