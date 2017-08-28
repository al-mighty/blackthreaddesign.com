import loadingManager from './loadingManager.js';
import OnLoadCallbacks from './OnLoadCallbacks.js';
import Loaders from './Loaders.js';
import HTMLControl from './HTMLControl.js';

const loaders = new Loaders();

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
      loadingManager.onStart();
      return OnLoadCallbacks.onJSONBufferGeometryLoad( url );
    case 'object':
      loadingManager.onStart();
      return OnLoadCallbacks.onJSONObjectLoad( url );
    case 'geometry':
      loadingManager.onStart();
      return OnLoadCallbacks.onJSONGeometryLoad( url );
    case 'fbx':
      loadingManager.onStart();
      return OnLoadCallbacks.onFBXLoad( url );
    case 'gltf':
    case 'glb':
      loadingManager.onStart();
      return OnLoadCallbacks.onGLTFLoad( url );
    case 'obj':
      loadingManager.onStart();
      return OnLoadCallbacks.onOBJLoad( url );
    case 'dae':
      loadingManager.onStart();
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

  const filesList = new FormData();

  loadingManager.totalFiles = files.length;

  for ( let i = 0; i < files.length; i++ ) {

    const type = files[i].name.split( '.' ).pop().toLowerCase();

    if ( !checkValidType( type ) ) {

      filesList.append( 'files[]', files[i] );

    }

  }

  // for use with obj + mtl files
  const mtls = {};
  const objs = [];

  fetch( '/php/upload.php', {
    method: 'post',
    body: filesList,
  } )
    .then( response => response.json() )
    .then( ( response ) => {

      if ( response.status === 'success' ) {

        const promises = response.data.map( ( file ) => {

          // create a temp unresolved promise so that promises are not resolved to early
          // without this JSON files can be deleted before they are read
          let promise = new Promise( ( resolve, reject ) => {} );

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

          } else if ( type === 'mtl' ) {

            loaders.setMtlLoaderPath( '/php/uploads/' );

            promise = loaders.mtlLoader( file );

            promise.then( ( materials ) => {

              materials.preload();
              Object.assign( mtls, materials.materials );

            } );

          } else if ( type === 'obj' ) {

            promise = Promise.resolve();

            objs.push( file );

          } else {

            promise = loadFileFromUrl( '/php/uploads/' + file, type );

          }

          return promise;

        } );

        Promise.all( promises )
          // once all files are uploaded, first process and  .obj files
          .then( () => {

            let objPromises;

            loaders.assignObjectLoaderMtls( mtls );

            if ( objs.length > 0 ) {

              objPromises = objs.map( ( obj ) => {

                return loadFileFromUrl( '/php/uploads/' + obj, 'obj' );

              } );

            } else {

              objPromises = [ Promise.resolve() ];

            }

            // then delete all the files to prevent clutter
            Promise.all( objPromises )
              .then( () => {

                fetch( '/php/deleteUploadedFiles.php', {
                  method: 'post',
                  body: filesList,
                } );

              } )
              .catch( ( err ) => {

                console.log( err );

              } );

          } )
          .catch( ( err ) => {

            console.log( err )

          } );

      } else {

        console.error( 'An error occurred while uploading the files: ' + response.data );

      }


    } );

};

HTMLControl.fileUpload.button.addEventListener( 'click',
  ( e ) => {

    e.preventDefault();
    HTMLControl.fileUpload.input.click();

  }, false );

HTMLControl.fileUpload.input.addEventListener( 'change', ( e ) => {

  e.preventDefault();
  const files = e.target.files;

  if ( files.length === 1 ) {

    processSingleFile( files );

  } else if ( files.length > 1 ) {

    processMultipleFiles( files );

  }

}, false );
