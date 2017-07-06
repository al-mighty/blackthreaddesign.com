// import throttle from 'lodash.throttle';
// import * as Ham from 'hammerjs';

// const Hammer = Ham.default;

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

const viewer = document.querySelector( '#view-container' );

const helpButton = document.querySelector( '#help-button' );
const settingsButton = document.querySelector( '#settings-button' );
const fullscreenButton = document.querySelector( '#fullscreen-button' );

const helpOverLay = document.querySelector( '#help-overlay' );
const settingsOverlay = document.querySelector( '#settings-overlay' );

helpButton.addEventListener( 'click', () => {
  settingsOverlay.classList.add( 'hide' );
  helpOverLay.classList.toggle( 'hide' );
} );

settingsButton.addEventListener( 'click', () => {
  helpOverLay.classList.add( 'hide' );
  settingsOverlay.classList.toggle( 'hide' );
} );

fullscreenButton.addEventListener( 'click', () => {
  goFullscreen( viewer );
} );

// export default function fbxViewerLayout() {

  // window.addEventListener( 'resize', throttle( () => { } ), 250 );

// }
