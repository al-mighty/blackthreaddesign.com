import throttle from 'lodash.throttle';
import * as THREE from 'three';

import HTMLControl from './HTMLControl.js';

export default class AnimationControls {

  constructor( ) {

    this.isPaused = false;
    this.pauseButtonActive = false;

    this.clips = [];
    this.mixers = [];
    this.actions = [];
    this.animationNames = [];

  }

  reset() {

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

      if ( !( animation instanceof THREE.AnimationClip ) ) {

        console.warn( 'Some animations are not valid THREE.AnimationClips. Skipping these.' );

        return;

      }

      const mixer = new THREE.AnimationMixer( object );

      const action = mixer.clipAction( animation );

      this.clips.push( animation );
      this.mixers.push( mixer );
      this.actions.push( action );
      this.animationNames.push( animation.name );

      HTMLControl.animation.clipsSelection.appendChild( new Option( animation.name, animation.name ) );

    } );

    // If all animations have been skipped, return
    if ( this.animationNames.length === 0 ) return;

    this.selectCurrentAnimation( this.animationNames[ 0 ] );

    HTMLControl.animation.controls.classList.remove( 'hide' );

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
      HTMLControl.animation.slider.max = String( this.currentClip.duration );

      HTMLControl.animation.slider.step = String( this.currentClip.duration / 150 );

      this.currentAction.play();

    }

  }

  setSliderValue( val ) {

    HTMLControl.animation.slider.value = String( val );

  }

  initPlaybackControls() {

    HTMLControl.animation.playbackControl.addEventListener( 'click', ( e ) => {

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
    HTMLControl.animation.playButton.classList.remove( 'hide' );
    HTMLControl.animation.pauseButton.classList.add( 'hide' );

  }

  play() {

    this.isPaused = false;
    HTMLControl.animation.playButton.classList.add( 'hide' );
    HTMLControl.animation.pauseButton.classList.remove( 'hide' );

  }

  initSlider() {

    HTMLControl.animation.slider.addEventListener( 'mousedown', ( e ) => {

      // e.preventDefault();
      if ( !this.pauseButtonActive ) this.pause();

    } );

    HTMLControl.animation.slider.addEventListener( 'input', throttle( ( e ) => {

      // e.preventDefault();
      const oldTime = this.currentMixer.time;
      const newTime = HTMLControl.animation.slider.value;

      this.currentMixer.update( newTime - oldTime );

    }, 17 ), false ); // throttling at ~17 ms will give approx 60fps while sliding the controls

    HTMLControl.animation.slider.addEventListener( 'mouseup', ( e ) => {

      // e.preventDefault();
      if ( !this.pauseButtonActive ) this.play();

    }, false );

  }

  initSelectionMenu() {

    HTMLControl.animation.clipsSelection.selectedIndex = 1;

    HTMLControl.animation.clipsSelection.addEventListener( 'change', ( e ) => {

      e.preventDefault();
      if ( e.target.value === 'static' ) {

        this.currentAction.stop();

      } else {

        this.selectCurrentAnimation( e.target.value );

      }

    }, false );

  }

}
