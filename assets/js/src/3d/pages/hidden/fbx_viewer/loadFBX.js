import * as THREE from 'three';

import FBXLoader from './App/modules/FBXLoader.module.js';

// import NURBSCurve from './App/utilities/curves/NURBSCurve.js';
// import NURBSUtils from './App/utilities/curves/NURBSUtils.js';

const progress = document.querySelector( '#progress' );
const overlay = document.querySelector( '#loading-overlay' );
const error = document.querySelector( '#loading-error-message' );

const onProgress = function ( xhr ) {
  if ( xhr.lengthComputable ) {
    const percentComplete = xhr.loaded / xhr.total * 100;
    progress.style.width = percentComplete + '%';
  }
};

const onError = function ( xhr ) {
  overlay.classList.remove( 'hide' );
  error.innerHTML = 'Failed to load the model with the following error: \n' + xhr;
};

const fbxLoader = new FBXLoader();

const vertices = document.querySelector( '#vertices' );
const faces = document.querySelector( '#faces' );


export default function loadFBX( url, mixers, app ) {

  const addModelInfo = () => {
    faces.innerHTML = app.renderer.info.render.faces;
    vertices.innerHTML = app.renderer.info.render.vertices;
  };

  fbxLoader.load( url, ( object ) => {
    if ( object.animations[ 0 ] !== undefined ) {
      object.mixer = new THREE.AnimationMixer( object );
      mixers.push( object.mixer );

      const action = object.mixer.clipAction( object.animations[ 0 ] );
      action.play();
    }

    app.scene.add( object );

    app.play();

    addModelInfo();

    overlay.style.display = 'none';
  }, onProgress, onError );
}
