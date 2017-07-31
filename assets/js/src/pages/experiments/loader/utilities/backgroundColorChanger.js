import HTMLControl from './HTMLControl.js';

const backgroundColorChanger = ( app ) => {

  let toggled = true;

  HTMLControl.controls.button.addEventListener( 'click', ( e ) => {

    e.preventDefault();
    if ( toggled ) {

      app.renderer.setClearColor( 0x000000, 1.0 );
      HTMLControl.setBlackBackgroundState();

    } else {

      app.renderer.setClearColor( 0xf7f7f7, 1.0 );
      HTMLControl.setWhiteBackgroundState();

    }

    toggled = !toggled;

  }, false );

};

export default backgroundColorChanger;
