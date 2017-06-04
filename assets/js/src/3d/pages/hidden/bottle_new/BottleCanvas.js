import * as THREE from 'three';

import App from './App/App.js';

import './bottleCanvasSetup.js';

import StatisticsOverlay from './App/StatisticsOverlay.js';

import OrbitControls from './App/OrbitControls.module.js';

const jsonLoader = new THREE.JSONLoader();
const objectLoader = new THREE.ObjectLoader();
const textureLoader = new THREE.TextureLoader();

export default class BottleCanvas {

  constructor( showStats ) {

    const self = this;

    this.container = document.querySelector( '.canvas-container' );

    this.canvas = document.querySelector( '#bottle-canvas' );

    this.app = new App( this.canvas );

    this.app.camera.position.set( 0, 0, 80 );
    this.app.camera.near = 0.01;
    this.app.camera.far = 1000;

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
    directionalLight1.position.set( 200, 200, 300 );

    const directionalLight2 = new THREE.DirectionalLight( 0xffffff, 1.0 );
    directionalLight2.position.set( -100, 0, 100 );

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

    this.bottleMat = new THREE.MeshStandardMaterial( {
      color: 0x541e00,
      envMap: this.envMap,
      metalness: 0.9,
      opacity: 0.7,
      refractionRatio: 1.9,
      roughness: 0.6,
      transparent: true,
    } );

    this.bottleBackMat = new THREE.MeshStandardMaterial( {
      color: 0x541e00,
      envMap: this.envMap,
      metalness: 0.9,
      opacity: 0.7,
      refractionRatio: 1.9,
      roughness: 0.6,
      side: THREE.BackSide,
      transparent: true,
    } );

    this.beerLiquidMat = new THREE.MeshStandardMaterial( {
      color: 0x362823,
      envMap: this.envMap,
      metalness: 0.0,
      opacity: 0.8,
      refractionRatio: 1.3,
      roughness: 0.3,
      transparent: true,
    } );

    this.beerLiquidBackMat = new THREE.MeshStandardMaterial( {
      color: 0x362823,
      envMap: this.envMap,
      metalness: 0.0,
      opacity: 0.6,
      refractionRatio: 1.3,
      roughness: 0.3,
      side: THREE.BackSide,
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
    this.bottleGroup.position.set( 0, -1, 0 );
    this.app.scene.add( this.bottleGroup );

    objectLoader.load( '/assets/models/hidden/bottle/bottle_group3.json', ( scene ) => {
      const bottle = scene.children[0];

      const liquidGeom = bottle.children[0].geometry;
      liquidGeom.scale( 1, -1, 1 );
      const glassExteriorGeom = bottle.children[1].geometry;
      glassExteriorGeom.scale( 1, -1, 1 );
      const glassInteriorGeom = bottle.children[2].geometry;
      glassInteriorGeom.scale( 1, -1, 1 );
      const liquidTopGeom = bottle.children[3].geometry;
      liquidTopGeom.scale( 1, -1, 1 );

      const liquid = new THREE.Mesh( liquidGeom, this.beerLiquidMat );
      const liquidBack = new THREE.Mesh( liquidGeom, this.beerLiquidBackMat );
      const glassExterior = new THREE.Mesh( glassExteriorGeom, this.bottleMat );
      const glassInterior = new THREE.Mesh( glassInteriorGeom, this.bottleBackMat );
      const liquidTop = new THREE.Mesh( liquidTopGeom, this.beerLiquidMat );
      const liquidTopBack = new THREE.Mesh( liquidTopGeom, this.beerLiquidBackMat );

      this.bottleGroup.add( liquid, liquidBack, liquidTop, liquidTopBack, glassInterior, glassExterior );
    } );

    jsonLoader.load( '/assets/models/hidden/bottle/cap.json', ( geometry ) => {
      geometry.scale( 335, 335, 335 );
      geometry.translate( 0, -37.5, 0 );
      const bottleCapMesh = new THREE.Mesh( geometry, this.bottleCapMat );
      this.bottleGroup.add( bottleCapMesh );
    } );

  }

  initSmiley() {
    const geometry = new THREE.PlaneBufferGeometry( 7, 7, 1, 1 );

    const smiley = new THREE.Mesh( geometry, this.smileyMat );
    smiley.rotation.x = -Math.PI / 2;
    smiley.position.set( -0.1, 38.5, 0 );

    this.bottleGroup.add( smiley );
  }

  initLabel() {
    const geometry = new THREE.CylinderBufferGeometry( 9.95, 9.95, 35, 64, 1, true );

    const label = new THREE.Mesh( geometry, this.labelmat );
    const labelBack = new THREE.Mesh( geometry, this.labelBackMat );

    label.position.y = labelBack.position.y = -16;
    label.rotation.y = labelBack.rotation.y = 4 * Math.PI / 3;

    this.bottleGroup.add( label, labelBack );
  }

  initControls() {
    const controls = new OrbitControls( this.app.camera, this.canvas );

    // controls.enableZoom = false;
    // controls.enablePan = false;

    controls.autoRotate = true;
    controls.autoRotateSpeed = -1.0;

    controls.maxPolarAngle = Math.PI * 0.75;

    controls.enableDamping = true;
    controls.dampingFactor = 0.1;

    this.controls = controls;
  }
}
