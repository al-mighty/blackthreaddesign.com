import * as THREE from 'three';
import StatisticsOverlay from '../StatisticsOverlay.js';
import App from '../App.js';
import OrbitControls from '../controls/OrbitControls.js';

import backgroundVert from '../shaders/splashBackground.vert';
import backgroundFrag from '../shaders/splashBackground.frag';
import textVert from '../shaders/splashText.vert';
import textFrag from '../shaders/splashText.frag';

import { pointerPos } from '../../utilities.js';

function generateTextGeometry( text, params ) {
  const geometry = new THREE.TextGeometry( text, params );

  geometry.computeBoundingBox();

  const size = geometry.boundingBox.getSize();
  const anchorX = size.x * -params.anchor.x;
  const anchorY = size.y * -params.anchor.y;
  const anchorZ = size.z * -params.anchor.z;
  const matrix = new THREE.Matrix4().makeTranslation( anchorX, anchorY, anchorZ );

  geometry.applyMatrix( matrix );

  return geometry;
}

export default class SplashHero {

  constructor( showStats ) {

    const self = this;

    self.canvas = document.querySelector( '#splash-hero-canvas' );
    self.container = document.querySelector( '#splash-hero-container' );

    self.app = new App( self.canvas );

    // self.app.camera.far = 100;
    self.app.camera.position.set( 0, 0, 500 );

    self.colorA = new THREE.Color( 0xffffff );
    self.colorB = new THREE.Color( 0x283844 );

    // TODO: not working in Edge
    let statisticsOverlay;
    if ( showStats ) statisticsOverlay = new StatisticsOverlay( self.app, self.container );

    const rtOptions = {
      wrapS: THREE.RepeatWrapping,
      wrapT: THREE.RepeatWrapping,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBFormat,
      depthBuffer: false,
      stencilBuffer: false,
    };

    const textureSize = THREE.Math.nextPowerOfTwo( Math.max( self.canvas.clientWidth, self.canvas.clientHeight ) );
    console.log( textureSize );

    this.bgRenderTarget = new THREE.WebGLRenderTarget( textureSize, textureSize, rtOptions );
    this.textRenderTarget = new THREE.WebGLRenderTarget( textureSize, textureSize, rtOptions );
    // this.textRenderTarget.texture.repeat.set( 0.001, 0.006 );
    self.addBackground();

    self.addText();

    self.addControls();

    const updateMaterials = function () {
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

    self.app.scene.background = this.bgRenderTarget.texture;

    self.num = 3;

    self.app.onUpdate = function () {
      updateMaterials();

      self.bgMesh.visible = true;
      self.backgroundMat.uniforms.color1.value = self.colorB;
      self.backgroundMat.uniforms.color2.value = self.colorA;
      self.app.renderer.render( self.app.scene, self.app.camera, self.textRenderTarget, false );
      self.backgroundMat.uniforms.color1.value = self.colorA;
      self.backgroundMat.uniforms.color2.value = self.colorB;
      self.app.renderer.render( self.app.scene, self.app.camera, self.bgRenderTarget, false );
      self.bgMesh.visible = false;


    //   if(self.num) {
    //       self.num -= 1;
    //       console.log (self.bgRenderTarget.texture);
    //       window.open( self.app.renderer.domElement.toDataURL( 'image/png' ), 'screenshot' );
    //   }

      if ( showStats ) statisticsOverlay.updateStatistics( self.app.delta );

    };

    self.app.onWindowResize = function () {
      this.bgRenderTarget.setSize( self.canvas.clientHeight, self.canvas.clientHeight );
      this.textRenderTarget.setSize( self.canvas.clientHeight, self.canvas.clientHeight );
    };

    self.app.play();

    // Pause if the canvas is not onscreen
    window.addEventListener( 'scroll', () => {
      if ( !self.app.isPaused && window.scrollY > ( self.canvas.offsetTop + self.canvas.clientHeight ) ) {
        self.app.pause();
      } else if ( self.app.isPaused ) {
        self.app.play();
      }
    } );

  }

  addControls() {
    this.controls = new OrbitControls( this.app.camera, this.app.renderer.domElement );
  }

  addBackground() {
    this.backgroundMat = this.initBackgroundMat( );
    const geometry = new THREE.PlaneGeometry( 2, 2, 1 );
    this.bgMesh = new THREE.Mesh( geometry, this.backgroundMat );
    this.app.scene.add( this.bgMesh );
  }


  initBackgroundMat( ) {
    const loader = new THREE.TextureLoader();
    const noiseTexture = loader.load( '/assets/images/textures/noise-1024.jpg' );
    noiseTexture.wrapS = noiseTexture.wrapT = THREE.RepeatWrapping;

    const uniforms = {

      noiseTexture: { value: noiseTexture },
      offset: { value: new THREE.Vector2( 0, 0 ) },
      smooth: { value: new THREE.Vector2( 0.0, 1.0 ) },
      color1: { value: this.colorA },
      color2: { value: this.colorB },

    };

    return new THREE.RawShaderMaterial( {
      uniforms,
      vertexShader: backgroundVert,
      fragmentShader: backgroundFrag,
      // side: THREE.DoubleSide,
      // transparent: true,
    } );

  }

  addText() {
    const self = this;

    const loader = new THREE.FontLoader();
    // this.textMat = new THREE.MeshBasicMaterial( { color: 0xffffff, map: this.textRenderTarget.texture } ); // this.initTextMat();
    this.textMat = this.initTextMat();


    loader.load( 'assets/fonts/json/droid_sans_mono_regular.typeface.json', ( response ) => {
      const textGeometry = generateTextGeometry( 'Black Thread Design', {
        size: 40,
        height: 3,
        font: response,
        weight: 'normal',
        style: 'normal',
        curveSegments: 24,
        bevelSize: 2,
        bevelThickness: 2,
        bevelEnabled: true,
        anchor: { x: 0.5, y: 0.5, z: 0.0 },
      } );

      const textMesh = new THREE.Mesh( textGeometry, self.textMat );

      textMesh.position.set( 0, 0, 100 );

      self.app.scene.add( textMesh );
    } );

  }

  initTextMat( ) {
    const loader = new THREE.TextureLoader();
    const noiseTexture = loader.load( '/assets/images/textures/noise-1024.jpg' );
    noiseTexture.wrapS = noiseTexture.wrapT = THREE.RepeatWrapping;

    const uniforms = {
      map: { value: this.textRenderTarget.texture },
    };

    return new THREE.ShaderMaterial( {
      uniforms,
      vertexShader: textVert,
      fragmentShader: textFrag,
      // side: THREE.DoubleSide,
      // transparent: true,
    } );

  }

}
