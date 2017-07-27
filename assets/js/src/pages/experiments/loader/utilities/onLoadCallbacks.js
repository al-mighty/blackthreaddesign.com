import * as THREE from 'three';

import loaderCanvas from 'pages/experiments/loader/LoaderCanvas.js';

import Loaders from './Loaders.js';

const loaders = new Loaders();
const defaultMat = new THREE.MeshBasicMaterial( { wireframe: true, color: 0x000000 } );

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

    console.log( file )

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

    console.log( 'Using THREE.GLTF2Loader' );

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

    console.log( 'Using THREE.ObjLoader2' );

    const promise = loaders.objLoader2( file );

    promise.then( ( result ) => {

      loaderCanvas.addObjectToScene( result );

    } );

    return promise;

  }

  static onDAELoad( file ) {

    console.log( 'Using THREE.ColladaLoader' );

    const promise = loaders.colladaLoader( file );

    promise.then( ( result ) => {

      console.log( result )

      const object = result.scene;

      if ( result.animations && result.animations.length > 0 ) object.animations = result.animations;

      console.log( object )
      loaderCanvas.addObjectToScene( object );

    } );

    return promise;

  }

}
