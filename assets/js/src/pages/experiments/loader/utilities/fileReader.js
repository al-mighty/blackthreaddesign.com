import manager from './loadingManager.js';

import OnLoadCallbacks from './OnLoadCallbacks.js';

// Check support for the File API support
const checkForFileAPI = () => {

  if ( !( window.File && window.FileReader && window.FileList && window.Blob ) ) {

    console.error( 'This loader requires the File API. Please upgrade your browser' );

  }

};

checkForFileAPI();

// Files that do no match these extensions will not be uploaded.
const checkValidType = type =>
  new RegExp( '(.*?)\.(png|jpg|jpeg|gif|bmp|dds|tga|json|js|fbx|gltf|bin|glb|dae|obj|mtl|txt|vert|frag)$' )
    .test( type );


const loadFileFromUrl = ( url, type ) => {

  switch ( type ) {

    case 'buffergeometry':
      manager.onStart();
      return OnLoadCallbacks.onJSONBufferGeometryLoad( url );
    case 'object':
      manager.onStart();
      return OnLoadCallbacks.onJSONObjectLoad( url );
    case 'geometry':
      manager.onStart();
      return OnLoadCallbacks.onJSONGeometryLoad( url );
    case 'fbx':
      manager.onStart();
      return OnLoadCallbacks.onFBXLoad( url );
    case 'gltf':
    case 'glb':
      manager.onStart();
      return OnLoadCallbacks.onGLTFLoad( url );
    case 'obj':
      manager.onStart();
      return OnLoadCallbacks.onOBJLoad( url );
    case 'dae':
      manager.onStart();
      return OnLoadCallbacks.onDAELoad( url );
    default:
      if ( checkValidType( type ) ) console.error( 'Unsupported file type ' + type + '- please load one of the supported model formats.' );
      return Promise.resolve();
  }

};

const processJSON = ( file ) => {

  const fileReader = new FileReader();

  fileReader.readAsText( file );

  fileReader.onload = ( e ) => {

    const json = JSON.parse( e.target.result );

    let type;

    if ( json.metadata && json.metadata.type ) {

      type = json.metadata.type.toLowerCase();

      const fileReader2 = new FileReader();
      fileReader2.readAsDataURL( file );

      fileReader2.onload = ( e ) => {

        loadFileFromUrl( e.target.result, type );

      };

    } else {

      console.error( file.name + ': invalid JSON.' );

    }

  };

};

const processSingleFile = ( files ) => {

  const fileReader = new FileReader();

  const file = files[0];

  const type = file.name.split( '.' ).pop().toLowerCase();

  if ( checkValidType( type ) ) {

    console.error( 'Invalid file type: ' + type );
    return;

  }

  // json files can contain either geometry / buffergeometry or a whole scene.
  // these are processed by different loaders
  if ( type === 'json' || type === 'js' ) {

    processJSON( file );

  } else {

    fileReader.readAsDataURL( file );

    fileReader.onload = ( e ) => {

      loadFileFromUrl( e.target.result, type );

    };

  }

};

const processMultipleFiles = ( files ) => {

  const data = new FormData();

  for ( let i = 0; i < files.length; i++ ) {

    const type = files[i].name.split( '.' ).pop().toLowerCase();

    if ( !checkValidType( type ) ) {

      data.append( 'files[]', files[i] );

    }

  }

  fetch( '/php/upload.php', {
    method: 'post',
    body: data,
  } )
    .then( response => response.json() )
    .then( ( response ) => {

      if ( response.status === 'success' ) {

        const promises = response.data.map( ( file ) => {

          // create a temp unresolved promise so that promises are not resolved to early
          // without this JSON files can be deleted before they are read
          let promise = new Promise( ( resolve = () => {}, reject = () => {} ) => {} );

          const type = file.split( '.' ).pop().toLowerCase();

          // JSON files are preloaded to get the type. Not the most efficient, but it works
          if ( type === 'json' || type === 'js' ) {

            fetch( '/php/uploads/' + file )
              .then( res => res.json() )
              .then( ( json ) => {

                if ( json.metadata && json.metadata.type ) {

                  const jsonType = json.metadata.type.toLowerCase();

                  promise = loadFileFromUrl( '/php/uploads/' + file, jsonType );

                } else {

                  console.error( file.name + ': invalid JSON.' );
                  promise = Promise.resolve();

                }

              } );

          } else {

            promise = loadFileFromUrl( '/php/uploads/' + file, type );

          }

          return promise;

        } );

        Promise.all( promises ).then( () => {

          fetch( '/php/deleteUploadedFiles.php', {
            method: 'post',
            body: data,
          } );

        } );


      } else {

        console.error( 'An error occurred while uploading the files: ' + response.data );

      }


    } );

};


const uploadInput = document.querySelector( '#file-upload-input' );

document.querySelector( '#file-upload-button' ).addEventListener( 'click',
  ( e ) => {

    e.preventDefault();
    uploadInput.click();

  }, false );

uploadInput.addEventListener( 'change', ( e ) => {

  e.preventDefault();
  const files = e.target.files;

  if ( files.length === 1 ) {

    processSingleFile( files );

  } else if ( files.length > 1 ) {

    processMultipleFiles( files );

  }

}, false );
