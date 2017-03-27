import avalonbox from '../vendor/avalonbox/avalonbox.js';

import utils from '../utilities.js';


export default function () {
  document.querySelectorAll( '.gallery' ).forEach( ( gallery ) => {
    if ( !gallery.id ) gallery.id = utils.uuid();
    avalonbox.run( gallery.id );
  } );

  document.querySelectorAll( '.lightbox' ).forEach( ( image ) => {
    if ( !image.id ) image.id = utils.uuid();
    avalonbox.run( image.id );
  } );
}
