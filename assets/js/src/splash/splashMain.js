import initSplashLayout from './splashLayout.js';
import SplashHero from '../3d/splash/SplashHero.js';
import SplashWork from '../3d/splash/SplashWork.js';
import SplashExperiments from '../3d/splash/SplashExperiments.js';
import SplashTutorials from '../3d/splash/SplashTutorials.js';
import SplashBlog from '../3d/splash/SplashBlog.js';


export default function initSplash() {
    // Check that we are on the splash page:
  if ( !document.querySelector( '.layout--splash' ) ) return;

  initSplashLayout();

  const splashHero = new SplashHero();
  const splashWork = new SplashWork();
  const splashExperiments = new SplashExperiments();
  const splashTutorials = new SplashTutorials();
  const splashBlog = new SplashBlog();
}
