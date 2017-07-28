import * as THREE from 'three';

const manager = new THREE.LoadingManager();

// hide the upload form when loading starts so that the progress bar can be shown
manager.onStart = () => {

  // console.log( 'manager.onstart' )
  document.querySelector( '#file-upload-form' ).classList.add( 'hide' );
  document.querySelector( '#loading-bar' ).classList.remove( 'hide' );

};

manager.onLoad = function ( ) {

  // console.log( 'manager.onload' );
  document.querySelector( '#loading-overlay' ).classList.add( 'hide' );
  document.querySelector( '#reveal-on-load' ).classList.remove( 'hide' );
  document.querySelector( '.hide-on-load' ).classList.add( 'hide' );

};

const progress = document.querySelector( '#progress' );
manager.onProgress = ( url, currentFile, totalFiles ) => {

  const percentComplete = currentFile / totalFiles * 100;
  progress.style.width = percentComplete + '%';

};

manager.onError = ( msg ) => {
  if ( msg instanceof String && msg !== '' ) console.error( 'THREE.LoadingManager error: ' + msg );
};

export default manager;
