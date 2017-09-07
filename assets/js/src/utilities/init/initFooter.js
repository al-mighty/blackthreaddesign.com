import throttle from 'lodash.throttle';

// equivalent to jQuery outerHeight( true )
function outerHeight( el ) {

  let height = el.offsetHeight;
  const style = getComputedStyle( el );

  height += parseInt( style.marginTop ) + parseInt( style.marginBottom );
  return height;

}

const footer = document.querySelector( '.page__footer' );

// Sticky footer
const setBodyMargin = function setBodyMargin() {
  const height = outerHeight( footer );
  document.querySelector( 'body' ).style.marginBottom = height + 'px';
};

export default function () {
  if ( footer ) {

    footer.classList.remove( 'hide' );

    setBodyMargin();

    window.addEventListener( 'resize', throttle( setBodyMargin, 250 ) );
  }

}
