import * as THREE from 'three';
import Stats from 'three/examples/js/libs/stats.min';

import App from 'App/App.js';

import OrbitControls from 'modules/OrbitControls.module.js';

// import LightHelperExtended from 'utilities/three/helpers/LightHelperExtended.js';

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
  width: 100px;`;

document.body.appendChild( stats.dom );

export default class BottleCanvas {

  constructor( canvas, labelCanvas = null, backgroundColor = 0xffffff, quality = 'high' ) {

    const self = this;

    this.canvas = canvas;
    this.labelCanvas = labelCanvas;

    this.app = new App( this.canvas );

    this.app.camera.position.set( 0, 20, 320 );
    this.app.camera.near = 100;
    this.app.camera.far = 500;
    this.app.camera.updateProjectionMatrix();

    this.app.renderer.setClearColor( backgroundColor, 1.0 );

    // NOTE: uncomment these lines to render a transparent background - i.e. to draw
    // again the background color of the containing element
    // this.app.renderer.setClearColor( backgroundColor, 0.0 );
    // this.app.renderer.alpha = true;

    // NOTE: this means that the order in which the objects are added determines the render
    // order (for transparency), since the built in method was failing (does not render liquid)
    // *may* also marginally improve performance
    this.app.renderer.sortObjects = false;

    // Put any per frame calculation here
    this.app.onUpdate = function () {
      // NB: use self inside this function

      self.bottleGroup.rotateY( -self.app.delta * 0.001 );

      // required if using 'damping' in controls
      self.controls.update();

      // remove if no longer using stats
      if ( stats ) stats.update();

      if ( this.labelMap ) this.labelMap.needsUpdate = true;

      // Helper Extended test
      // console.log( self.spot.name );

    };

    // put any per resize calculations here (throttled to once per 250ms)
    this.app.onWindowResize = function () {
      // NB: use self inside this function
    };

    this.initLights();

    this.initTextures();

    switch ( quality ) {
      case 'high':
        this.initMaterialsHigh();
        break;
      default: // "low""
        this.initMaterialsLow();
    }

    this.initBottle();

    // this.initSmiley();
    // this.initLabel();

    this.initControls();

    // App has play / pause / stop functions
    this.app.play();

  }

  initLights() {
    const spot = new THREE.SpotLight( 0xffffff, 7, 500, Math.PI / 5, 0.9, 2.5 );
    spot.position.set( -15, 130, -180 );
    this.app.scene.add( spot, spot.target );
    // const lhSpot = new LightHelperExtended( spot, true, true );

    // this.spot = spot;

    const hemi = new THREE.HemisphereLight( 0x000000, 0xffffff, 0.75 );
    this.app.scene.add( hemi );
    // const lhHemi = new LightHelperExtended( hemi, true, true );

    // const ambient = new THREE.AmbientLight( 0x404040, 1.0 );
    // this.app.scene.add( ambient );
    // const lhAmbient = new LightHelperExtended( ambient, true, true );

    // const directional = new THREE.DirectionalLight( 0xffffff, 0.5 );
    // this.app.scene.add( directional );
    // const lhHemi = new LightHelperExtended( directional, true, true );

    // const point = new THREE.PointLight( 0xff0000, 1, 100, 2 );
    // this.app.scene.add( point );
    // const lhPoint = new LightHelperExtended( point, true, true );

    // const rectArea = new THREE.RectAreaLight( 0xffffff, 1.0, 100, 200 );
    // this.app.scene.add( rectArea );
    // const lhPoint = new LightHelperExtended( rectArea, true, true );
  }

  initTextures() {
    this.envMap = textureLoader.load( '/assets/images/textures/env_maps/grey_room.jpg' );
    this.envMap.mapping = THREE.EquirectangularRefractionMapping;

    this.smileyTexture = textureLoader.load( '/assets/images/textures/work/bottle/carlsberg-smiley-dark.png' );

    this.labelMap = this.labelCanvas ? new THREE.CanvasTexture( this.labelCanvas ) : null;
  }

  initBottle() {
    this.bottleGroup = new THREE.Group();
    this.bottleGroup.position.set( 0, -1, 0 );
    this.bottleGroup.scale.set( 20, 20, 20 );
    this.app.scene.add( this.bottleGroup );

    fileLoader.load( '/assets/models/work/bottle/bottle.json', ( json ) => {
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

      const bottle = new THREE.Mesh( geometries.bottle, this.bottleMat );
      const bottleInterior = new THREE.Mesh( geometries.bottle_interior, this.bottleMatInterior );

      const liquid = new THREE.Mesh( geometries.liquid, this.liquidMat );
      const liquidTop = new THREE.Mesh( geometries.liquidTop, this.liquidMat );

      this.bottleGroup.add(
        cap,
        capBack,
        liquidTop,
        liquid,
        bottle,
        bottleInterior
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

    controls.enableZoom = false;
    controls.enablePan = false;

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

  initMaterialsHigh() {
    const glassColor = 0x371805;

    this.capMat = new THREE.MeshLambertMaterial( {
      color: 0xffffff,
      emissive: 0x606060,
      envMap: this.envMap,
      side: THREE.BackSide,

      // Lambert
      reflectivity: 0.15,
    } );

    this.capBackMat = new THREE.MeshBasicMaterial( {
      color: 0x505050,
    } );

    this.bottleMat = new THREE.MeshLambertMaterial( {
      color: glassColor,
      opacity: 0.85,
      transparent: true,
    } );

    this.bottleMatInterior = new THREE.MeshStandardMaterial( {
      color: glassColor,
      envMap: this.envMap,
      envMapIntensity: 0.1,
      opacity: 0.7,
      refractionRatio: 1.9,
      transparent: true,

      // STANDARD
      metalness: 0.4,
      roughness: 0.15,
    } );

    this.liquidMat = new THREE.MeshLambertMaterial( {
      color: 0x8c3e13, // 0x8c3e13 0x58360d 0xd15c1a
      opacity: 0.8,
      transparent: true,
    } );
  }

  initMaterialsLow() {
    const glassColor = 0x371805;

    this.capMat = new THREE.MeshLambertMaterial( {
      color: 0xffffff,
      emissive: 0x808080,
      envMap: this.envMap,
      side: THREE.BackSide,

      // Lambert
      reflectivity: 0.15,
    } );

    this.capBackMat = new THREE.MeshBasicMaterial( {
      color: 0x505050,
    } );

    this.bottleMat = new THREE.MeshLambertMaterial( {
      color: glassColor,
      opacity: 0.85,
      transparent: true,
    } );

    this.bottleMatInterior = new THREE.MeshLambertMaterial( {
      color: glassColor,
      envMap: this.envMap,
      opacity: 0.7,

      transparent: true,

      // LAMBERT
      reflectivity: 0.3,
    } );

    this.liquidMat = new THREE.MeshLambertMaterial( {
      color: 0x8c3e13,
      opacity: 0.8,
      transparent: true,
    } );
  }
}
