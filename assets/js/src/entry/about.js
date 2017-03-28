// import initSplashLayout from '../pages/experiments/splashLayout.js';
import AboutCanvas from '../3d/pages/about/AboutCanvas.js';


function initAbout( showStats ) {
    // Check that we are on the splash page:

  // initSplashLayout();

  const aboutCanvas = new AboutCanvas( showStats );

}

// Set up Splash scene
const showStats = false;
initAbout( showStats );

