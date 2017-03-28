import throttle from 'lodash.throttle';

export default function aboutLayout() {
  const canvasContainer = document.querySelector( '.fullpage-canvas-container' );

  const canvasContainerHeight = window.innerHeight * 0.75;

  canvasContainer.style.height = canvasContainerHeight + 'px';

  window.addEventListener('resize', throttle(() => {
    const canvasContainerHeight = window.innerHeight * 0.75;
    canvasContainer.style.height = canvasContainerHeight + 'px';
  }), 250 );

  
}
