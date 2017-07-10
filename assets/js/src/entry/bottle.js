import bottleLayout from '../pages/work/bottle/bottleLayout.js';
import BottleCanvas from '../pages/work/bottle/BottleCanvas.js';

const canvas = document.querySelector( '#bottle-canvas' );

bottleLayout();

const bottleCanvas = new BottleCanvas( canvas, null, 0xcccccc );

