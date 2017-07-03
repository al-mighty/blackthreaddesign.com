// hide the upload form when loading starts so that the progress bar can be shown
const onloadstart = () => {

  document.querySelector( '#file-upload-form' ).classList.add( 'hide' );
  document.querySelector( '#loading-bar' ).classList.remove( 'hide' );

};

const onError = ( msg ) => {

  document.querySelector( '#error-overlay' ).classList.remove( 'hide' );
  document.querySelector( '#error-message' ).innerHTML = msg;

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
   Zip file processing
*******************************************************************   */
const processZip = ( file ) => {
  JSZip.loadAsync( file ).then( ( zip ) => {

        // First loop over the zip's contents and extract the FBX file and any images
    const imagesZipped = [];

    let fbxFileZipped = false;

    for ( const entry in zip.files ) {

      const zippedFile = zip.files[ entry ];

      /*
      const checkForDirectory = zippedFile.name.indexOf( '/' ) > -1;

      if ( checkForDirectory ) {
        console.warn( `
          Warning: The zip file contains directories.
          These are currently not supported and your model may display incorrectly.
          To fix any issues put all texture files at the top level in the zip file.
        ` );
        return;
      }

      */

      const extension = zippedFile.name.split( '.' ).pop().toLowerCase();

      if ( extension === 'fbx' ) {

        if ( fbxFileZipped ) {

          console.error( 'Error: more than one FBX file found in archive!' );

        } else {

          fbxFileZipped = zippedFile;

        }

      } else {

        imagesZipped.push( zippedFile );
      }
    }

        // At this point the FBX file should be contained in fbxFileZipped and images are in
        // imagesZipped - these are still compressed, so we'll need to set up a Promise and
        // uncompress them all before calling the FBXParser

    const promises = imagesZipped.map( ( zippedFile ) => {

      const URL = window.webkitURL || window.mozURL || window.URL;
      return zippedFile.async( 'arrayBuffer' )
            .then( ( image ) => {

              const buffer = new Uint8Array( image );
              const blob = new Blob( [ buffer.buffer ] );
              const url = URL.createObjectURL( blob );
              return url;

            } );

    } );

    const fbxFilePromise = fbxFileZipped.async( 'arrayBuffer' )
          .then( ( data ) => { return data; } );

    promises.push( fbxFilePromise );

    Promise.all( promises ).then( ( resultsArray ) => {

      const fbxFile = resultsArray.pop();

      fileModel.onZipLoad( fbxFile, resultsArray );

    } );

  } );
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
      processZip( file );
      break;
    default:
      onError( 'Unsupported file type!' );
      break;

  }

}, false );

export default fileModel;
