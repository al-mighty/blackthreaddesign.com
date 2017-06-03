import * as THREE from 'three';

import threeUtils from '../../App/threeUtils.js';
import utils from '../../../utilities.js';
import './aboutCanvasSetup.js';

import StatisticsOverlay from '../../App/StatisticsOverlay.js';

import App from '../../App/App.js';

import backgroundVert from './shaders/background.vert';
import backgroundFrag from './shaders/background.frag';

import portraitVert from './shaders/portrait.vert';
import portraitFrag from './shaders/portrait.frag';


// import { randomPointInDisk, randomPointInSphere, cameraZPos, createTextGeometry } from './aboutCanvasHelpers.js';

let mastHeadHeight = document.querySelector( '.masthead' ).clientHeight;

const textureLoader = new THREE.TextureLoader();

export default class AboutCanvas {

  constructor( showStats ) {

    const self = this;

    self.container = document.querySelector( '.fullpage-canvas-container' );

    self.app = new App( document.querySelector( '#about-canvas' ) );

    self.app.camera.position.set( 0, 0, 100 );

    // TODO: not working in Edge
    let statisticsOverlay;
    if ( showStats ) statisticsOverlay = new StatisticsOverlay( self.app, self.container );

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


    self.app.onUpdate = function () {

      updateMaterials();

      if ( showStats ) statisticsOverlay.updateStatistics( self.app.delta );

    };

    self.app.onWindowResize = function () { 
      mastHeadHeight = document.querySelector( '.masthead' ).clientHeight;
    };

    self.initMaterials();
    self.addBackground();
    self.addPortrait();

    self.app.play();

  }


  addBackground() {
    const geometry = new THREE.PlaneBufferGeometry( 2, 2, 1 );
    this.bgMesh = new THREE.Mesh( geometry, this.backgroundMat );
    this.app.scene.add( this.bgMesh );
  }

  addPortrait() {
    const portrait = textureLoader.load( '/assets/images/about/portrait-512.png' );

    const geometry = new THREE.CircleBufferGeometry( 40, 64 );

    const material = new THREE.MeshBasicMaterial( {
      color: 0xffffff,
      map: portrait,
    } );
    const circle = new THREE.Mesh( geometry, this.portraitMat );

    circle.position.set( 50, 30, 0 );
    this.app.scene.add( circle );
  }

  initMaterials() {
    const noiseTexture = textureLoader.load( '/assets/images/textures/noise-1024.jpg' );
    noiseTexture.wrapS = noiseTexture.wrapT = THREE.RepeatWrapping;

    const portraitTexture = textureLoader.load( '/assets/images/about/portrait-512.png' );

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

    this.portraitMat = new THREE.ShaderMaterial( {
        uniforms: Object.assign( {
          portraitTexture: { value: portraitTexture },
          color1: { value: colB },
          color2: { value: colA },
          uTime: { value: 0.0 },
          pointer: { value: this.pointer },
        }, uniforms ),
        vertexShader: portraitVert,
        fragmentShader: portraitFrag,
        side: THREE.DoubleSide,
    } );

    this.backgroundMat = new THREE.ShaderMaterial( {
      uniforms: Object.assign( {
        color1: { value: colB },
        color2: { value: colA },
      }, uniforms ),
      vertexShader: backgroundVert,
      fragmentShader: backgroundFrag,
    } );
  }

}
