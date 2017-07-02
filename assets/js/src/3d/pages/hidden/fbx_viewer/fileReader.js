// zip.workerScriptsPath = '/assets/js/build/vendor/zip/';

const progress = document.querySelector( '#progress' );
const overlay = document.querySelector( '#loading-overlay' );
const errorOverlay = document.querySelector( '#error-overlay' );
const errorMessage = document.querySelector( '#error-message' );

// hide the upload form when loading starts so that the progress bar can be shown
const onloadstart = () => {

  document.querySelector( '#file-upload-form' ).classList.add( 'hide' );
  document.querySelector( '#loading-bar' ).classList.remove( 'hide' );

};

const onError = ( msg ) => {

  errorOverlay.classList.remove( 'hide' );
  errorMessage.innerHTML = msg;

};

// Check support for the File API support
const checkForFileAPI = () => {


  if ( !( window.File && window.FileReader && window.FileList && window.Blob ) ) {

    onError( 'This loader requires the File API. Please upgrade your browser' );

  }

};

checkForFileAPI();

/*  *******************************************************************
              Set up FileReader
*******************************************************************   */
const fileReader = new FileReader();

fileReader.onprogress = ( e ) => {

  if ( e.lengthComputable ) {

    const percentComplete = e.loaded / e.total * 100;
    progress.style.width = percentComplete + '%';

  }

};

fileReader.onerror = onError;

/*  *******************************************************************
   Set up File Model
   This is imported in the FbxViewerCanvas, where onload callbacks are set up
*******************************************************************   */

const fileModel = {

  extension: '',
  fileReader,
  onZipLoad: () => {},

};


/*  *******************************************************************
              Set up eventlistener for file input
*******************************************************************   */
const fileInput = document.querySelector( '#file-upload-input' );

fileInput.addEventListener( 'change', ( e ) => {
  const file = e.target.files[0];

  fileModel.extension = file.name.split( '.' ).pop().toLowerCase();

  switch ( fileModel.extension ) {

    case 'fbx':
      onloadstart();
      fileReader.readAsArrayBuffer( file );
      break;
    case 'zip':
      onloadstart();
      JSZip.loadAsync( file ).then( ( zip ) => {

        let fbxFile = false;

        for ( const entry in zip.files ) {

          const zippedFile = zip.files[ entry ];

          const checkForDirectory = zippedFile.name.indexOf( '/' ) > -1;

          if ( checkForDirectory ) {
            console.warn( `
              Warning: The zip file contains directories.
              These are currently not supported and your model may display incorrectly.
              To fix any issues put all texture files at the top level in the zip file.
            ` );
            return;
          }

          const extension = zippedFile.name.split( '.' ).pop().toLowerCase();

          if ( extension === 'fbx' ) {

            if ( fbxFile ) {

              console.error( 'Error: more than one FBX file found in archive!' );

            } else {

              zippedFile.async( 'uint8array' ).then( ( data ) => {
                
                fbxFile = data;

                fileModel.onZipLoad( fbxFile );

              } );

            }

          }
        }

      } );
      break;
    default:
      onError( 'Unsupported file type!' );
      break;

  }

}, false );

export default fileModel;
