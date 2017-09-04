import * as THREE from 'three';

class AnimationControls {

  constructor( ) {

    this.isPaused = true;

    this.actions = {};

    this.currentAction = null;

  }

  initMixer( object ) {

    this.mixer = new THREE.AnimationMixer( object );

  }

  update( delta ) {

    if ( this.isPaused ) return;

    if ( this.mixer !== undefined ) this.mixer.update( delta / 1000 );

  }

  play() {

    this.isPaused = false;

  }

  pause() {

    this.isPaused = true;

  }

  playAction( name ) {

    if ( this.currentAction && this.currentAction.name === name ) return;

    let actionFound = false;

    Object.values( this.actions ).forEach( ( action ) => {

      if ( action.name === name ) {

        this.currentAction = action;

        action.play();

        this.isPaused = false;

        actionFound = true;

      } else action.stop();

    } );

    if ( !actionFound ) {

      console.warn( 'Action \'' + name + '\' was not found.' );
      this.isPaused = true;

    }

  }

  setTimeScale( timeScale, name ) {

    const action = this.actions[ name ];

    if ( action === undefined ) {

      console.warn( 'Setting TimeScale: Action \'' + name + '\' was not found' );
      return;

    }

    const currentTimeScale = action.getEffectiveTimeScale();

    action.warp( currentTimeScale, timeScale, 0.25 );

  }

  initAnimation( animationClip, optionalRoot ) {

    const action = this.mixer.clipAction( animationClip, optionalRoot );

    action.name = animationClip.name;

    this.actions[ animationClip.name ] = action;

  }

}

const animationControls = new AnimationControls();

export default animationControls;

