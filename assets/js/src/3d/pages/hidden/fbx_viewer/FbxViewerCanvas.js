import throttle from 'lodash.throttle';

import * as THREE from 'three';

import App from './App/App.js';

import FBXLoader from './App/modules/FBXLoader.module.js';

import fileModel from './fileReader.js';

/* ******************************************************** */
// STATS overlay. Don't use this in production as it
// causes issues in some browsers!
import Stats from 'three/examples/js/libs/stats.min';

const stats = new Stats();
stats.dom.style = `position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
  opacity: 0.9;
  z-index: 1;
  width: 100px;`;

document.body.appendChild( stats.dom );

/* ******************************************************** */

// Set up THREE caching
THREE.Cache.enabled = true;

export default class FbxViewerCanvas {

  constructor( canvas ) {

    const self = this;

    this.canvas = canvas;

    this.app = new App( this.canvas );

    this.app.renderer.setClearColor( 0xf7f7f7, 1.0 );

    this.mixers = [];

    const animationSlider = document.querySelector( '#animation-slider' );
    // Put any per frame calculation here
    this.app.onUpdate = function () {
      // NB: use self inside this function

      // remove if no longer using stats
      if ( stats ) stats.update();

      if ( self.mixers.length > 0 ) {

        for ( let i = 0; i < self.mixers.length; i++ ) {

          self.mixers[ i ].update( self.app.delta / 1000 );
          animationSlider.value = String( self.mixers[ i ].action.time );

        }

      }

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

    const ambientLight = new THREE.AmbientLight( 0x333333 );

    const backLight = new THREE.DirectionalLight( 0xffffff, 0.325 );
    backLight.position.set( 2.6, 1, 3 );

    const keyLight = new THREE.DirectionalLight( 0xffffff, 0.475 );
    keyLight.position.set( -2, -1, 0 );

    const fillLight = new THREE.DirectionalLight( 0xffffff, 0.65 );
    fillLight.position.set( 3, 3, 2 );

    this.app.scene.add( ambientLight, backLight, keyLight, fillLight );
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

  initFBXLoader() {
    const animationSlider = document.querySelector( '#animation-slider' );
    const animationControls = document.querySelector( '#animation-controls' );
    const playbackControl = document.querySelector( '#playback-control' );
    const playBtn = document.querySelector( '#play-button' );
    const pauseBtn = document.querySelector( '#pause-button' );
    const vertices = document.querySelector( '#vertices' );
    const faces = document.querySelector( '#faces' );

    const addModelInfo = () => {

      faces.innerHTML = this.app.renderer.info.render.faces;
      vertices.innerHTML = this.app.renderer.info.render.vertices;

    };

    const fbxLoader = new FBXLoader();

    const initAnimation = ( object ) => {
      animationControls.classList.remove( 'hide' );

      object.mixer = new THREE.AnimationMixer( object );
      this.mixers.push( object.mixer );

      const animation = object.animations[ 0 ];

      // set animation slider max to length of animation
      animationSlider.max = String( animation.duration );

      // update the slider at ~ 60fps
      animationSlider.step = String( animation.duration / 150 );

      const action = object.mixer.clipAction( animation );
      object.mixer.action = action;
      action.play();

      playbackControl.addEventListener( 'click', () => {

        if ( action.paused ) {

          action.paused = false;
          playBtn.classList.add( 'hide' );
          pauseBtn.classList.remove( 'hide' );

        } else {

          action.paused = true;
          playBtn.classList.remove( 'hide' );
          pauseBtn.classList.add( 'hide' );

        }

      } );

      animationSlider.addEventListener( 'mousedown', () => {

        action.paused = true;

      } );

      animationSlider.addEventListener( 'input', throttle( () => {

        const newPos = animationSlider.value;

        action.time = newPos;

        animationSlider.value = String( newPos );

      }, 17 ) ); // throttled at ~17 ms will give approx 60fps while sliding the controls

      animationSlider.addEventListener( 'mouseup', () => {

        action.paused = false;

      } );
    };

    const addObjectToScene = ( object ) => {
      
      this.app.fitCameraToObject( object );

      if ( object.animations.length !== 0 ) {

        initAnimation( object );

      }

      this.app.scene.add( object );

      // this needs to be called a little while after loading, otherwise the model may
      // not be fully rendered yet
      setTimeout( () => this.takeScreenShot( 1440, 800 ), 1000 );

      this.app.play();

      addModelInfo();

      document.querySelector( '#loading-overlay' ).classList.add( 'hide' );
    };

    // onload callback when loading .fbx file
    fileModel.fileReader.onload = ( e ) => {

      const object = fbxLoader.parse( e.target.result );
      addObjectToScene( object );

    }

    // onload callback when loading .zip file
    fileModel.onZipLoad = ( data ) => {

      const object = fbxLoader.parse( data );
      addObjectToScene( object );

    }

  }

}

