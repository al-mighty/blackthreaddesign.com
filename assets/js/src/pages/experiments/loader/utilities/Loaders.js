import * as THREE from 'three';

import 'modules/loaders/DDSLoader.module.js';
import FBXLoader from 'modules/loaders/FBXLoader.module.js';
import GLTFLoader from 'modules/loaders/GltfLoader.module.js';
import GLTF2Loader from 'modules/loaders/Gltf2Loader.module.js';
import OBJLoader from 'modules/loaders/OBJLoader.module.js';
import OBJLoader2 from 'modules/loaders/OBJLoader2.module.js';
import MTLLoader from 'modules/loaders/MTLLoader.module.js';
import ColladaLoader from 'modules/loaders/ColladaLoader.module.js';
import ColladaLoader2 from 'modules/loaders/ColladaLoader2.module.js';
import TGALoader from 'modules/loaders/TGALoader.module.js';

import loadingManager from './loadingManager.js';

let objectLoader = null;
let bufferGeometryLoader = null;
let jsonLoader = null;
let fbxLoader = null;
let gltfLoader = null; // todo
let gltf2Loader = null;
let objLoader = null; // todo
let objLoader2 = null;
let mtlLoader = null;
let colladaLoader = null;  // todo
let colladaLoader2 = null;
let tgaLoader = null;

// object loaders require access to .setMaterials function
const oLoader = new OBJLoader( loadingManager );
const oLoader2 = new OBJLoader2( loadingManager );
// don't use loadingManager here as this is called early to preload materials
// required for access to .setPath
const mtlLdr = new MTLLoader();

const defaultReject = ( err ) => { console.log( err ); };

const promisifyLoader = loader =>
  url => new Promise( ( resolve, reject = defaultReject ) => {

    loader.load( url, resolve, loadingManager.onProgress, loadingManager.onError );

  } );

THREE.Loader.Handlers.add( /\.tga$/i, new TGALoader() );

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

      get gltfLoader() {
        if ( gltfLoader === null ) {
          gltfLoader = promisifyLoader( new GLTFLoader( loadingManager ) );
        }
        return gltfLoader;
      },

      get gltf2Loader() {
        if ( gltf2Loader === null ) {
          gltf2Loader = promisifyLoader( new GLTF2Loader( loadingManager ) );
        }
        return gltf2Loader;
      },

      get objLoader() {
        if ( objLoader === null ) {
          objLoader = promisifyLoader( oLoader );
        }
        return objLoader;
      },

      get objLoader2() {
        if ( objLoader2 === null ) {
          objLoader2 = promisifyLoader( oLoader2 );
        }
        return objLoader2;
      },

      assignObjectLoaderMtls: ( mtls ) => {

        oLoader.setMaterials( mtls );
        oLoader2.setMaterials( mtls );

      },

      get mtlLoader() {
        if ( mtlLoader === null ) {
          mtlLoader = promisifyLoader( mtlLdr );
        }
        return mtlLoader;
      },

      setMtlLoaderPath( path ) {
        mtlLdr.setPath( path );
      },

      get colladaLoader() {
        if ( colladaLoader === null ) {
          colladaLoader = promisifyLoader( new ColladaLoader( loadingManager ) );
        }
        return colladaLoader;
      },

      get colladaLoader2() {
        if ( colladaLoader2 === null ) {
          colladaLoader2 = promisifyLoader( new ColladaLoader2( loadingManager ) );
        }
        return colladaLoader2;
      },

    };

  }

}
