import 'babel-polyfill';

// this needs to be called before any scripts that use hammer.js, as it sets up the global Hammer
// import '../utilities/init/initHammer.js';

import initNav from 'utilities/init/initNav.js';

import bottleLayout from 'pages/work/bottle/bottleLayout.js';
import BottleCanvas from 'pages/work/bottle/BottleCanvas.js';

initNav();

bottleLayout();

const canvas = document.querySelector( '#bottle-canvas' );
const bottleCanvas = new BottleCanvas( canvas, null, 0xcccccc );
