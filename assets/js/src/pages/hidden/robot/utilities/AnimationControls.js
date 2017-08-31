import * as THREE from 'three';

class AnimationControls {

  constructor( ) {

    this.isPaused = true;

    this.mixers = {};

    this.actions = [];

  }

  reset() {

    this.actions.forEach( ( action ) => {

      action.stop();

    } );

    Object.values( this.mixers ).forEach( ( mixer ) => {

      mixer.time = 0;
      mixer.stopAllAction();

    } );


    this.mixers = {};
    this.actions = [];
    this.isPaused = true;

  }

  update( delta ) {

    if ( this.isPaused ) return;

    Object.values( this.mixers ).forEach( ( mixer ) => {

      // divide by 1000 to convert seconds to milliseconds
      mixer.update( delta / 1000 );

    } );

  }

  initAnimation( object, animationClip, mixer, startAt ) {

    const action = mixer.clipAction( animationClip );
    action.clampWhenFinished = true;
    action.loop = THREE.LoopOnce;

    if ( startAt !== undefined ) action.startAt( startAt );

    action.play();

    if ( !this.mixers[mixer.name] ) this.mixers[ mixer.name ] = mixer;

    this.actions.push( action );

  }

  play() {

    this.isPaused = false;

  }

  pause() {

    this.isPaused = true;

  }

}

const animationControls = new AnimationControls();

export default animationControls;
