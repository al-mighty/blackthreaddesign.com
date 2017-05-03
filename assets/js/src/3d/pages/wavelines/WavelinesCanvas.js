import * as THREE from 'three';

import utils from '../../../utilities.js';

import lineSpec from './spec/lines.js';

import './wavelinesCanvasSetup.js';

import StatisticsOverlay from '../../App/StatisticsOverlay.js';

import App from '../../App/App.js';

// import Waveline from './objects/Waveline.js';

import SineWave from './objects/SineWave.js';

import basicVert from './shaders/basic.vert';
import basicFrag from './shaders/basic.frag';


import { visibleHeightAtZDepth, visibleWidthAtZDepth } from './wavelinesCanvasHelpers.js';

export default class WavelinesCanvas {

  constructor( showStats ) {

    const self = this;

    self.container = document.querySelector( '.canvas-container' );

    self.app = new App( document.querySelector( '#wavelines-canvas' ) );

    self.app.renderer.setClearColor( 0xffffff );
    self.app.camera.position.set( 0, 0, 1 );

    // TODO: not working in Edge
    let statisticsOverlay;
    if ( showStats ) statisticsOverlay = new StatisticsOverlay( self.app, self.container );


    self.app.onUpdate = function () {

      // self.animateCamera();

      self.mixer.update( self.app.delta * 0.001 );

      if ( showStats ) statisticsOverlay.updateStatistics( self.app.delta );

    };

    self.app.onWindowResize = function () { 
      mastHeadHeight = document.querySelector( '.masthead' ).clientHeight;
      self.canvasHeight = visibleHeightAtZDepth( self.lineDepth, self.app.camera );
      self.canvasWidth = visibleWidthAtZDepth( self.lineDepth, self.app.camera );
    };

    self.canvasHeight = visibleHeightAtZDepth( self.lineDepth, self.app.camera );
    self.canvasWidth = visibleWidthAtZDepth( self.lineDepth, self.app.camera );

    self.wavelinesAnimationObjectGroup = new THREE.AnimationObjectGroup();

    self.initLines();

    this.initAnimation();

    // self.centreCircle();

    self.app.play();
  }

  // For testing
  centreCircle() {
    const geom = new THREE.SphereBufferGeometry( 1.5, 32, 32 );
    const mesh = new THREE.Mesh( geom, new THREE.MeshBasicMaterial( { color: 0xff00ff } ) );

    mesh.position.set( 0, 0, -5 );

    this.app.scene.add( mesh );
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
    Object.keys( lineSpec ).forEach( ( key ) => {
      const spec = lineSpec[key];

      spec.material = this.initMaterial( spec.opacity );
      spec.fineness = 200;
      spec.canvasWidth = visibleWidthAtZDepth( spec.z, this.app.camera )

      const sinewave = new SineWave( spec );

      this.wavelinesAnimationObjectGroup.add( sinewave );

      this.app.scene.add( sinewave );

    } );

  }

  initMaterial( opacity ) {
    opacity = opacity || 1.0;

    // this.lineMat = new THREE.MeshBasicMaterial( { color: 0xff0000 } );

    return new THREE.ShaderMaterial( {
      uniforms: {
        opacity: {
          value: opacity,
        },
        morphTargetInfluences: {
          value: [0, 0, 0, 0],
        },
      },
      vertexShader: basicVert,
      fragmentShader: basicFrag,
      morphTargets: true,
      transparent: true,
      side: THREE.DoubleSide,
    } );

  }

  animateCamera() {
    const pointerY = utils.pointerPos.y;

    console.log( pointerY / window.innerHeight );

    this.app.camera.position.set( 0, pointerY / window.innerHeight, 0 )
  }

}
