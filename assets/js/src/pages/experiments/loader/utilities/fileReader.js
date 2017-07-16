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
              Set up FileReader
*******************************************************************   */
const fileReader = new FileReader();

fileReader.onerror = ( msg ) => {

  console.error( 'FileReader error: ' + msg );

};

/*  *******************************************************************
              Set up eventListener for file input
*******************************************************************   */

const fileInput = document.querySelector( '#file-upload-input' );

fileInput.addEventListener( 'change', ( e ) => {

  const files = event.target.files;

  if ( files.length === 1 ) {

    const file = files[0];
    const extension = file.name.split( '.' ).pop().toLowerCase();

    switch ( extension ) {

      case 'json':
      case 'js':
        manager.onStart();
        fileReader.onload = OnLoadCallbacks.onJSONLoad;
        fileReader.readAsText( file );
        break;
      case 'fbx':
        manager.onStart();
        fileReader.onload = OnLoadCallbacks.onFBXLoad;
        fileReader.readAsArrayBuffer( file );
        break;
      case 'gltf':
      case 'glb':
        manager.onStart();
        fileReader.onload = OnLoadCallbacks.onGLTFLoad;
        fileReader.readAsArrayBuffer( file );
        break;
      case 'obj':
        manager.onStart();
        fileReader.onload = OnLoadCallbacks.onOBJLoad;
        fileReader.readAsArrayBuffer( file );
        break;
      case 'zip':
        manager.onStart();
        zipHandler( file );
        break;
      default:
        console.error( 'Unsupported file type ' + extension + '- please load one of the supported model formats or a zip archive.' );

    }

  } else {

    let jsonFile = null;
    let fbxFile = null;
    let gltfFile = null;
    let objFile = null;
    let mtlFile = null;


    const textures = [];

    for ( let i = 0; i < files.length; i++ ) {

      const file = files[i];

      const extension = file.name.split( '.' ).pop().toLowerCase();


      // check for image file
      if ( file.type.match( 'image.*' ) ) {

        textures.push( file );

      } else {

        switch ( extension ) {

          case 'json':
          case 'js':
            jsonFile = file;
            break;
          case 'fbx':
            fbxFile = file;
            break;
          case 'gltf':
          case 'glb':
            gltfFile = file;
            break;
          case 'obj':
            objFile = file;
            break;
          case 'mtl':
            mtlFile = file;
            break;
          case 'zip':
            console.error( 'Zip support forthcoming' );
            break;
          default:
            console.error( 'Unknown file type ' + extension + '- please load one of the supported model formats or a zip archive.' );

        }

      }

    }

  }

}, false );

