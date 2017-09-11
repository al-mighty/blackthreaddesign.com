---
layout: standard
title: "Wave Lines"
excerpt: "This is an experiment in creating ribbons - lines of any thickness - which is not possible by default in thee.js"
categories: experiments
permalink: /experiments/waves/
header:
  teaser: /assets/images/experiments/waves/teaser.jpg
comments: true
js:
  - waves
---

Most browsers are unable to display thick lines with WebGL - the lines will always be rendered at 1px, no matter what the thickness is set to.

In this experiment the lines are generated as thin triangle strips, allowing for lines of any thickness.

Note that with this implementation, the thickness is a property of the geometry, so that if the camera zooms in the lines will get thicker. Work is being done on a "screen space" implementation of thick lines in the three.js core (so that the lines will always be rendered at same thickness), which will likely be added in the next release at time of writing (r87).

<div class="canvas-container">
  <canvas id="wavelines-canvas" class="fullpage-canvas"></canvas>
</div>