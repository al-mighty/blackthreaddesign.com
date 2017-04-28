import * as THREE from 'three';

// import threeUtils from '../../App/threeUtils.js';
// import utils from '../../../utilities.js';
import './wavelinesCanvasSetup.js';

import StatisticsOverlay from '../../App/StatisticsOverlay.js';

import App from '../../App/App.js';

import Waveline from './objects/Waveline.js';

import backgroundVert from './shaders/background.vert';
import backgroundFrag from './shaders/background.frag';


import { visibleHeightAtZDepth, visibleWidthAtZDepth } from './wavelinesCanvasHelpers.js';

let mastHeadHeight = document.querySelector( '.masthead' ).clientHeight;

export default class WavelinesCanvas {

  constructor( showStats ) {

    const self = this;

    self.container = document.querySelector( '.canvas-container' );

    self.app = new App( document.querySelector( '#wavelines-canvas' ) );

    self.app.renderer.setClearColor( 0xffffff );
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
      self.halfCanvasHeight = -visibleHeightAtZDepth( self.lineDepth, self.app.camera ) / 2;
      self.halfCanvasWidth = -visibleWidthAtZDepth( self.lineDepth, self.app.camera ) / 2;
    };

    self.lineDepth = -100;
    self.halfCanvasHeight = -visibleHeightAtZDepth( self.lineDepth, self.app.camera ) / 2;
    self.halfCanvasWidth = -visibleWidthAtZDepth( self.lineDepth, self.app.camera ) / 2;

    self.wavelinesAnimationObjectGroup = new THREE.AnimationObjectGroup();

    self.initMaterials();
    self.initLines();

    this.initAnimation();

    self.app.play();


  }

    initAnimation() {
      // Create keyframes for start and end of morph target, setting the final time equal to the total length of the animation
      // Note: 'name' must reference the propery being animated
      const keyFrame = new THREE.NumberKeyframeTrack( 'geometry.morphTargetInfluences', [0.0, 5.0], [0.0, 1.0], THREE.InterpolateSmooth );

      // Create an animation clip with the keyframes
      const clip = new THREE.AnimationClip( 'wavelineMorphTargetsClip', 5.0, [keyFrame] );

      // Create a mixer of the clip referencing the object to be animated
      this.mixer = new THREE.AnimationMixer( this.wavelinesAnimationObjectGroup );

      // create an animationAction using the mixer's clipAction function
      const animationAction = this.mixer.clipAction( clip );

      // Set the loop mode to play / reverse infinitely
      animationAction.loop = THREE.LoopPingPong;

      // Start the animation
      animationAction.play();
  }

  initLines() {

    for (let i = 0; i < 1000; i++) {
      const diff = i % 100;
      const spec = {
        material: this.lineMat,
        zDepth: this.lineDepth,
        //the following arrays must all be of the same size, >=2
        xInitial: [ //x positions at start of animation
          -this.halfCanvasWidth,
          -this.halfCanvasWidth * 0.5,
          0,
          this.halfCanvasWidth * 0.5,
          this.halfCanvasWidth,
        ], 
        xFinal: [ //x positions at end of animation
          -this.halfCanvasWidth,
          -this.halfCanvasWidth * 0.5,
          0,
          this.halfCanvasWidth * 0.5,
          this.halfCanvasWidth,
        ], 
        yInitial: [ //y positions at start of animation
          this.halfCanvasHeight - diff,
          this.halfCanvasHeight - 10 - diff,
          this.halfCanvasHeight - 20 - diff,
          this.halfCanvasHeight - 50 - diff,
          this.halfCanvasHeight - 20 - diff,
        ],
        yFinal: [ //y positions at end of animation
          this.halfCanvasHeight - 10 - diff,
          this.halfCanvasHeight - 20 - diff,
          this.halfCanvasHeight - 30 - diff,
          this.halfCanvasHeight - 20 - diff,
          this.halfCanvasHeight - 50 - diff,
        ]
      };

      const waveline = new Waveline( spec );

      this.wavelinesAnimationObjectGroup.add( waveline );

      this.app.scene.add( waveline );
    }
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
