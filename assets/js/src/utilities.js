  /* ****************************************
  Keep track of mouse / pointer position
  use something like

  import utils from './utilities.js';
  window.addEventListener('mousemove', utils.moveHandler); //use once globally

  utils.pointerPos

  to access the position
*/

const pointerPos = {
  x: 0,
  y: 0,
};

export default {
  // Simple uuid function
  uuid: function b( a ) {
    return a ? ( a ^ Math.random() * 16 >> a / 4 ).toString( 16 ) :
        ( [1e7] + -1e3 + -4e3 + -8e3 + -1e11 ).replace( /[018]/g, b );
  },

  pointerPos,

  moveHandler: ( e ) => {
    if ( e.pointerType === 'touch' ) {

      pointerPos.x = e.center.x;
      pointerPos.y = e.center.y;
    } else {
      pointerPos.x = e.pageX;
      pointerPos.y = e.pageY;
    }
  }
}
