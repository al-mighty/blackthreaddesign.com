import escherSketchLayout from '../pages/work/escherSketch/escherSketchLayout.js';
import EscherSketchCanvas from '../pages/work/escherSketch/EscherSketchCanvas.js';


// Set up Splash scene
const showStats = false;

escherSketchLayout();

const escherSketchCanvas = new EscherSketchCanvas( showStats );


