import * as THREE from 'three';

import loaderCanvas from '../RobotCanvas.js';
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

    promise = loaders.gltf2Loader( file );

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

    // only objLoader2 is working
    let promise = new Promise( ( resolve ) => {} );

    console.log( 'Using THREE.OBJLoader2' );

    promise = loaders.objLoader2( file );


    promise.then( ( object ) => {

      loaderCanvas.addObjectToScene( object );

    } );


    return promise;
  }

  static onDAELoad( file ) {

    let promise = new Promise( ( resolve ) => {} );

    console.log( 'Using THREE.ColladaLoader2' );

    promise = loaders.colladaLoader2( file );


    promise.then( ( result ) => {

      const object = result.scene;

      if ( result.animations && result.animations.length > 0 ) object.animations = result.animations;

      loaderCanvas.addObjectToScene( object );

    } );

    return promise;

  }

}
