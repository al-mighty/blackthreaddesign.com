import * as THREE from 'three';

import HTMLControl from './HTMLControl.js';

const manager = new THREE.LoadingManager();

// hide the upload form when loading starts so that the progress bar can be shown
manager.onStart = () => {

  HTMLControl.setOnLoadStartState();

};

manager.onLoad = function ( ) {

  HTMLControl.setOnLoadEndState();

};

manager.onProgress = ( url, currentFile, totalFiles ) => {

  const percentComplete = currentFile / totalFiles * 100;
  HTMLControl.loading.progress.style.width = percentComplete + '%';

};

manager.onError = ( msg ) => {

  if ( msg instanceof String && msg !== '' ) console.error( 'THREE.LoadingManager error: ' + msg );
  else console.log( msg );

};

export default manager;
