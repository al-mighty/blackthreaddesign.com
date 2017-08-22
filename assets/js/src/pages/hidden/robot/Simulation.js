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
  // ballMoveStart: 0, // for testing
  ballMoveStart: 12.75,

  // ball rolls this long
  // ballMoveDuration: 2,

  // all animations end
  // get ballMoveEnd() { return this.ballMoveStart + this.ballMoveDuration; },

};

export default class Simulation {

  constructor() {

    this.preLoad();

    this.loadModels();

    this.loadAnimations();

    this.postLoad();

  }

  // everything done before loading is called here
  preLoad() {

    this.loadingPromises = [];

    this.animations = {};

    this.initPositions();

    this.updateEquation();

    this.initReset();

  }

  // load the models
  loadModels() {

    const fieldPromise = loaders.fbxLoader( '/assets/models/robot/field.fbx' ).then( ( object ) => {

      object.getObjectByName( 'Field' ).receiveShadow = true;

      // field width width ~140cm, length ~200cm
      canvas.app.scene.add( object );

    } );

    const naoPromise = loaders.fbxLoader( '/assets/models/robot/nao.fbx' ).then( ( object ) => {

      // NOTE: Will no longer be needed if https://github.com/mrdoob/three.js/issues/11911 is merged
      invertMirroredFBX( object );

      this.nao = object;

      this.naoPivot = new THREE.Group();
      this.naoPivot.add( object );

    } );

    const ballPromise = loaders.fbxLoader( '/assets/models/robot/ball.fbx' ).then( ( object ) => {

      // this.ball = object;


      this.ball = new THREE.Group();

      // this.ball.rotation.set( 0, -Math.PI / 2, 0 );

      this.ballMesh = object;

      // this.ballMesh.rotation.set( 0, 0, -Math.PI / 2 );

      this.ball.add( this.ballMesh );


    } );

    this.loadingPromises = [ fieldPromise, naoPromise, ballPromise ];

  }

  loadAnimations() {

    const rollPromise = loaders.animationLoader( '/assets/models/robot/anims/roll.json' ).then( ( object ) => {

      this.animations.roll = object;

      // console.log( object )

    } );

    this.loadingPromises.push( rollPromise );

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

      },
    );

  }

  // set up positions for the animations
  initPositions() {
    this.ballInitialPos = [
      THREE.Math.randInt( -15, 30 ),
      5,
      THREE.Math.randInt( -15, 30 ),
    ];

    this.naoInitialPos = [ this.ballInitialPos[0] - 44, 0, this.ballInitialPos[2] - 37 ];

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

      cancelAnimationFrame( this.ballAnimationFrameId );

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

    this.nao.position.set( this.naoInitialPos[0], this.naoInitialPos[1], this.naoInitialPos[2] );

    this.nao.rotation.set( 0, 0, 0 );
    this.ball.rotation.set( 0, 0, 0 );
    this.ballMesh.rotation.set( 0, 0, 0 );

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

    // ball initial velocity ( not physically calculated, just start at 1 )
    const initialVelocity = 1;

    // split this into x and z components based on slope
    const angle = Math.tan( slope );
    const xVel = Math.cos( angle ) * initialVelocity;
    const zVel = Math.sin( angle ) * initialVelocity;

    this.moveBall( xVel, zVel );

  }

  // very simple physics model for ball
  moveBall( xVel, zVel ) {

    const self = this;

    // Rotate an object around an arbitrary axis in object space
    const rotObjectMatrix = new THREE.Matrix4();
    function rotateAroundObjectAxis( object, axis, radians ) {

      rotObjectMatrix.makeRotationAxis( axis.normalize(), radians );

      object.matrix.multiply( rotObjectMatrix );

      object.rotation.setFromRotationMatrix( object.matrix );
    }

    const rotWorldMatrix = new THREE.Matrix4();
    // Rotate an object around an arbitrary axis in world space
    function rotateAroundWorldAxis( object, axis, radians ) {

      rotWorldMatrix.makeRotationAxis( axis.normalize(), radians );

      rotWorldMatrix.multiply( object.matrix );

      object.matrix = rotWorldMatrix;

      object.rotation.setFromRotationMatrix( object.matrix );
    }

    // rotation around z-x axis
    const axis = new THREE.Vector3();

    function ballMover() {

      // checks to reverse x direction
      const postXPositionCheck = ( self.ball.position.x >= 73 );
      const nearPostZPositionCheck = postXPositionCheck && ( self.ball.position.z >= 20 && self.ball.position.z <= 30 );
      const farPostZPositionCheck = postXPositionCheck && ( self.ball.position.z <= -20 && self.ball.position.z >= -30 );
      const postCheck = nearPostZPositionCheck || farPostZPositionCheck;

      const nearFrontAdBoardCheck = ( self.ball.position.x >= 87 && self.ball.position.z <= -20 );
      const farFrontAdBoardCheck = ( self.ball.position.x >= 87 && self.ball.position.z >= 20 );
      const frontAdBoardCheck = farFrontAdBoardCheck || nearFrontAdBoardCheck;

      const backOfGoalCheck = self.ball.position.x >= 92;

      // checks to reverse z direction
      const topAndBottomWallCheck = self.ball.position.z >= 55 || self.ball.position.z <= -55;

      if ( postCheck || frontAdBoardCheck ) xVel *= -1;

      if ( backOfGoalCheck ) {

        xVel *= -0.5;
        zVel *= 0.5;

      }

      if ( topAndBottomWallCheck ) zVel *= -1;

      self.ball.translateX( xVel );
      self.ball.translateZ( zVel );

      xVel *= 0.99166; // value calculated to allow ball to roll approx 2 seconds
      zVel *= 0.99166;

      const totalVelocity = Math.sqrt( xVel * xVel + zVel * zVel );

      // const xAngle = xVel / ( Math.PI * 10 ) * Math.PI;
      // const zAngle = zVel / ( Math.PI * 10 ) * Math.PI;

      const angle = totalVelocity / ( Math.PI * 10 ) * Math.PI;

      // for movement in x rotate around z axis and vice versa
      axis.set( zVel, 0, -xVel ).normalize();


      // self.ballMesh.rotation.z -= xAngle;

      // and for movement in z rotate around x axis
      // self.ballMesh.rotation.x += zAngle;

      self.ballMesh.rotateOnAxis( axis, angle );

      if ( totalVelocity < 0.05 ) return;

      self.ballAnimationFrameId = requestAnimationFrame( () => { ballMover(); } );

    }

    setInterval( () => {

      ballMover();

    }, timing.ballMoveStart * 1000 );

    // timer.start();

  }

  initSimulation() {

    HTMLControl.setInitialState();

    HTMLControl.controls.simulate.addEventListener( 'click', ( e ) => {

      e.preventDefault();

      const slope = -HTMLControl.controls.slope.value;

      this.initNaoAnimation( slope );
      this.initBallAnimation( slope );

      animationControls.play();

      HTMLControl.controls.simulate.disabled = true;
      HTMLControl.controls.reset.disabled = false;

    }, false );

  }

}
