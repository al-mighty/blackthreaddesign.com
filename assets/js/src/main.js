import avalonbox from '../vendor/avalonbox/avalonbox.js';
import fluidvids from '../vendor/fluidVids.js';
import Greedy from '../vendor/greedy-nav.js';

document.querySelectorAll( '.gallery' ).forEach( ( gallery ) => {
  avalonbox.run( gallery.id );
} );

fluidvids.init( {
  selector: ['iframe', 'object'], // runs querySelectorAll()
  players: ['www.youtube.com', 'player.vimeo.com'], // players to support
} );

// equivalent to jQuery outerHeight( true )
function outerHeight( el ) {
  let height = el.offsetHeight;
  const style = getComputedStyle( el );

  height += parseInt( style.marginTop ) + parseInt( style.marginBottom );
  return height;
}


// Sticky footer
const bumpIt = function bumpIt() {
  const height = outerHeight( document.querySelector( '.page__footer' ) );
  document.querySelector( 'body' ).style.marginBottom = height + 'px';
};

let didResize = false;

bumpIt();

const onResize = function onResize() {
  didResize = true;
};

window.addEventListener( 'resize', onResize );

setInterval( () => {
  if ( didResize ) {
    didResize = false;
    bumpIt();
  }
}, 250 );


// Initialise menu
const menu = new Greedy( {
  element: '.greedy-nav',
  counter: false,
} );

