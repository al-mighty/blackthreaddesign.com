import * as THREE from 'three';

import canvas from './Canvas.js';

import Loaders from './utilities/Loaders.js';

import animationControls from './utilities/AnimationControls.js';

const loaders = new Loaders();

export default class Simulation {

  constructor() {

    this.loadingPromises = [];

    this.loadModels();

    canvas.app.controls.rotateUp( Math.PI / 12 );

    canvas.app.play();

    Promise.all( this.loadingPromises ).then(
      () => {

        this.initNaoAnimations();
        this.initBallAnimations();

      },
    );

  }

  initBallAnimations() {

    const initialPos = Object.keys( this.ball.position ).map( ( key ) => this.ball.position[key] );

    //roll
    animationControls.initAnimation( this.ball, this.ball.animations[ 0 ], 'ball_roll' );

    //move (translate)
    // This may need to be set up based on user inout
    const moveKF = new THREE.VectorKeyframeTrack(
      '.position',
      [ 0, 2 ],
      [
        ...initialPos,
        this.ball.position.x + 90, // -10 = ball diameter
        initialPos[1],
        initialPos[2],
      ],
    );
    const moveClip = new THREE.AnimationClip( 'ball_move', -1, [ moveKF ] );
    animationControls.initAnimation( this.ball, moveClip );

  }

  initNaoAnimations() {

    // const initialPos = this.nao.position;
    const initialPos = Object.keys( this.nao.position ).map( ( key ) => this.nao.position[key] );

    const finalPos = [ this.ball.position.x - 10, 0, this.ball.position.z ];

    // walk
    // for now this is a dummy KF - replace with proper animation later
    const walkKF = new THREE.VectorKeyframeTrack( '.position', [ 0, 0.5 ],
      [
        ...finalPos,
        ...finalPos,
      ],
    );
    const walkClip = new THREE.AnimationClip( 'nao_walk', -1, [ walkKF ] );
    animationControls.initAnimation( this.nao, walkClip );

    // move (translate)
    const moveKF = new THREE.VectorKeyframeTrack(
      '.position',
      [ 0, 3 ],
      [
        ...initialPos,
        ...finalPos,
      ],
    );
    const moveClip = new THREE.AnimationClip( 'nao_move', -1, [ moveKF ] );
    animationControls.initAnimation( this.nao, moveClip );

    // turn
    // Set up based on input from user

    // kick
    // for now this is a dummy KF - replace with proper animation later
    const kickKF = walkKF;
    const kickClip = new THREE.AnimationClip( 'nao_kick', -1, [ kickKF ] );
    animationControls.initAnimation( this.nao, kickClip );

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


}

