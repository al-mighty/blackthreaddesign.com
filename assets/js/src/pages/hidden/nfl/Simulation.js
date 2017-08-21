import * as THREE from 'three';

import canvas from './Canvas.js';

import Loaders from './utilities/Loaders.js';
import HTMLControl from './utilities/HTMLControl.js';
import animationControls from './utilities/AnimationControls.js';

const loaders = new Loaders();

export default class Simulation {

  constructor() {

    this.preLoad();

    this.loadModels();

    this.loadAnimations();

    this.postLoad();

  }

  preLoad() {

    this.animations = {};

    this.loadingPromises = [];

  }

  loadModels() {

    const playerPromise = loaders.fbxLoader( '/assets/models/nfl/test.fbx' ).then( ( object ) => {

      this.player = object;

    } );

    const ballPromise = Promise.resolve();

    this.loadingPromises = [ playerPromise, ballPromise ];

  }

  loadAnimations() {

    const idlePromise = loaders.animationLoader( '/assets/models/nfl/anims/offensive_idle.json' ).then( ( object ) => {

      console.log( object );

      this.animations.idle = object;

    } );

    this.loadingPromises.push( idlePromise );

  }

  postLoad() {

    Promise.all( this.loadingPromises ).then(
      () => {

        this.addObjectsToScene();

        this.initAnimations();

        canvas.app.play();

        animationControls.play();

      },
    );

  }

  addObjectsToScene() {

    canvas.addObjectToScene( this.player );

  }

  initAnimations() {

    const mixer = new THREE.AnimationMixer( this.player );
    mixer.name = 'mixer';

    animationControls.initAnimation( this.player, this.animations.idle, mixer, 0 );

  }

}
