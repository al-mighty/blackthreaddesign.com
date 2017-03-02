import throttle from 'lodash.throttle';

export default function initSplashLayout() {
  const canvas = document.querySelector('#splash__hero-container');

  const canvasHeight = 0.75;
  canvas.style.height = window.innerHeight * canvasHeight + 'px';

  const masthead = document.querySelector('.masthead');

  let mastheadHeight = masthead.clientHeight;

  const underCanvas = document.querySelector('#splash__under-hero');
  underCanvas.style.height = window.innerHeight - canvas.getBoundingClientRect().bottom + 'px';

  window.addEventListener('resize', throttle(() => {
      canvas.style.height = window.innerHeight * canvasHeight + 'px';
      underCanvas.style.height = window.innerHeight - canvas.getBoundingClientRect().bottom + 'px';
  }), 250);

}
