const backgroundColorChanger = ( app ) => {

  const controlLinks = document.querySelector( '#bottom-controls' ).getElementsByTagName( 'a' );

  const toggle = document.querySelector( '#toggle-background' );

  toggle.addEventListener( 'change', () => {
    if ( toggle.checked ) {

      app.renderer.setClearColor( 0x000000, 1.0 );
      for ( let i = 0; i < controlLinks.length; i++ ) {

        controlLinks[ i ].style.color = 'white';

      }

    } else {

      app.renderer.setClearColor( 0xf7f7f7, 1.0 );
      for ( let i = 0; i < controlLinks.length; i++ ) {

        controlLinks[ i ].style.color = 'black';

      }
    }
  } );

};

export default backgroundColorChanger;
