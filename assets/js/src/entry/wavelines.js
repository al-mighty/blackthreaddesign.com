import wavelinesLayout from '../pages/wavelinesLayout.js';
import WavelinesCanvas from '../3d/pages/wavelines/WavelinesCanvas.js';


function initWavelines( showStats ) {

  wavelinesLayout();

  const wavelinesCanvas = new WavelinesCanvas( showStats );

}

// Set up Splash scene
const showStats = true;
initWavelines( showStats );
