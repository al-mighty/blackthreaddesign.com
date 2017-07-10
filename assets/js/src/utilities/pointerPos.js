  /* ****************************************
  Keep track of mouse / pointer position
  use something like

  to access the position
*/

const pointerPos = {
  x: 0,
  y: 0,
};

const moveHandler = ( e ) => {
  if ( e.pointerType === 'touch' ) {
    pointerPos.x = e.center.x;
    pointerPos.y = e.center.y;
  } else {
    pointerPos.x = e.pageX;
    pointerPos.y = e.pageY;
  }
};

// Set up event listeners for touch and mouse

// TODO: Make sure this isn't being called twice
window.addEventListener( 'mousemove', moveHandler );
new Hammer( document.querySelector( 'body' ) )
  .on( 'pan', moveHandler );

export default pointerPos;
