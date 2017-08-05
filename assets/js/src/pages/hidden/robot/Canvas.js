import * as THREE from 'three';

import App from 'App/App.js';

import AnimationControls from './utilities/AnimationControls.js';

import LightingSetup from './utilities/LightingSetup.js';

import HTMLControl from './utilities/HTMLControl.js';

/* ******************************************************** */

// Set up THREE caching
THREE.Cache.enabled = true;

class Canvas {

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

    this.loadedObjects = new THREE.Group();
    this.app.scene.add( this.loadedObjects );

    this.app.initControls();

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
    this.app.fitCameraToObject( this.loadedObjects );

    this.app.play();

  }


  initReset() {

    HTMLControl.reset.addEventListener( 'click', () => {
      this.animationControls.reset();
      this.app.controls.reset();

      HTMLControl.setInitialState();

    } );

  }

}

const canvas = new Canvas( HTMLControl.canvas );

export default canvas;
