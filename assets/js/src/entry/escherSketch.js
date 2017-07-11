import 'babel-polyfill';

// this needs to be called before any scripts that use hammer.js, as it sets up the global Hammer
import 'utilities/init/initHammer.js';

import initNav from 'utilities/init/initNav.js';

import escherSketchLayout from 'pages/work/escherSketch/escherSketchLayout.js';
import EscherSketchCanvas from 'pages/work/escherSketch/EscherSketchCanvas.js';

initNav();

escherSketchLayout();

const showStats = false;
const escherSketchCanvas = new EscherSketchCanvas( showStats );
