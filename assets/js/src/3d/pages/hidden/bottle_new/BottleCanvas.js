import * as THREE from 'three';

import App from './App/App.js';

import OrbitControls from './App/OrbitControls.module.js';

import Stats from 'three/examples/js/libs/stats.min';

// Set up THREE
THREE.Cache.enabled = true;

const jsonLoader = new THREE.JSONLoader();
const textureLoader = new THREE.TextureLoader();
const fileLoader = new THREE.FileLoader();
fileLoader.setResponseType( 'json' );
const cubeTextureLoader = new THREE.CubeTextureLoader();

const stats = new Stats();
stats.dom.style = `position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
  opacity: 0.9;
  z-index: 1;
  width: 100px;`;

document.body.appendChild( stats.dom );

export default class BottleCanvas {

  constructor( canvas, labelCanvas = null, backgroundColor = 0xffffff ) {

    const self = this;

    this.canvas = canvas;
    this.labelCanvas = labelCanvas;

    this.app = new App( this.canvas );

    this.app.camera.position.set( 0, 20, 250 );
    this.app.camera.near = 1.0;
    this.app.camera.far = 1000;

    this.app.renderer.setClearColor( backgroundColor, 1.0 );

    // this.app.renderer.toneMapping = THREE.NoToneMapping;
    // this.app.renderer.toneMapping = THREE.LinearToneMapping;
    // this.app.renderer.toneMapping = THREE.ReinhardToneMapping;
    // this.app.renderer.toneMapping = THREE.Uncharted2ToneMapping;
    this.app.renderer.toneMapping = THREE.CineonToneMapping;
    this.app.renderer.gammaInput = true;
    this.app.renderer.gammaOutput = true;
    this.app.renderer.toneMappingExposure = 0.2;
    // this.app.renderer.toneMappingWhitePoint = 20.0;

    this.app.onUpdate = function () {
      // NB: use self inside this function

      self.bottleGroup.rotateY( -self.app.delta * 0.001 );

      // required if using 'damping' in controls
      self.controls.update();

      // remove if no longer using stats
      if ( stats ) stats.update();

      if ( this.labelMap ) this.labelMap.needsUpdate = true;

    };

    this.app.onWindowResize = function () {
      // NB: use self inside this function
    };

    this.initLights();

    this.initTextures();
    this.initMaterials();

    this.initBottle();

    this.initSmiley();
    // this.initLabel();

    this.initControls();

    this.app.play();
  }

  initLights() {

    const spotLight1 = new THREE.SpotLight( 0xffffff, 6, 600, Math.PI / 4, 0.7, 2 );
    spotLight1.position.set( -15, 100, -180 );
    this.app.scene.add( new THREE.SpotLightHelper( spotLight1 ) );
    this.app.scene.add( spotLight1 );

    const hemi = new THREE.HemisphereLight( 0x111111, 0x000000, 3.0 );
    this.app.scene.add( hemi );
  }

  initTextures() {
    this.envMapRefraction = textureLoader.load( '/assets/images/textures/env_maps/grey_room.jpg' );
    this.envMapRefraction.mapping = THREE.EquirectangularRefractionMapping;

    this.smileyTexture = textureLoader.load( '/assets/images/textures/hidden/bottle/carlsberg-smiley-dark.png' );

    this.labelMap = this.labelCanvas ? new THREE.CanvasTexture( this.labelCanvas ) : null;
  }

  initMaterials() {
    const glassColor = 0x421d06;
    const liquidColor = 0xd15c1a;
    const envMapIntensity = 0.1;

    this.capMat = new THREE.MeshStandardMaterial( {
      color: 0xffffff,
      emissive: 0x606060,
      envMap: this.envMapRefraction,
      envMapIntensity,
      side: THREE.BackSide,

      // STANDARD
      metalness: 0.5,
      roughness: 0.4,

      // PHONG
      // reflectivity: 1,
      // shininess: 100,
      // specular: 0xbe745f,
    } );

    this.capBackMat = new THREE.MeshBasicMaterial( {
      color: 0x505050,
    } );

    this.bottleMat = new THREE.MeshStandardMaterial( {
      color: glassColor,
      envMap: this.envMapRefraction,
      envMapIntensity,
      opacity: 0.6,
      refractionRatio: 1.9,
      transparent: true,

      // STANDARD
      metalness: 0.2,
      roughness: 0.15,
    } );

    this.bottleBackMat = new THREE.MeshStandardMaterial( {
      color: glassColor,
      // envMap: this.envMapRefraction,
      // envMapIntensity,
      opacity: 0.3,
      refractionRatio: 1.9,
      transparent: true,
      side: THREE.BackSide,

      // STANDARD
      metalness: 0.6,
      roughness: 0.15,
    } );

    this.liquidMat = new THREE.MeshStandardMaterial( {
      color: liquidColor,
      opacity: 0.8,
      refractionRatio: 1.3,
      transparent: true,

      // STANDARD
      metalness: 0.0,
      roughness: 0.1,
    } );

    this.smileyMat = new THREE.MeshBasicMaterial( {
      map: this.smileyTexture,
      transparent: true,
    } );

    this.labelmat = new THREE.MeshStandardMaterial( {
      color: 0x7279a5,
      map: this.labelMap,
    } );

    this.labelBackMat = new THREE.MeshBasicMaterial( {
      color: 0x7279a5,
      side: THREE.BackSide,
    } );
  }

  initBottle() {
    this.bottleGroup = new THREE.Group();
    this.bottleGroup.position.set( 0, -1, 0 );
    this.bottleGroup.scale.set( 20, 20, 20 );
    this.app.scene.add( this.bottleGroup );

    fileLoader.load( '/assets/models/hidden/bottle/bottle2.json', ( json ) => {
      const geometries = {};

      json.geometries.forEach( ( obj ) => {
        const name = obj.data.name;
        const geometry = jsonLoader.parse( obj ).geometry;
        geometry.scale( 1, -1, 1 );
        geometries[ name ] = geometry;
      } );

      geometries.cap.translate( 0, 6.5, 0 );

      const cap = new THREE.Mesh( geometries.cap, this.capMat );
      const capBack = new THREE.Mesh( geometries.cap, this.capBackMat );

      geometries.bottle.merge( geometries.bottle_interior );

      const bottleFront = new THREE.Mesh( geometries.bottle, this.bottleMat );
      bottleFront.renderOrder = 1;
      const bottleBack = new THREE.Mesh( geometries.bottle, this.bottleBackMat );
      bottleBack.renderOrder = 2;

      geometries.liquid.merge( geometries.liquidTop );

      const liquid = new THREE.Mesh( geometries.liquid, this.liquidMat );
      liquid.renderOrder = 0;

      this.bottleGroup.add(
        bottleFront,
        bottleBack,
        cap,
        capBack,
        liquid
      );
    } );

  }

  initSmiley() {
    const geometry = new THREE.PlaneBufferGeometry( 1.1, 1.1 );

    const smiley = new THREE.Mesh( geometry, this.smileyMat );
    smiley.rotation.x = -Math.PI / 2;
    smiley.position.set( -0.025, 6.7, 0.1 );

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

    // controls.autoRotate = true;
    // controls.autoRotateSpeed = -1.0;

    // How far you can orbit horizontally, upper and lower limits.
    // If set, must be a sub-interval of the interval [ - Math.PI, Math.PI ].
    controls.minAzimuthAngle = 0; // radians
    controls.maxAzimuthAngle = 0; // radians

    controls.maxPolarAngle = Math.PI * 0.75;

    controls.enableDamping = true;
    controls.dampingFactor = 0.1;

    this.controls = controls;
  }
}
