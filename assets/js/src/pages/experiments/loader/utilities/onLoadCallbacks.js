import * as THREE from 'three';

import loaderCanvas from 'pages/experiments/loader/LoaderCanvas.js';
import Loaders from './Loaders.js';
import HTMLControl from './HTMLControl.js';

const loaders = new Loaders();
const defaultMat = new THREE.MeshBasicMaterial( { wireframe: true, color: 0x000000 } );

// const selectLoader = ( loader1Name, loader2Name, type, callback ) => {

//   document.querySelector( '#loader-select-type' ).innerHTML = type;

//   const button1 = document.querySelector( '#loader1' );
//   const button2 = document.querySelector( '#loader2' );

//   button1.innerHTML = loader1Name;
//   button2.innerHTML = loader2Name;

//   document.querySelector( '#loader-choice-form' ).classList.remove( 'hide' );

//   button1.addEventListener( 'click', ( e ) => {

//     e.preventDefault();

//     document.querySelector( '#loader-choice-form' ).classList.add( 'hide' );

//     callback( 1 );


//   }, false );

//   button2.addEventListener( 'click', ( e ) => {

//     e.preventDefault();

//     document.querySelector( '#loader-choice-form' ).classList.add( 'hide' );

//     callback( 2 );

//   }, false );

// };

export default class OnLoadCallbacks {

  static onJSONBufferGeometryLoad( file ) {

    console.log( 'Using THREE.BufferGeometryLoader' );

    const promise = loaders.bufferGeometryLoader( file );
    promise.then( ( geometry ) => {

      console.log( geometry );

      const object = new THREE.Mesh( geometry, defaultMat );
      loaderCanvas.addObjectToScene( object );

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

    } );

    return promise;

  }

  static onJSONObjectLoad( file ) {

    console.log( 'Using THREE.ObjectLoader' );

    const promise = loaders.objectLoader( file );
    promise.then( ( object ) => {

      console.log( object );

      loaderCanvas.addObjectToScene( object );

    } );

    return promise;

  }

  static onFBXLoad( file ) {

    console.log( 'Using THREE.FBXLoader' );

    const promise = loaders.fbxLoader( file );

    promise.then( ( object ) => {

      console.time( 'inverting meshes' );

      console.log( object );

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

    } );

    return promise;

  }

  static onGLTFLoad( file ) {

    let promise = new Promise( ( resolve, reject ) => {} );

    // selectLoader( 'GLTFLoader', 'GLTFLoader2', 'gltf', ( loader ) => {

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

    } );

    // } );

    return promise;

  }

  static onOBJLoad( file ) {

    // only objLoader2 is working
    let promise = new Promise( ( resolve, reject ) => {} );

    // selectLoader( 'OBJLoader', 'OBJLoader2', 'obj', ( loader ) => {


      // if ( loader === 1 ) {

      //   console.log( 'Using THREE.OBJLoader' );

      //   promise = loaders.objLoader( file );

      // } else {

        console.log( 'Using THREE.OBJLoader2' );

        promise = loaders.objLoader2( file );

      // }


      promise.then( ( object ) => {

        console.log( object );

        loaderCanvas.addObjectToScene( object );

        // THREE.ColladaLoader doesn't support loadingManager so call onLoad() manually
        // if ( loader === 1 ) loadingManager.onLoad();

      } );

    // } );

    return promise;
  }

  static onDAELoad( file ) {

    let promise = new Promise( ( resolve ) => {} );

    // selectLoader( 'ColladaLoader', 'ColladaLoader2', 'collada', ( loader ) => {


      // if ( loader === 1 ) {

      //   console.log( 'Using THREE.ColladaLoader' );
      //   console.warn( 'THREE.ColladaLoader uses an older animation system which is not supported here; animations will be ignored.' );

      //   promise = loaders.colladaLoader( file );

      // } else {

        console.log( 'Using THREE.ColladaLoader2' );

        promise = loaders.colladaLoader2( file );

      // }

      promise.then( ( object ) => {

        console.log( object );

        const scene = object.scene;

        if ( object.animations && object.animations.length > 0 ) scene.animations = object.animations;

        // object.scale.set( 1, 1, 1)
        // console.log( object)
        loaderCanvas.addObjectToScene( scene );

        // THREE.ColladaLoader doesn't support loadingManager so call onLoad() manually
        // if ( loader === 1 ) loadingManager.onLoad();

      } );

    // } );

    return promise;

  }

}
