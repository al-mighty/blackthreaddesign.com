import avalonbox from '../../vendor/avalonbox/avalonbox.js';

import { uuid } from '../utilities.js';

document.querySelectorAll( '.gallery' ).forEach( ( gallery ) => {
  if(! gallery.id) gallery.id = uuid();
  avalonbox.run( gallery.id );
} );

document.querySelectorAll( '.lightbox' ).forEach( ( image ) => {
  if(! image.id) image.id = uuid();
  avalonbox.run( image.id );
} );
