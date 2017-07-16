import * as THREE from 'three';

import FBXLoader from 'modules/loaders/FBXLoader.module.js';
import OBJLoader2 from 'modules/loaders/OBJLoader2.module.js';
import MTLLoader from 'modules/loaders/MTLLoader.module.js';

import manager from './loadingManager.js';

let textureLoader = null;
let fbxLoader = null;
let objLoader2 = null;
let mtlLoader = null;

export default class Loaders {

  constructor() {

    return {

      get textureLoader() {
        if ( textureLoader === null ) {
          textureLoader = new THREE.TextureLoader();
        }
        return textureLoader;
      },

      get fbxLoader() {
        if ( fbxLoader === null ) {
          fbxLoader = new FBXLoader( manager );
        }
        return fbxLoader;
      },

      get objLoader2() {
        if ( objLoader2 === null ) {
          objLoader2 = new OBJLoader2( manager );
        }
        return objLoader2;
      },

      get mtlLoader() {
        if ( mtlLoader === null ) {
          mtlLoader = new MTLLoader( manager );
        }
        return mtlLoader;
      },

    };

  }

}
