import * as THREE from 'three';

import './init/initLightBox.js';
import './init/initGreedyNav.js';
import './init/initSmoothScroll.js';
import './init/initFooter.js';
import './init/initVideos.js';

window.THREE = THREE;

//SPLASH
//TODO: only load these for splash page
import './splash/splashLayout.js';
import Splash from './3d/Splash.js';

import { moveHandler } from './utilities.js';

//Set up app wide event listeners for touch and mouse
window.addEventListener('mousemove', moveHandler);
// new Hammer(document.querySelector('body'))
//   .on('pan', moveHandler);

const splash = new Splash();