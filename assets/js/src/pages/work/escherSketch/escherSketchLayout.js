import throttle from 'lodash.throttle';

const calculateCanvasDims = () => {
  const dim = ( window.innerWidth < window.innerHeight ) 
    ? window.innerWidth * 0.9 : window.innerHeight * 0.9;

  return Math.min( 1280, dim );
}

function initPQSelectors(){
  function change( direction, elem ) {
    if ( direction === 1 ) {
      elem.innerHTML = '8';
    }
    else {
      elem.innerHTML = '6';
    }
  }

  const pValue = document.querySelector( '#p-value' );
  const qValue = document.querySelector( '#q-value' );

  document.querySelector( '#p-up' ).addEventListener( 'click', () => {
    change( 1, pValue );
  } );

  document.querySelector( '#p-down' ).addEventListener( 'click', () => {
    change( 0, pValue );
  } );

  const qUp = document.querySelector( '#q-up' );
  const qDown = document.querySelector( '#q-down' );

}


export default function escherSketchLayout() {
  const canvasContainer = document.querySelector( '.canvas-container' );

  let canvasContainerDim = calculateCanvasDims();

  canvasContainer.style.height = canvasContainerDim + 'px';
  canvasContainer.style.width = canvasContainerDim + 'px';

  window.addEventListener( 'resize', throttle( () => {
    canvasContainerDim = calculateCanvasDims();
    canvasContainer.style.height = canvasContainerDim + 'px';
    canvasContainer.style.width = canvasContainerDim + 'px';
  }), 250 );

  initPQSelectors();

}
