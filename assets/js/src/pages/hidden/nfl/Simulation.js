import * as THREE from 'three';

import canvas from './Canvas.js';
import Loaders from './utilities/Loaders.js';
// import HTMLControl from './utilities/HTMLControl.js';
import AttributeControls from './utilities/AttributeControls.js';
import animationControls from './utilities/AnimationControls.js';
import cameraControl from './utilities/cameraControl.js';

const loaders = new Loaders();

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

    this.attributeControls = new AttributeControls();

    // Put any per frame calculation here
    canvas.app.onUpdate = function () {
      // NB: use self inside this function, 'this' will refer to canvas.app

      animationControls.update( this.delta );
      cameraControl.update( this.delta );

    };

    // put any per resize calculations here (throttled to once per 250ms)
    canvas.app.onWindowResize = function () {
      // NB: use self inside this function, 'this' will refer to canvas.app

    };


  }

  loadModels() {

    const playerPromise = loaders.fbxLoader( '/assets/models/nfl/white_player_static.fbx' ).then( ( object ) => {

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
      'catch_1',
      'catch_2',
      'catch_3',
      'hike',
      'idle',
      'on_back_to_stand',
      'on_front_to_stand',
      'pass',
      'run',
      'stance',
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

        animationControls.playAction( 'idle' );

        this.attributeControls.initAnimationControls( animationControls );

        this.attributeControls.enableControls();

        cameraControl.init( this.player );

      },
    );

  }

}
