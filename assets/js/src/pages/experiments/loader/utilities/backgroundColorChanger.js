const backgroundColorChanger = ( app ) => {

  const controlLinks = document.querySelectorAll( '.fa' );

  const sliders = document.querySelectorAll( '.loader-slider' );

  const toggle = document.querySelector( '#toggle-background' );

  let toggled = false;


  toggle.addEventListener( 'click', ( e ) => {

    e.preventDefault();
    if ( toggled ) {

      app.renderer.setClearColor( 0x000000, 1.0 );
      for ( let i = 0; i < controlLinks.length; i++ ) {

        controlLinks[ i ].style.color = 'white';

      }

      for ( let i = 0; i < sliders.length; i++ ) {

        sliders[ i ].style.backgroundColor = 'white';
        sliders[ i ].classList.remove( 'white-slider' );

      }

    } else {

      app.renderer.setClearColor( 0xf7f7f7, 1.0 );
      for ( let i = 0; i < controlLinks.length; i++ ) {

        controlLinks[ i ].style.color = 'black';

      }

      for ( let i = 0; i < sliders.length; i++ ) {

        sliders[ i ].style.backgroundColor = '#424242';
        sliders[ i ].classList.add( 'white-slider' );
      }
    }

    toggled = !toggled;

  }, false );

};

export default backgroundColorChanger;
