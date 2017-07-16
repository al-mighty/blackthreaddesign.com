// Simple error handling function - customize as necessary

const errorHandler = ( msg ) => {

  // bug in three.js or WebGL returns this error on Chrome
  // if ( msg.indexOf( 'gl.getProgramInfoLog()' ) !== -1 ) return;

  document.querySelector( '#error-overlay' ).classList.remove( 'hide' );
  const p = document.createElement( 'p' );
  p.innerHTML = msg;

  document.querySelector( '#error-message' ).appendChild( p );

};

export default errorHandler;
