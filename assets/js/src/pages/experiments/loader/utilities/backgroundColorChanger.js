import HTMLControl from './HTMLControl.js';

const backgroundColorChanger = ( app ) => {

  let toggled = false;

  HTMLControl.background.button.addEventListener( 'click', ( e ) => {

    e.preventDefault();
    if ( toggled ) {

      app.renderer.setClearColor( 0x000000, 1.0 );
      for ( let i = 0; i < HTMLControl.background.links.length; i++ ) {

        HTMLControl.background.links[ i ].style.color = 'white';

      }

      for ( let i = 0; i < HTMLControl.background.sliders.length; i++ ) {

        HTMLControl.background.sliders[ i ].style.backgroundColor = 'white';
        HTMLControl.background.sliders[ i ].classList.remove( 'white-slider' );

      }

    } else {

      app.renderer.setClearColor( 0xf7f7f7, 1.0 );
      for ( let i = 0; i < HTMLControl.background.links.length; i++ ) {

        HTMLControl.background.links[ i ].style.color = 'black';

      }

      for ( let i = 0; i < HTMLControl.background.sliders.length; i++ ) {

        HTMLControl.background.sliders[ i ].style.backgroundColor = '#424242';
        HTMLControl.background.sliders[ i ].classList.add( 'white-slider' );
      }
    }

    toggled = !toggled;

  }, false );

};

export default backgroundColorChanger;
