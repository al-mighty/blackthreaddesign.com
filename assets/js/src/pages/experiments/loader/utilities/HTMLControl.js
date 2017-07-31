// const loadOverlay =
const canvas = document.querySelector( '#viewer-canvas' );
const reset = document.querySelector( '#reset' );
const fullscreenButton = document.querySelector( '#fullscreen-button' );
const faces = document.querySelector( '#faces' );
const vertices = document.querySelector( '#vertices' );

const error = {
  overlay: document.querySelector( '#error-overlay' ),
  messages: document.querySelector( '#error-message' ),
};

const animation = {
  slider: document.querySelector( '#animation-slider' ),
  playButton: document.querySelector( '#play-button' ),
  pauseButton: document.querySelector( '#pause-button' ),
  playbackControl: document.querySelector( '#playback-control' ),
  clipsSelection: document.querySelector( '#animation-clips' ),
  controls: document.querySelector( '#animation-controls' ),
};

const fileUpload = {
  input: document.querySelector( '#file-upload-input' ),
  button: document.querySelector( '#file-upload-button' ),
  form: document.querySelector( '#file-upload-form' ),
};

const grid = {
  slider: document.querySelector( '#grid-slider' ),
};

const demos = {
  FBX: document.querySelector( '#demo-fbx' ),
  GLTF: document.querySelector( '#demo-gltf' ),
  JSONGeo: document.querySelector( '#demo-json-geo' ),
  JSONBuffer: document.querySelector( '#demo-json-buffer' ),
  JSONScene: document.querySelector( '#demo-json-scene' ),
  Collada: document.querySelector( '#demo-collada' ),
  OBJ: document.querySelector( '#demo-obj' ),
};

const lighting = {
  slider: document.querySelector( '#lighting-slider' ),
  symbol: document.querySelector( '#light-symbol' ),
};

const loading = {
  bar: document.querySelector( '#loading-bar' ),
  overlay: document.querySelector( '#loading-overlay' ),
  revealOnLoad: document.querySelector( '#reveal-on-load' ),
  hideOnLoad: document.querySelector( '.hide-on-load' ),
  progress: document.querySelector( '#progress' ),
};

const screenshot = {
  button: document.querySelector( '#screenshot-button' ),
  width: document.querySelector( '#screenshot-width' ),
  height: document.querySelector( '#screenshot-height' ),
};

const background = {
  links: document.querySelectorAll( '.fa' ),
  button: document.querySelector( '#toggle-background' ),
  sliders: document.querySelectorAll( '.loader-slider' ),
};


export default class HTMLControl {

  static setInitialState() {

  }

  static setOnLoadStartState() {

  }

  static setOnLoadEndState() {

  }

  static setBlackBackgroundState() {

  }

  static setWhiteBackgroundState() {

  }

  static addModelInfo( renderer ) {

    faces.innerHTML = renderer.info.render.faces;
    vertices.innerHTML = renderer.info.render.vertices;

  }

}

HTMLControl.canvas = canvas;
HTMLControl.reset = reset;
HTMLControl.fullscreenButton = fullscreenButton;
HTMLControl.error = error;
HTMLControl.animation = animation;
HTMLControl.fileUpload = fileUpload;
HTMLControl.grid = grid;
HTMLControl.demos = demos;
HTMLControl.lighting = lighting;
HTMLControl.loading = loading;
HTMLControl.screenshot = screenshot;
HTMLControl.background = background;
// HTMLControl.
// HTMLControl.
// HTMLControl.
// HTMLControl.
