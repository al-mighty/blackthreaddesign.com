const canvas = document.querySelector( '#viewer-canvas' );
const container = document.querySelector( '#view-container' );

const ballPosition = document.querySelector( '#ball_position' );
const equation = document.querySelector( '#equation' );


const error = {
  overlay: document.querySelector( '#error-overlay' ),
  messages: document.querySelector( '#error-messages' ),
};

const animation = {
  slider: document.querySelector( '#animation-slider' ),
  playButton: document.querySelector( '#play-button' ),
  pauseButton: document.querySelector( '#pause-button' ),
  playbackControl: document.querySelector( '#playback-control' ),
  clipsSelection: document.querySelector( '#animation-clips' ),
  controls: document.querySelector( '#animation-controls' ),
};

const loading = {
  bar: document.querySelector( '#loading-bar' ),
  overlay: document.querySelector( '#loading-overlay' ),
  revealOnLoad: document.querySelectorAll( '.reveal-on-load' ),
  hideOnLoad: document.querySelectorAll( '.hide-on-load' ),
  progress: document.querySelector( '#progress' ),
};

const controls = {
  links: document.querySelector( '#controls' ).querySelectorAll( 'span' ),
  reset: document.querySelector( '#reset' ),
  slope: document.querySelector( '#slope' ),
  simulate: document.querySelector( '#simulate' ),
  fullscreen: document.querySelector( '#fullscreen-button' ),
};

export default class HTMLControl {

  static setInitialState() {
    controls.slope.value = 0;

    error.overlay.classList.add( 'hide' );
    error.messages.innerHTML = '';

    controls.simulate.disabled = false;
    controls.slope.disabled = false;
    controls.reset.disabled = true;

  }

  static setOnLoadStartState() {
    loading.bar.classList.remove( 'hide' );
  }

  static setOnLoadEndState() {
    loading.overlay.classList.add( 'hide' );

    for ( let i = 0; i < loading.hideOnLoad.length; i++ ) {

      loading.hideOnLoad[ i ].classList.add( 'hide' );

    }

    for ( let i = 0; i < loading.revealOnLoad.length; i++ ) {

      loading.revealOnLoad[ i ].classList.remove( 'hide' );

    }
  }

}

HTMLControl.canvas = canvas;
HTMLControl.container = container;
HTMLControl.ballPosition = ballPosition;
HTMLControl.equation = equation;
HTMLControl.error = error;
HTMLControl.animation = animation;
HTMLControl.loading = loading;
HTMLControl.controls = controls;
