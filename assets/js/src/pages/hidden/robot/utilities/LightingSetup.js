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

    const backLight = new THREE.DirectionalLight( 0xffffff, 0.325 );
    backLight.position.set( 130, 100, 150 );

    const keyLight = new THREE.DirectionalLight( 0xffffff, 0.375 );
    keyLight.position.set( 100, 50, 0 );

    const fillLight = new THREE.DirectionalLight( 0xffffff, 0.3 );
    fillLight.position.set( 75, 75, 50 );

    this.app.scene.add( backLight, keyLight, fillLight );


    // ****  METHOD 2:   CAMERA LIGHT ***********************************
    // Visually similar to 3 point lighting, but cheaper as only two lights
    // are needed

    // this.pointLight = new THREE.PointLight( 0xffffff, 0.7, 0, 0 );
    // this.app.camera.add( this.pointLight );
    // this.app.scene.add( this.app.camera );

  }

}