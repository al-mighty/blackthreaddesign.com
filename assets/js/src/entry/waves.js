import wavesLayout from '../pages/experiments/waves/wavesLayout.js';
import WavesCanvas from '../pages/experiments/waves/WavesCanvas.js';

// Set up scene
const showStats = false;
wavesLayout();

const wavesCanvas = new WavesCanvas( showStats );
