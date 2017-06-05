import * as THREE from 'three';

import App from './App/App.js';

import './bottleCanvasSetup.js';

import StatisticsOverlay from './App/StatisticsOverlay.js';

import OrbitControls from './App/OrbitControls.module.js';

const jsonLoader = new THREE.JSONLoader();
const objectLoader = new THREE.ObjectLoader();
const textureLoader = new THREE.TextureLoader();
const bufferGeometryLoader = new THREE.BufferGeometryLoader();
const fileLoader = new THREE.FileLoader();
fileLoader.setResponseType( 'json' );

export default class BottleCanvas {

  constructor( showStats ) {

    const self = this;

    this.container = document.querySelector( '.canvas-container' );

    this.canvas = document.querySelector( '#bottle-canvas' );

    this.app = new App( this.canvas );

    this.app.camera.position.set( 0, 2, 12 );
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
    directionalLight2.position.set( 100, 0, 100 );

    const hemiLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );

    this.app.scene.add(
      ambient,
      hemiLight
      // directionalLight1,
      // directionalLight2
    );
  }

  initTextures() {
    this.envMap = textureLoader.load( '/assets/images/textures/env_maps/test_env_map.jpg' );
    this.envMap.mapping = THREE.EquirectangularRefractionMapping;

    this.smileyTexture = textureLoader.load( '/assets/images/textures/hidden/bottle/carlsberg-smiley-dark.png' );

    this.labelMap = new THREE.Texture();
  }

  initMaterials() {
    this.capMat = new THREE.MeshStandardMaterial( {
      color: 0xffffff,
      envMap: this.envMap,
      metalness: 0.75,
      roughness: 0.8,
      side: THREE.BackSide,
    } );

    this.capBackMat = this.capMat.clone();
    this.capBackMat.side = THREE.FrontSide;

    this.bottleMat = new THREE.MeshStandardMaterial( {
      color: 0x541e00,
      envMap: this.envMap,
      metalness: 0.9,
      opacity: 0.7,
      refractionRatio: 1.9,
      roughness: 0.6,
      transparent: true,
    } );

    this.bottleBackMat = this.bottleMat.clone();
    this.bottleBackMat.side = THREE.BackSide;

    this.liquidMat = new THREE.MeshStandardMaterial( {
      color: 0x362823,
      envMap: this.envMap,
      metalness: 0.0,
      opacity: 0.8,
      refractionRatio: 1.3,
      roughness: 0.3,
      transparent: true,
    } );

    this.liquidBackMat = this.liquidMat.clone();
    this.liquidBackMat.side = THREE.BackSide;

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
    const self = this;
    this.bottleGroup = new THREE.Group();
    this.bottleGroup.position.set( 0, -1, 0 );
    this.app.scene.add( this.bottleGroup );

    fileLoader.load( '/assets/models/hidden/bottle/bottle_reduced.json', ( json ) => {
      const geometries = {};

      json.geometries.forEach( ( obj ) => {
        const name = obj.data.name;
        const geometry = jsonLoader.parse( obj ).geometry;

        // blender model tend to be upside down in three.js
        geometry.scale( 1, -1, 1 );

        geometries[ name ] = geometry;
      } );

      geometries.cap.translate( 0, 6.5, 0 );

      const cap = new THREE.Mesh( geometries.cap, this.capMat );
      const capBack = new THREE.Mesh( geometries.cap, this.capBackMat );

      const bottleExterior = new THREE.Mesh( geometries.bottle, this.bottleMat );
      const bottleExteriorBack = new THREE.Mesh( geometries.bottle, this.bottleBackMat );

      const liquidTop = new THREE.Mesh( geometries.liquidTop, this.liquidMat );
      const liquidTopBack = new THREE.Mesh( geometries.liquidTop, this.liquidBackMat );
      // self.app.toJSON( geometries.liquidTop );

      const liquid = new THREE.Mesh( geometries.liquid, this.bottleMat );
      const liquidBack = new THREE.Mesh( geometries.liquid, this.bottleBackMat );

      this.bottleGroup.add(
        cap,
        capBack,
        bottleExterior,
        bottleExteriorBack,
        liquidTop,
        liquidTopBack,
        liquid,
        liquidBack
      );
    } );

  }

  initSmiley() {
    const geometry = new THREE.PlaneBufferGeometry( 1.25, 1.25 );

    const smiley = new THREE.Mesh( geometry, this.smileyMat );
    smiley.rotation.x = -Math.PI / 2;
    smiley.position.set( -0.025, 6.7, 0 );

    this.bottleGroup.add( smiley );
  }

  initLabel() {
    const geometry = new THREE.CylinderBufferGeometry( 1.71, 1.71, 5.5, 64, 1, true );

    const label = new THREE.Mesh( geometry, this.labelmat );
    const labelBack = new THREE.Mesh( geometry, this.labelBackMat );

    label.position.y = labelBack.position.y = -2.6;

    // this rotation was in the old scene - leaving it here in case it is needed for some reason
    // label.rotation.y = labelBack.rotation.y = 4 * Math.PI / 3;

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
