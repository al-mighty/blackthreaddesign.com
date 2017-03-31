import escherSketchLayout from '../pages/work/escherSketch/escherSketchLayout.js';
import EscherSketchCanvas from '../3d/pages/work/escherSketch/EscherSketchCanvas.js';


function initEscherSketch( showStats ) {
  // escherSketchLayout();

  const escherSketchCanvas = new EscherSketchCanvas( showStats );

}

// Set up Splash scene
const showStats = false;
initEscherSketch( showStats );

