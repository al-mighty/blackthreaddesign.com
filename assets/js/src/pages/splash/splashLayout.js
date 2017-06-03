import throttle from 'lodash.throttle';

export default function initSplashLayout() {
  let mastHeadHeight = document.querySelector( '.masthead' ).clientHeight;

  const splashHeroContainer = document.querySelector( '#splash-hero-container' );

  let splashHeroContainerHeight = window.innerHeight - mastHeadHeight;

  splashHeroContainer.style.height = splashHeroContainerHeight + 'px';


  window.addEventListener( 'resize', throttle( () => {
    mastHeadHeight = document.querySelector( '.masthead' ).clientHeight;

    splashHeroContainerHeight = window.innerHeight - mastHeadHeight;
    splashHeroContainer.style.height = splashHeroContainerHeight + 'px';

  } ), 250 );
}
