import * as THREE from 'three';

import loaderCanvas from 'pages/experiments/loader/LoaderCanvas.js';
import Loaders from './Loaders.js';
// import HTMLControl from './HTMLControl.js';

const loaders = new Loaders();
const defaultMat = new THREE.MeshBasicMaterial( { wireframe: true, color: 0x000000 } );

export default class OnLoadCallbacks {

  static onJSONBufferGeometryLoad( file ) {

    console.log( 'Using THREE.BufferGeometryLoader' );

    const promise = loaders.bufferGeometryLoader( file );
    promise.then( ( geometry ) => {

      console.log( geometry );

      const object = new THREE.Mesh( geometry, defaultMat );
      loaderCanvas.addObjectToScene( object );

    } ).catch( ( err ) => {

      console.log( err );

    } );

    return promise;

  }

  static onJSONGeometryLoad( file ) {

    console.log( 'Using THREE.JSONLoader' );

    const promise = loaders.jsonLoader( file );
    promise.then( ( geometry ) => {

      console.log( geometry );

      const object = new THREE.Mesh( geometry, defaultMat );
      loaderCanvas.addObjectToScene( object );

    } ).catch( ( err ) => {

      console.log( err );

    } );

    return promise;

  }

  static onJSONObjectLoad( file ) {

    console.log( 'Using THREE.ObjectLoader' );

    const promise = loaders.objectLoader( file );
    promise.then( ( object ) => {

      console.log( object );

      loaderCanvas.addObjectToScene( object );

    } ).catch( ( err ) => {

      console.log( err );

    } );

    return promise;

  }

  static onFBXLoad( file ) {

    console.log( 'Using THREE.FBXLoader' );

    const promise = loaders.fbxLoader( file );

    promise.then( ( object ) => {

      console.log( object );

      // applying inverted meshes fix: https://github.com/mrdoob/three.js/issues/11911
      object.traverse( ( child ) => {

        if ( child instanceof THREE.Mesh ) {

          if ( child.matrixWorld.determinant() < 0 ) {

            const l = child.geometry.attributes.position.array.length;

            for ( let i = 0; i < l; i += 9 ) {

              // reverse winding order
              const tempX = child.geometry.attributes.position.array[ i ];
              const tempY = child.geometry.attributes.position.array[ i + 1 ];
              const tempZ = child.geometry.attributes.position.array[ i + 2 ];

              child.geometry.attributes.position.array[ i ] = child.geometry.attributes.position.array[ i + 6 ];
              child.geometry.attributes.position.array[ i + 1 ] = child.geometry.attributes.position.array[ i + 7 ];
              child.geometry.attributes.position.array[ i + 2 ] = child.geometry.attributes.position.array[ i + 8 ];


              child.geometry.attributes.position.array[ i + 6 ] = tempX;
              child.geometry.attributes.position.array[ i + 7 ] = tempY;
              child.geometry.attributes.position.array[ i + 8 ] = tempZ;

              // switch vertex normals
              const tempNX = child.geometry.attributes.normal.array[ i ];
              const tempNY = child.geometry.attributes.normal.array[ i + 1 ];
              const tempNZ = child.geometry.attributes.normal.array[ i + 2 ];

              child.geometry.attributes.normal.array[ i ] = child.geometry.attributes.normal.array[ i + 6 ];
              child.geometry.attributes.normal.array[ i + 1 ] = child.geometry.attributes.normal.array[ i + 7 ];
              child.geometry.attributes.normal.array[ i + 2 ] = child.geometry.attributes.normal.array[ i + 8 ];


              child.geometry.attributes.normal.array[ i + 6 ] = tempNX;
              child.geometry.attributes.normal.array[ i + 7 ] = tempNY;
              child.geometry.attributes.normal.array[ i + 8 ] = tempNZ;

            }

          }

        }

      } );

      console.timeEnd( 'inverting meshes' );


      loaderCanvas.addObjectToScene( object );

    } ).catch( ( err ) => {

      console.log( err );

    } );

    return promise;

  }

  static onGLTFLoad( file ) {

    let promise = new Promise( ( resolve, reject ) => {} );

    console.log( 'Using THREE.GLTFLoader' );

    promise = loaders.gltfLoader( file );

    promise.then( ( gltf ) => {

      console.log( gltf );

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

    } ).catch( ( err ) => {

      console.log( err );

    } );

    return promise;

  }

  static onOBJLoad( file ) {

    let promise = new Promise( ( resolve, reject ) => {} );

    // no need for this as OBJLoader2 reports logs it's version
    // console.log( 'Using THREE.OBJLoader2' );

    promise = loaders.objLoader( file );

    promise.then( ( object ) => {

      console.log( object );

      loaderCanvas.addObjectToScene( object );

    } ).catch( ( err ) => {

      console.log( err );

    } );


    return promise;
  }

  static onDAELoad( file ) {

    let promise = new Promise( ( resolve ) => {} );

    // no need for this as ColladaLoader2 reports plenty of information
    // console.log( 'Using THREE.ColladaLoader2' );

    promise = loaders.colladaLoader( file );


    promise.then( ( object ) => {

      console.log( object );

      const scene = object.scene;

      if ( object.animations && object.animations.length > 0 ) scene.animations = object.animations;


      loaderCanvas.addObjectToScene( scene );


    } )
    .catch( ( err ) => {

      console.log( err );

    } );

    return promise;

  }

}
