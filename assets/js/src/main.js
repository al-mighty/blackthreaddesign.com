import * as THREE from 'three';
import * as Hammer from 'hammerjs';


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

//TODO: setup global flag to show / hide stats
//window.DEVELOPMENT = false;

THREE.Cache.enabled = true;
initLoader();

import { moveHandler } from './utilities.js';

// Set up app wide event listeners for touch and mouse
window.addEventListener( 'mousemove', moveHandler );
new window.Hammer( document.querySelector( 'body' ) )
  .on( 'pan', moveHandler );

initSplash();
