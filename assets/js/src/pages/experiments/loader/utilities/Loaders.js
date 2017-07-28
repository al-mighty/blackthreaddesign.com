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

import manager from './loadingManager.js';

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

// object loaders require access to .setMaterials function
const oLoader = new OBJLoader( manager );
const oLoader2 = new OBJLoader2( manager );
// don't use manager here as this is called early to preload materials
// required for access to .setPath
const mtlLdr = new MTLLoader();

const defaultReject = ( err ) => { console.log( err ); };

const promisifyLoader = loader =>
  url => new Promise( ( resolve, reject = defaultReject ) => {

    loader.load( url, resolve );

  } );


export default class Loaders {

  constructor() {

    return {

      get objectLoader() {
        if ( objectLoader === null ) {
          objectLoader = promisifyLoader( new THREE.ObjectLoader( manager ) );
        }
        return objectLoader;
      },

      get bufferGeometryLoader() {
        if ( bufferGeometryLoader === null ) {
          bufferGeometryLoader = promisifyLoader( new THREE.BufferGeometryLoader( manager ) );
        }
        return bufferGeometryLoader;
      },

      get jsonLoader() {
        if ( jsonLoader === null ) {
          jsonLoader = promisifyLoader( new THREE.JSONLoader( manager ) );
        }
        return jsonLoader;
      },

      get fbxLoader() {
        if ( fbxLoader === null ) {
          fbxLoader = promisifyLoader( new FBXLoader( manager ) );
        }
        return fbxLoader;
      },

      get gltfLoader() {
        if ( gltfLoader === null ) {
          gltfLoader = promisifyLoader( new GLTFLoader( manager ) );
        }
        return gltfLoader;
      },

      get gltf2Loader() {
        if ( gltf2Loader === null ) {
          gltf2Loader = promisifyLoader( new GLTF2Loader( manager ) );
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
          colladaLoader = promisifyLoader( new ColladaLoader( manager ) );
        }
        return colladaLoader;
      },

      get colladaLoader2() {
        if ( colladaLoader2 === null ) {
          colladaLoader2 = promisifyLoader( new ColladaLoader2( manager ) );
        }
        return colladaLoader2;
      },

    };

  }

}
