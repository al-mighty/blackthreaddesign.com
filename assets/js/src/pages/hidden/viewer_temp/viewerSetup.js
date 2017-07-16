const goFullscreen = ( elem ) => {

  if ( !document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {
    if ( elem.requestFullscreen ) {
      elem.requestFullscreen();
    } else if ( elem.msRequestFullscreen ) {
      elem.msRequestFullscreen();
    } else if ( elem.mozRequestFullScreen ) {
      elem.mozRequestFullScreen();
    } else if ( elem.webkitRequestFullscreen ) {
      elem.webkitRequestFullscreen();
    }
  } else if ( document.exitFullscreen ) {
    document.exitFullscreen();
  } else if ( document.msExitFullscreen ) {
    document.msExitFullscreen();
  } else if ( document.mozCancelFullScreen ) {
    document.mozCancelFullScreen();
  } else if ( document.webkitExitFullscreen ) {
    document.webkitExitFullscreen();
  }

};

const viewer = document.querySelector( '#viewer-canvas' );
const fullscreenButton = document.querySelector( '#fullscreen-button' );
fullscreenButton.addEventListener( 'click', () => {

  goFullscreen( viewer );

} );
