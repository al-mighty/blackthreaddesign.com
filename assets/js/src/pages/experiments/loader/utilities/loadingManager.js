import * as THREE from 'three';

import HTMLControl from './HTMLControl.js';

const loadingManager = new THREE.LoadingManager();

let percentComplete = 0;

// hide the upload form when loading starts so that the progress bar can be shown
loadingManager.onStart = ( url, itemsLoaded, itemsTotal ) => {
  percentComplete = 0;
  HTMLControl.setOnLoadStartState();

};

loadingManager.onLoad = function ( ) {

  HTMLControl.setOnLoadEndState();

};

loadingManager.onProgress = ( url, currentFile, totalFiles ) => {

  // console.log( 'on progress ', percentComplete)
  if ( percentComplete < 100 ) {

    percentComplete += ( 10 / totalFiles );
    HTMLControl.loading.progress.style.width = percentComplete + '%';

  }

};

loadingManager.onError = ( msg ) => {

  if ( msg instanceof String && msg !== '' ) console.error( 'THREE.LoadingManager error: ' + msg );
  else console.log( msg );

};

export default loadingManager;
