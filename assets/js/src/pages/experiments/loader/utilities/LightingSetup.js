import * as THREE from 'three';
import throttle from 'lodash.throttle';
import HTMLControl from './HTMLControl.js';

export default class LightingSetup {

  constructor( app ) {

    this.app = app;

    this.initLights();

    this.initSlider();

    this.initialStrength = this.pointLight.intensity;

    HTMLControl.lighting.slider.value = String( this.pointLight.intensity );

  }

  initLights() {

    const ambientLight = new THREE.AmbientLight( 0xffffff, 0.2 );
    this.app.scene.add( ambientLight );
    ambientLight.userData.keepOnReset = true;

    // ****  METHOD 1:   3 POINT LIGHTING ***************************
    // Traditional 3 point light setup - slightly more expensive due to
    // two extra lights

    // const backLight = new THREE.DirectionalLight( 0xffffff, 0.325 );
    // backLight.position.set( 2.6, 1, 3 );

    // const keyLight = new THREE.DirectionalLight( 0xffffff, 0.475 );
    // keyLight.position.set( -2, -1, 0 );

    // const fillLight = new THREE.DirectionalLight( 0xffffff, 0.65 );
    // fillLight.position.set( 3, 3, 2 );

    // this.app.scene.add( backLight, keyLight, fillLight );


    // ****  METHOD 2:   CAMERA LIGHT ***********************************
    // Visually similar to 3 point lighting, but cheaper as only two lights
    // are needed

    this.pointLight = new THREE.PointLight( 0xffffff, 0.7, 0, 0 );
    this.pointLight.userData.keepOnReset = true;
    this.app.camera.add( this.pointLight );
    this.app.scene.add( this.app.camera );

    this.app.camera.userData.keepOnReset = true;
  }

  initSlider() {

    this.sliderInputEvent = throttle( ( e ) => {

      e.preventDefault();
      this.pointLight.intensity = HTMLControl.lighting.slider.value;

    }, 100 );

    HTMLControl.lighting.slider.addEventListener( 'input', this.sliderInputEvent, false );

    this.symbolClickEvent = throttle( ( e ) => {

      e.preventDefault();
      this.reset();

    }, 100 );

    HTMLControl.lighting.symbol.addEventListener( 'click', this.symbolClickEvent, false );

  }

  reset( ) {

    this.pointLight.intensity = this.initialStrength;
    HTMLControl.lighting.slider.value = String( this.pointLight.intensity );

    // HTMLControl.lighting.slider.removeEventListener( 'input', this.sliderInputEvent, false );
    // HTMLControl.lighting.symbol.removeEventListener( 'click', this.symbolClickEvent, false );

  }

}