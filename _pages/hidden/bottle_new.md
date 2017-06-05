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

## Monday

I've fixed the wobbling of the model. The issue was that the level of detail was too low, so I've increased it by the smallest amount possible to hide the wobble at the zoom level you will be using. If you zoom in very close you may still see some minor wobble. 

Remaining issues: if you zoom in very close you can see some tiny artefacts along the edge of the top surface of the liquid, and also at the top of the straight part of the neck. Let me know if you think these need to be fixed, but for now I'm going to leave them and move on.

I'll spend the rest of today streamlining things and getting a version ready for you to integrate in your site, then if I have time I'll work on lighting and materials. 

## Codeword: wobbleBeGone

<div class="canvas-container">
  <canvas id="bottle-canvas" class="fullpage-canvas"></canvas>
</div>
