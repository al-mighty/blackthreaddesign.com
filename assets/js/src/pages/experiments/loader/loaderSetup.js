import * as THREE from 'three';
import errorHandler from './utilities/errorHandler.js';

const revElem = document.querySelector( '.three-rev' );

if ( revElem !== undefined ) revElem.innerHTML = THREE.REVISION;

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

fullscreenButton.addEventListener( 'click', ( e ) => {

  e.preventDefault();
  goFullscreen( viewer );

}, false );

// override console functions to show errors and warnings on the page
console.warn = errorHandler;
console.error = errorHandler;
