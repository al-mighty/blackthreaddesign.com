import * as THREE from 'three';

export default class LightingSetup {

  constructor( app ) {

    this.app = app;

    this.initLights();

  }

  initLights() {

    const ambientLight = new THREE.AmbientLight( 0xffffff, 0.3 );
    this.app.scene.add( ambientLight );

    // ****  METHOD 1:   3 POINT LIGHTING ***************************
    // Traditional 3 point light setup - slightly more expensive due to
    // two extra lights

    const backLight = new THREE.DirectionalLight( 0xffffff, 0.4 );
    backLight.position.set( 130, 200, 150 );
    // backLight.castShadow = true;
    // backLight.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 40, 1, 1, 10000 ) );
    // backLight.shadow.bias = -0.000222;
    // backLight.shadow.mapSize.width = 2048;
    // backLight.shadow.mapSize.height = 2048;


    const keyLight = new THREE.DirectionalLight( 0xffffff, 0.4 );
    keyLight.position.set( 100, 50, 0 );
    // keyLight.castShadow = true;
    // keyLight.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 70, 1, 1, 2000 ) );
    // keyLight.shadow.bias = 0.000222;
    // keyLight.shadow.mapSize.width = 2048;
    // keyLight.shadow.mapSize.height = 2048;

    const fillLight = new THREE.DirectionalLight( 0xffffff, 0.4 );
    fillLight.position.set( 75, 75, 50 );
    // fillLight.castShadow = true;
    // fillLight.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 70, 1, 1, 2000 ) );
    // fillLight.shadow.bias = 0.0001;
    // fillLight.shadow.mapSize.width = 2048;
    // fillLight.shadow.mapSize.height = 2048;

    this.app.scene.add( backLight, keyLight, fillLight );


    // ****  METHOD 2:   CAMERA LIGHT ***********************************
    // Visually similar to 3 point lighting, but cheaper as only two lights
    // are needed

    // this.pointLight = new THREE.PointLight( 0xffffff, 0.5, 0, 0 );
    // this.app.camera.add( this.pointLight );
    // this.app.scene.add( this.app.camera );

  }

}