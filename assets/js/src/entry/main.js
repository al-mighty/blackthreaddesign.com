import * as THREE from 'three';
import * as Hammer from 'hammerjs';

import 'babel-polyfill';

// Adds TweenLite, TimeLineLite etc as globals
// import 'gsap/src/uncompressed/TimelineLite';
// import 'gsap/src/uncompressed/easing/EasePack';

import PNLTRI from '../vendor/pnltri/pnltri.js';

import utils from '../utilities.js';

// TODO: refactor as functions to allow these to be run after initLoader
import initLightBox from '../init/initLightBox.js';
import initGreedyNav from '../init/initGreedyNav.js';
import initSmoothScroll from '../init/initSmoothScroll.js';
import initFooter from '../init/initFooter.js';
import initVideos from '../init/initVideos.js';

import initLoader from '../loadingOverlay.js';
// import initSplash from '../splash/splashMain.js';

// Set up loading overlay
initLoader();

// Initialise layout and other things
initGreedyNav();

// BUG: nav left not hidden on first image
initLightBox();

initFooter();
initSmoothScroll();
initVideos();

// Set up any globals
window.Hammer = Hammer.default;


// Set up THREE
THREE.Cache.enabled = true;

//Use PNLTRI for triangualtion
THREE.ShapeUtils.triangulateShape = ( () => {
  const pnlTriangulator = new PNLTRI.Triangulator();
  function removeDupEndPts( points ) {
    const l = points.length;
    if ( l > 2 && points[l - 1].equals( points[0] ) ) {
      points.pop();
    }
  }
  return function triangulateShape( contour, holes ) {
    removeDupEndPts( contour );
    holes.forEach( removeDupEndPts );
    return pnlTriangulator.triangulate_polygon( [contour].concat( holes ) );
  };
} )();

// Set up app wide event listeners for touch and mouse
window.addEventListener( 'mousemove', utils.moveHandler );
new window.Hammer( document.querySelector( 'body' ) )
  .on( 'pan', utils.moveHandler );


// Set up Splash scene
// const showStats = false;
// initSplash( showStats );
