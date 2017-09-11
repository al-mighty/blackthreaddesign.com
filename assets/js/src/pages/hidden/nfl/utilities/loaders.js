import * as THREE from 'three';

import FBXLoader from 'modules/loaders/FBXLoader.module.js';
import AnimationLoader from 'modules/loaders/AnimationLoader.module.js';

import loadingManager from './loadingManager.js';

let objectLoader = null;
let bufferGeometryLoader = null;
let jsonLoader = null;
let animationLoader = null;
let fbxLoader = null;
let textureLoader = null;


const defaultReject = ( err ) => { console.log( err ); };

const promisifyLoader = loader =>
  url => new Promise( ( resolve, reject = defaultReject ) => {

    loader.load( url, resolve, loadingManager.onProgress, reject );

  } );


class Loaders {

  constructor() {

    return {

      get textureLoader() {
        if ( textureLoader === null ) {
          textureLoader = promisifyLoader( new THREE.TextureLoader( loadingManager ) );
        }
        return textureLoader;
      },

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

const loaders = new Loaders();

export default loaders;
