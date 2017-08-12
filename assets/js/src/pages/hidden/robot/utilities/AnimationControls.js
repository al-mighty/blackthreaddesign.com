import * as THREE from 'three';

class AnimationControls {

  constructor( ) {

    this.isPaused = true;

    this.mixers = {};

    this.actions = [];

  }

  reset() {

    this.mixers = {};
    this.actions = [];
    this.isPaused = true;

    // this.setTimeScales( -3 );

  }

  update( delta ) {

    if ( this.isPaused ) return;

    Object.values( this.mixers ).forEach( ( mixer ) => {

      mixer.update( delta / 1000 );

    } );

  }

  setTimeScales( timeScale ) {

    this.actions.forEach( ( action ) => {

      action.timeScale = timeScale;

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

}

const animationControls = new AnimationControls();

export default animationControls;
