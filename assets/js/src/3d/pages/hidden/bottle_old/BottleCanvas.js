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

    this.container = document.querySelector( '.canvas-container' );

    this.canvas = document.querySelector( '#bottle-canvas' );

    this.app = new App( this.canvas );

    this.app.camera.position.set( 0, 0, 35 );

    this.app.renderer.setClearColor( 0xF9F9F9, 1.0 );

    let statisticsOverlay;
    if ( showStats ) statisticsOverlay = new StatisticsOverlay( this.app, this.container );

    this.app.onUpdate = function () {
      // NB: use self inside this function

      if ( showStats ) statisticsOverlay.updateStatistics( self.app.delta );

      self.controls.update();

    };

    this.app.onWindowResize = function () {
      // NB: use self inside this function
    };

    this.initLights();

    this.initTextures();
    this.initMaterials();


    this.initBottle();
    this.initSmiley();
    this.initLabel();

    this.initControls();

    this.app.play();

  }

  initLights() {
    const ambient = new THREE.AmbientLight( 0x404040, 1.0 );

    const directionalLight1 = new THREE.DirectionalLight( 0xffffff, 1.0 );
    directionalLight1.position.set( 20, 20, 30 );

    const directionalLight2 = new THREE.DirectionalLight( 0xffffff, 1.0 );
    directionalLight2.position.set( -10, 0, 10 );

    this.app.scene.add( ambient, directionalLight1, directionalLight2 );
  }

  initTextures() {
    this.envMap = textureLoader.load( '/assets/images/textures/env_maps/test_env_map.jpg' );
    this.envMap.mapping = THREE.EquirectangularRefractionMapping;

    this.smileyTexture = textureLoader.load( '/assets/images/textures/hidden/bottle/carlsberg-smiley-dark.png' );

    this.labelMap = new THREE.Texture();
  }

  initMaterials() {
    this.bottleCapMat = new THREE.MeshStandardMaterial( {
      color: 0xffffff,
      envMap: this.envMap,
      metalness: 0.75,
      roughness: 0.8,
      side: THREE.DoubleSide,
    } );

    this.bottleGlassMat = new THREE.MeshStandardMaterial( {
      color: 0x541e00,
      envMap: this.envMap,
      metalness: 0.9,
      opacity: 0.8,
      refractionRatio: 1.9,
      roughness: 0.1,
      transparent: true,
    } );

    this.smileyMat = new THREE.MeshBasicMaterial( {
      map: this.smileyTexture,
      transparent: true,
    } );

    this.labelmat = new THREE.MeshStandardMaterial( {
      color: 0x7279a5,
      envMap: this.envMap,
      metalness: 0.2,
      roughness: 0.8,
      // map: this.labelMap,
    } );

    this.labelBackMat = new THREE.MeshBasicMaterial( {
      color: 0x7279a5,
      side: THREE.BackSide,
    } );
  }

  initBottle() {
    this.bottleGroup = new THREE.Group();
    this.app.scene.add( this.bottleGroup );

    jsonLoader.load( '/assets/models/hidden/bottle/bottle-real-applied.model.old.json', ( geometry ) => {
      geometry.computeVertexNormals();
      console.log( geometry );
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
    const geometry = new THREE.PlaneBufferGeometry( 3.8, 3.8, 1, 1 );

    const smiley = new THREE.Mesh( geometry, this.smileyMat );
    smiley.rotation.x = -Math.PI / 2;
    smiley.position.set( -0.1, 18.95, 0 );
    smiley.scale.set( 0.9, 0.9, 1 );

    this.bottleGroup.add( smiley );
  }

  initLabel() {
    const geometry = new THREE.CylinderBufferGeometry( 4.93, 4.93, 18, 64, 1, true );

    const label = new THREE.Mesh( geometry, this.labelmat );
    const labelBack = new THREE.Mesh( geometry, this.labelBackMat );

    label.position.y = labelBack.position.y = -8;
    label.rotation.y = labelBack.rotation.y = 4 * Math.PI / 3;

    this.bottleGroup.add( label, labelBack );
  }

  initControls() {
    const controls = new OrbitControls( this.app.camera, this.canvas );

    controls.enableZoom = false;
    controls.enablePan = false;

    controls.autoRotate = true;
    controls.autoRotateSpeed = -1.0;

    controls.maxPolarAngle = Math.PI * 0.75;

    controls.enableDamping = true;
    controls.dampingFactor = 0.1;

    this.controls = controls;
  }
}
