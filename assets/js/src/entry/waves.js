import wavesLayout from '../pages/experiments/waves/wavesLayout.js';
import WavesCanvas from '../3d/pages/experiments/waves/WavesCanvas.js';


function initWaves( showStats ) {

  wavesLayout();

  const wavesCanvas = new WavesCanvas( showStats );

}

// Set up scene
const showStats = false;
initWaves( showStats );
