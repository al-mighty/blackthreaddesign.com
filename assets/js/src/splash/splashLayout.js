import throttle from 'lodash.throttle';

//BUG: underCanvas height is not set correctly when page is scrolled down
export default function initSplashLayout() {
  const splashHeroContainer = document.querySelector( '#splash__hero-container' );

  const splashHeroContainerHeight = 0.75;
  splashHeroContainer.style.height = window.innerHeight * splashHeroContainerHeight + 'px';

  //const masthead = document.querySelector('.masthead');

  //let mastheadHeight = masthead.clientHeight;

  const underCanvas = document.querySelector('#splash__under-hero');
  underCanvas.style.height = window.innerHeight - splashHeroContainer.getBoundingClientRect().bottom + 'px';

  window.addEventListener('resize', throttle(() => {
    splashHeroContainer.style.height = window.innerHeight * splashHeroContainerHeight + 'px';
    underCanvas.style.height = window.innerHeight - splashHeroContainer.getBoundingClientRect().bottom + 'px';
  }), 250 );

}
