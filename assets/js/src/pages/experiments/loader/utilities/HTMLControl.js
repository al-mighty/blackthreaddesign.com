// const loadOverlay =
const canvas = document.querySelector( '#loader-canvas' );
const reset = document.querySelector( '#reset' );
const exportBtn = document.querySelector( '#export' );
const exportAnims = document.querySelector( '#export-anims' );
const fullscreenButton = document.querySelector( '#fullscreen-button' );
const faces = document.querySelector( '#faces' );
const vertices = document.querySelector( '#vertices' );

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
  revealOnLoad: document.querySelectorAll( '.reveal-on-load' ),
  hideOnLoad: document.querySelectorAll( '.hide-on-load' ),
  progress: document.querySelector( '#progress' ),
};

const screenshot = {
  button: document.querySelector( '#screenshot-button' ),
  width: document.querySelector( '#screenshot-width' ),
  height: document.querySelector( '#screenshot-height' ),
};

const controls = {
  links: document.querySelector( '#controls' ).querySelectorAll( 'span' ),
  button: document.querySelector( '#toggle-background' ),
  sliders: document.querySelectorAll( '.loader-slider' ),
};


export default class HTMLControl {

  static setInitialState() {
    loading.overlay.classList.remove( 'hide' );
    fileUpload.form.classList.remove( 'hide' );
    loading.bar.classList.add( 'hide' );
    loading.progress.style.width = 0;

    error.overlay.classList.add( 'hide' );
    error.messages.innerHTML = '';

    animation.controls.classList.add( 'hide' );
    animation.playButton.classList.add( 'hide' );
    animation.pauseButton.classList.remove( 'hide' );

    for ( let i = 0; i < loading.hideOnLoad.length; i++ ) {

      loading.hideOnLoad[ i ].classList.remove( 'hide' );

    }

    for ( let i = 0; i < loading.revealOnLoad.length; i++ ) {

      loading.revealOnLoad[ i ].classList.add( 'hide' );

    }

    // reset animations options
    const base = animation.clipsSelection.children[ 0 ];
    animation.clipsSelection.innerHTML = '';
    animation.clipsSelection.appendChild( base );
  }

  static setOnLoadStartState() {
    fileUpload.form.classList.add( 'hide' );
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

  static setBlackBackgroundState() {
    for ( let i = 0; i < controls.links.length; i++ ) {

      controls.links[ i ].style.color = 'white';

    }

    for ( let i = 0; i < controls.sliders.length; i++ ) {

      controls.sliders[ i ].style.backgroundColor = 'white';

    }
  }

  static setWhiteBackgroundState() {
    for ( let i = 0; i < HTMLControl.controls.links.length; i++ ) {

      controls.links[ i ].style.color = 'black';

    }

    for ( let i = 0; i < HTMLControl.controls.sliders.length; i++ ) {

      controls.sliders[ i ].style.backgroundColor = '#424242';

    }
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
HTMLControl.controls = controls;
HTMLControl.export = exportBtn;
HTMLControl.exportAnims = exportAnims;
// HTMLControl.
// HTMLControl.
// HTMLControl.
