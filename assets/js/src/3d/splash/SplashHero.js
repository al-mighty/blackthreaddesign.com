
import StatisticsOverlay from '../StatisticsOverlay.js';
import App from '../App.js';

import backgroundVert from '../shaders/splashBackground.vert';
import backgroundFrag from '../shaders/splashBackground.frag';

import { pointerPos } from '../../utilities.js';

export default class SplashHero {

  constructor( showStats ) {

    const self = this;

    self.canvas = document.querySelector( '#splash-hero-canvas' );

    self.container = document.querySelector( '#splash-hero-container' );

    self.app = new App( self.canvas );

    // self.app.camera.far = 100;
    self.app.camera.position.set( 0, 0, 400);

    // TODO: not working in Edge
    let statisticsOverlay;
    if ( showStats ) statisticsOverlay = new StatisticsOverlay( app, container );

    self.addBackground();

    self.addText();

    const updateMaterial = function () {
        // For some reason pan events on mobile sometimes register as (0,0); ignore these
        if ( pointerPos.x !== 0 && pointerPos.y !== 0 ) {
            const offsetX = pointerPos.x / self.app.canvas.clientWidth;
            let offsetY = 1 - pointerPos.y / self.app.canvas.clientHeight;

            // make the line well defined when moving the pointer off the top of the screen
            offsetY = ( offsetY > 0.99 ) ? 0.999 : offsetY;

            self.backgroundMat.uniforms.offset.value = [offsetX, offsetY];
            self.backgroundMat.uniforms.smooth.value = [1, offsetY];

        }
    };

    self.app.onUpdate = function () {
      updateMaterial();

      if ( showStats ) statisticsOverlay.updateStatistics( self.app.delta );

    };

    self.app.onWindowResize = function () {};

    self.app.play();

    //Pause if the canvas is not onscreen
    window.addEventListener( 'scroll', () =>  {
      if ( ! self.app.isPaused && window.scrollY > (self.canvas.offsetTop + self.canvas.clientHeight) ) {
        self.app.pause();
      } else if ( self.app.isPaused ) {
        self.app.play();
      }
    });

  }

  addText() {
    const self = this;
    
    const loader = new THREE.FontLoader();
    const textMat = new THREE.MeshBasicMaterial( {color: 0xffffff } );
    loader.load( 'assets/fonts/json/droid_sans_mono_regular.typeface.json', function ( response ) {
      const textGeometry = new THREE.TextGeometry( 'Black Thread Design', {
        font: response,
        size: 14,
        height: 0,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 10,
        bevelSize: 8,
        bevelSegments: 5
      } );

      textGeometry.computeBoundingBox();
			textGeometry.computeVertexNormals();

      const textMesh = new THREE.Mesh( textGeometry, textMat );

      // console.log(textMesh);
      textMesh.position.set( 0, -40, 0)

      self.app.scene.add( textMesh );
    } );

  }
  
  addBackground() {
    this.backgroundMat = this.initBackgroundMat( );
    const geometry = new THREE.PlaneBufferGeometry( 2, 2, 1 );

    const mesh = new THREE.Mesh( geometry, this.backgroundMat );

    this.app.scene.add( mesh );
  }


  initBackgroundMat( ) {
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
