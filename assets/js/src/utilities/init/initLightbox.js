import avalonbox from 'vendor/avalonbox/avalonbox.js';

import uuid from '../uuid.js';


export default function () {
  const galleries = document.querySelectorAll( '.gallery' );

  for ( let i = 0; i < galleries.length; i++ ) {
    const gallery = galleries[i];

    if ( !gallery.id ) gallery.id = uuid();
    avalonbox.run( gallery.id );
  }

  const lightboxes = document.querySelectorAll( '.lightbox' );

  for ( let i = 0; i < lightboxes.length; i++ ) {
    const image = lightboxes[i];

    if ( !image.id ) image.id = uuid();
    avalonbox.run( image.id );
  }
}
