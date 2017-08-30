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
  progress: document.querySelector( '#progress' ),
};

const controls = {
  links: document.querySelector( '#controls' ).querySelectorAll( 'span' ),
  reset: document.querySelector( '#reset' ),
  randomize: document.querySelector( '#randomize' ),
  slope: document.querySelector( '#slope' ),
  simulate: document.querySelector( '#simulate' ),
  fullscreen: document.querySelector( '#fullscreen-button' ),
  showGrid: document.querySelector( '#show-grid' ),
};

export default class HTMLControl {

  static setInitialState() {

    controls.slope.value = 0;

    controls.simulate.disabled = false;
    controls.slope.disabled = false;
    controls.randomize.disabled = false;
    controls.reset.disabled = true;
    controls.showGrid.disabled = false;

  }

  static setOnLoadStartState() {

    loading.bar.classList.remove( 'hide' );

  }

  static setOnLoadEndState() {

    loading.overlay.classList.add( 'hide' );

  }

  static setOnSimulateState() {

    controls.simulate.disabled = true;
    controls.slope.disabled = true;
    controls.reset.disabled = false;

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
