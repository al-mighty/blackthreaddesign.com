import bottleLayout from '../pages/work/bottle/bottleLayout.js';
import BottleCanvas from '../3d/pages/work/bottle/BottleCanvas.js';

const canvas = document.querySelector( '#bottle-canvas' );

bottleLayout();

const bottleCanvas = new BottleCanvas( canvas, null, 0x020000 );

