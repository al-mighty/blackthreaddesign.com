import zipHandler from './zipHandler.js';
import manager from './loadingManager.js';

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
   Set up File Model
   This is imported in the FbxViewerCanvas, where onload callbacks are set up
*******************************************************************   */

const fileOnloadCallbacks = {

  onJSONLoad: () => {},
  onFBXLoad: () => {},
  onZipLoad: () => {},

};

/*  *******************************************************************
              Set up eventListener for file input
*******************************************************************   */

const fileInput = document.querySelector( '#file-upload-input' );

fileInput.addEventListener( 'change', ( e ) => {

  const file = e.target.files[0];

  const extension = file.name.split( '.' ).pop().toLowerCase();

  switch ( extension ) {

    case 'json':
    case 'js':
      manager.onStart();
      fileReader.onload = fileOnloadCallbacks.onJSONLoad();
      fileReader.readAsText( file );
      break;
    case 'fbx':
      manager.onStart();
      fileReader.onload = fileOnloadCallbacks.onFBXLoad;
      fileReader.readAsArrayBuffer( file );
      break;
    case 'zip':
      manager.onStart();
      zipHandler( file );
      break;
    default:
      console.error( 'Unsupported file type - please load an FBX file or a zip archive.' );

  }

}, false );

export default fileOnloadCallbacks;
