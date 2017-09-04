import HTMLControl from './HTMLControl.js';

// Simple error handling function - customize as necessary

const cachedMessages = {};

const errorHandler = ( msg ) => {

  // cache the message to prevent it being displayed multiple times
  if ( cachedMessages[ msg ] === true ) return;
  cachedMessages[ msg ] = true;

  if ( !( msg instanceof String ) ) {

    console.log( msg );
    return;

  }

  // bug in three.js or WebGL returns this error on Chrome
  if ( msg.indexOf( 'gl.getProgramInfoLog()' ) !== -1 ) return;

  HTMLControl.error.overlay.classList.remove( 'hide' );
  const p = document.createElement( 'p' );
  p.innerHTML = msg;

  HTMLControl.error.messages.appendChild( p );

};

export default errorHandler;
