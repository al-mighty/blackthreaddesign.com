import jump from 'vendor/jump/jump.js';

const links = document.querySelectorAll( 'a' );

// Filename of current page
const fileName = location.href.split( '/' ).pop().split( '#' )[0];

export default function () {

  for ( let i = 0; i < links.length; i++){
    const a = links[i];
    //check if it's a link to another location on the page
    if ( ~a.href.indexOf( fileName + '#' ) ) {
      const link = '#' + a.href.split( '#' ).pop();

      // if it's an empty link ('#'), just return
      if ( link === '#' ) return;

      a.onclick = () => jump( link );
    }
  }
}
