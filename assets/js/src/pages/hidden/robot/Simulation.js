import * as THREE from 'three';

import canvas from './Canvas.js';

import Loaders from './utilities/Loaders.js';
import HTMLControl from './utilities/HTMLControl.js';

import animationControls from './utilities/AnimationControls.js';

const loaders = new Loaders();

export default class Simulation {

  constructor() {

    this.loadingPromises = [];

    this.loadModels();

    // canvas.app.controls.rotateUp( Math.PI / 12 );

    canvas.app.play();

    this.initAnimationTimings();

    Promise.all( this.loadingPromises ).then(
      () => {

        HTMLControl.controls.simulate.disabled = false;

        this.initPositions();
        this.initNaoAnimations();

        this.initSimulation();

      },
    );

  }

  // set up positions for the animations
  initPositions() {

    this.naoInitialPos = Object.keys( this.nao.position ).map( ( key ) => this.nao.position[key] );
    this.ballInitialPos = Object.keys( this.ball.position ).map( ( key ) => this.ball.position[key] );

    this.naoFinalPos = [ this.ballInitialPos[ 0 ] - 10, 0, this.naoInitialPos[2] ];

    this.ballFinalPos = [
      this.ballInitialPos[0] + 85,
      0, // ball final y position - this will be set from the entered sloped
      this.ballInitialPos[2]
    ];

  }

  initAnimationTimings() {

    this.animationTimings = {

      naoMoveStart: 0,

      naoTurnStart: 2, // = naoMovEnd

      naoKickStart: 2.5, // = naoTurnEnd

      ballMoveStart: 3, // = naoKickEnd

      ballMoveEnd: 4,

    };

  }

   // these can be set up before the user has entered the slope
  initNaoAnimations() {

    // walk
    // for now this is a dummy KF - replace with proper animation later
    const walkKF = new THREE.VectorKeyframeTrack( '.position', [ 0, 0.5 ],
      [
        ...this.naoFinalPos,
        ...this.naoFinalPos,
      ],
    );
    const walkClip = new THREE.AnimationClip( 'nao_walk', -1, [ walkKF ] );
    walkClip.loop = THREE.LoopOnce;
    animationControls.initAnimation( this.nao, walkClip );

    // move (translate)
    const moveKF = new THREE.VectorKeyframeTrack(
      '.position',
      [ 0, 3 ],
      [
        ...this.naoInitialPos,
        ...this.naoFinalPos,
      ],
    );
    const moveClip = new THREE.AnimationClip( 'nao_move', -1, [ moveKF ] );
    moveClip.loop = THREE.LoopOnce;
    animationControls.initAnimation( this.nao, moveClip );

    // turn
    // Set up based on input from user

    // kick
    // for now this is a dummy KF - replace with proper animation later
    const kickKF = walkKF;
    const kickClip = new THREE.AnimationClip( 'nao_kick', -1, [ kickKF ] );
    kickClip.loop = THREE.LoopOnce;
    animationControls.initAnimation( this.nao, kickClip );

  }

  // this is set up after the user has entered the slope
  initNaoTurnAnimation( slope ) {

    // calculate rotation. Assume PI / 8 for now
    const rotationAmount = Math.tan( -slope );

    // Rotation is performed using quaternions, via a QuaternionKeyframeTrack

    // set up rotation about x axis
    const yAxis = new THREE.Vector3( 0, 1, 0 );

    const qInitial = new THREE.Quaternion().setFromAxisAngle( yAxis, 0 );
    const qFinal = new THREE.Quaternion().setFromAxisAngle( yAxis, rotationAmount );

    const turnKF = new THREE.QuaternionKeyframeTrack( '.quaternion', [ 0, 1, 2 ], [ qInitial.x, qInitial.y, qInitial.z, qInitial.w, qFinal.x, qFinal.y, qFinal.z, qFinal.w, qInitial.x, qInitial.y, qInitial.z, qInitial.w ] );
    const turnClip = new THREE.AnimationClip( 'nao_turn', -1, [ turnKF ] );
    turnClip.loop = THREE.LoopOnce;
    animationControls.initAnimation( this.nao, turnClip, 'nao_turn' );

  }

  // this is set up after the user has entered the slope
  initBallAnimation( slope ) {

    const finalZPos = slope * ( this.ballFinalPos[ 0 ] );

    this.ballFinalPos[ 2 ] = finalZPos;

    console.log( this.ball.animations[ 0 ] )

    this.ball.animations[ 0 ].name = 'ball_roll';
    this.ball.animations[ 0 ].loop = THREE.LoopOnce;

    // roll
    animationControls.initAnimation( this.ball, this.ball.animations[ 0 ] );

    // move (translate)
    // This may need to be set up based on user inout
    const moveKF = new THREE.VectorKeyframeTrack(
      '.position',
      [ 0, 2 ],
      [
        ...this.ballInitialPos,
        ...this.ballFinalPos,
      ],
    );
    const moveClip = new THREE.AnimationClip( 'ball_move', -1, [ moveKF ] );
    moveClip.loop = THREE.LoopOnce;
    animationControls.initAnimation( this.ball, moveClip );

  }

  loadModels() {

    const fieldPromise = loaders.fbxLoader( '/assets/models/robot/field.fbx' ).then( ( result ) => {

      // field width width ~140cm, length ~200cm
      canvas.addObjectToScene( result );

    } );

    const naoPromise = loaders.fbxLoader( '/assets/models/robot/nao.fbx' ).then( ( result ) => {

      result.position.set( -50, 0, 0 );

      canvas.addObjectToScene( result );

      this.nao = result;

    } );

    const ballPromise = loaders.fbxLoader( '/assets/models/robot/ball.fbx' ).then( ( result ) => {

      result.position.set( 0, 5, 0 );
      result.rotation.set( 0, -Math.PI / 2, 0 );

      canvas.addObjectToScene( result );

      this.ball = result;

    } );

    this.loadingPromises = [ fieldPromise, naoPromise, ballPromise ];

  }

  initSimulation() {

    HTMLControl.controls.simulate.addEventListener( 'click', ( e ) => {

      e.preventDefault();

      const slope = -HTMLControl.controls.slope.value;

      HTMLControl.controls.simulate.disabled = true;
      HTMLControl.controls.reset.disabled = false;
      HTMLControl.controls.slope.disabled = true;

      this.initNaoTurnAnimation( slope );
      this.initBallAnimation( slope );

    }, false );

  }


}

