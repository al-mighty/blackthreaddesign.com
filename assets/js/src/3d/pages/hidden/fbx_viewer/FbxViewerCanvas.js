import * as THREE from 'three';
import Stats from 'three/examples/js/libs/stats.min';

import App from './App/App.js';
import OrbitControls from './App/modules/OrbitControls.module.js';

import loadFBX from './loadFBX.js';

// import LightHelperExtended from './App/utilities/LightHelperExtended.js';

// Set up THREE
THREE.Cache.enabled = true;

const stats = new Stats();
stats.dom.style = `position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
  opacity: 0.9;
  z-index: 1;
  width: 100px;`;

document.body.appendChild( stats.dom );

export default class FbxViewerCanvas {

  constructor( canvas ) {

    const self = this;

    this.canvas = canvas;

    this.app = new App( this.canvas );

    this.app.camera.position.set( 0, -80, 40 );
    // this.app.camera.near = 100;
    // this.app.camera.far = 500;
    this.app.camera.updateProjectionMatrix();

    this.app.renderer.setClearColor( 0xffffff, 1.0 );

    this.mixers = [];

    // Put any per frame calculation here
    this.app.onUpdate = function () {
      // NB: use self inside this function

      // required if using 'damping' in controls
      self.controls.update();

      // remove if no longer using stats
      if ( stats ) stats.update();

      if ( self.mixers.length > 0 ) {
        for ( let i = 0; i < self.mixers.length; i++ ) {
          self.mixers[ i ].update( self.app.delta / 1000 );
        }
      }

    };

    // put any per resize calculations here (throttled to once per 250ms)
    this.app.onWindowResize = function () {
      // NB: use self inside this function
    };

    this.initLights();

    this.initControls();

    this.initBackgroundColorChanger();

    this.initSaveImageButton();

    this.loadModel( '/assets/models/fbx/xsi_man_skinning.fbx' );

    // App has play / pause / stop functions
    // this.app.play();
  }

  initLights() {
    const spot = new THREE.SpotLight( 0xffffff, 7, 500, Math.PI / 5, 0.9, 2.5 );
    spot.position.set( -15, 130, 180 );
    this.app.scene.add( spot, spot.target );
    // const lhSpot = new LightHelperExtended( spot, true, true );

    // this.spot = spot;

    const hemi = new THREE.HemisphereLight( 0x000000, 0xffffff, 0.75 );
    this.app.scene.add( hemi );
    // const lhHemi = new LightHelperExtended( hemi, true, true );

  }

  initControls() {
    const controls = new OrbitControls( this.app.camera, this.canvas );

    // controls.enableZoom = false;
    // controls.enablePan = false;

    // controls.autoRotate = true;
    // controls.autoRotateSpeed = -1.0;

    // How far you can orbit horizontally, upper and lower limits.
    // If set, must be a sub-interval of the interval [ - Math.PI, Math.PI ].
    // controls.minAzimuthAngle = 0; // radians
    // controls.maxAzimuthAngle = 0; // radians

    // controls.maxPolarAngle = Math.PI * 0.75;

    controls.enableDamping = true;
    controls.dampingFactor = 0.1;

    this.controls = controls;
  }

  loadModel( url ) {
    const self = this;
    loadFBX( url, this.mixers, this.app );
  }

  initSaveImageButton() {
    document.querySelector( '#screenshot-button' ).addEventListener( 'click', () => {
      const w = window.open( '', '' );
      w.document.title = 'FBX Viewer Screenshot';

      const img = new Image();

      this.app.renderer.render( this.app.scene, this.app.camera );
      img.src = this.app.renderer.domElement.toDataURL();
      w.document.body.appendChild( img );
    } );
  }

  initBackgroundColorChanger() {
    const controlLinks = document.querySelector( '#controls' ).getElementsByTagName( 'a' );

    document.querySelector( '#toggle-background' ).onchange = ( e ) => {
      console.log( e )
      if ( e.returnValue === true ) {

        this.app.renderer.setClearColor( 0x000000, 1.0 );
        for ( let i = 0; i < controlLinks.length; i++ ) {

          controlLinks[ i ].style.color = 'white';

        }

      } else if ( e.returnValue === false ) {

        this.app.renderer.setClearColor( 0xffffff, 1.0 );
        for ( let i = 0; i < controlLinks.length; i++ ) {

          controlLinks[ i ].style.color = 'black';

        }
      }
    };
  }

}
