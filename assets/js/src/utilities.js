// Simple uuid function
export const uuid = function b( a ) {
  return a ? ( a ^ Math.random() * 16 >> a / 4 ).toString( 16 ) :
      ( [1e7] + -1e3 + -4e3 + -8e3 + -1e11 ).replace( /[018]/g, b );
};


/* ****************************************
  Keep track of mouse / pointer position
  use something like

  import { moveHandler } from './utilities.js';
  window.addEventListener('mousemove', moveHandler); //use once globally

  to keep track of position then use

  import { pointerPos } from './utilities.js';

  to access the position
*/
export const pointerPos = {
  x: 0,
  y: 0,
};

export const moveHandler = ( e ) => {
  if ( e.pointerType === 'touch' ) {

    pointerPos.x = e.center.x;
    pointerPos.y = e.center.y;
  } else {
    pointerPos.x = e.pageX;
    pointerPos.y = e.pageY;
  }
};
