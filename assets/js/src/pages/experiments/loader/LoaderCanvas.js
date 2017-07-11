import * as THREE from 'three';

import App from 'App/App.js';
import FBXLoader from 'modules/loaders/FBXLoader.module.js';

import fileOnloadCallbacks from './utilities/fileReader.js';
import manager from './utilities/loadingManager.js';
import AnimationControls from './utilities/AnimationControls.js';
import addModelInfo from './utilities/addModelInfo.js';
import backgroundColorChanger from './utilities/backgroundColorChanger.js';

/* ******************************************************** */

// Set up THREE caching
THREE.Cache.enabled = true;

export default class LoaderCanvas {

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

    this.initFormatLoaders();

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

    this.app.fitCameraToObject( object );

    this.animationControls.initAnimation( object );

    this.app.scene.add( object );

    this.app.play();

    addModelInfo( this.app.renderer );

    document.querySelector( '#loading-overlay' ).classList.add( 'hide' );

  }

  initFormatLoaders() {
    const processObject = ( object ) => {

      if ( object !== undefined ) this.addObjectToScene( object );
      else console.error( 'Oops! An unspecified error occured :(' );

    };

    fileOnloadCallbacks.onJSONLoad = ( e ) => {

      const loader = new THREE.ObjectLoader( manager );
      const object = loader.parse( e.target.result );
      processObject( object );

    };

    fileOnloadCallbacks.onFBXLoad = ( e ) => {

      const loader = new FBXLoader( manager );
      const object = loader.parse( e.target.result );
      processObject( object );

    };

    // onload callback when loading .zip file
    fileOnloadCallbacks.onZipLoad = ( fbxFile, resources ) => {

      const loader = new FBXLoader( manager );
      const object = loader.parse( fbxFile, resources );
      processObject( object );

    };

  }

}

