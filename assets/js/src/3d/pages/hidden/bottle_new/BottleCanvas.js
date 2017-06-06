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

const stats = new Stats();
stats.dom.style = `position: absolute;
top: 0;
right: 0;
cursor: pointer;
opacity: 0.9;
z-index: 1;
width: 100px;`

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

    const lightTarget = new THREE.Object3D();

    // // set the target position to the top of the bottlecap
    // lightTarget.position.set( 100, 6.5, 0 );

    // this.app.scene.add( lightTarget );

    const ambient = new THREE.AmbientLight( 0x404040, 1.0 );
    // this.app.scene.add( ambient );

    const directionalLight1 = new THREE.DirectionalLight( 0xffffff, 0.75 );
    directionalLight1.position.set( 100, 300, 150 );
    // directionalLight1.target.position.set( 0, 6.5, 0 ); //= lightTarget;
    // this.app.scene.add( directionalLight1.target );
    this.app.scene.add( directionalLight1 );
    const dl1Hhelper = new THREE.DirectionalLightHelper( directionalLight1, 5 );
    // this.app.scene.add( dl1Hhelper );


    const directionalLight2 = new THREE.DirectionalLight( 0xffffff, 0.75 );
    directionalLight2.position.set( 100, 300, -150 );
    const dl2Hhelper = new THREE.DirectionalLightHelper( directionalLight2, 5 );
    // this.app.scene.add( dl2Hhelper );
    this.app.scene.add( directionalLight2 );

    const spotLight1 = new THREE.SpotLight( 0xffffff, 0.75, 0, Math.PI / 8, 1.0, 2 );
    spotLight1.position.set( -100, 300, 100 );
    spotLight1.target = lightTarget;
    const spotLight1Helper = new THREE.SpotLightHelper( spotLight1 );
    // this.app.scene.add( spotLight1Helper );
    this.app.scene.add( spotLight1 );
  }

  initTextures() {
    this.envMap = textureLoader.load( '/assets/images/textures/env_maps/test_env_map.jpg' );
    this.envMap.mapping = THREE.EquirectangularRefractionMapping;

    this.smileyTexture = textureLoader.load( '/assets/images/textures/hidden/bottle/carlsberg-smiley-dark.png' );

    this.labelMap = this.labelCanvas ? new THREE.CanvasTexture( this.labelCanvas ) : null;
  }

  initMaterials() {
    const glassColor = 0x362823;
    const liquidColor = 0x362823;

    this.capMat = new THREE.MeshStandardMaterial( {
      color: 0xffffff,
      emissive: 0x303030,
      envMap: this.envMap,
      metalness: 0.9,
      roughness: 0.4,
      side: THREE.BackSide,
    } );

    this.capBackMat = this.capMat.clone();
    this.capBackMat.side = THREE.FrontSide;

    this.bottleExteriorMat = new THREE.MeshStandardMaterial( {
      color: glassColor,
      envMap: this.envMap,
      metalness: 0.2,
      opacity: 0.75,
      refractionRatio: 1.9,
      roughness: 0.5,
      transparent: true,
    } );

    this.bottleExteriorBackMat = new THREE.MeshStandardMaterial( {
      color: glassColor,
      envMap: this.envMap,
      metalness: 0.2,
      opacity: 0.5,
      refractionRatio: 1.9,
      roughness: 0.2,
      transparent: true,
      side: THREE.BackSide,
    } );

    this.bottleInteriorMat = new THREE.MeshStandardMaterial( {
      color: glassColor,
      envMap: this.envMap,
      metalness: 0.2,
      opacity: 0.7,
      refractionRatio: 1.9,
      roughness: 0.5,
      transparent: true,
    } );

    this.bottleInteriorBackMat = new THREE.MeshStandardMaterial( {
      color: glassColor,
      envMap: this.envMap,
      metalness: 0.2,
      opacity: 0.7,
      refractionRatio: 1.9,
      roughness: 0.2,
      transparent: true,
      side: THREE.BackSide,
      // depthTest: false,
      // depthWrite: false,
    } );

    this.liquidMat = new THREE.MeshStandardMaterial( {
      color: liquidColor,
      envMap: this.envMap,
      metalness: 0.0,
      opacity: 0.6,
      refractionRatio: 1.3,
      roughness: 0.3,
      transparent: true,
    } );

    this.liquidBackMat = new THREE.MeshStandardMaterial( {
      color: liquidColor,
      envMap: this.envMap,
      metalness: 0.0,
      opacity: 0.6,
      refractionRatio: 1.3,
      roughness: 0.3,
      transparent: true,
      side: THREE.BackSide,
    } );

    this.liquidTopMat = new THREE.MeshStandardMaterial( {
      color: liquidColor,
      envMap: this.envMap,
      metalness: 0.0,
      opacity: 0.2,
      refractionRatio: 1.3,
      roughness: 0.3,
      transparent: true,
    } );

    this.liquidTopBackMat = new THREE.MeshStandardMaterial( {
      color: liquidColor,
      envMap: this.envMap,
      metalness: 0.0,
      opacity: 0.2,
      refractionRatio: 1.3,
      roughness: 0.3,
      transparent: true,
      side: THREE.BackSide,
    } );

    this.smileyMat = new THREE.MeshBasicMaterial( {
      map: this.smileyTexture,
      transparent: true,
    } );

    this.labelmat = new THREE.MeshStandardMaterial( {
      color: 0x7279a5,
      envMap: this.envMap,
      map: this.labelMap,
      metalness: 0.2,
      roughness: 0.8,
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
    this.bottleGroup.scale.set( 20, 20, 20 );
    this.app.scene.add( this.bottleGroup );

    fileLoader.load( '/assets/models/hidden/bottle/bottle.json', ( json ) => {
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

      const bottleExterior = new THREE.Mesh( geometries.bottle, this.bottleExteriorMat );
      const bottleExteriorBack = new THREE.Mesh( geometries.bottle, this.bottleExteriorBackMat );

      const bottleInterior = new THREE.Mesh( geometries.bottle_interior, this.bottleInteriorMat );
      const bottleInteriorBack = new THREE.Mesh( geometries.bottle_interior, this.bottleInteriorBackMat );

      const liquidTop = new THREE.Mesh( geometries.liquidTop, this.liquidTopMat );
      const liquidTopBack = new THREE.Mesh( geometries.liquidTop, this.liquidTopBackMat );

      const liquid = new THREE.Mesh( geometries.liquid, this.liquidMat );
      const liquidBack = new THREE.Mesh( geometries.liquid, this.liquidBackMat );

      const underCap = new THREE.Mesh( geometries.liquidTop, this.bottleExteriorMat );
      underCap.position.set( 0, 3.9, 0 );
      underCap.scale.set( 0.69, 0.69, 0.69 );

      this.bottleGroup.add(
        cap,
        capBack,
        bottleExterior,
        // bottleExteriorBack,
        // bottleInterior,
        bottleInteriorBack,
        liquidTop,
        liquidTopBack,
        // liquid,
        liquidBack,
        underCap
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
