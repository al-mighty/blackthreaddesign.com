import * as THREE from 'three';

const manager = new THREE.LoadingManager();

manager.onStart = () => {

  // needs to be called earlier

  // document.querySelector( '#file-upload-form' ).classList.add( 'hide' );
  // document.querySelector( '#loading-bar' ).classList.remove( 'hide' );

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

manager.onError = ( msg ) => {

  document.querySelector( '#error-overlay' ).classList.remove( 'hide' );
  document.querySelector( '#error-message' ).innerHTML = msg;

};

export default manager;
