import * as THREE from 'three';

import App from 'App/App.js';
import FBXLoader from './loaders-modules/FBXLoader.custom.js';

import fileModel from './utilities/fileReader.js';
import manager from './utilities/loadingManager.js';
import AnimationControls from './utilities/AnimationControls.js';
import addModelInfo from './utilities/addModelInfo.js';

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

    this.mixers = [];

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

    this.initBackgroundColorChanger();

    this.initFBXLoader();

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

  takeScreenShot( width, height ) {

    // set camera and renderer to screenshot size
    this.app.camera.aspect = width / height;
    this.app.camera.updateProjectionMatrix();
    this.app.renderer.setSize( width, height, false );

    // render scene at new size
    this.app.renderer.render( this.app.scene, this.app.camera, null, false );

    const img = new Image();
    img.src = this.app.renderer.domElement.toDataURL();
    document.querySelector( '#screenshot' ).appendChild( img );

    // reset the renderer and camera to original size
    this.app.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    this.app.camera.updateProjectionMatrix();
    this.app.renderer.setSize( this.canvas.clientWidth, this.canvas.clientHeight, false );
  }

  initBackgroundColorChanger() {
    const controlLinks = document.querySelector( '#controls' ).getElementsByTagName( 'a' );

    const toggle = document.querySelector( '#toggle-background' );

    toggle.addEventListener( 'change', () => {
      if ( toggle.checked ) {

        this.app.renderer.setClearColor( 0x000000, 1.0 );
        for ( let i = 0; i < controlLinks.length; i++ ) {

          controlLinks[ i ].style.color = 'white';

        }

      } else {

        this.app.renderer.setClearColor( 0xf7f7f7, 1.0 );
        for ( let i = 0; i < controlLinks.length; i++ ) {

          controlLinks[ i ].style.color = 'black';

        }
      }
    } );

  }

  addObjectToScene( object ) {

    this.app.fitCameraToObject( object );

    this.animationControls.initAnimation( object );

    this.app.scene.add( object );

    // this needs to be called a little while after loading, otherwise
    // otherwise textures may not have fully loaded
    // setTimeout( () => this.takeScreenShot( 1440, 800 ), 1000 );

    this.app.play();

    addModelInfo( this.app.renderer );

    document.querySelector( '#loading-overlay' ).classList.add( 'hide' );

  }

  initFBXLoader() {

    const fbxLoader = new FBXLoader( manager );

    fileModel.fileReader.onload = ( e ) => {

      const object = fbxLoader.parse( e.target.result );
      if ( object !== undefined ) this.addObjectToScene( object );

    };

    // onload callback when loading .zip file
    fileModel.onZipLoad = ( fbxFile, resources ) => {

      const object = fbxLoader.parse( fbxFile, resources );
      if ( object !== undefined ) this.addObjectToScene( object );

    };

  }

}

