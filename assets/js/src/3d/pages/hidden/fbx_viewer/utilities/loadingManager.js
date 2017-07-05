import * as THREE from 'three';

const manager = new THREE.LoadingManager();

// hide the upload form when loading starts so that the progress bar can be shown
manager.onStart = () => {

  document.querySelector( '#file-upload-form' ).classList.add( 'hide' );
  document.querySelector( '#loading-bar' ).classList.remove( 'hide' );

};

manager.onLoad = function ( ) {

  // this doesn't fire when loading objects with a single file

  // document.querySelector( '#loading-overlay' ).classList.add( 'hide' );

};

const progress = document.querySelector( '#progress' );
manager.onProgress = ( url, currentFile, totalFiles ) => {

  const percentComplete = currentFile / totalFiles * 100;
  progress.style.width = percentComplete + '%';

};

// NOTE: A lot of unimportant errors tend to come from here,
// so these are just output as warnings to the console instead of
// using the errorHandler
manager.onError = ( msg ) => {
  console.warn( 'THREE.LoadingManager error: ' + msg );
};

export default manager;
