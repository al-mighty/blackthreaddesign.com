import zipHandler from './zipHandler.js';
import manager from './loadingManager.js';

import OnLoadCallbacks from './OnLoadCallbacks.js';

// Check support for the File API support
const checkForFileAPI = () => {

  if ( !( window.File && window.FileReader && window.FileList && window.Blob ) ) {

    console.error( 'This loader requires the File API. Please upgrade your browser' );

  }

};

checkForFileAPI();

/*  *******************************************************************
              Set up eventListener for file input
*******************************************************************   */

const fileInput = document.querySelector( '#file-upload-input' );

const allFilesLoadedCallback = ( textures, file, type ) => {

  // console.log( textures )

  switch ( type ) {

    case 'json':
    case 'js':
      manager.onStart();
      OnLoadCallbacks.onJSONLoad( file );
      break;
    case 'fbx':
      manager.onStart();
      OnLoadCallbacks.onFBXLoad( file, textures );
      break;
    case 'gltf':
    case 'glb':
      manager.onStart();
      OnLoadCallbacks.onGLTFLoad( file );
      break;
    case 'obj':
      manager.onStart();
      OnLoadCallbacks.onOBJLoad( file );
      break;
    case 'dae':
      manager.onStart();
      OnLoadCallbacks.onDAELoad( file );
      break;
    case 'zip':
      manager.onStart();
      zipHandler( file );
      break;
    default:
      console.error( 'Unsupported file type ' + type + '- please load one of the supported model formats or a zip archive.' );

  }

}

fileInput.addEventListener( 'change', ( e ) => {

  const files = e.target.files;

  const textures = [];

  let count = files.length;
  let type;
  let mainFile;

  for ( let i = 0; i < files.length; i++ ) {

    const fileReader = new FileReader();

    fileReader.onerror = ( msg ) => {

      console.error( 'FileReader error: ' + msg );

    };

    const file = files[i];

    fileReader.readAsDataURL( file );

    // check for image file
    if ( file.type.match( 'image.*' ) ) {

      fileReader.onload = ( evt ) => {

        textures.push( evt.target.result );

        // count down loading of files and callback when all are done
        if ( --count === 0 ) allFilesLoadedCallback( textures, mainFile, type );

      };

    } else {

      type = file.name.split( '.' ).pop().toLowerCase();

      fileReader.onload = ( evt ) => {

        mainFile = evt.target.result;
        if ( --count === 0 ) allFilesLoadedCallback( textures, mainFile, type );

      };

    }

  }

}, false );

