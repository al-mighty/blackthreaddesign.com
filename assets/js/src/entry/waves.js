import 'babel-polyfill';

// this needs to be called before any scripts that use hammer.js, as it sets up the global Hammer
import 'utilities/init/initHammer.js';
import initNav from 'utilities/init/initNav.js';

import wavesLayout from 'pages/experiments/waves/wavesLayout.js';
import WavesCanvas from 'pages/experiments/waves/WavesCanvas.js';

initNav();

wavesLayout();

const showStats = false;
const wavesCanvas = new WavesCanvas( showStats );
