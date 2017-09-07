import * as THREE from 'three';

import canvas from './Canvas.js';
import loaders from './utilities/loaders.js';
// import HTMLControl from './utilities/HTMLControl.js';
import attributeControls from './utilities/AttributeControls.js';
import animationControls from './utilities/AnimationControls.js';
import cameraControl from './utilities/cameraControl.js';
import sprites from './utilities/sprites.js';

export default class Simulation {

  constructor() {

    this.preLoad();

    this.loadModels();

    this.loadAnimations();

    this.postLoad();

  }

  preLoad() {

    // const self = this;

    this.animations = {};

    this.loadingPromises = [];

    // Put any per frame calculation here
    canvas.app.onUpdate = function () {
      // NB: use self inside this function, 'this' will refer to canvas.app
      const delta = this.delta / 1000;

      animationControls.update( delta );
      cameraControl.update( delta );
      sprites.update( delta );

    };

    // put any per resize calculations here (throttled to once per 250ms)
    canvas.app.onWindowResize = function () {
      // NB: use self inside this function, 'this' will refer to canvas.app

    };


  }

  loadModels() {

    const playerPromise = loaders.fbxLoader( '/assets/models/nfl/t_pose_rigged.fbx' ).then( ( object ) => {

      object.traverse( ( child ) => {

        // console.log( child )

        if ( child instanceof THREE.Mesh ) {

          child.frustumCulled = false;
          // child.castShadow = true;

        }


      } );

      this.player = object;

    } );

    const ballPromise = Promise.resolve();

    this.loadingPromises = [ playerPromise, ballPromise ];

  }

  loadAnimations() {

    const animationsNames = [
      'catch_to_fall',
      'catch_to_roll',
      'defeat',
      'hike',
      'idle_transition_long',
      'idle_transition_short',
      'offensive_idle',
      'pass_left_hand',
      'pass_right_hand',
      'pushup_to_idle',
      'run',
      'situp_to_idle',
      'victory',
    ];

    this.animations = [];

    animationsNames.forEach( ( name ) => {

      this.loadingPromises.push( loaders.animationLoader( '/assets/models/nfl/anims/' + name + '.json' ).then( ( anim ) => {

        anim.name = name;
        this.animations.push( anim );

      } ) );

    } );

  }

  postLoad() {

    Promise.all( this.loadingPromises ).then(
      () => {

        canvas.app.scene.add( this.player );

        canvas.app.play();

        animationControls.initMixer( this.player );

        this.animations.forEach( ( anim ) => {

          animationControls.initAnimation( anim );

        } );

        animationControls.playAction( 'offensive_idle' );

        attributeControls.init( this.player );
        attributeControls.initAnimationControls( animationControls );
        attributeControls.enableControls();
        cameraControl.init( this.player );
        sprites.init( this.player );

      },
    );

  }

}