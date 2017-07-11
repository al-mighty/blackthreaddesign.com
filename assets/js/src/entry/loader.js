import 'pages/experiments/loader/loaderLayout.js';
import LoaderCanvas from 'pages/experiments/loader/LoaderCanvas.js';

const canvas = document.querySelector( '#viewer-canvas' );

const loaderCanvas = new LoaderCanvas( canvas );
