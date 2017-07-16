import * as THREE from 'three';

import App from 'App/App.js';

import AnimationControls from './utilities/AnimationControls.js';
import addModelInfo from './utilities/addModelInfo.js';
import backgroundColorChanger from './utilities/backgroundColorChanger.js';

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

    this.initLights();

    this.app.initControls();

    backgroundColorChanger( this.app );

  }

  initLights() {

    const ambientLight = new THREE.AmbientLight( 0xffffff, 0.2 );
    this.app.scene.add( ambientLight );

    // ****  METHOD 1:   3 POINT LIGHTING ***************************
    // Traditional 3 point light setup - slightly more expensive due to
    // two extra lights

    // const backLight = new THREE.DirectionalLight( 0xffffff, 0.325 );
    // backLight.position.set( 2.6, 1, 3 );

    // const keyLight = new THREE.DirectionalLight( 0xffffff, 0.475 );
    // keyLight.position.set( -2, -1, 0 );

    // const fillLight = new THREE.DirectionalLight( 0xffffff, 0.65 );
    // fillLight.position.set( 3, 3, 2 );

    // this.app.scene.add( backLight, keyLight, fillLight );


    // ****  METHOD 2:   CAMERA LIGHT ***********************************
    // Visually similar to 3 point lighting, but cheaper as only two lights
    // are needed

    const pointLight = new THREE.PointLight( 0xffffff, 0.7, 0, 0 );
    this.app.camera.add( pointLight );
    this.app.scene.add( this.app.camera );

  }


  addObjectToScene( object ) {

    if ( object === undefined ) {

      console.error( 'Oops! An unspecified error occurred :(' );
      return;

    }

    this.app.fitCameraToObject( object );

    this.animationControls.initAnimation( object );

    this.app.scene.add( object );

    this.app.play();

    addModelInfo( this.app.renderer );

    document.querySelector( '#loading-overlay' ).classList.add( 'hide' );

  }

}

const canvas = document.querySelector( '#viewer-canvas' );

const loaderCanvas = new LoaderCanvas( canvas );

export default loaderCanvas;
