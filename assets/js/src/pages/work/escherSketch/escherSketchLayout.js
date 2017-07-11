import throttle from 'lodash.throttle';

const calculateCanvasDims = () => {
  const dim = ( window.innerWidth < window.innerHeight )
    ? window.innerWidth * 0.9 : window.innerHeight * 0.9;

  return Math.min( 1280, dim );
};

function initPQSelectors() {

  function change( direction, elem ) {

    const currentValue = parseInt( elem.innerHTML, 10 );
    if ( direction === 1 ) {
      if ( currentValue === 8 ) return;
      elem.innerHTML = currentValue + 2;
    } else {
      if ( currentValue === 4 ) return;
      elem.innerHTML = String( currentValue - 2 );
    }

  }

  const pValue = document.querySelector( '#p-value' );
  const qValue = document.querySelector( '#q-value' );

  const pUp = document.querySelector( '#p-up' );
  new Hammer( pUp )
    .on( 'tap', () => { change( 1, pValue ); } );

  const pDown = document.querySelector( '#p-down' );
  new Hammer( pDown )
    .on( 'tap', () => { change( 0, pValue ); } );

  const qUp = document.querySelector( '#q-up' );
  new Hammer( qUp )
    .on( 'tap', () => { change( 1, qValue ); } );

  const qDown = document.querySelector( '#q-down' );
  new Hammer( qDown )
    .on( 'tap', () => { change( 0, qValue ); } );

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
  } ), 250 );

  initPQSelectors();

}
