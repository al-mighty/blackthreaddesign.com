import * as THREE from 'three';
import * as Hammer from 'hammerjs';


import './init/initLightBox.js';
import './init/initGreedyNav.js';
import './init/initSmoothScroll.js';
import './init/initFooter.js';
import './init/initVideos.js';

window.THREE = THREE;
window.Hammer = Hammer.default;

// SPLASH
// TODO: only load these for splash page
import './splash/splashLayout.js';
import Splash from './3d/Splash.js';

import { moveHandler } from './utilities.js';

// Set up app wide event listeners for touch and mouse
window.addEventListener( 'mousemove', moveHandler );
new window.Hammer( document.querySelector( 'body' ) )
  .on( 'pan', moveHandler );

const splash = new Splash();
