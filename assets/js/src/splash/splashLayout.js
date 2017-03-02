import throttle from 'lodash.throttle';

export default function initSplashLayout() {
  const splashHeroContainer = document.querySelector( '#splash__hero-container' );
  const underCanvas = document.querySelector('#splash__under-hero');

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
