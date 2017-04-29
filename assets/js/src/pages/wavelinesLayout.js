import throttle from 'lodash.throttle';

const calculateCanvasDims = () => {
  const dim = ( window.innerWidth < window.innerHeight ) 
    ? window.innerWidth * 0.9 : window.innerHeight * 0.9;

  return Math.min( 1280, dim );
}


export default function wavelinesLayout() {
  const page = document.querySelector( '.page' );

  page.style.width = '100%';
  page.style.padding = 0;

  const canvasContainer = document.querySelector( '.canvas-container' );

  let canvasContainerDim = calculateCanvasDims();

  canvasContainer.style.height = canvasContainerDim + 'px';
  canvasContainer.style.width = '100%';

  window.addEventListener( 'resize', throttle( () => {
    canvasContainerDim = calculateCanvasDims();
    canvasContainer.style.height = canvasContainerDim + 'px';
  }), 250 );

}
