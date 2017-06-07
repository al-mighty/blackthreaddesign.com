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

    this.app.camera.position.set( 0, 0, 250 );
    this.app.camera.near = 1.0;
    this.app.camera.far = 1000;

    this.app.renderer.setClearColor( backgroundColor, 1.0 );

    this.app.onUpdate = function () {
      // NB: use self inside this function

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
    this.initLabel();

    this.initControls();

    this.app.play();
  }

  initLights() {
    // const ambient = new THREE.AmbientLight( 0x404040, 0.5 );
    // this.app.scene.add( ambient );

    const spotLight1 = new THREE.SpotLight( 0xffffff, 1.25, 0, Math.PI / 8, 0.5, 2 );
    spotLight1.position.set( -100, 300, 200 );
    const spotLight1Helper = new THREE.SpotLightHelper( spotLight1 );
    // this.app.scene.add( spotLight1Helper );
    this.app.scene.add( spotLight1 );

    const spotLight2 = new THREE.SpotLight( 0xffffff, 1.25, 0, Math.PI / 8, 0.5, 2 );
    spotLight2.position.set( 0, 250, -150 );
    const spotLight2Helper = new THREE.SpotLightHelper( spotLight2 );
    // this.app.scene.add( spotLight2Helper );
    this.app.scene.add( spotLight2 );

    const hemi = new THREE.HemisphereLight( 0x606060, 0x303030, 0.25 );
    this.app.scene.add( hemi );
  }

  initTextures() {
    this.envMapRefraction = textureLoader.load( '/assets/images/textures/env_maps/grey_room.jpg' );
    this.envMapRefraction.mapping = THREE.EquirectangularRefractionMapping;

    this.smileyTexture = textureLoader.load( '/assets/images/textures/hidden/bottle/carlsberg-smiley-dark.png' );

    this.labelMap = this.labelCanvas ? new THREE.CanvasTexture( this.labelCanvas ) : null;
  }

  initMaterials() {
    const glassColor = 0x3b1a0e;
    const liquidColor = 0xdc621c;
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
      opacity: 0.5,
      refractionRatio: 1.9,
      transparent: true,

      // STANDARD
      metalness: 0.1,
      roughness: 0.15,

      // PHONG
      // reflectivity: 5,
      // shininess: 400,
      // specular: 0xbe745f,
    } );

    this.bottleBackMat = new THREE.MeshStandardMaterial( {
      color: glassColor,
      envMap: this.envMapRefraction,
      envMapIntensity,
      opacity: 0.5,
      refractionRatio: 1.9,
      transparent: true,
      side: THREE.BackSide,

      // STANDARD
      metalness: 0.1,
      roughness: 0.15,

      // PHONG
      // reflectivity: 5,
      // shininess: 400,
      // specular: 0xbe745f,
    } );

    this.liquidMat = new THREE.MeshStandardMaterial( {
      color: liquidColor,
      envMap: this.envMapRefraction,
      envMapIntensity,
      opacity: 0.4,
      refractionRatio: 1.3,
      transparent: true,

      // STANDARD
      metalness: 0.2,
      roughness: 0.1,

      // PHONG
      // reflectivity: 1,
      // shininess: 200,
      // specular: 0xbe745f,
    } );

    this.liquidBackMat = new THREE.MeshStandardMaterial( {
      color: liquidColor,
      envMap: this.envMapRefraction,
      envMapIntensity,
      opacity: 0.4,
      refractionRatio: 1.3,
      transparent: true,

      side: THREE.BackSide,
      // emissive: 0xdc621c,
      // emissiveIntensity: 0.15,

      // STANDARD
      metalness: 0.2,
      roughness: 0.1,

      // PHONG
      // reflectivity: 1,
      // shininess: 200,
      // specular: 0xbe745f,
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

      const bottle_front = new THREE.Mesh( geometries.bottle, this.bottleMat );
      bottle_front.renderOrder = 2;
      const bottle_back = new THREE.Mesh( geometries.bottle, this.bottleBackMat );
      bottle_back.renderOrder = 3;

      geometries.liquid.merge( geometries.liquidTop );

      const liquid = new THREE.Mesh( geometries.liquid, this.liquidMat );
      liquid.renderOrder = 0;
      const liquidBack = new THREE.Mesh( geometries.liquid, this.liquidBackMat );
      liquidBack.renderOrder = 1;

      this.bottleGroup.add(
        bottle_front,
        bottle_back,
        cap,
        capBack,
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
