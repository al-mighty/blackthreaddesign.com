
import StatisticsOverlay from '../StatisticsOverlay.js';
import App from '../App.js';
import OrbitControls from '../controls/OrbitControls.js';

import backgroundVert from '../shaders/splashBackground.vert';
import backgroundFrag from '../shaders/splashBackground.frag';

import { pointerPos } from '../../utilities.js';

function generateTextGeometry(text, params) {
  const geometry = new THREE.TextGeometry(text, params);

  geometry.computeBoundingBox();

  const size = geometry.boundingBox.getSize();
  const anchorX = size.x * -params.anchor.x;
  const anchorY = size.y * -params.anchor.y;
  const anchorZ = size.z * -params.anchor.z;
  const matrix = new THREE.Matrix4().makeTranslation(anchorX, anchorY, anchorZ);

  geometry.applyMatrix(matrix);

  return geometry;
}

export default class SplashHero {

  constructor( showStats ) {

    const self = this;

    self.canvas = document.querySelector( '#splash-hero-canvas' );

    self.container = document.querySelector( '#splash-hero-container' );

    self.app = new App( self.canvas );

    // self.app.camera.far = 100;
    self.app.camera.position.set( 0, 0, 300 );

    // TODO: not working in Edge
    let statisticsOverlay;
    if ( showStats ) statisticsOverlay = new StatisticsOverlay( self.app, self.container );

    //self.addBackground();

    self.addText();

    self.addControls();

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
      //updateMaterial();

      if ( showStats ) statisticsOverlay.updateStatistics( self.app.delta );

    };

    self.app.onWindowResize = function () {};

    self.app.play();

    // Pause if the canvas is not onscreen
    window.addEventListener( 'scroll', () =>  {
      if ( ! self.app.isPaused && window.scrollY > (self.canvas.offsetTop + self.canvas.clientHeight) ) {
        self.app.pause();
      } else if ( self.app.isPaused ) {
        self.app.play();
      }
    });

  }

  addControls() {
    this.controls = new OrbitControls( this.app.camera, this.app.renderer.domElement );
  }

  addText() {
    const self = this;

    const loader = new THREE.FontLoader();
    const textMat = new THREE.MeshBasicMaterial( {color: 0xffffff } );
    loader.load( 'assets/fonts/json/droid_sans_mono_regular.typeface.json', function ( response ) {
      const textGeometry = generateTextGeometry( 'Black Thread Design', {
        size:40,
        height:3,
        font: response,
        weight:'normal',
        style:'normal',
        curveSegments:24,
        bevelSize:2,
        bevelThickness:2,
        bevelEnabled:true,
        anchor:{x:0.5, y:0.5, z:0.0}
      });


      const textMesh = new THREE.Mesh( textGeometry, textMat );

      textMesh.position.set( 0, 0, 10 );

      self.app.scene.add( textMesh );
    } );

  }
  
  addBackground() {
    this.backgroundMat = this.initBackgroundMat( );
    const geometry = new THREE.PlaneBufferGeometry( 2, 2, 1 );

    const mesh = new THREE.Mesh( geometry, this.backgroundMat );
    mwesh.position.set( 0, 0, -1 );
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
