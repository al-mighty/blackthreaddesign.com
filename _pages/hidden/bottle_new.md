---
layout: single
title:  "New Bottle Model"
permalink: /hidden/bottle_new
date:   2017-06-03 13:00:35 +0700
comments: true
js:
  'bottle_new'
---

This is the new (fixed) model - you can see the extra detail in the cap and glass. 

There were a number of issues (which you can pass onto your artist - they are not actually problems with the work, but rather good things to know regarding doing 3D modelling work for web).

* The bottle and cap were modelled with quads - these should always be converted to triangles when preparing work for the web as WebGL does not support quads. They are automatically converted by three.js but it doesn't always do a good job (as in this case).
* The bottle and interior liquid were modelled with "depth" - so the bottle glass had an interior and exterior surface. This is not handled well in WebGL (it was the main cause of the visual artefacts in this case). I've solved this by splitting the glass into two pieces, one exterior and one interior glass wall, and the beer liquid into a body and top surface.

The next step is working to improve the efficiency of the models, and better lighting and materials. 

## Codeword: fabaceous

<div class="canvas-container">
  <canvas id="bottle-canvas" class="fullpage-canvas"></canvas>
</div>
