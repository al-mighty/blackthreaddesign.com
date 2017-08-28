import * as THREE from 'three';

class AnimationControls {

  constructor( ) {

    this.actions = {};

  }

  initMixer( object ) {

    this.mixer = new THREE.AnimationMixer( object );

  }

  update( delta ) {

    this.mixer.update( delta / 1000 );

  }

  setTimeScales( name ) {

    // set time scale of a particular action

  }

  initAnimation( animationClip, name ) {

    console.log(  animationClip )

    const action = this.mixer.clipAction( animationClip );

    this.actions[ name ] = action;

    action.play();


  }

}

const animationControls = new AnimationControls();

export default animationControls;

