import 'babel-polyfill';

// this needs to be called before any scripts that use hammer.js, as it sets up the global Hammer
import 'utilities/init/initHammer.js';
import initNav from 'utilities/init/initNav.js';
import initLoadingOverlay from 'utilities/init/initLoadingOverlay.js';

import SplashHero from 'pages/splash/SplashCanvas.js';

initLoadingOverlay();
initNav();

const splashHero = new SplashHero( false );
