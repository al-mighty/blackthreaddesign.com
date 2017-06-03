// import * as THREE from 'three';

// promisified version of THREE.ObjectLoader
// let objLoader;
// export const objectLoader = ( URL ) => {
//   const promiseLoader = objURL => new Promise( ( resolve, reject ) => {
//     if ( !objLoader ) objLoader = new THREE.ObjectLoader();
//     objLoader.load( objURL, resolve );
//   } );

//   return promiseLoader( URL )
//   .then( ( object ) => {
//     return object;
//   } );
// };

// // promisified version of THREE.JSONLoader
// let jsonLoader;
// export const JSONLoader = ( URL ) => {
//   const promiseLoader = objURL => new Promise( ( resolve, reject ) => {
//     if ( !jsonLoader ) jsonLoader = new THREE.JSONLoader();
//     jsonLoader.load( objURL, resolve );
//   } );

//   return promiseLoader( URL )
//   .then( ( object ) => {
//     return object;
//   } );
// };
