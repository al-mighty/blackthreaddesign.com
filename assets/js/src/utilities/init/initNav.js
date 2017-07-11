import Greedy from 'vendor/greedy-nav.js';

const addActiveToCurrentNavLink = () => {
  const menuItems = Array.prototype.slice.call( document.querySelectorAll( '.masthead__menu-item' ) );
  menuItems.shift();

  const loc = location.href.split( '/' )[3];

  menuItems.forEach( ( item ) => {
    const href = item.firstChild.href.split( '/' )[3];

    if ( href === loc ) item.classList.add( 'active' );

  } );

}

// Initialise menu
export default function () {
  addActiveToCurrentNavLink();

  const menu = new Greedy( {
    element: '.masthead__menu',
    counter: true,
  } );
}
