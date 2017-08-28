import * as THREE from 'three';

import 'modules/loaders/DDSLoader.module.js';
import FBXLoader from 'modules/loaders/FBXLoader.module.js';
import GLTFLoader from 'modules/loaders/GltfLoader.module.js';
import OBJLoader from 'modules/loaders/OBJLoader2.module.js';
import MTLLoader from 'modules/loaders/MTLLoader.module.js';
import ColladaLoader from 'modules/loaders/ColladaLoader2.module.js';
// import TGALoader from 'modules/loaders/TGALoader.module.js';

import loadingManager from './loadingManager.js';

let objectLoader = null;
let bufferGeometryLoader = null;
let jsonLoader = null;
let fbxLoader = null;
let gltfLoader = null;
let objLoader = null;
let mtlLoader = null;
let colladaLoader = null;
// let tgaLoader = null;

// object loaders require access to .setMaterials function
const oLoader = new OBJLoader( loadingManager );

// don't use loadingManager here as this is called early to preload materials
// required for access to .setPath
const mtlLdr = new MTLLoader();

const promisifyLoader = loader =>
  url => new Promise( ( resolve, reject ) => {

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

      get gltfLoader() {
        if ( gltfLoader === null ) {
          gltfLoader = promisifyLoader( new GLTFLoader( loadingManager ) );
        }
        return gltfLoader;
      },


      get objLoader() {
        if ( objLoader === null ) {
          objLoader = promisifyLoader( oLoader );
        }
        return objLoader;
      },

      assignObjectLoaderMtls: ( mtls ) => {

        oLoader.setMaterials( mtls );

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

    };

  }

}
