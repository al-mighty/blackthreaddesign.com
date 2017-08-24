import * as THREE from 'three';

import canvas from './Canvas.js';

import Loaders from './utilities/Loaders.js';
import HTMLControl from './utilities/HTMLControl.js';
import invertMirroredFBX from './utilities/invertMirroredFBX.js';
import animationControls from './utilities/AnimationControls.js';

const loaders = new Loaders();

const timing = {

  ballMoveStart: 13,

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

    } );

    const ballPromise = loaders.fbxLoader( '/assets/models/robot/ball.fbx' ).then( ( object ) => {

      this.ball = new THREE.Group();

      this.ballMesh = object;
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
      4.75,
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

  }

    // this is set up after the user has entered the slope
  initNaoAnimation( slope ) {

    animationControls.initAnimation( this.nao, this.nao.animations[ 0 ], this.naoMixer, timing.naoAnimStart );

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

    // set up rotation axis
    const axis = new THREE.Vector3();

    axis.set( xVel, 0, zVel ).normalize();
    axis.cross( THREE.Object3D.DefaultUp );

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

      if ( postCheck || frontAdBoardCheck ) {

        // don't reverse the direction more than once as this can cause 'juddering'
        // as the direction is rapidly changed
        xVel *= -1 * Math.sign( xVel );

        axis.set( xVel, 0, zVel ).normalize();
        axis.cross( THREE.Object3D.DefaultUp );

      }

      if ( backOfGoalCheck ) {

        xVel *= -0.5 * Math.sign( xVel );
        zVel *= 0.5;

        axis.set( xVel, 0, zVel ).normalize();
        axis.cross( THREE.Object3D.DefaultUp );

      }

      if ( topAndBottomWallCheck ) {

        zVel *= -1;

        axis.set( xVel, 0, zVel ).normalize();
        axis.cross( THREE.Object3D.DefaultUp );

      }

      self.ball.translateX( xVel );
      self.ball.translateZ( zVel );

      xVel *= 0.99166; // value calculated to allow ball to roll approx 2 seconds
      zVel *= 0.99166;

      const totalVelocity = Math.sqrt( xVel * xVel + zVel * zVel );

      const angle = -totalVelocity / ( Math.PI * 10 ) * Math.PI;
      self.ballMesh.rotateOnAxis( axis, angle );



      if ( totalVelocity < 0.05 ) return;

      self.ballAnimationFrameId = requestAnimationFrame( () => { ballMover(); } );

    }

    setInterval( () => {

      ballMover();

    }, timing.ballMoveStart * 1000 );

    // ballMover(); // roll ball immediately for testing

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
