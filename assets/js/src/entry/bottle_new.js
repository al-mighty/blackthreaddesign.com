import bottleLayout from '../pages/hidden/bottle/bottleLayout.js';
import BottleCanvas from '../3d/pages/hidden/bottle_new/BottleCanvas.js';


function initBottle( showStats ) {
  bottleLayout();

  const bottleCanvas = new BottleCanvas( showStats );

}

const showStats = true;
initBottle( showStats );

