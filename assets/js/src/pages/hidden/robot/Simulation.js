import * as THREE from 'three';

import canvas from './Canvas.js';

import Loaders from './utilities/Loaders.js';
import HTMLControl from './utilities/HTMLControl.js';
import invertMirroredFBX from './utilities/invertMirroredFBX.js';

import animationControls from './utilities/AnimationControls.js';

const loaders = new Loaders();

const timing = {

  noaMoveStart: 0,

  naoMoveDuration: 4,

  get naoTurnStart() { return this.noaMoveStart + this.naoMoveDuration; }, // = naoMovEnd

  naoTurnDuration: 0.5,

  get naoKickStart() { return this.naoTurnStart + this.naoTurnDuration; }, // = naoTurnEnd

  naoKickDuration: 0.5,

  get ballMoveStart() { return this.naoKickStart + this.naoKickDuration; }, // = naoKickEnd

  ballMoveDuration: 2,

  get ballMoveEnd() { return this.ballMoveStart + this.ballMoveDuration; },

};

export default class Simulation {

  constructor() {

    this.preLoad();

    this.loadModels();

    this.postLoad();

  }

  // everything done before loading is called here
  preLoad() {

    this.loadingPromises = [];

    this.initPositions();

    this.updateEquation();

    this.initReset();

  }

  // load the models
  loadModels() {

    const fieldPromise = loaders.fbxLoader( '/assets/models/robot/field.fbx' ).then( ( object ) => {

      // field width width ~140cm, length ~200cm
      canvas.app.scene.add( object );

    } );

    const naoPromise = loaders.fbxLoader( '/assets/models/robot/nao.fbx' ).then( ( object ) => {

      // NOTE: Will no longer be needed if https://github.com/mrdoob/three.js/issues/11911 is merged
      invertMirroredFBX( object );

      this.nao = object;

    } );

    const ballPromise = loaders.fbxLoader( '/assets/models/robot/ball.fbx' ).then( ( object ) => {

       // rotate to make the roll animation play correctly
      object.rotation.set( 0, -Math.PI / 2, 0 );

      this.ball = object;

    } );

    this.loadingPromises = [ fieldPromise, naoPromise, ballPromise ];

  }

  // everything done after loading is called here
  postLoad() {

    Promise.all( this.loadingPromises ).then(
      () => {

        HTMLControl.controls.simulate.disabled = false;

        this.setInitialTransforms();
        this.addObjects();

        this.initMixers();

        this.initNaoAnimations();

        this.initSimulation();

        canvas.app.play();

      },
    );

  }

  // set up positions for the animations
  initPositions() {
    this.ballInitialPos = [
      THREE.Math.randInt( -30, 30 ),
      5,
      THREE.Math.randInt( -30, 30 ),
    ];

    this.naoInitialPos = [ this.ballInitialPos[0] - 60, 0, this.ballInitialPos[2] ];
    this.naoFinalPos = [ this.ballInitialPos[ 0 ] - 10, 0, this.ballInitialPos[2] ];

    this.ballFinalPos = [
      85,
      this.ballInitialPos[ 1 ], // height will not change
      0, // // ball final y position - this will be set from the entered sloped
    ];

  }

  updateEquation() {

    HTMLControl.ballPosition.innerHTML = this.ballInitialPos[0] + ', ' + this.ballInitialPos[2];

    const signA = this.ballInitialPos[0] > 0 ? ' - ' : '';
    const signB = this.ballInitialPos[2] > 0 ? ' ) + ' : ' ) ';

    HTMLControl.equation.innerHTML =
      '( '
      + 'x '
      + signA
      + this.ballInitialPos[0]
      + signB
      + this.ballInitialPos[2];
  }

  initReset() {

    HTMLControl.controls.reset.addEventListener( 'click', () => {

      animationControls.reset();
      canvas.app.controls.reset();

      HTMLControl.setInitialState();

      animationControls.reset();

      this.setInitialTransforms();
      this.initMixers();

      this.initNaoAnimations();

    } );

  }

  addObjects() {

    canvas.app.scene.add( this.nao, this.ball );

  }

  setInitialTransforms() {

    this.ball.position.set( this.ballInitialPos[0], this.ballInitialPos[1], this.ballInitialPos[2] )
    this.nao.position.set( this.naoInitialPos[0], this.naoInitialPos[1], this.naoInitialPos[2] );

    this.nao.rotation.set( 0, 0, 0 );

  }

  initMixers() {

    this.ballMixer = new THREE.AnimationMixer( this.ball );
    this.ballMixer.name = 'ball mixer';
    this.naoMixer = new THREE.AnimationMixer( this.nao );
    this.naoMixer.name = 'nao mixer';

    this.naoMixer.addEventListener( 'finished', ( e ) => {

      console.log( e.action );

    } );

  }

   // these can be set up before the user has entered the slope
  initNaoAnimations() {

    // walk
    // (pre built walk )
    animationControls.initAnimation( this.nao, this.nao.animations[ 0 ], this.naoMixer, timing.noaMoveStart );

    // move (translate) while walking
    const moveKF = new THREE.VectorKeyframeTrack(
      '.position',
      [ 0, timing.naoMoveDuration ],
      [
        ...this.naoInitialPos,
        ...this.naoFinalPos,
      ],
    );
    // const moveWalkClip = new THREE.AnimationClip( 'nao_move', -1, [ moveKF, walkKF ] );
    const moveWalkClip = new THREE.AnimationClip( 'nao_move', timing.naoMoveDuration - 1, [ moveKF ] );

    animationControls.initAnimation( this.nao, moveWalkClip, this.naoMixer, timing.noaMoveStart + 0.5 );

    // turn
    // Set up later based on input from user

    // kick
    // for now this is a dummy KF - replace with proper animation later
    const kickKF = new THREE.VectorKeyframeTrack( '.scale',
      [ 0, timing.naoKickDuration ],
      [
        1, 1, 1,
        1, 1, 1,
      ],
    );
    const kickClip = new THREE.AnimationClip( 'nao_kick', timing.naoKickDuration, [ kickKF ] );

    animationControls.initAnimation( this.nao, kickClip, this.naoMixer, timing.naoKickStart );

  }

    // this is set up after the user has entered the slope
  initNaoTurnAnimation( slope ) {

    // calculate rotation based on slope
    const rotationAmount = Math.tan( -slope );

    // Rotation is performed using quaternions, via a QuaternionKeyframeTrack

    // set up rotation about x axis
    const yAxis = new THREE.Vector3( 0, 1, 0 );

    const qInitial = new THREE.Quaternion().setFromAxisAngle( yAxis, 0 );
    const qFinal = new THREE.Quaternion().setFromAxisAngle( yAxis, rotationAmount );

    // turn from initial angle to final angle over 0.5 seconds
    const turnKF = new THREE.QuaternionKeyframeTrack( '.quaternion',
    [ 0, timing.naoTurnDuration ],
    [ qInitial.x, qInitial.y, qInitial.z, qInitial.w, qFinal.x, qFinal.y, qFinal.z, qFinal.w ],
    );

    const turnClip = new THREE.AnimationClip( 'nao_turn', timing.naoTurnDuration, [ turnKF ] );

    animationControls.initAnimation( this.nao, turnClip, this.naoMixer, timing.naoTurnStart );

  }

  // this is set up after the user has entered the slope
  initBallAnimation( slope ) {

    // the ball will always stop at the same final x position, however the z position will be calculated
    // from the slope
    // y2 - y1 = m(x2 - x1)
    // -> y2 = m(m2 - x1) + y1
    const finalZPos = slope * ( this.ballFinalPos[ 0 ] - this.ballInitialPos[ 0 ] ) + this.ballInitialPos[ 2 ];

    this.ballFinalPos[ 2 ] = finalZPos;

    const rollTrack = this.ball.animations[ 0 ].tracks[1];

    // move (translate)
    const moveKF = new THREE.VectorKeyframeTrack(
      '.position',
      [ 0, 2 ],
      [
        ...this.ballInitialPos,
        ...this.ballFinalPos,
      ],
    );

    // combine roll and move into a 2 second clip - the length could be adjusted based on balls
    // initial position
    const moveClip = new THREE.AnimationClip( 'ball_move', 2, [ moveKF, rollTrack ] );
    animationControls.initAnimation( this.ball, moveClip, this.ballMixer, timing.ballMoveStart );

  }

  initSimulation() {

    HTMLControl.setInitialState();

    HTMLControl.controls.simulate.addEventListener( 'click', ( e ) => {

      e.preventDefault();

      const slope = -HTMLControl.controls.slope.value;

      this.initNaoTurnAnimation( slope );
      this.initBallAnimation( slope );

      animationControls.play();

      HTMLControl.controls.simulate.disabled = true;
      HTMLControl.controls.reset.disabled = false;

    }, false );

  }

}

