import * as THREE from 'three';

import App from 'App/App.js';

import addModelInfo from './utilities/addModelInfo.js';

import Loaders from './utilities/Loaders.js';

import errorHandler from  './utilities/errorHandler.js';

/* ******************************************************** */

// Set up THREE caching
THREE.Cache.enabled = true;

class LoaderCanvas {

  constructor( canvas ) {

    // const self = this;

    this.loaders = new Loaders();

    this.canvas = canvas;

    this.app = new App( this.canvas );

    this.app.renderer.setClearColor( 0xf7f7f7, 1.0 );

    this.app.camera.far = 10000;
    

    // Put any per frame calculation here
    this.app.onUpdate = function () {

      // NB: use self inside this function

    };

    // put any per resize calculations here (throttled to once per 250ms)
    this.app.onWindowResize = function () {

      // NB: use self inside this function

    };

    this.initLights();

    this.app.initControls();

    this.loadMaps();
    this.initMaterials();

    this.loadFBXObject();
    // this.loadOBJObject();

    this.initFloor();

    this.setupControls();

  }

  initLights() {

    const ambientLight = new THREE.AmbientLight( 0xffffff, 0.2 );
    this.app.scene.add( ambientLight );

    // ****  METHOD 1:   3 POINT LIGHTING ***************************
    // Traditional 3 point light setup - slightly more expensive due to
    // two extra lights

    const backLight = new THREE.DirectionalLight( 0xffffff, 0.325 );
    backLight.position.set( 3, 1, -3 );

    const keyLight = new THREE.DirectionalLight( 0xffffff, 0.475 );
    keyLight.position.set( -2, -1, 0 );

    const fillLight = new THREE.DirectionalLight( 0xffffff, 0.65 );
    fillLight.position.set( 3, 3, 2 );

    this.app.scene.add( backLight, keyLight, fillLight );


    // ****  METHOD 2:   CAMERA LIGHT ***********************************
    // Visually similar to 3 point lighting, but cheaper as only two lights
    // are needed - use this if performance is low

    // const pointLight = new THREE.PointLight( 0xffffff, 0.7, 0, 0 );
    // this.app.camera.add( pointLight );
    // this.app.scene.add( this.app.camera );

  }


  addObjectToScene( object ) {

    if ( object === undefined ) {

      errorHandler( 'Oops! An unspecified error occurred :(' );
      return;

    }

    this.app.fitCameraToObject( object );

    this.app.scene.add( object );

    this.app.play();

    addModelInfo( this.app.renderer );

    document.querySelector( '#loading-overlay' ).classList.add( 'hide' );

  }

  loadMaps() {
    // this.envMap = this.loaders.textureLoader.load( '/assets/images/textures/env_maps/grey_room.jpg' );
    // this.envMap = this.loaders.textureLoader.load( '/assets/images/textures/env_maps/grey_lights.jpg' );
    // this.envMap = this.loaders.textureLoader.load( '/assets/images/textures/env_maps/studio_setup.jpg' );
    this.envMap = this.loaders.textureLoader.load( '/assets/images/textures/env_maps/test_env_map.jpg' );
    // this.envMap = this.loaders.textureLoader.load( '/assets/images/textures/env_maps/very_grey.jpg' );

    this.envMap.mapping = THREE.EquirectangularReflectionMapping;

    this.floorMap = this.loaders.textureLoader.load( '/assets/images/textures/hidden/floorReflection.png' );
  }

  initMaterials() {

    this.materials = {
      
      // transparent stem
      Glas: new THREE.MeshStandardMaterial( {

        envMap: this.envMap,
        envMapIntensity: 0.4,
        transparent: true,
        opacity: 0.7,
        color: 0xffffff,

      } ),


      // red plastic
      glossy_red01: new THREE.MeshStandardMaterial( {

        envMap: this.envMap,
        envMapIntensity: 0.7,
        color: 0xd60000,
        side: THREE.DoubleSide,

        // STANDARD
        metalness: 0.1,
        roughness: 0.4,

      } ),

      // inner grey rim
      'Plastik Mittelgl': new THREE.MeshStandardMaterial( {

        // envMap: this.envMap,
        // envMapIntensity: 0.8,

        color: 0xcccccc,
        side: THREE.DoubleSide,

        // STANDARD
        metalness: 0.1,
        roughness: 0.4,

      } ),

      // inner top black plastic
      'Schwarz Matt': new THREE.MeshStandardMaterial( {

        color: 0x333333,
        side: THREE.DoubleSide,

        // STANDARD
        metalness: 0.1,
        roughness: 0.4,

      } ),

      floorMat: new THREE.MeshStandardMaterial( {

        transparent: true,
        opacity: 0.15,
        color: 0xffffff,
        map: this.floorMap,

        // side: THREE.DoubleSide,

        // STANDARD
        metalness: 0.1,
        roughness: 0.4,

      } ),

    };

  }

  initFloor() {

    const floorGeo = new THREE.PlaneBufferGeometry( 265, 265, 4, 4 );
    floorGeo.rotateX( -Math.PI / 2 );
    floorGeo.rotateY( Math.PI / 2 );
    floorGeo.translate( 71, 0, 42.8 );
    const floorMesh = new THREE.Mesh( floorGeo, this.materials.floorMat );
    this.app.scene.add( floorMesh );

  }

  loadFBXObject() {

    const url = '/assets/models/viewer_temp/product_scaled.fbx';

    console.log( 'Starting model load' );
    console.time( 'load' );
    this.loaders.fbxLoader.load( url,
      ( result ) => {

        console.log( 'Loading finished' );
        console.timeEnd( 'load' );

        const object = result.children[0];

        object.traverse( ( child ) => {

          if ( child.material !== undefined ) {

            child.material = this.materials[ child.material.name ];

          }

        } );

        this.addObjectToScene( object );

      },
      ( progress ) => {

        // set up loading bar here if desired

      },
      ( error ) => { errorHandler( error ); },

    );

  }

  loadOBJObject() {

    const objURL = '/assets/models/viewer_temp/product_scaled.obj';

    const objLoader = this.loaders.objLoader2;

    objLoader.setMaterials( this.materials );

    objLoader.load( objURL,
      ( result ) => {

        this.addObjectToScene( result );

      },
      ( progress ) => {},
      ( error ) => { console.error( error ); }

    );

  }

  setupControls() {

    const controls = this.app.controls;

    // How far you can dolly in and out
    controls.minDistance = 80;
    controls.maxDistance = 200;

    // How far you can orbit vertically, upper and lower limits.
    // Range is 0 to Math.PI radians.
    // controls.minPolarAngle = 0; // radians
    // controls.maxPolarAngle = Math.PI * 0.5; // radians

    // How far you can orbit horizontally, upper and lower limits.
    // If set, must be a sub-interval of the interval [ - Math.PI, Math.PI ].
    // controls.minAzimuthAngle = - Math.PI / 2; // radians
    // controls.maxAzimuthAngle = Math.PI / 2; // radians
  }

}

const canvas = document.querySelector( '#viewer-canvas' );

const loaderCanvas = new LoaderCanvas( canvas );

export default loaderCanvas;
