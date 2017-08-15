import * as THREE from 'three';
import throttle from 'lodash.throttle';
// import HTMLControl from './HTMLControl.js';

export default class LightingSetup {

  constructor( app ) {

    this.app = app;

    this.initLights();

  }

  initLights() {

    const ambientLight = new THREE.AmbientLight( 0xffffff, 0.35 );
    this.app.scene.add( ambientLight );

    // ****  METHOD 1:   3 POINT LIGHTING ***************************
    // Traditional 3 point light setup - slightly more expensive due to
    // two extra lights

    const backLight = new THREE.DirectionalLight( 0xffffff, 0.325 );
    backLight.position.set( 130, 100, 150 );
    // backLight.castShadow = true;
    // backLight.shadow.mapSize.width = 2048;
    // backLight.shadow.mapSize.height = 2048;
    // backLight.shadow.camera.near = 0.5;
    // backLight.shadow.camera.far = 1500;
    // backLight.shadow.camera.updateProjectionMatrix();

    const keyLight = new THREE.DirectionalLight( 0xffffff, 0.375 );
    keyLight.position.set( 100, 50, 0 );
    // keyLight.castShadow = true;
    // keyLight.shadow.mapSize.width = 2048;
    // keyLight.shadow.mapSize.height = 2048;
    // keyLight.shadow.camera.near = 0.5;
    // keyLight.shadow.camera.far = 1500;
    // keyLight.shadow.camera.updateProjectionMatrix();

    const fillLight = new THREE.DirectionalLight( 0xffffff, 0.3 );
    fillLight.position.set( 75, 75, 50 );

    // fillLight.castShadow = true;
    // fillLight.shadow.bias = 0.0001;
    // fillLight.shadow.mapSize.width = 2048;
    // fillLight.shadow.mapSize.height = 2048;
    // fillLight.shadow.camera.near = 0.5;
    // fillLight.shadow.camera.far = 1500;
    // fillLight.shadow.camera.updateProjectionMatrix();

    this.app.scene.add( backLight, keyLight, fillLight );


    // ****  METHOD 2:   CAMERA LIGHT ***********************************
    // Visually similar to 3 point lighting, but cheaper as only two lights
    // are needed

    // this.pointLight = new THREE.PointLight( 0xffffff, 0.7, 0, 0 );
    // this.app.camera.add( this.pointLight );
    // this.app.scene.add( this.app.camera );

  }

}