import * as THREE from 'three';

import Loaders from './Loaders.js';

import loaderCanvas from 'pages/experiments/loader/LoaderCanvas.js';

const loaders = new Loaders();
const defaultMat = new THREE.MeshBasicMaterial( { wireframe: true, color: 0x000000 } );

export default class OnLoadCallbacks {

  static onJSONLoad( file ) {

    let promise;

    try {

      console.log( 'Attempting to load JSON with THREE.BufferGeometryLoader' );
      
      promise = loaders.bufferGeometryLoader( file );
      promise.then( ( geometry ) => {

        console.log( 'Success!' );

        const object = new THREE.Mesh( geometry, defaultMat );
        loaderCanvas.addObjectToScene( object );

      } ).catch( ( err ) => {} );
      return promise;

    } catch ( err ) {

      console.log( 'Failed...' );

      try {

        console.log( 'Attempting to load JSON with THREE.JSONLoader' );

        promise = loaders.jsonLoader( file );
        promise.then( ( geometry ) => {

          console.log( 'Success!' );

          const object = new THREE.Mesh( geometry, defaultMat );
          loaderCanvas.addObjectToScene( object );

        } ).catch( ( err ) => {} );
        return promise;
        
      } catch ( err ) {

        console.log( 'Failed...' );

        try {

          console.log( 'Attempting to load JSON with THREE.ObjectLoader' );

          promise = loaders.objectLoader( file );
          promise.then( ( result ) => {

            console.log( 'Success!' );

            loaderCanvas.addObjectToScene( result );

          } ).catch( ( err ) => {} );
          return promise;

        } catch ( err ) {

          console.log( 'Failed...' );

          console.error( err );

        }

      }
      
    }
    // switch ( type ) {

    //   case 'buffergeometry':
    //     promise = loaders.bufferGeometryLoader( file );
    //     promise.then( ( geometry ) => {

    //       object = new THREE.Mesh( geometry, defaultMat );
    //       loaderCanvas.addObjectToScene( object );

    //     } );
    //     return promise;
    //   case 'geometry':
    //     promise = loaders.jsonLoader( file );
    //     promise.then( ( geometry ) => {

    //       object = new THREE.Mesh( geometry, defaultMat );
    //       loaderCanvas.addObjectToScene( object );

    //     } );
    //     return promise;
    //   default:
    //     promise = loaders.objectLoader( file );
    //     promise.then( ( result ) => {
    //       loaderCanvas.addObjectToScene( object );

    //     } );
    //     return promise;

    // }

  }

  static onFBXLoad( file ) {

    const promise = loaders.fbxLoader( file );

    promise.then( ( result ) => {

      loaderCanvas.addObjectToScene( result );

    } );

    return promise;

  }

  static onGLTFLoad( file ) {

    const promise = loaders.gltf2Loader( file );

    promise.then( ( gltf ) => {

      if ( gltf.scenes.length > 1 ) {

        gltf.scenes.forEach( ( scene ) => {

          if ( gltf.animations ) scene.animations = gltf.animations;
          loaderCanvas.addObjectToScene( scene );

        } );

      } else if ( gltf.scene ) {

        if ( gltf.animations ) gltf.scene.animations = gltf.animations;
        loaderCanvas.addObjectToScene( gltf.scene );

      } else {

        console.error( 'No scene found in GLTF file.' );

      }

    } );

    return promise;

  }

  static onOBJLoad( file ) {

    const promise = loaders.objLoader2( file );

    promise.then( ( result ) => {

      loaderCanvas.addObjectToScene( result );

    } );

    return promise;

  }

  static onDAELoad( file ) {

    const promise = loaders.colladaLoader( file );

    promise.then( ( result ) => {

      const object = result.scene;

      if ( result.animations && result.animations.length > 0 ) object.animations = result.animations;

      loaderCanvas.addObjectToScene( object );

    } );

    return promise;

  }

}
