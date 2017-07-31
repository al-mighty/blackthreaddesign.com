import throttle from 'lodash.throttle';

import HTMLControl from './HTMLControl.js';

export default class ScreenshotHandler {

  constructor( app ) {

    this.app = app;

    HTMLControl.screenshot.width.value = app.canvas.clientWidth;
    HTMLControl.screenshot.height.value = app.canvas.clientHeight;

    this.initButton();

    window.addEventListener( 'resize', throttle( () => {

      HTMLControl.screenshot.width.value = app.canvas.clientWidth;
      HTMLControl.screenshot.height.value = app.canvas.clientHeight;

    }, 250 ), false );

  }

  initButton() {

    HTMLControl.screenshot.button.addEventListener( 'click', throttle( ( e ) => {

      e.preventDefault();
      const width = HTMLControl.screenshot.width.value;
      const height = HTMLControl.screenshot.height.value;

      const img = this.app.takeScreenshot( width, height );

      const w = window.open( '' );
      w.document.write( '<title>Three.js Loader screenshot</title>' );
      w.document.write( img.outerHTML );

    }, 1000 ), false );
  }

}
