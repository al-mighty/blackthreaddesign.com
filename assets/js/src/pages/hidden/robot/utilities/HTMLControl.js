const canvas = document.querySelector( '#viewer-canvas' );
const container = document.querySelector( '#view-container' );

const ballPosition = document.querySelector( '#ball_position' );
const equation = document.querySelector( '#equation' );

const loading = {
  bar: document.querySelector( '#loading-bar' ),
  overlay: document.querySelector( '#loading-overlay' ),
  progress: document.querySelector( '#progress' ),
};

const controls = {
  reset: document.querySelector( '#reset' ),
  randomize: document.querySelector( '#randomize' ),
  slope: document.querySelector( '#slope' ),
  simulate: document.querySelector( '#simulate' ),
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
    loading.progress.style.width = '0%';

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
HTMLControl.loading = loading;
HTMLControl.controls = controls;
