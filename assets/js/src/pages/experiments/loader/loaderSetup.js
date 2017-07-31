import * as THREE from 'three';
import errorHandler from './utilities/errorHandler.js';
import './utilities/initDemos.js';
import HTMLControl from './utilities/HTMLControl.js';

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

HTMLControl.fullscreenButton.addEventListener( 'click', ( e ) => {

  e.preventDefault();
  goFullscreen( HTMLControl.canvas );

}, false );

// override console functions to show errors and warnings on the page
console.warn = errorHandler;
console.error = errorHandler;
