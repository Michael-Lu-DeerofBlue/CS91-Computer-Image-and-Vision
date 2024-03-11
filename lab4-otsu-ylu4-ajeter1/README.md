# Assignment 4: Otsu Thresholding

**DUE February 26th at 11:59 PM**

In this lab, we will implement a more sophisticated method for
thresholding grayscale images to binary images. We'll use the
[Otsu](https://en.wikipedia.org/wiki/Otsu%27s_method) method for
developing models of the foreground and background.

![`otsu`](otsu.png){width=400px}

## Implementation

1. `calchist(img: p5.Image): List` 

 - Compute & return the histogram (256 bins) of grayscale `img`.

2. `calcmode(h: list): Number` 

 - Given a histogram (256 bins), return the mode.

3. `calcmean(h: list): Number` 

 - Given a histogram (256 bins), return the mean/average.
 
4. `calcmaxotsu(h: list): Number`

 - Given the histogram, return the [otsu threshold](https://en.wikipedia.org/wiki/Otsu%27s_method) by maximizing the between-class variance.
 
5. `calcminotsu(h: list): Number`

 - Given the hisgtogram, return the [otsu threshold](https://en.wikipedia.org/wiki/Otsu%27s_method) by minimizing the within-class variance (should give the same answer as the `calcmaxotsu` method).
 

## Reflection

1. Include your results for the different thresholds (median, mean,
   mode, otsu).
2. Find an image where Otsu fails. Reflect on why it failed.
3. Describe another method for picking the threshold.

## Challenges

1. Implement your alternative thresholding method from the last section.
2. Calculate the [maximum entropy](https://en.wikipedia.org/wiki/Entropy_(information_theory)) threshold.
3. Use Otsu for three classes.
4. Use Otsu for RGB images.

## Learning Objectives

- use histograms to compute statistics
- think about an image as a mixture of foreground and background
- threshold images using statistics


## Deliverables

1. Commit the javascript `sketch.js` to the repo. Your sketch should
   use [`key`](https://p5js.org/reference/#/p5/key) to toggle between
   the different ways of thresholding.

2. Write the reflection (as a markdown document named
   `reflection.md`) about what you were able to accomplish in this
   lab including the questions above. Don't forget the collaboration statement!

