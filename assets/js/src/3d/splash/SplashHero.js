
import StatisticsOverlay from '../StatisticsOverlay.js';
import App from '../App.js';

import backgroundVert from '../shaders/splashBackground.vert';
import backgroundFrag from '../shaders/splashBackground.frag';

import { pointerPos } from '../../utilities.js';

export default class SplashHero {

  constructor() {

    const canvas = document.querySelector( '#splash-hero-canvas' );

    const container = document.querySelector( '#splash-hero-container' );

    const app = new App( canvas );

    app.camera.far = 5;

    // TODO: not working in Edge
    const statisticsOverlay = new StatisticsOverlay( app, container );


    const material = this.initMaterial( );
    const geometry = new THREE.PlaneBufferGeometry( 2, 2, 1 );

    const mesh = new THREE.Mesh( geometry, material );

    app.scene.add( mesh );

    const updateMaterial = function () {
        // For some reason pan events on mobile sometimes register as (0,0); ignore these
        if ( pointerPos.x !== 0 && pointerPos.y !== 0 ) {
            const offsetX = pointerPos.x / app.canvas.clientWidth;
            let offsetY = 1 - pointerPos.y / app.canvas.clientHeight;

            // make the line well defined when moving the pointer off the top of the screen
            offsetY = ( offsetY > 0.99 ) ? 0.999 : offsetY;

            material.uniforms.offset.value = [offsetX, offsetY];
            material.uniforms.smooth.value = [1, offsetY];

        }
    };

    app.onUpdate = function () {
      updateMaterial();

      statisticsOverlay.updateStatistics( app.delta );

    };

    // app.onWindowResize = function () {};

    app.play();

  }

  initMaterial( ) {
    const loader = new THREE.TextureLoader();
    const noiseTexture = loader.load( '/assets/images/textures/noise-1024.jpg' );
    noiseTexture.wrapS = noiseTexture.wrapT = THREE.RepeatWrapping;
    // noiseTexture.premultiplyAlpha = true;
    // noiseTexture.repeat = [10.5, 10.5];
    // noiseTexture.offset = [100.0, 1.0];

    const uniforms = {

      noiseTexture: { value: noiseTexture },
      offset: { value: new THREE.Vector2( 0, 0 ) },
      smooth: { value: new THREE.Vector2( 0.0, 1.0 ) },
      color1: { value: new THREE.Color( 0xffffff ) },
      color2: { value: new THREE.Color( 0x283844 ) },

    };

    return new THREE.RawShaderMaterial( {
      uniforms,
      vertexShader: backgroundVert,
      fragmentShader: backgroundFrag,
      side: THREE.DoubleSide,
      transparent: true,
    } );

  }

}
