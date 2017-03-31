import throttle from 'lodash.throttle';

export default function escherSketchLayout() {
  const canvasContainer = document.querySelector( '.canvas-container' );

  const canvasContainerHeight = window.innerWidth;

  canvasContainer.style.height = canvasContainerHeight + 'px';

  window.addEventListener('resize', throttle(() => {
    const canvasContainerHeight = window.innerWidth;
    canvasContainer.style.height = canvasContainerHeight + 'px';
  }), 250 );

  
}
