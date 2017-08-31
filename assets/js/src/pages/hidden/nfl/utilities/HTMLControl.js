const canvas = document.querySelector( '#canvas' );
const container = document.querySelector( '#container' );

const masthead = document.querySelector( '.masthead' );
const footer = document.querySelector( '.page__footer' );

const loading = {
  bar: document.querySelector( '#loading-bar' ),
  overlay: document.querySelector( '#loading-overlay' ),
  revealOnLoad: document.querySelectorAll( '.reveal-on-load' ),
  hideOnLoad: document.querySelectorAll( '.hide-on-load' ),
  progress: document.querySelector( '#progress' ),
};

const attributes = {
  'dominant-hand': {
    left: document.querySelector( '#hand-left' ),
    right: document.querySelector( '#hand-right' ),
    both: document.querySelector( '#hand-both' ),
  },
};

[].slice.call( document.querySelectorAll( '.attribute' ) )
  .forEach( ( node ) => {

    const slider = node.querySelector( '.slider' );

    if ( slider !== null ) attributes[ slider.id ] = slider;

  } );

export default class HTMLControl {

  static setInitialState() {

  }

  static setOnLoadStartState() {

    loading.bar.classList.remove( 'hide' );

  }

  static setOnLoadEndState() {
    loading.overlay.classList.add( 'hide' );

    for ( let i = 0; i < loading.hideOnLoad.length; i++ ) {

      loading.hideOnLoad[ i ].classList.add( 'hide' );

    }

    for ( let i = 0; i < loading.revealOnLoad.length; i++ ) {

      loading.revealOnLoad[ i ].classList.remove( 'hide' );

    }
  }

}

HTMLControl.canvas = canvas;
HTMLControl.container = container;
HTMLControl.masthead = masthead;
HTMLControl.footer = footer;
HTMLControl.loading = loading;
HTMLControl.attributes = attributes;

