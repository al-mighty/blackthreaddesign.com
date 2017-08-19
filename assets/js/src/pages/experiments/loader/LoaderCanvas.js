import * as THREE from 'three';

import App from 'App/App.js';

import AnimationControls from './utilities/AnimationControls.js';
import backgroundColorChanger from './utilities/backgroundColorChanger.js';
import LightingSetup from './utilities/LightingSetup.js';
import ScreenshotHandler from './utilities/ScreenshotHandler.js';
import Grid from './utilities/Grid.js';
import HTMLControl from './utilities/HTMLControl.js';
import exportAsJSON from './utilities/exportAsJSON.js';
import exportAnimsAsJSON from './utilities/exportAnimsAsJSON.js';

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

    this.initExport();
    this.initExportAnims();

  }

  addObjectToScene( object ) {

    if ( object === undefined ) {

      console.error( 'Oops! An unspecified error occurred :(' );
      return;

    }

    this.animationControls.initAnimation( object );

    this.loadedObjects.add( object );

    // fit camera to all loaded objects
    this.app.fitCameraToObject( this.loadedObjects );

    this.grid.setMaxSize( Math.floor( this.app.camera.far * 0.75 ) );

    this.app.play();

    HTMLControl.addModelInfo( this.app.renderer );

    this.loadedMaterials = [];

    this.loadedObjects.traverse( ( child ) => {

      if ( child.material !== undefined ) {

        this.loadedMaterials.push( child.material );

      }

    } );

  }

  initReset() {

    HTMLControl.reset.addEventListener( 'click', () => {

      while ( this.loadedObjects.children.length > 0 ) {

        let child = this.loadedObjects.children[ 0 ];

        this.loadedObjects.remove( child );
        child = null;

      }

      this.animationControls.reset();
      this.grid.reset();
      this.lighting.reset();
      HTMLControl.setInitialState();

    } );

  }

  initExport() {

    HTMLControl.export.addEventListener( 'click', ( e ) => {

      e.preventDefault();

      if ( this.loadedObjects.children.length === 0 ) return;

      exportAsJSON( this.loadedObjects );

    }, false );

  }

  initExportAnims() {

    HTMLControl.exportAnims.addEventListener( 'click', ( e ) => {

      e.preventDefault();

      if ( this.animationControls.clips.length === 0 ) return;

      exportAnimsAsJSON( this.animationControls.clips );

    }, false );

  }

}

const loaderCanvas = new LoaderCanvas( HTMLControl.canvas );

export default loaderCanvas;
