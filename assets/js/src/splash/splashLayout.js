import throttle from 'lodash.throttle';

export default function initSplashLayout() {
  const splashHeroContainer = document.querySelector( '#splash-hero-container' );
  const underCanvas = document.querySelector('#splash-under-hero-row');

  const splashHeroContainerHeight = window.innerHeight * 0.75;

  splashHeroContainer.style.height = splashHeroContainerHeight + 'px';

  const underCanvasHeight = window.innerHeight - ( splashHeroContainer.clientTop + splashHeroContainerHeight );
  underCanvas.style.height = underCanvasHeight + 'px';

  window.addEventListener('resize', throttle(() => {
    const splashHeroContainerHeight = window.innerHeight * 0.75;
    splashHeroContainer.style.height = splashHeroContainerHeight + 'px';

    const underCanvasHeight = window.innerHeight - ( splashHeroContainer.clientTop + splashHeroContainerHeight );
    underCanvas.style.height = underCanvasHeight + 'px';
  }), 250 );

}
