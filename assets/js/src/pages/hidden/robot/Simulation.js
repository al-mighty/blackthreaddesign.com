import * as THREE from 'three';

import canvas from './Canvas.js';

import Loaders from './utilities/Loaders.js';
import HTMLControl from './utilities/HTMLControl.js';
import invertMirroredFBX from './utilities/invertMirroredFBX.js';
import animationControls from './utilities/AnimationControls.js';

const loaders = new Loaders();

const timing = {

  naoAnimStart: 0,

  // turn to correct direction to kick ball
  naoTurnStart: 10.5,

  naoTurnDuration: 2,

  get naoTurnEnd() { return this.naoTurnStart + this.naoTurnDuration; },

  // point at which nao's kick makes connection
  ballMoveStart: 0, // for testing
  // ballMoveStart: 13.5,

  // ball rolls this long
  ballMoveDuration: 3,

  // all animations end
  // get ballMoveEnd() { return this.ballMoveStart + this.ballMoveDuration; },

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

      // console.log( object )
      object.getObjectByName( 'Field' ).receiveShadow = true;

      // console.log( object )

      // field width width ~140cm, length ~200cm
      canvas.app.scene.add( object );

    } );

    const naoPromise = loaders.fbxLoader( '/assets/models/robot/nao.fbx' ).then( ( object ) => {

      // NOTE: Will no longer be needed if https://github.com/mrdoob/three.js/issues/11911 is merged
      invertMirroredFBX( object );

      this.nao = object;

      this.naoPivot = new THREE.Group();
      this.naoPivot.add( object );

      // this.nao.animations = object.animations;
      // console.log( this.nao )
      // this.nao = object;
      // this.nao.castShadow = true;

    } );

    const ballPromise = loaders.fbxLoader( '/assets/models/robot/ball.fbx' ).then( ( object ) => {

       // rotate to make the roll animation play correctly
      object.rotation.set( 0, -Math.PI / 2, 0 );

      this.ball = object;
      // this.ball.children[0].castShadow = true;
      // this.ball.castShadow = true;


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

        this.initSimulation();

        canvas.app.play();

        this.testingFunctions();

      },
    );

  }

  // set up positions for the animations
  initPositions() {
    this.ballInitialPos = [
      THREE.Math.randInt( -15, 30 ),
      0,
      THREE.Math.randInt( -15, 30 ),
    ];

    this.naoPivotPosition = [ this.ballInitialPos[0] - 5, 0, this.ballInitialPos[2] - 5 ];

    this.naoInitialPos = [ this.naoPivotPosition[0] - 35, 0, this.naoPivotPosition[2] - 25 ];

    this.ballFinalPos = [
      85,
      this.ballInitialPos[ 1 ], // height will not change
      0, // ball final y position - this will be set from the entered sloped
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

      this.initPositions();
      this.setInitialTransforms();
      this.initMixers();

    } );

  }

  addObjects() {

    // canvas.app.scene.add( this.naoPivot, this.ball );
    canvas.app.scene.add( this.nao, this.ball );

  }

  setInitialTransforms() {

    this.ball.position.set( this.ballInitialPos[0], this.ballInitialPos[1], this.ballInitialPos[2] );

    this.naoPivot.position.set( ...this.naoPivotPosition );
    this.nao.position.set( this.naoInitialPos[0], this.naoInitialPos[1], this.naoInitialPos[2] );

    this.nao.rotation.set( 0, 0, 0 );

  }

  initMixers() {

    this.ballMixer = new THREE.AnimationMixer( this.ball );
    this.ballMixer.name = 'ball mixer';
    this.naoMixer = new THREE.AnimationMixer( this.nao );
    this.naoMixer.name = 'nao mixer';
    this.naoPivotMixer = new THREE.AnimationMixer( this.naoPivot );
    this.naoPivotMixer.name = 'nao mixer';

    // this.naoMixer.addEventListener( 'finished', ( e ) => {

    //   console.log( e.action );

    // } );

  }

  initNaoPrebuiltAnimation() {

    animationControls.initAnimation( this.nao, this.nao.animations[ 0 ], this.naoMixer, timing.naoAnimStart );

  }

    // this is set up after the user has entered the slope
  initNaoAnimation( slope ) {

    this.initNaoPrebuiltAnimation();

    // calculate rotation based on slope
    const rotationAmount = Math.tan( slope );

    // Rotation is performed using quaternions, via a QuaternionKeyframeTrack

    // set up rotation about y axis
    const yAxis = new THREE.Vector3( 0, 1, 0 );

    // nao is turned at this point in the prebuilt animations at 30 degrees to the ball
    // apply this correction
    const correction = THREE.Math.degToRad( 30 );

    const qInitial = new THREE.Quaternion().setFromAxisAngle( yAxis, 0 );
    const qFinal = new THREE.Quaternion().setFromAxisAngle( yAxis, rotationAmount + correction );

    // turn from initial angle to final angle over 0.5 seconds
    const turnKF = new THREE.QuaternionKeyframeTrack( '.quaternion',
      [
        0,
        timing.naoTurnDuration,
      ],
      [
        qInitial.x, qInitial.y, qInitial.z, qInitial.w,
        qFinal.x, qFinal.y, qFinal.z, qFinal.w ],
            );

    const turnClip = new THREE.AnimationClip( 'nao_turn', timing.naoTurnDuration, [ turnKF ] );

    animationControls.initAnimation( this.naoPivot, turnClip, this.naoPivotMixer, 0 );


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
      [ 0.05, 1.95 ],
      [
        ...this.ballInitialPos,
        ...this.ballFinalPos,
      ],
      THREE.InterpolateSmooth,
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

      // this.initNaoAnimation( slope );
      this.initBallAnimation( slope );

      animationControls.play();

      HTMLControl.controls.simulate.disabled = true;
      HTMLControl.controls.reset.disabled = false;

    }, false );

  }

  testingFunctions() {

    this.addBallConstraintGuides();
    // this.pivotPointMarker();

  }

  addBallConstraintGuides() {

    const groundGeo = new THREE.PlaneBufferGeometry( 182, 120, 1, 1 );

    const groundMesh = new THREE.Mesh( groundGeo );

    groundMesh.position.set( 0, 2, 0 );
    groundMesh.rotation.x = -Math.PI / 2;

    const postGeo = new THREE.CylinderBufferGeometry( 2, 2, 40, 12, 12 );

    const farPostMesh = new THREE.Mesh( postGeo );
    farPostMesh.position.set( 78, 0, 24.5 );

    const nearPostMesh = new THREE.Mesh( postGeo );
    nearPostMesh.position.set( 78, 0, -25 );

    canvas.app.scene.add( groundMesh, farPostMesh, nearPostMesh );

  }

  pivotPointMarker() {

    const geo = new THREE.BoxBufferGeometry( 8, 40, 2 );
    const mesh = new THREE.Mesh( geo );
    mesh.position.set( ...this.naoPivotPosition );

    this.naoPivotMarker = mesh;
    canvas.app.scene.add( mesh );

    // this.pivotMixer = new THREE.AnimationMixer( this.naoPivotMarker );
    // this.pivotMixer.name = 'nao mixer';

    // // this.initNaoPrebuiltAnimation();

    // // calculate rotation based on slope
    // const rotationAmount = 0;

    // // Rotation is performed using quaternions, via a QuaternionKeyframeTrack

    // // set up rotation about y axis
    // const yAxis = new THREE.Vector3( 0, 1, 0 );

    // // nao is turned at this point in the prebuilt animations at 30 degrees to the ball
    // // apply this correction
    // const correction = THREE.Math.degToRad( 30 );

    // const qInitial = new THREE.Quaternion().setFromAxisAngle( yAxis, 0 );
    // const qFinal = new THREE.Quaternion().setFromAxisAngle( yAxis, rotationAmount + correction );

    // // turn from initial angle to final angle over 0.5 seconds
    // const turnKF = new THREE.QuaternionKeyframeTrack( '.quaternion',
    //   [
    //     0,
    //     timing.naoTurnDuration,
    //   ],
    //   [
    //     qInitial.x, qInitial.y, qInitial.z, qInitial.w,
    //     qFinal.x, qFinal.y, qFinal.z, qFinal.w ],
    //     );

    // const turnClip = new THREE.AnimationClip( 'nao_turn', timing.naoTurnDuration, [ turnKF ] );

    // animationControls.initAnimation( this.naoPivotMarker, turnClip, this.pivotMixer, 0 );

    // console.log( timing.naoTurnDuration, timing.naoTurnStart );
  }

}
