import 'pages/hidden/fbx_viewer/fbxViewerLayout.js';
import FbxViewerCanvas from 'pages/hidden/fbx_viewer/FbxViewerCanvas.js';

const canvas = document.querySelector( '#viewer-canvas' );

const fbxViewerCanvas = new FbxViewerCanvas( canvas );
