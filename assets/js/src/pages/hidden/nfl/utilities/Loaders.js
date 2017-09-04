import * as THREE from 'three';

import 'modules/loaders/DDSLoader.module.js';
import FBXLoader from 'modules/loaders/FBXLoader.module.js';
import AnimationLoader from 'modules/loaders/AnimationLoader.module.js';

import loadingManager from './loadingManager.js';

let objectLoader = null;
let bufferGeometryLoader = null;
let jsonLoader = null;
let animationLoader = null;
let fbxLoader = null;


const defaultReject = ( err ) => { console.log( err ); };

const promisifyLoader = loader =>
  url => new Promise( ( resolve, reject = defaultReject ) => {

    loader.load( url, resolve, loadingManager.onProgress, reject );

  } );


export default class Loaders {

  constructor() {

    return {

      get objectLoader() {
        if ( objectLoader === null ) {
          objectLoader = promisifyLoader( new THREE.ObjectLoader( loadingManager ) );
        }
        return objectLoader;
      },

      get bufferGeometryLoader() {
        if ( bufferGeometryLoader === null ) {
          bufferGeometryLoader = promisifyLoader( new THREE.BufferGeometryLoader( loadingManager ) );
        }
        return bufferGeometryLoader;
      },

      get jsonLoader() {
        if ( jsonLoader === null ) {
          jsonLoader = promisifyLoader( new THREE.JSONLoader( loadingManager ) );
        }
        return jsonLoader;
      },

      get animationLoader() {
        if ( animationLoader === null ) {
          animationLoader = promisifyLoader( new AnimationLoader( loadingManager ) );
        }
        return animationLoader;
      },

      get fbxLoader() {
        if ( fbxLoader === null ) {
          fbxLoader = promisifyLoader( new FBXLoader( loadingManager ) );
        }
        return fbxLoader;
      },

    };

  }

}