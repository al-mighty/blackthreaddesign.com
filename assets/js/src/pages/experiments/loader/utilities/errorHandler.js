// Simple error handling function - customize as necessary

const errorHandler = ( msg ) => {

  document.querySelector( '#error-overlay' ).classList.remove( 'hide' );
  const p = document.createElement( 'p' );
  p.innerHTML = msg;

  document.querySelector( '#error-message' ).appendChild( p );

};

export default errorHandler;
