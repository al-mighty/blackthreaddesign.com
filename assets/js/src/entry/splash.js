import initSplashLayout from '../pages/splash/splashLayout.js';
import SplashHero from '../3d/pages/splash/SplashHero.js';

export default function initSplash( showStats ) {
    // Check that we are on the splash page:
  if ( !document.querySelector( '.layout--splash' ) ) return;

  initSplashLayout();

  const splashHero = new SplashHero( showStats );

}
