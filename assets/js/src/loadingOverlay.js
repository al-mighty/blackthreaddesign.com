const useLoadingManager = false;

const fadeLoader = () => {
  const loadingOverlay = document.querySelector( '#loadingOverlay' );

  if(!loadingOverlay) return;

  loadingOverlay.classList.add( 'fadeOut' );
  window.setTimeout( () => {
    loadingOverlay.classList.add( 'hidden' );
  }, 1000 );
};

export default function initLoader() {
  // If THREE is not being used, fade out straightaway
  if ( typeof THREE !== 'object' ) {
    fadeLoader();
    return;
  }

  // if we are using the loadingManager, wait for it to finish before
  // fading out the loader
  if ( useLoadingManager ) {
    THREE.DefaultLoadingManager.onLoad = () => {
      fadeLoader();
    };
  }
  // otherwise fade it out straightaway
  else {
    fadeLoader();
  }

};
