import fbxViewerLayout from '../pages/hidden/fbx_viewer/fbxViewerLayout.js';
import FbxViewerCanvas from '../3d/pages/hidden/fbx_viewer/FbxViewerCanvas.js';

const canvas = document.querySelector( '#viewer-canvas' );

fbxViewerLayout();

const fbxViewerCanvas = new FbxViewerCanvas( canvas );

