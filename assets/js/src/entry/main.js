
import * as Hammer from 'hammerjs';

import 'babel-polyfill';

import utils from '../utilities.js';

// TODO: refactor as functions to allow these to be run after initLoader
import initLightBox from '../init/initLightBox.js';
import initNav from '../init/initNav.js';
import initSmoothScroll from '../init/initSmoothScroll.js';
import initFooter from '../init/initFooter.js';
import initVideos from '../init/initVideos.js';

import initLoader from '../loadingOverlay.js';
// import initSplash from '../splash/splashMain.js';

// Set up any globals
window.Hammer = Hammer.default;

// Set up loading overlay
initLoader();

// Initialise layout and other things
initNav();

// BUG: nav left not hidden on first image
initLightBox();

initFooter();
initSmoothScroll();
initVideos();

// // Set up app wide event listeners for touch and mouse
// window.addEventListener( 'mousemove', utils.moveHandler );
// new window.Hammer( document.querySelector( 'body' ) )
//   .on( 'pan', utils.moveHandler );
