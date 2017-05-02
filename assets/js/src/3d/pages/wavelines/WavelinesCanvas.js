import * as THREE from 'three';

// import threeUtils from '../../App/threeUtils.js';
// import utils from '../../../utilities.js';
import './wavelinesCanvasSetup.js';

import StatisticsOverlay from '../../App/StatisticsOverlay.js';

import App from '../../App/App.js';

import Waveline from './objects/Waveline.js';

import basicVert from './shaders/basic.vert';
import basicFrag from './shaders/basic.frag';


import { initialSurfaceGen, finalSurfaceGen, xCoord, yCoord, visibleHeightAtZDepth, visibleWidthAtZDepth } from './wavelinesCanvasHelpers.js';

let mastHeadHeight = document.querySelector( '.masthead' ).clientHeight;

export default class WavelinesCanvas {

  constructor( showStats ) {

    const self = this;

    self.container = document.querySelector( '.canvas-container' );

    self.app = new App( document.querySelector( '#wavelines-canvas' ) );

    self.app.renderer.setClearColor( 0xffffff );
    self.app.camera.position.set( 0, 0, 1);

    // TODO: not working in Edge
    let statisticsOverlay;
    if ( showStats ) statisticsOverlay = new StatisticsOverlay( self.app, self.container );


    self.app.onUpdate = function () {

      self.mixer.update( self.app.delta * 0.001 );

      if ( showStats ) statisticsOverlay.updateStatistics( self.app.delta );

    };

    self.app.onWindowResize = function () { 
      mastHeadHeight = document.querySelector( '.masthead' ).clientHeight;
      self.canvasHeight = visibleHeightAtZDepth( self.lineDepth, self.app.camera );
      self.canvasWidth = visibleWidthAtZDepth( self.lineDepth, self.app.camera );
    };

    self.lineDepth = 0;
    self.canvasHeight = visibleHeightAtZDepth( self.lineDepth, self.app.camera );
    self.canvasWidth = visibleWidthAtZDepth( self.lineDepth, self.app.camera );

    self.wavelinesAnimationObjectGroup = new THREE.AnimationObjectGroup();

    self.initMaterials();
    self.initLines();

    this.initAnimation();

    self.app.play();
  }

  initAnimation() {
    const animationLength = 10.0;

    // Create keyframes for start and end of morph target, setting the final time equal to the total length of the animation
    // Note: 'name' must reference the propery being animated
    const keyFrame = new THREE.NumberKeyframeTrack( 'geometry.morphTargetInfluences', [0.0, animationLength], [0.0, 1.0], THREE.InterpolateSmooth );

    // Create an animation clip with the keyframes
    const clip = new THREE.AnimationClip( 'wavelineMorphTargetsClip', animationLength, [keyFrame] );

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

    const spec = {
        thickness: 0.0035,
        material: this.lineMat,
        zDepth: this.lineDepth,
        meshFineness: 32,
    }

    // x positions at start of animation
    const xInitial = [xCoord( 0, this.canvasWidth ), 0, 0, 0,  xCoord( 100, this.canvasWidth )];
    // x positions at start of animation
    const xFinal = [xCoord( 0, this.canvasWidth ), 0, 0, 0, xCoord( 100, this.canvasWidth )];

    for ( let i = 0; i < 50; i++ ) {
      xInitial[1] = xCoord( THREE.Math.randInt( 15, 25 ), this.canvasWidth );
      xInitial[3] = xCoord( THREE.Math.randInt( 65, 85 ), this.canvasWidth );
      xFinal[1] = xCoord( THREE.Math.randInt( 15, 25 ), this.canvasWidth );
      xFinal[3] = xCoord( THREE.Math.randInt( 65, 85 ), this.canvasWidth );

      const s = Object.assign( {
        //the following arrays must all be of the same size, >=2
        xInitial, 
        xFinal, 
        yInitial: [ //y positions at start of animation
          yCoord( THREE.Math.randInt( 35, 65 ), this.canvasHeight ),
          yCoord( THREE.Math.randInt( 35, 65 ), this.canvasHeight ),
          0,
          yCoord( THREE.Math.randInt( 35, 65 ), this.canvasHeight ),
          yCoord( THREE.Math.randInt( 35, 65 ), this.canvasHeight ),
        ],
        yFinal: [ //y positions at end of animation
          yCoord( THREE.Math.randInt( 35, 65 ), this.canvasHeight ),
          yCoord( THREE.Math.randInt( 35, 65 ), this.canvasHeight ),
          0,
          yCoord( THREE.Math.randInt( 35, 65 ), this.canvasHeight ),
          yCoord( THREE.Math.randInt( 35, 65 ), this.canvasHeight ),
        ]
      }, spec );

      const waveline = new Waveline( s );

      this.wavelinesAnimationObjectGroup.add( waveline );

      this.app.scene.add( waveline );
    }
  }

  initMaterials() {
    this.lineMat = new THREE.ShaderMaterial( {
      uniforms: {
        morphTargetInfluences: {
          value: [0, 0, 0, 0],
        },
      },
      vertexShader: basicVert,
      fragmentShader: basicFrag,
      morphTargets: true,
    } );

  }

}
