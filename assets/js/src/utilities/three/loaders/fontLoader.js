import * as THREE from 'three';

let loader;

// promisified version of THREE.FontLoader
const fontLoader = ( url ) => {
  const promiseLoader = url => new Promise( ( resolve, reject ) => {
    if ( !loader ) loader = new THREE.FontLoader();
    loader.load( url, resolve );
  } );

  return promiseLoader( url )
  .then( ( object ) => {
    return object;
  } );
};

export default fontLoader;
