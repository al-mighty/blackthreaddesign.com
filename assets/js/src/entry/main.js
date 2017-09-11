
import 'babel-polyfill';

// this needs to be called before any scripts that use hammer.js, as it sets up the global Hammer
import 'utilities/init/initHammer.js';

import initLightBox from 'utilities/init/initLightBox.js';
import initNav from 'utilities/init/initNav.js';
import initSmoothScroll from 'utilities/init/initSmoothScroll.js';
import initVideos from 'utilities/init/initVideos.js';
import initLoadingOverlay from 'utilities/init/initLoadingOverlay.js';

// Set up loading overlay
initLoadingOverlay();

// Initialise layout and other things
initNav();

// BUG: nav left not hidden on first image
initLightBox();

initSmoothScroll();
initVideos();
