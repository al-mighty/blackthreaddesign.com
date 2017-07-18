import * as THREE from 'three';

import 'modules/loaders/DDSLoader.module.js';
import FBXLoader from 'modules/loaders/FBXLoader.module.js';
import GLTF2Loader from 'modules/loaders/Gltf2Loader.module.js';
import OBJLoader2 from 'modules/loaders/OBJLoader2.module.js';
import WWOBJLoader2 from 'modules/loaders/WWOBJLoader2.module.js';
import MTLLoader from 'modules/loaders/MTLLoader.module.js';
import ColladaLoader from 'modules/loaders/ColladaLoader2.module.js';

import manager from './loadingManager.js';

let objectLoader = null;
let bufferGeometryLoader = null;
let jsonLoader = null;
let fbxLoader = null;
let gltf2Loader = null;
let objLoader2 = null;
let wwobj2Loader = null;
let mtlLoader = null;
let colladaLoader = null;


export default class Loaders {

  constructor() {

    return {

      get objectLoader() {
        if ( objectLoader === null ) {
          objectLoader = new THREE.ObjectLoader( manager );
        }
        return objectLoader;
      },

      get bufferGeometryLoader() {
        if ( bufferGeometryLoader === null ) {
          bufferGeometryLoader = new THREE.BufferGeometryLoader( manager );
        }
        return bufferGeometryLoader;
      },

      get jsonLoader() {
        if ( jsonLoader === null ) {
          jsonLoader = new THREE.JSONLoader( manager );
        }
        return jsonLoader;
      },

      get fbxLoader() {
        if ( fbxLoader === null ) {
          fbxLoader = new FBXLoader( manager );
        }
        return fbxLoader;
      },

      get gltf2Loader() {
        if ( gltf2Loader === null ) {
          gltf2Loader = new GLTF2Loader( manager );
        }
        return gltf2Loader;
      },

      get objLoader2() {
        if ( objLoader2 === null ) {
          objLoader2 = new OBJLoader2( manager );
        }
        return objLoader2;
      },

      get wwobj2Loader() {
        if ( wwobj2Loader === null ) {
          wwobj2Loader = new WWOBJLoader2( manager );
        }
        return wwobj2Loader;
      },

      get mtlLoader() {
        if ( mtlLoader === null ) {
          mtlLoader = new MTLLoader( manager );
        }
        return mtlLoader;
      },

      get colladaLoader() {
        if ( colladaLoader === null ) {
          colladaLoader = new ColladaLoader( manager );
        }
        return colladaLoader;
      },

    };

  }

}
