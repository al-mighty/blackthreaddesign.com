import * as THREE from 'three';

import threeUtils from '../../App/threeUtils.js';
import utils from '../../../utilities.js';
import './splashCanvasSetup.js';

import StatisticsOverlay from '../../App/StatisticsOverlay.js';
import App from '../../App/App.js';
// import OrbitControls from '../../modules/OrbitControls.module.js';

import backgroundVert from './shaders/background.vert';
import backgroundFrag from './shaders/background.frag';
import textVert from './shaders/text.vert';
import textFrag from './shaders/text.frag';

import { randomPointInDisk, randomPointInSphere, cameraZPos, createTextGeometry } from './splashCanvasHelpers.js';





export default class SplashCanvas {

  constructor( showStats ) {

    const self = this;

    self.container = document.querySelector( '#splash-hero-container' );

    self.app = new App( document.querySelector( '#splash-hero-canvas' ) );

    self.app.camera.position.set( 0, 0, cameraZPos( self.app.camera.aspect ) );

    // TODO: not working in Edge
    let statisticsOverlay;
    if ( showStats ) statisticsOverlay = new StatisticsOverlay( self.app, self.container );

    self.initMaterials();

    self.addBackground();

    self.addText();

    this.pauseWhenOffscreen();

    let mastHeadHeight = document.querySelector( '.masthead' ).clientHeight;

    const updateMaterials = function () {
        // Pan events on mobile sometimes register as (0,0); ignore these
      if ( utils.pointerPos.x !== 0 && utils.pointerPos.y !== 0 ) {
        const offsetX = utils.pointerPos.x / self.app.canvas.clientWidth;
        let offsetY = 1 - ( utils.pointerPos.y - mastHeadHeight ) / self.app.canvas.clientHeight;

        // make the line well defined when moving the pointer off the top of the canvas
        offsetY = ( offsetY > 0.99 ) ? 0.999 : offsetY;

        self.offset.set( offsetX, offsetY );
        self.smooth.set( 1.0, offsetY );

        const pointer = threeUtils.pointerPosToCanvasCentre( self.app.canvas, mastHeadHeight );
        self.pointer.set( pointer.x, pointer.y );
      }
    };

    let uTime = 1.0;
    const minTime = 0.1;
    const animSpeed = 8000;

    const updateAnimation = function () {

      // set on repeat (for testing)
      // if ( uTime <= minTime ) uTime = 1.0;

      // Ignore large values of delta (caused by window not be being focused for a while)
      if ( uTime >= minTime && self.app.delta < 100 ) {
        uTime += ( -self.app.delta / animSpeed );
      }

      self.textMat.uniforms.uTime.value = uTime;
    };

    self.app.onUpdate = function () {
      updateMaterials();

      updateAnimation();

      if ( showStats ) statisticsOverlay.updateStatistics( self.app.delta );

    };


    self.app.onWindowResize = function () { 
      self.app.camera.position.set( 0, 0, cameraZPos( self.app.camera.aspect ) );
      mastHeadHeight = document.querySelector( '.masthead' ).clientHeight;
    };

    self.app.play();

  }

  addText() {
    const self = this;

    threeUtils.fontLoader( '/assets/fonts/json/droid_sans_mono_regular.typeface.json' )
    .then( ( font ) => {

      const textGeometry = createTextGeometry( font );

      const bufferGeometry = new THREE.BufferGeometry( textGeometry );

      self.initBufferAnimation( bufferGeometry, textGeometry );

      const textMesh = new THREE.Mesh( bufferGeometry, self.textMat );

      self.app.scene.add( textMesh );
    });

  }

  initBufferAnimation( bufferGeometry, geometry ) {
    const faceCount = geometry.faces.length;
    const vertexCount = geometry.vertices.length;

    threeUtils.setBufferGeometryIndicesFromFaces( bufferGeometry, faceCount, geometry.faces );
    threeUtils.bufferPositions( bufferGeometry, geometry.vertices );

    const aAnimation = threeUtils.createBufferAttribute( bufferGeometry, 'aAnimation', 2, vertexCount );
    const aEndPosition = threeUtils.createBufferAttribute( bufferGeometry, 'aEndPosition', 3, vertexCount );

    let i;
    let i2;
    let i3;
    let i4;
    let v;

    const maxDelay = 0.0;
    const minDuration = 1.0;
    const maxDuration = 100.0;

    const stretch = 0.1;
    const lengthFactor = 0.0001;

    const maxLength = geometry.boundingBox.max.length();

    this.animationDuration = maxDuration + maxDelay + stretch + lengthFactor * maxLength;
    this._animationProgress = 0;

    for ( i = 0, i2 = 0, i3 = 0, i4 = 0; i < faceCount; i++, i2 += 6, i3 += 9 ) {
      const face = geometry.faces[i];

      const centroid = threeUtils.computeCentroid( geometry, face );

      // animation
      const delay = ( maxLength - centroid.length() ) * lengthFactor;
      const duration = THREE.Math.randFloat( minDuration, maxDuration );

      for ( v = 0; v < 6; v += 2 ) {
        aAnimation.array[i2 + v] = delay + stretch * 0.5;
        aAnimation.array[i2 + v + 1] = duration;
      }

      // end position
      const point = randomPointInSphere( 300 );

      for ( v = 0; v < 9; v += 3 ) {
        aEndPosition.array[i3 + v] = point.x;
        aEndPosition.array[i3 + v + 1] = point.y;
        aEndPosition.array[i3 + v + 2] = point.z;
      }

    }
  }

  addBackground() {
    const geometry = new THREE.PlaneBufferGeometry( 2, 2, 1 );
    this.bgMesh = new THREE.Mesh( geometry, this.backgroundMat );
    this.app.scene.add( this.bgMesh );
  }

  initMaterials() {
    const loader = new THREE.TextureLoader();
    const noiseTexture = loader.load( '/assets/images/textures/noise-1024.jpg' );
    noiseTexture.wrapS = noiseTexture.wrapT = THREE.RepeatWrapping;

    this.offset = new THREE.Vector2( 0, 0 );
    this.smooth = new THREE.Vector2( 1.0, 1.0 );
    this.pointer = new THREE.Vector2( 100, 100 );

    const colA = new THREE.Color( 0xffffff );
    const colB = new THREE.Color( 0x283844 );

    const uniforms = {
        noiseTexture: { value: noiseTexture },
        offset: { value: this.offset },
        smooth: { value: this.smooth },  
    };

    this.textMat = new THREE.ShaderMaterial( {
        uniforms: Object.assign( { 
          color1: { value: colB },
          color2: { value: colA },
          uTime: { value: 0.0 },
          pointer:{ value: this.pointer },
        }, uniforms ),
        vertexShader: textVert,
        fragmentShader: textFrag,
        side: THREE.DoubleSide,
    } );

    this.backgroundMat = new THREE.RawShaderMaterial( {
      uniforms: Object.assign( { 
          color1: { value: colA },
          color2: { value: colB },
        }, uniforms ),
      vertexShader: backgroundVert,
      fragmentShader: backgroundFrag,
    } );
  }

  // Pause if the canvas is not onscreen
  // TODO: Make this a part of App
  // TODO: Currently only works when scrolling down
  pauseWhenOffscreen() {
    window.addEventListener( 'scroll', () => {
      if ( !this.app.isPaused && window.scrollY > ( this.app.canvas.offsetTop + this.app.canvas.clientHeight ) ) {
        this.app.pause();
      } else if ( this.app.isPaused ) {
        this.app.play();
      }
    } );
  }

}
