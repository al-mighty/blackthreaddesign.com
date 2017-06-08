import bottleLayout from '../pages/hidden/bottle/bottleLayout.js';
import BottleCanvas from '../3d/pages/hidden/bottle_new/BottleCanvas.js';

const canvas = document.querySelector( '#bottle-canvas' );

bottleLayout();

const bottleCanvas = new BottleCanvas( canvas, null, 0xb0b0b0 );

