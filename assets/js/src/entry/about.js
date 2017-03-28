import aboutLayout from '../pages/about/aboutLayout.js';
import AboutCanvas from '../3d/pages/about/AboutCanvas.js';


function initAbout( showStats ) {
    // Check that we are on the splash page:

  aboutLayout();

  const aboutCanvas = new AboutCanvas( showStats );

}

// Set up Splash scene
const showStats = false;
initAbout( showStats );

