import * as THREE from 'three';

// import threeUtils from '../../App/threeUtils.js';
// import utils from '../../../utilities.js';
import './wavelinesCanvasSetup.js';

import StatisticsOverlay from '../../App/StatisticsOverlay.js';

import App from '../../App/App.js';

import Waveline from './objects/Waveline.js';

import backgroundVert from './shaders/background.vert';
import backgroundFrag from './shaders/background.frag';


// import { randomPointInDisk, randomPointInSphere, cameraZPos, createTextGeometry } from './wavelinesCanvasHelpers.js';

let mastHeadHeight = document.querySelector( '.masthead' ).clientHeight;

export default class WavelinesCanvas {

  constructor( showStats ) {

    const self = this;

    self.container = document.querySelector( '.canvas-container' );

    self.app = new App( document.querySelector( '#wavelines-canvas' ) );

    self.app.camera.position.set( 0, 0, 10 );

    // TODO: not working in Edge
    let statisticsOverlay;
    if ( showStats ) statisticsOverlay = new StatisticsOverlay( self.app, self.container );


    self.app.onUpdate = function () {

      self.mixer.update( self.app.delta * 0.001 );

      if ( showStats ) statisticsOverlay.updateStatistics( self.app.delta );

    };

    self.app.onWindowResize = function () { 
      mastHeadHeight = document.querySelector( '.masthead' ).clientHeight;
    };

    self.initMaterials();
    self.initLines();

    this.initAnimation();

    self.app.play();

  }

    initAnimation() {
      const keyFrame = new THREE.NumberKeyframeTrack( 'geometry.morphTargetInfluences', [0.0, 2.0], [0.0, 1.0], THREE.InterpolateSmooth );

      const clip = new THREE.AnimationClip( 'wavelineMorphTargetsClip', 2.0, [keyFrame] );

      this.mixer = new THREE.AnimationMixer( this.waveline );
      
      this.mixer.clipAction( clip ).play();


  }

  initLines() {
    //for (let i = 0; i < 1; i++) {
    const spec = {
      material: this.lineMat,
      zDepth: 0,
      //the following arrays must all be of the same size, >=2
      xInitial: [ //x positions at start of animation
        0,
        THREE.Math.randInt(20, 30),
        50,
        THREE.Math.randInt(60, 80),
        100], //first should be 0, last 100 to cover screen
      xFinal: [ //x positions at end of animation
        0,
        THREE.Math.randInt(20, 30),
        50,
        THREE.Math.randInt(60, 80),
        100], //first should be 0, last 100 to cover screen
      yInitial: [ //y positions at start of animation
        THREE.Math.randInt(0, 100),
        THREE.Math.randInt(0, 100),
        50,
        THREE.Math.randInt(0, 100),
        THREE.Math.randInt(0, 100),
      ],
      yFinal: [ //y positions at end of animation
        THREE.Math.randInt(0, 100),
        THREE.Math.randInt(0, 100),
        50,
        THREE.Math.randInt(0, 100),
        THREE.Math.randInt(0, 100),
      ],
      yDiffsInitial: [
        THREE.Math.randInt(1, 3),
        THREE.Math.randInt(1, 3),
        THREE.Math.randInt(1, 3),
        THREE.Math.randInt(1, 3),
        THREE.Math.randInt(1, 3),
      ], //controls width of initial waveline, in pixels
      yDiffsFinal: [
        THREE.Math.randInt(1, 3),
        THREE.Math.randInt(1, 3),
        THREE.Math.randInt(1, 3),
        THREE.Math.randInt(1, 3),
        THREE.Math.randInt(1, 3),
      ], //controls width of final waveline
    };
    this.waveline = new Waveline(spec);
    //dummy objects to allow TweenLite to tween the morphTargetInfluences
    //which is an array
    // const dummy = {
    //   x: 0,
    // };
    // const tween = TweenMax.fromTo(dummy, 25, {
    //   x: 0,
    // }, {
    //   x: 1,
    //   ease: Sine.easeInOut,
    //   yoyo: true,
    //   repeat: -1,
    //   onUpdate: () => {
    //     waveline.morphTargetInfluences[0] = dummy.x;
    //   },
    // });
    // tween.progress(randomFloat(0, 1), true);
    // //this.timeline.add(tween, 0);
    this.app.scene.add( this.waveline );
    //}
  }

  initMaterials() {
    this.lineMat = new THREE.MeshBasicMaterial( { 
      color: 0x4CCEEF,
      morphTargets: true,
    } );
    // const uniforms = {
    //   noiseTexture: { value: noiseTexture },
    //   offset: { value: this.offset },
    //   smooth: { value: this.smooth },
    // };

    // this.backgroundMat = new THREE.ShaderMaterial( {
    //   uniforms: Object.assign( {
    //     color1: { value: colB },
    //     color2: { value: colA },
    //   }, uniforms ),
    //   vertexShader: backgroundVert,
    //   fragmentShader: backgroundFrag,
    // } );
  }

}
