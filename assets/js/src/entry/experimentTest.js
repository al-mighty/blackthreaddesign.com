// import initSplashLayout from '../pages/experiments/splashLayout.js';
import Test from '../3d/pages/experiments/Test.js';


function initTest( showStats ) {
    // Check that we are on the splash page:
  if ( !document.querySelector( '.layout--splash' ) ) return;

  // initSplashLayout();

  const Test = new Test( showStats );

}

// Set up Splash scene
const showStats = true;
initTest( showStats );

