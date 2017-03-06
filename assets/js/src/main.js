import * as THREE from 'three';
import * as Hammer from 'hammerjs';

//Adds TweenLite, TimeLineLite etc as globals
import 'gsap/src/uncompressed/TimelineLite';
import 'gsap/src/uncompressed/easing/EasePack';

import BAS from './3d/vendor/bas.js';

import PNLTRI from '../vendor/pnltri/pnltri.js';


import './init/initLightBox.js';
import './init/initGreedyNav.js';
import './init/initSmoothScroll.js';
import './init/initFooter.js';
import './init/initVideos.js';

import initLoader from './loadingOverlay.js';
import initSplash from './splash/splashMain.js';

// Set up globals
window.THREE = THREE;
window.Hammer = Hammer.default;

//Use PNLTRI for triangualtion
window.THREE.ShapeUtils.triangulateShape = ( function () {
  var pnlTriangulator = new PNLTRI.Triangulator();
  function removeDupEndPts(points) {
    var l = points.length;
    if ( l > 2 && points[ l - 1 ].equals( points[ 0 ] ) ) {
      points.pop();
    }
  }
  return function triangulateShape( contour, holes ) {
    removeDupEndPts( contour );
    holes.forEach( removeDupEndPts );
    return pnlTriangulator.triangulate_polygon( [ contour ].concat(holes) );
  };
} )();


THREE.Cache.enabled = true;
initLoader();

import { moveHandler } from './utilities.js';

// Set up app wide event listeners for touch and mouse
window.addEventListener( 'mousemove', moveHandler );
new window.Hammer( document.querySelector( 'body' ) )
  .on( 'pan', moveHandler );

const showStats = false;
initSplash( showStats );
