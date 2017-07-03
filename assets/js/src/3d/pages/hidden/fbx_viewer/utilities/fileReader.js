import errorHandler from './errorHandler.js';
import processZip from './zipHandler.js';
import manager from './loadingManager.js';

// Check support for the File API support
const checkForFileAPI = () => {


  if ( !( window.File && window.FileReader && window.FileList && window.Blob ) ) {

    errorHandler( 'This loader requires the File API. Please upgrade your browser' );

  }

};

checkForFileAPI();

/*  *******************************************************************
              Set up FileReader
*******************************************************************   */
const fileReader = new FileReader();

fileReader.onerror = ( msg ) => { 
  errorHandler( 'FileReader error: ' + msg );
};

/*  *******************************************************************
   Set up File Model
   This is imported in the FbxViewerCanvas, where onload callbacks are set up
*******************************************************************   */

const fileModel = {

  fileReader,
  onZipLoad: () => {},

};

/*  *******************************************************************
   Zip file processing
*******************************************************************   */

/*  *******************************************************************
              Set up eventlistener for file input
*******************************************************************   */

const fileInput = document.querySelector( '#file-upload-input' );

fileInput.addEventListener( 'change', ( e ) => {
  const file = e.target.files[0];

  const extension = file.name.split( '.' ).pop().toLowerCase();

  switch ( extension ) {

    case 'fbx':
      manager.onStart();
      fileReader.readAsArrayBuffer( file );
      break;
    case 'zip':
      manager.onStart();
      processZip( file );
      break;
    default:
      errorHandler( 'Unsupported file type - please load an FBX file or a zip archive.' );
      break;

  }

}, false );

export default fileModel;
