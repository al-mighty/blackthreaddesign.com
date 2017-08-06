import * as THREE from 'three';

import 'modules/loaders/DDSLoader.module.js';
import FBXLoader from 'modules/loaders/FBXLoader.module.js';
// import GLTFLoader from 'modules/loaders/GltfLoader.module.js';
// import GLTF2Loader from 'modules/loaders/Gltf2Loader.module.js';
// import OBJLoader from 'modules/loaders/OBJLoader.module.js';
// import OBJLoader2 from 'modules/loaders/OBJLoader2.module.js';
// import MTLLoader from 'modules/loaders/MTLLoader.module.js';
// import ColladaLoader from 'modules/loaders/ColladaLoader.module.js';
// import ColladaLoader2 from 'modules/loaders/ColladaLoader2.module.js';

import loadingManager from './loadingManager.js';

let objectLoader = null;
let bufferGeometryLoader = null;
let jsonLoader = null;
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

      get fbxLoader() {
        if ( fbxLoader === null ) {
          fbxLoader = promisifyLoader( new FBXLoader( loadingManager ) );
        }
        return fbxLoader;
      },

    };

  }

}
