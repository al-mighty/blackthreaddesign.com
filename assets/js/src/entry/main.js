
import 'babel-polyfill';

// import utils from '../utilities.js';

// TODO: refactor as functions to allow these to be run after initLoader
import initLightBox from '../init/initLightBox.js';
import initNav from '../init/initNav.js';
import initSmoothScroll from '../init/initSmoothScroll.js';
import initFooter from '../init/initFooter.js';
import initVideos from '../init/initVideos.js';

import initLoader from '../loadingOverlay.js';

// Set up loading overlay
initLoader();

// Initialise layout and other things
initNav();

// BUG: nav left not hidden on first image
initLightBox();

initFooter();
initSmoothScroll();
initVideos();
