import bottleLayout from '../pages/work/product_viewer/productViewerLayout.js';
import BottleCanvas from '../3d/pages/work/product_viewer/productViewerCanvas.js';

const canvas = document.querySelector( '#bottle-canvas' );

bottleLayout();

const bottleCanvas = new BottleCanvas( canvas, null, 0x707070 );

