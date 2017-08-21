import HTMLControl from './utilities/HTMLControl.js';

const onFullscreen = () => {

  HTMLControl.masthead.classList.add( 'hide' );
  HTMLControl.footer.classList.add( 'hide' );

};

const onExitFullscreen = () => {

  HTMLControl.masthead.classList.remove( 'hide' );
  HTMLControl.footer.classList.remove( 'hide' );

};


const goFullscreen = ( elem ) => {

  if ( !document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {

    if ( elem.requestFullscreen ) {

      onFullscreen();
      elem.requestFullscreen();

    } else if ( elem.msRequestFullscreen ) {

      onFullscreen();
      elem.msRequestFullscreen();

    } else if ( elem.mozRequestFullScreen ) {

      onFullscreen();
      elem.mozRequestFullScreen();

    } else if ( elem.webkitRequestFullscreen ) {

      onFullscreen();
      elem.webkitRequestFullscreen();

    }

  } else if ( document.exitFullscreen ) {

    onExitFullscreen();
    document.exitFullscreen();

  } else if ( document.msExitFullscreen ) {

    onExitFullscreen();
    document.msExitFullscreen();

  } else if ( document.mozCancelFullScreen ) {

    onExitFullscreen();
    document.mozCancelFullScreen();

  } else if ( document.webkitExitFullscreen ) {

    onExitFullscreen();
    document.webkitExitFullscreen();

  }

};

HTMLControl.controls.fullscreen.addEventListener( 'click', ( e ) => {

  e.preventDefault();
  goFullscreen( HTMLControl.container );

}, false );
