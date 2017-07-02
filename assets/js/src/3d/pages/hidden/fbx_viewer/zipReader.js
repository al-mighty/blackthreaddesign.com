// const writer = new zip.Data64URIWriter( 'application/octet-stream' );
// const writer = new zip.TextWriter();
// const writer = new zip.BlobWriter();

export default ( entries, callback ) => {

  // get all entries from the zip
  reader.getEntries( ( entries ) => {


    entries.forEach( ( entry, idx ) => {

      const checkForDirectory = entry.filename.indexOf( '/' ) > -1;

      if ( checkForDirectory ) {
        console.warn( `
          Warning: The zip file contains directories.
          These are currently not supported and your model may display incorrectly.
          To fix any issues put all texture files at the top level in the zip file.
        ` );
        return;
      }

      const extension = entry.filename.split( '.' ).pop().toLowerCase();

      if ( extension === 'fbx' ) {

        if ( fbxFile ) {

          console.error( 'Error: more than one FBX file found in archive!' );

        } else {

          entry.getData( writer, ( data ) => {

            const buffer = window.btoa( data );

            console.log( buffer )

            // fbxFile = URL.createObjectURL( data );

            callback( buffer, resourcesURL );

          }, () => { /* onprogress callback */ } );

          // console.log( entry );

        }

      }

    } );

  } );

};

