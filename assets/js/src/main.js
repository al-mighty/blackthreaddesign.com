import avalonbox from '../vendor/avalonbox/avalonbox.js';
import fluidvids from '../vendor/fluidVids.js';
import Greedy from '../vendor/greedy-nav.js';

//Simple uuid function
var uuid = function b(a) {
  return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) :
      ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, b);
};

document.querySelectorAll( '.gallery' ).forEach( ( gallery ) => {
  if(! gallery.id) gallery.id = uuid();
  avalonbox.run( gallery.id );
} );

document.querySelectorAll( '.lightbox' ).forEach( ( image ) => {
  if(! image.id) image.id = uuid();
  avalonbox.run( image.id );
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

