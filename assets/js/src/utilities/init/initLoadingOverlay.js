import * as THREE from 'three';

const useLoadingManager = true;

const fadeLoader = () => {
  const loadingOverlay = document.querySelector( '#loadingOverlay' );

  if ( !loadingOverlay ) return;

  loadingOverlay.classList.add( 'fadeOut' );
  window.setTimeout( () => {
    loadingOverlay.classList.add( 'hidden' );
  }, 1500 );
};

const initLoader = () => {
  // show for at least a few seconds
  // window.setTimeout( () => {
    // // If THREE is not being used, fade out straightaway
    // if ( typeof THREE !== 'object' ) {
    //   fadeLoader();
    //   return;
    // }

    // if we are using the loadingManager, wait for it to finish before
    // fading out the loader
  //   if ( useLoadingManager ) {
  //     THREE.DefaultLoadingManager.onLoad = () => {
  //       fadeLoader();
  //     };
  //   }
  //   // otherwise fade it out straightaway
  //   else {
  //     fadeLoader();
  //   }
  // }, 3000 );

};

export default {
  init: initLoader,
  fadeOut: fadeLoader
}
