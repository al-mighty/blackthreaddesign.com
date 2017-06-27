const progress = document.querySelector( '#progress' );
const overlay = document.querySelector( '#loading-overlay' );
const error = document.querySelector( '#loading-error-message' );

const reader = new FileReader();

// hide the upload form when loading starts so that the progress bar can be shown
reader.onloadstart = () => {

  document.querySelector( '#file-upload-form' ).classList.add( 'hide' );
  document.querySelector( '#loading-bar' ).classList.remove( 'hide' );

};

reader.onprogress = ( e ) => {
  if ( e.lengthComputable ) {
    const percentComplete = e.loaded / e.total * 100;
    progress.style.width = percentComplete + '%';
  }
};

reader.onerror = ( e ) => {
  overlay.classList.remove( 'hide' );
  error.innerHTML = 'Failed to load the model with the following error: \n' + e;
};

const fileInput = document.querySelector( '#file-upload-input' );

fileInput.addEventListener( 'change', ( e ) => {
  const file = e.target.files[0];

  reader.readAsArrayBuffer( file );

}, false );

export default reader;