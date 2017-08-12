import * as THREE from 'three';

import App from 'App/App.js';

import LightingSetup from './utilities/LightingSetup.js';

import HTMLControl from './utilities/HTMLControl.js';

import animationControls from './utilities/AnimationControls.js';


/* ******************************************************** */

// Set up THREE caching
THREE.Cache.enabled = true;

class Canvas {

  constructor( canvas ) {

    const self = this;

    this.canvas = canvas;

    this.app = new App( this.canvas );

    this.app.renderer.setClearColor( 0xf7f7f7, 1.0 );

    // Put any per frame calculation here
    this.app.onUpdate = function () {
      // NB: use self inside this function

      animationControls.update( self.app.delta );

    };

    // put any per resize calculations here (throttled to once per 250ms)
    this.app.onWindowResize = function () {

      // NB: use self inside this function

    };

    this.app.scene.fog = new THREE.Fog( 0xf7f7f7, 200, 1500 );

    this.lighting = new LightingSetup( this.app );

    this.loadedObjects = new THREE.Group();
    this.app.scene.add( this.loadedObjects );

    this.initCamera();
    this.app.initControls();
    this.initControls();

    this.addGround();

  }

  initCamera() {

    this.app.camera.far = 1500;
    this.app.camera.fov = 30;
    this.app.camera.position.set( 250, 120, 200 );
    this.app.camera.updateProjectionMatrix();

  }

  initControls() {

    this.app.controls.minPolarAngle = Math.PI / 12;
    this.app.controls.maxPolarAngle = Math.PI / 2;

  }

  addGround() {
    const geometry = new THREE.PlaneBufferGeometry( 20000, 20000 );
    const material = new THREE.MeshPhongMaterial( { shininess: 0.1 } );
    const ground = new THREE.Mesh( geometry, material );
    ground.position.set( 0, - 1, 0 );
    ground.rotation.x = - Math.PI / 2;
    this.app.scene.add( ground );

  }


  addObjectToScene( object ) {

    if ( object === undefined ) {

      console.error( 'Oops! An unspecified error occurred :(' );
      return;

    }
    this.loadedObjects.add( object );

    // fit camera to all loaded objects
    this.app.fitCameraToObject( this.loadedObjects );

  }

}

const canvas = new Canvas( HTMLControl.canvas );

export default canvas;
