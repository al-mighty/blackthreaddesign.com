import throttle from 'lodash.throttle';

// equivalent to jQuery outerHeight( true )
function outerHeight( el ) {
  let height = el.offsetHeight;
  const style = getComputedStyle( el );

  height += parseInt( style.marginTop ) + parseInt( style.marginBottom );
  return height;
}


// Sticky footer
const setBodyMargin = function setBodyMargin() {
  const height = outerHeight( document.querySelector( '.page__footer' ) );
  document.querySelector( 'body' ).style.marginBottom = height + 'px';
};

setBodyMargin();

window.addEventListener( 'resize', throttle( setBodyMargin, 250 ) );

