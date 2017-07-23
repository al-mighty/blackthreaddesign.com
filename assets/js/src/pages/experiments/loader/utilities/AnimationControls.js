import throttle from 'lodash.throttle';

import * as THREE from 'three';

export default class AnimationControls {

  constructor( ) {

    this.slider = document.querySelector( '#animation-slider' );
    this.playButton = document.querySelector( '#play-button' );
    this.pauseButton = document.querySelector( '#pause-button' );
    this.playbackControl = document.querySelector( '#playback-control' );

    this.clipsSelection = document.querySelector( '#animation-clips' );

    this.controls = document.querySelector( '#animation-controls' );

    this.isPaused = false;
    this.pauseButtonActive = false;

    this.clips = [];
    this.mixers = [];
    this.actions = [];
    this.animationNames = [];

  }

  update( delta ) {

    // delta is in seconds while animations are in milliseconds so convert here
    if ( this.currentMixer && this.currentAction && !this.isPaused ) {

      this.currentMixer.update( delta / 1000 );

      // this.currentMixer.time increases indefinitely, whereas this.currentAction.time increases modulo
      // the animation duration, so set the slider value from that
      this.setSliderValue( this.currentAction.time );

    }

  }

  initAnimation( object ) {

    // don't do anything if the object has no animations
    if ( !object.animations || object.animations.length === 0 ) return;

    object.animations.forEach( ( animation ) => {

      // lots of models have tiny < .1 second animations that cause
      // flickering / stuttering - ignore these
      if ( animation.duration < 0.1 ) {

        console.warn( 'Skipping animation with duration < 0.1 seconds: ' + animation.name );

      } else {

        const mixer = new THREE.AnimationMixer( object );

        const action = mixer.clipAction( animation );

        this.clips.push( animation );
        this.mixers.push( mixer );
        this.actions.push( action );
        this.animationNames.push( animation.name );

        this.clipsSelection.appendChild( new Option( animation.name, animation.name ) );

      }

    } );

    this.selectCurrentAnimation( this.animationNames[ 0 ] );

    document.querySelector( '#animation-controls' ).classList.remove( 'hide' );

    this.initPlaybackControls();

    this.initSlider();

    this.initSelectionMenu();

  }

  selectCurrentAnimation( name ) {

    const index = this.animationNames.indexOf( name );

    if ( index === -1 ) {

      console.warn( 'Animation ' + name + ' not found.' );

    } else {

      if ( this.currentAction ) this.currentAction.stop();

      this.currentMixer = this.mixers[ index ];
      this.currentAction = this.actions[ index ];
      this.currentClip = this.clips[ index ];

      // set animation slider max to length of animation
      this.slider.max = String( this.currentClip.duration );

      this.slider.step = String( this.currentClip.duration / 150 );

      this.currentAction.play();

    }

  }

  setSliderValue( val ) {

    this.slider.value = String( val );

  }

  initPlaybackControls() {

    this.playbackControl.addEventListener( 'click', ( e ) => {

      e.preventDefault();

      if ( !this.isPaused ) {

        this.pauseButtonActive = true;

      } else {

        this.pauseButtonActive = false;

      }

      this.togglePause();

    }, false );

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

    this.slider.addEventListener( 'mousedown', ( e ) => {

      // e.preventDefault();
      if ( !this.pauseButtonActive ) this.pause();

    } );

    this.slider.addEventListener( 'input', throttle( ( e ) => {

      // e.preventDefault();
      const oldTime = this.currentMixer.time;
      const newTime = this.slider.value;

      this.currentMixer.update( newTime - oldTime );

    }, 17 ), false ); // throttling at ~17 ms will give approx 60fps while sliding the controls

    this.slider.addEventListener( 'mouseup', ( e ) => {

      // e.preventDefault();
      if ( !this.pauseButtonActive ) this.play();

    }, false );

  }

  initSelectionMenu() {

    this.clipsSelection.selectedIndex = 1;

    this.clipsSelection.addEventListener( 'change', ( e ) => {

      e.preventDefault();
      if ( e.target.value === 'static' ) {

        this.currentAction.stop();

      } else {

        this.selectCurrentAnimation( e.target.value );

      }

    }, false );

  }

}
