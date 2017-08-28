import * as THREE from 'three';

import canvas from './Canvas.js';

import Loaders from './utilities/Loaders.js';
import HTMLControl from './utilities/HTMLControl.js';
import AttributeControls from './utilities/AttributeControls.js';
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

    this.controls = new AttributeControls();

  }

  loadModels() {

    const playerPromise = loaders.fbxLoader( '/assets/models/nfl/white_player_static.fbx' ).then( ( object ) => {

      this.player = object;

    } );

    const ballPromise = Promise.resolve();

    this.loadingPromises = [ playerPromise, ballPromise ];

  }

  loadAnimations() {

    animationControls.initMixer( this.player );

    const animationsNames = [
      'catch_1',
      'catch_2',
      'catch_3',
      'hike',
      'idle',
      'on_back_to_stand',
      'on_front_to_stand',
      'pass',
      'pass_1',
      'run',
      'stance',
      'stand',
    ]

    animationsNames.forEach( ( name ) => {

      this.loadingPromises.push( loaders.animationLoader( '/assets/models/nfl/anims/' + name + '.json' ).then( ( anim ) => {

        anim.name = name;
        animationControls.initAnimation( anim, name );

      } ) );

    } );

  }

  postLoad() {

    Promise.all( this.loadingPromises ).then(
      () => {

        canvas.addObjectToScene( this.player );

        this.controls.init();

        canvas.app.play();

      },
    );

  }

}
