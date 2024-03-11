# Assignment 5: Hough Transform

**DUE March 4th at 11:59 PM**

In this lab, we will experiment with the Hough Transform, a method for
finding lines in images by combining some of the techniques used
earlier in the course: edge detection, histograms, and homogeneous
coordinates.

![`hough`](hough.png){width=300px}

## Warm-up

1. Understand `create_hough(nimg: p5.Image, nhro: int, ntheta: int): 2D list`
    
   - This method creates the hough histogram with `nhro` bins for the
     line distance and `ntheta` bins for the angle. Remember the line
     equation we use for hough is $\rho = x \cos(\theta) + y \sin(\theta)$.
	 
   - Write a few words about what the 2 `map` calls are doing in the
     reflection.
   
   - Why do we need to bound check `r` (making sure it's between 0 and
     `nrho`), but not `ti`?

2. In this lab we'll be using
   [jsfeat](https://inspirit.github.io/jsfeat/#structs) for some of
   the things we've already implemented ourselves. Experiment a little
   with the arguments to `gaussian_blur` and `canny` to get the best
   results for edge detection.

\newpage

## Implementation

3. Implement `draw_hough_lines(hough: 2D list)`.

   - The method should draw all the lines in the hough histogram that
     have non-zero counts. 
	 
	 **Note:** Odds are you will see many lines, you might
     use `max_count(hist)` to find the one most-likely line while debugging.

4. Implement `filter_lines(hough: 2D list): 2D list`
   - Given a histogram of detected lines, return a new histogram. Some ideas:
	 - threshold the histogram by some constant (i.e., have more than $N$ votes)
	 - threshold the histogram by some proportion  (i.e., in the top $25%4 of vote)
     - non-maximal suppression: only lines that are the most voted-for
       in their neighborhood survive


## Learning Objectives

- find lines in images
- use homogeneous coordinates to represent lines
- perform non-maximal suppression
- use [jsfeat](https://inspirit.github.io/jsfeat/#structs) for some low-level image processing tasks

## Deliverables

1. Commit the javascript `sketch.js` to the repo.

2. Write the reflection (as a markdown document named
   `reflection.md`) about what you were able to accomplish in this
   lab. Don't forget the collaboration statement!

