import * as THREE from 'three';

import App from './App/App.js';

// import { JSONLoader } from './bottleCanvasHelpers.js';

import './bottleCanvasSetup.js';

import StatisticsOverlay from './App/StatisticsOverlay.js';

import OrbitControls from './App/OrbitControls.module.js';

const jsonLoader = new THREE.JSONLoader();
const textureLoader = new THREE.TextureLoader();

export default class BottleCanvas {

  constructor( showStats ) {

    const self = this;

    self.container = document.querySelector( '.canvas-container' );

    this.canvas = document.querySelector( '#bottle-canvas' );
    
    self.app = new App( this.canvas );

    self.app.camera.position.set( 0, 0, 35 );

    self.app.renderer.setClearColor( 0xF9F9F9, 1.0 );

    let statisticsOverlay;
    if ( showStats ) statisticsOverlay = new StatisticsOverlay( self.app, self.container );

    self.app.onUpdate = function () {

      if ( showStats ) statisticsOverlay.updateStatistics( self.app.delta );

    };

    self.app.onWindowResize = function () {

    };

    self.initMaterials();
    self.initLights();
    // self.initTestObject();
    self.initBottle();
    self.initControls();

    self.app.play();

  }

  initMaterials() {

    const envMap = textureLoader.load( '/assets/images/textures/env_maps/test_env_map.jpg' );
    envMap.mapping = THREE.EquirectangularReflectionMapping;
    // envMap.mapping = THREE.EquirectangularRefractionMapping;
    envMap.magFilter = THREE.LinearFilter;
    envMap.minFilter = THREE.LinearMipMapLinearFilter;

    envMap.anisotropy = this.app.renderer.getMaxAnisotropy();


    this.bottleCapMat = new THREE.MeshStandardMaterial( {
        color: 0xFFFFFF,
        shading: THREE.SmoothShading,
        side: THREE.FrontSide
    } );

    this.bottleGlassMat = new THREE.MeshStandardMaterial( {
      envMap,
      color: 0x541E00,
      roughness: 0.5,
      metalness: 1.0,
      transparent: true,
      opacity: 0.75,
      // shading: THREE.SmoothShading,
      // side: THREE.DoubleSide,
      side: THREE.FrontSide,
    } );
  }

  initLights() {
    const ambient = new THREE.AmbientLight( 0x404040, 1.0 );

    const directionalLight = new THREE.DirectionalLight( 0xffffff, 1.0 );
    directionalLight.position.set( 0, 100, 0 );

    this.app.scene.add( ambient, directionalLight );
  }

  initTestObject() {
    const testCube = new THREE.BoxBufferGeometry( 30, 30, 30 );
    this.testMesh = new THREE.Mesh( testCube, this.bottleGlassMat );

    this.app.scene.add( this.testMesh );
  }

  initBottle() {
    this.bottleGroup = new THREE.Group();
    this.app.scene.add( this.bottleGroup );

    jsonLoader.load( '/assets/models/hidden/bottle/bottle-real-applied.model.old.json', ( geometry ) => {
      // console.log( geometry );
      const bottleGlassMesh = new THREE.Mesh( geometry, this.bottleGlassMat );
      this.bottleGroup.add( bottleGlassMesh );
    } );

    jsonLoader.load( '/assets/models/hidden/bottle/bottle-cap.model.old.json', ( geometry ) => {
      // console.log( geometry );
      const bottleCapMesh = new THREE.Mesh( geometry, this.bottleCapMat );

      bottleCapMesh.scale.set( 2.15, 2.5, 2.15 );
      bottleCapMesh.position.y = 19;

      this.bottleGroup.add( bottleCapMesh );
    } );

  }

  initControls() {
    const controls = new OrbitControls( this.app.camera, this.canvas );
  }
}
