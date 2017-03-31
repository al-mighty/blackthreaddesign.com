import * as THREE from 'three';

// import threeUtils from '../../App/threeUtils.js';
import utils from '../../../../utilities.js';
import './escherSketchCanvasSetup.js';

import StatisticsOverlay from '../../../App/StatisticsOverlay.js';

import App from '../../../App/App.js';

import backgroundVert from './shaders/background.vert';
import backgroundFrag from './shaders/background.frag';


// import { randomPointInDisk, randomPointInSphere, cameraZPos, createTextGeometry } from './escherSketchCanvasHelpers.js';

let mastHeadHeight = document.querySelector( '.masthead' ).clientHeight;

export default class EscherSketchCanvas {

  constructor( showStats ) {

    const self = this;

    self.container = document.querySelector( '.canvas-container' );

    self.app = new App( document.querySelector( '#escherSketch-canvas' ) );

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

        // const pointer = threeUtils.pointerPosToCanvasCentre( self.app.canvas, mastHeadHeight );
        // self.pointer.set( pointer.x, pointer.y );
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

    self.app.play();

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
    // this.pointer = new THREE.Vector2( 100, 100 );

    const colA = new THREE.Color( 0xffffff );
    const colB = new THREE.Color( 0x283844 );

    const uniforms = {
      noiseTexture: { value: noiseTexture },
      offset: { value: this.offset },
      smooth: { value: this.smooth },
    };

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
