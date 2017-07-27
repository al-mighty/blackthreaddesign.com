import * as THREE from 'three';

import loaderCanvas from 'pages/experiments/loader/LoaderCanvas.js';

import Loaders from './Loaders.js';

import manager from './loadingManager.js';

const loaders = new Loaders();
const defaultMat = new THREE.MeshBasicMaterial( { wireframe: true, color: 0x000000 } );

const selectLoader = ( loader1Name, loader2Name, type, callback ) => {

  document.querySelector( '#loader-select-type' ).innerHTML = type;

  const button1 = document.querySelector( '#loader1' );
  const button2 = document.querySelector( '#loader2' );

  button1.innerHTML = loader1Name;
  button2.innerHTML = loader2Name;

  document.querySelector( '#loader-choice-form' ).classList.remove( 'hide' );

  button1.addEventListener( 'click', ( e ) => {

    e.preventDefault();

    document.querySelector( '#loader-choice-form' ).classList.add( 'hide' );

    callback( 1 );


  }, false );

  button2.addEventListener( 'click', ( e ) => {

    e.preventDefault();

    document.querySelector( '#loader-choice-form' ).classList.add( 'hide' );

    callback( 2 );

  }, false );

};

export default class OnLoadCallbacks {

  static onJSONBufferGeometryLoad( file ) {

    console.log( 'Using THREE.BufferGeometryLoader' );

    const promise = loaders.bufferGeometryLoader( file );
    promise.then( ( geometry ) => {

      const object = new THREE.Mesh( geometry, defaultMat );
      loaderCanvas.addObjectToScene( object );

    } );

    return promise;

  }

  static onJSONGeometryLoad( file ) {

    console.log( 'Using THREE.JSONLoader' );

    const promise = loaders.jsonLoader( file );
    promise.then( ( geometry ) => {

      const object = new THREE.Mesh( geometry, defaultMat );
      loaderCanvas.addObjectToScene( object );

    } );

    return promise;

  }

  static onJSONObjectLoad( file ) {

    console.log( 'Using THREE.ObjectLoader' );

    console.log( file );

    const promise = loaders.objectLoader( file );
    promise.then( ( object ) => {

      loaderCanvas.addObjectToScene( object );

    } );

    return promise;

  }

  static onFBXLoad( file ) {

    console.log( 'Using THREE.FBXLoader' );

    const promise = loaders.fbxLoader( file );

    promise.then( ( result ) => {

      loaderCanvas.addObjectToScene( result );

    } );

    return promise;

  }

  static onGLTFLoad( file ) {

    let promise = new Promise( ( resolve, reject ) => {} );

    selectLoader( 'GLTFLoader', 'GLTFLoader2', 'gltf', ( loader ) => {

      // Only GLTF2Loader seems to work


      // if ( loader === 1 ) {

      //   console.log( 'Using THREE.GLTFLoader' );

      //   promise = loaders.gltfLoader( file );

      // } else {

      //   console.log( 'Using THREE.OBJLoader2' );

      //   promise = loaders.gltf2Loader( file );

      // }

      console.log( 'Using THREE.OBJLoader2' );

      promise = loaders.gltf2Loader( file );

      promise.then( ( gltf ) => {

        console.log( gltf )

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

    } );

    return promise;

  }

  static onOBJLoad( file ) {

    console.log( file );

    let promise = new Promise( ( resolve, reject ) => {} );

    selectLoader( 'OBJLoader', 'OBJLoader2', 'obj', ( loader ) => {


      if ( loader === 1 ) {

        console.log( 'Using THREE.OBJLoader' );

        promise = loaders.objLoader( file );

      } else {

        console.log( 'Using THREE.OBJLoader2' );

        promise = loaders.objLoader2( file );

      }


      promise.then( ( object ) => {

        loaderCanvas.addObjectToScene( object );

        // THREE.ColladaLoader doesn't support loading manager so call onLoad() manually
        // if ( loader === 1 ) manager.onLoad();

      } );

    } );

    return promise;
  }

  static onDAELoad( file ) {

    let promise = new Promise( ( resolve, reject ) => {} );

    selectLoader( 'ColladaLoader', 'ColladaLoader2', 'collada', ( loader ) => {


      if ( loader === 1 ) {

        console.log( 'Using THREE.ColladaLoader' );
        console.warn( 'THREE.ColladaLoader uses an older animation system which is not supported here; animations will be ignored.' );

        promise = loaders.colladaLoader( file );

      } else {

        console.log( 'Using THREE.ColladaLoader2' );

        promise = loaders.colladaLoader2( file );

      }

      promise.then( ( result ) => {

        const object = result.scene;

        if ( result.animations && result.animations.length > 0 ) object.animations = result.animations;

        loaderCanvas.addObjectToScene( object );

        // THREE.ColladaLoader doesn't support loading manager so call onLoad() manually
        if ( loader === 1 ) manager.onLoad();

      } );

    } );

    return promise;

  }

}
