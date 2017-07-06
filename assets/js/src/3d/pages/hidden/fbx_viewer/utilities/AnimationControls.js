import throttle from 'lodash.throttle';

import * as THREE from 'three';

export default class AnimationControls {

  constructor( ) {

    this.slider = document.querySelector( '#animation-slider' );
    this.playButton = document.querySelector( '#play-button' );
    this.pauseButton = document.querySelector( '#pause-button' );
    this.playbackControl = document.querySelector( '#playback-control' );

    this.controls = document.querySelector( '#animation-controls' );

    this.isPaused = false;
    this.pauseButtonActive = false;

  }

  update( delta ) {

    // delta is in seconds while fbx animations are in milliseconds so convert here
    if ( this.mixer && this.action && !this.isPaused ) {

      this.mixer.update( delta / 1000 );

      // this.mixer.time increases indefinitely, whereas this.action.time increases modulo
      // the animation duration, so set the slider value from that
      this.setSliderValue( this.action.time );

    }

  }

  initAnimation( object ) {

    // don't do anything if the object has no animations
    if ( object.animations.length === 0 ) return;

    const animation = object.animations[ 0 ];

    // lots of models have tiny < .1 second animations that cause
    // flickering / stuttering - ignore these
    if ( animation.duration < 0.1 ) {

      console.warn( 'Skipping animation with duration < 0.1 seconds.' );
      return;

    }

    // set animation slider max to length of animation
    this.slider.max = String( animation.duration );

    this.slider.step = String( animation.duration / 150 );

    this.mixer = new THREE.AnimationMixer( object );

    this.action = this.mixer.clipAction( animation );

    this.action.play();

    document.querySelector( '#animation-controls' ).classList.remove( 'hide' );

    this.initPlaybackControls();

    this.initSlider();

  }

  setSliderValue( val ) {

    this.slider.value = String( val );

  }

  initPlaybackControls() {

    this.playbackControl.addEventListener( 'click', () => {

      if ( !this.isPaused ) {

        this.pauseButtonActive = true;

      } else {

        this.pauseButtonActive = false;

      }

      this.togglePause();

    } );

  }

  togglePause() {

    if ( !this.isPaused ) {

      this.pause();

    } else {

      this.play();

    }

  }

  pause() {

    this.isPaused = true;
    this.playButton.classList.remove( 'hide' );
    this.pauseButton.classList.add( 'hide' );

  }

  play() {

    this.isPaused = false;
    this.playButton.classList.add( 'hide' );
    this.pauseButton.classList.remove( 'hide' );

  }

  initSlider() {

    this.slider.addEventListener( 'mousedown', () => {

      if ( !this.pauseButtonActive ) this.pause();

    } );

    this.slider.addEventListener( 'input', throttle( () => {

      const oldTime = this.mixer.time;
      const newTime = this.slider.value;

      this.mixer.update( newTime - oldTime );

    }, 17 ) ); // throttling at ~17 ms will give approx 60fps while sliding the controls

    this.slider.addEventListener( 'mouseup', () => {

      if ( !this.pauseButtonActive ) this.play();

    } );

  }
}
