import * as THREE from 'three';

import App from 'App/App.js';

import LightingSetup from './utilities/LightingSetup.js';

import HTMLControl from './utilities/HTMLControl.js';

// import animationControls from './utilities/AnimationControls.js';


/* ******************************************************** */

// Set up THREE caching
THREE.Cache.enabled = true;

class Canvas {

  constructor( canvas ) {

    this.canvas = canvas;

    this.app = new App( this.canvas );

    this.app.renderer.setClearColor( 0xf7f7f7, 1.0 );

    this.lighting = new LightingSetup( this.app );

    this.loadedObjects = new THREE.Group();
    this.app.scene.add( this.loadedObjects );

    this.app.initControls();

    // this.initShadows();
    this.initFog();
    this.addGround();

  }

  initShadows() {

    this.app.renderer.shadowMap.enabled = true;
    this.app.renderer.shadowMap.type = THREE.PCFShadowMap;
    // PCFSoftShadowMap, PCFShadowMap, BasicShadowMap

  }

  initFog() {

    this.app.scene.fog = new THREE.Fog( 0xf7f7f7, 1500, 10000 );

  }

  addGround() {

    const geometry = new THREE.PlaneBufferGeometry( 20000, 20000 );
    const material = new THREE.MeshPhongMaterial( { color: 0xb0b0b0, shininess: 0.1 } );
    const ground = new THREE.Mesh( geometry, material );
    ground.position.set( 0, -25, 0 );
    ground.rotation.x = -Math.PI / 2;

    // const shadowGeometry = new THREE.PlaneBufferGeometry( 20000, 20000 );
    // const shadowMat = new THREE.ShadowMaterial();
    // shadowMat.opacity = 0.2;
    // const shadowReceiver = new THREE.Mesh( shadowGeometry, shadowMat );
    // shadowReceiver.position.set( 0, 0, 0 );
    // shadowReceiver.rotation.x = -Math.PI / 2;
    // shadowReceiver.receiveShadow = true;

    // this.app.scene.add( ground, shadowReceiver );

    ground.receiveShadow = true;
    this.app.scene.add( ground );

  }

}

const canvas = new Canvas( HTMLControl.canvas );

export default canvas;