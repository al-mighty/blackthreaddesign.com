import Greedy from '../vendor/greedy-nav.js';

// Initialise menu
export default function () {
  const menu = new Greedy( {
    element: '.greedy-nav',
    counter: true,
  } );
}
