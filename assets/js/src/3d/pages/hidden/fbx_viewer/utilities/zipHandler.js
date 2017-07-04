import errorHandler from './errorHandler.js';
import fileModel from './fileReader.js';

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
        console.warn(
          `Warning: The zip file contains directories.
          These are currently not supported and your model may display incorrectly.
          To fix any issues put all texture files at the top level in the zip file.`
        );
        return;
      }

      */

      const extension = zippedFile.name.split( '.' ).pop().toLowerCase();

      if ( extension === 'fbx' ) {

        if ( fbxFileZipped ) {

          errorHandler( 
            `Warning: more than one FBX file found in archive,
            skipping subsequent files.`
          );

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

    const images = {};

    const promises = imagesZipped.map( ( zippedFile ) => {

      const URL = window.webkitURL || window.mozURL || window.URL;
      return zippedFile.async( 'arrayBuffer' )
            .then( ( image ) => {

              const buffer = new Uint8Array( image );
              const blob = new Blob( [ buffer.buffer ] );
              const url = URL.createObjectURL( blob );
              images[ zippedFile.name ] = url;

            } );

    } );

    const fbxFilePromise = fbxFileZipped.async( 'arrayBuffer' )
          .then( ( data ) => { return data; } );

    promises.push( fbxFilePromise );

    Promise.all( promises ).then( ( resultsArray ) => {

      const fbxFile = resultsArray.pop();

      fileModel.onZipLoad( fbxFile, images );

    } );

  } );

};


export default processZip;
