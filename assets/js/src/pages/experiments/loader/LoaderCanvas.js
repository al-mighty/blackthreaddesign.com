import * as THREE from 'three';

import App from 'App/App.js';

import AnimationControls from './utilities/AnimationControls.js';
import addModelInfo from './utilities/addModelInfo.js';
import backgroundColorChanger from './utilities/backgroundColorChanger.js';
import LightingSetup from './utilities/LightingSetup.js';
import ScreenshotHandler from './utilities/ScreenshotHandler.js';
import reset from './utilities/reset.js';
import Grid from './utilities/Grid.js';

import './utilities/fileReader.js';

/* ******************************************************** */

// Set up THREE caching
THREE.Cache.enabled = true;

class LoaderCanvas {

  constructor( canvas ) {

    const self = this;

    this.canvas = canvas;

    this.app = new App( this.canvas );

    this.app.renderer.setClearColor( 0xf7f7f7, 1.0 );

    this.animationControls = new AnimationControls();

    // Put any per frame calculation here
    this.app.onUpdate = function () {
      // NB: use self inside this function

      self.animationControls.update( self.app.delta );

    };

    // put any per resize calculations here (throttled to once per 250ms)
    this.app.onWindowResize = function () {

      // NB: use self inside this function

    };

    this.lighting = new LightingSetup( this.app );

    this.grid = new Grid();

    this.app.scene.add( this.grid.helpers );

    this.loadedObjects = new THREE.Group();
    this.app.scene.add( this.loadedObjects );

    this.app.initControls();

    backgroundColorChanger( this.app );

    this.screenshotHandler = new ScreenshotHandler( this.app );

    this.initReset();

  }

  addObjectToScene( object ) {

    if ( object === undefined ) {

      console.error( 'Oops! An unspecified error occurred :(' );
      return;

    }

    this.animationControls.initAnimation( object );

    this.loadedObjects.add( object );

    // fit camera to all loaded objects
    this.boundingBox = this.app.fitCameraToObject( this.loadedObjects );

    // set grid to correct size
    const size = this.boundingBox.getSize();
    const maxEdge = Math.ceil( Math.max( size.x, size.y ) );
    this.grid.setSize( maxEdge );
    // this.grid.setMaxSize( Math.floor( this.app.camera.far * 0.75 ) );

    this.app.play();

    addModelInfo( this.app.renderer );

  }

  initReset() {

    document.querySelector( '#reset' ).addEventListener( 'click', () => {

      reset( this.loadedObjects );

    } );

  }

}

const canvas = document.querySelector( '#viewer-canvas' );

const loaderCanvas = new LoaderCanvas( canvas );

export default loaderCanvas;
