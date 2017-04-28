import throttle from 'lodash.throttle';
import * as Ham from 'hammerjs';

const Hammer = Ham.default;

const calculateCanvasDims = () => {
  const dim = ( window.innerWidth < window.innerHeight ) 
    ? window.innerWidth * 0.9 : window.innerHeight * 0.9;

  return Math.min( 1280, dim );
}


export default function wavelinesLayout() {
  const canvasContainer = document.querySelector( '.canvas-container' );

  let canvasContainerDim = calculateCanvasDims();

  canvasContainer.style.height = canvasContainerDim + 'px';
  canvasContainer.style.width = canvasContainerDim + 'px';

  window.addEventListener( 'resize', throttle( () => {
    canvasContainerDim = calculateCanvasDims();
    canvasContainer.style.height = canvasContainerDim + 'px';
    canvasContainer.style.width = canvasContainerDim + 'px';
  }), 250 );

}
