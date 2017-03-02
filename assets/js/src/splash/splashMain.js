import initSplashLayout from './splashLayout.js';
import SplashHero from '../3d/splash/SplashHero.js';


export default function initSplash() {
    // Check that we are on the splash page:
  if ( !document.querySelector( '.layout--splash' ) ) return;

  initSplashLayout();
  const splashHero = new SplashHero();
}
