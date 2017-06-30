zip.workerScriptsPath = '/assets/js/build/vendor/zip/';

export default ( blob ) => {

  zip.createReader( new zip.BlobReader( blob ), ( reader ) => {

    // get all entries from the zip
    reader.getEntries( ( entries ) => {
      console.log( 'ss' )
      if ( entries.length ) {

        // get first entry content as text
        entries[0].getData( new zip.TextWriter(), ( text ) => {
          // text contains the entry data as a String
          console.log( text );

          // close the zip reader
          reader.close( () => {
            // onclose callback
          } );

        }, ( current, total ) => {
          // onprogress callback
        } );
      }
    } );
  }, ( error ) => {
    // onerror callback
  } );
  }

