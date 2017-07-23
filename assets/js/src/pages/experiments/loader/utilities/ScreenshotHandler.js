import throttle from 'lodash.throttle';

export default class ScreenshotHandler {

  constructor( app ) {

    this.app = app;

    this.button = document.querySelector( '#screenshot-button' );
    this.widthSelector = document.querySelector( '#screenshot-width' );
    this.heightSelector = document.querySelector( '#screenshot-height' );

    this.widthSelector.value = app.canvas.clientWidth;
    this.heightSelector.value = app.canvas.clientHeight;

    this.initButton();

    window.addEventListener( 'resize', throttle( () => {

      this.widthSelector.value = app.canvas.clientWidth;
      this.heightSelector.value = app.canvas.clientHeight;

    }, 250 ), false );

  }

  initButton() {

    this.button.addEventListener( 'click', throttle( ( e ) => {

      e.preventDefault();
      const width = this.widthSelector.value;
      const height = this.heightSelector.value;

      const img = this.app.takeScreenshot( width, height );

      const w = window.open( '' );
      w.document.write( '<title>Three.js Loader screenshot</title>' );
      w.document.write( img.outerHTML );

    }, 1000 ), false );
  }

}
