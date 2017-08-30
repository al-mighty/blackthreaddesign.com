import * as THREE from 'three';

import App from 'App/App.js';

import LightingSetup from './utilities/LightingSetup.js';

import HTMLControl from './utilities/HTMLControl.js';

/* ******************************************************** */

// Set up THREE caching
THREE.Cache.enabled = true;

class Canvas {

  constructor( canvas ) {

    this.canvas = canvas;

    this.app = new App( this.canvas );

    this.app.renderer.setClearColor( 0xf7f7f7, 1.0 );

    // this.app.renderer.alpha = true;

    this.app.renderer.autoClear = false;

    this.app.scene.background = 0xf7f7f7;
    this.app.scene.fog = new THREE.Fog( 0xf7f7f7, 400, 1500 );

    this.lighting = new LightingSetup( this.app );

    this.loadedObjects = new THREE.Group();
    this.app.scene.add( this.loadedObjects );

    this.initCamera();
    this.app.initControls();
    this.initControls();

    // this.initShadows();

    this.addGround();

  }

  initShadows() {

    this.app.renderer.shadowMap.enabled = true;
    this.app.renderer.shadowMap.type = THREE.PCFShadowMap;
    // PCFSoftShadowMap, PCFShadowMap

  }

  initCamera() {

    this.app.camera.far = 1500;
    this.app.camera.fov = 30;
    this.app.camera.position.set( 250, 120, 200 );
    this.app.camera.updateProjectionMatrix();

  }

  initControls() {

    this.app.controls.minPolarAngle = 0;
    this.app.controls.maxPolarAngle = Math.PI * 0.45;

    this.app.controls.minDistance = 10;
    this.app.controls.maxDistance = 500;

    // How far you can orbit horizontally, upper and lower limits.
    // If set, must be a sub-interval of the interval [ - Math.PI, Math.PI ].
    this.app.controls.minAzimuthAngle = - Math.PI * 0.65; // radians
    this.app.controls.maxAzimuthAngle = Math.PI * 0.75; // radians

  }

  addGround() {
    const geometry = new THREE.PlaneBufferGeometry( 20000, 20000 );
    const material = new THREE.MeshPhongMaterial( { shininess: 0.1 } );
    const ground = new THREE.Mesh( geometry, material );
    ground.position.set( 0, -2, 0 );
    ground.rotation.x = -Math.PI / 2;
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
