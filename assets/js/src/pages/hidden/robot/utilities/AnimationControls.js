import * as THREE from 'three';

class AnimationControls {

  constructor( ) {

    this.isPaused = true;

    this.mixers = {};

  }

  reset() {

    this.mixers = {};
    this.isPaused = true;

  }

  update( delta ) {

    if ( this.isPaused ) return;

    Object.values( this.mixers ).forEach( ( mixer ) => {

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

  }

  play() {

    this.isPaused = false;

  }

}

const animationControls = new AnimationControls();

export default animationControls;
