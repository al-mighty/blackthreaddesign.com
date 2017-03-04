import initSplashLayout from './splashLayout.js';
import SplashHero from '../3d/splash/SplashHero.js';
import SplashWork from '../3d/splash/SplashWork.js';
import SplashExperiments from '../3d/splash/SplashExperiments.js';
import SplashTutorials from '../3d/splash/SplashTutorials.js';
import SplashBlog from '../3d/splash/SplashBlog.js';


export default function initSplash( showStats ) {
    // Check that we are on the splash page:
  if ( !document.querySelector( '.layout--splash' ) ) return;

  initSplashLayout();

  const splashHero = new SplashHero( showStats );
  // const splashWork = new SplashWork( showStats );
  // const splashExperiments = new SplashExperiments( showStats );
  const splashTutorials = new SplashTutorials( showStats );
  // const splashBlog = new SplashBlog( showStats );
}
