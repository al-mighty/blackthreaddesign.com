import initSplashLayout from './splashLayout.js';
import Splash from '../3d/Splash.js';


export default function initSplash() {
    // Check that we are on the splash page:
  if ( !document.querySelector( '.layout--splash' ) ) return;

  initSplashLayout();
  const splash = new Splash();
}
