import SplashHero from '../3d/pages/splash/SplashCanvas.js';
import initLoader from '../loadingOverlay.js';

function initSplash( showStats ) {

  const splashHero = new SplashHero( showStats );

}

initLoader();
initSplash();

