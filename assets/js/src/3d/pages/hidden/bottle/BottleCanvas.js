import * as THREE from 'three';

import App from './App/App.js';

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

      // self.bottleGroup.rotation.y -= self.app.delta * 0.0005;

      self.controls.update();

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
    const maxAnistropy = this.app.renderer.getMaxAnisotropy();

    const envMap = textureLoader.load( '/assets/images/textures/env_maps/test_env_map.jpg' );
    // envMap.mapping = THREE.EquirectangularReflectionMapping;
    envMap.mapping = THREE.EquirectangularRefractionMapping;
    envMap.magFilter = THREE.LinearFilter;
    envMap.minFilter = THREE.LinearMipMapLinearFilter;

    envMap.anisotropy = maxAnistropy;

    const smileyTexture = textureLoader.load( '/assets/images/textures/hidden/bottle/carlsberg-smiley-dark.png' );
    smileyTexture.anisotropy = maxAnistropy;

    this.bottleCapMat = new THREE.MeshStandardMaterial( {
      envMap,
      map: smileyTexture,
      roughness: 0.8,
      metalness: 0.75,
      color: 0xFFFFFF,
      side: THREE.FrontSide,
    } );

    this.bottleGlassMat = new THREE.MeshStandardMaterial( {
      envMap,
      color: 0x541E00, // 0x662805,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.8,
      // side: THREE.DoubleSide,
      side: THREE.FrontSide,
      refractionRatio: 1.44,

      // specular: 0xCCCCCC,
      // shininess: 230,
      // shading: THREE.SmoothShading,
    } );
  }

  initLights() {
    const ambient = new THREE.AmbientLight( 0x404040, 1.0 );

    const directionalLight1 = new THREE.DirectionalLight( 0xffffff, 1.0 );
    directionalLight1.position.set( 20, 20, 30 );

    const directionalLight2 = new THREE.DirectionalLight( 0xffffff, 1.0 );
    directionalLight2.position.set( -10, 0, 10 );

    this.app.scene.add( ambient, directionalLight1, directionalLight2 );
  }

  // initTestObject() {
  //   const testCube = new THREE.BoxBufferGeometry( 30, 30, 30 );
  //   this.testMesh = new THREE.Mesh( testCube, this.bottleGlassMat );

  //   this.app.scene.add( this.testMesh );
  // }

  initBottle() {
    this.bottleGroup = new THREE.Group();
    this.app.scene.add( this.bottleGroup );

    jsonLoader.load( '/assets/models/hidden/bottle/bottle-real-applied.model.old.json', ( geometry ) => {
      geometry.computeVertexNormals();
      const bottleGlassMesh = new THREE.Mesh( geometry, this.bottleGlassMat );
      this.bottleGroup.add( bottleGlassMesh );
    } );

    jsonLoader.load( '/assets/models/hidden/bottle/bottle-cap.model.old.json', ( geometry ) => {
      const bottleCapMesh = new THREE.Mesh( geometry, this.bottleCapMat );

      bottleCapMesh.scale.set( 2.15, 2.5, 2.15 );
      bottleCapMesh.position.y = 19;

      this.bottleGroup.add( bottleCapMesh );
    } );

  }

  initSmiley() {

  }

  initControls() {
    const controls = new OrbitControls( this.app.camera, this.canvas );

    controls.enableZoom = false;
    controls.enablePan = false;

    controls.autoRotate = true;
    controls.autoRotateSpeed = -1.0; // 30 seconds per round when fps is 60

    // controls.minPolarAngle = 0; // radians
    controls.maxPolarAngle = Math.PI * 0.75; // radians

    controls.enableDamping = true;
    controls.dampingFactor = 0.1;

    this.controls = controls;
  }
}
