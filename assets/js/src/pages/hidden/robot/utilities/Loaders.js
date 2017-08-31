import * as THREE from 'three';

import 'modules/loaders/DDSLoader.module.js';
import FBXLoader from 'modules/loaders/FBXLoader.module.js';

import loadingManager from './loadingManager.js';

let fontLoader = null;

let fbxLoader = null;


const defaultReject = ( err ) => { console.log( err ); };

const promisifyLoader = loader =>
  url => new Promise( ( resolve, reject = defaultReject ) => {

    loader.load( url, resolve, loadingManager.onProgress, reject );

  } );


class Loaders {

  constructor() {

    return {

      get fontLoader() {
        if ( fontLoader === null ) {
          fontLoader = promisifyLoader( new THREE.FontLoader( loadingManager ) );
        }
        return fontLoader;
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
