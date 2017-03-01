
let fluidvids = {
  selector: [
      'iframe', 'object',
    ],
  players: ['www.youtube.com', 'player.vimeo.com'],
};

let css = [
  '.fluidvids {',
  'width: 100%; max-width: 100%;',
  '}',
  '.fluidvids-item {',
  'position: absolute; top: 0px; left: 0px; width: 100%; height: 100%;',
  '}',
].join( '' );

let head = document.head || document.getElementsByTagName( 'head' )[0];

function matches( src ) {
  return new RegExp( '^(https?:)?\/\/(?:' + fluidvids.players.join( '|' ) + ').*$', 'i' ).test( src );
}

function getRatio( height, width ) {
  return ( ( parseInt( height, 10 ) / parseInt( width, 10 ) ) * 100 ) + '%';
}

function fluid( elem ) {
  if ( !matches( elem.src ) && !matches( elem.data ) || !!elem.getAttribute( 'data-fluidvids' ) )
      {return;}
  let wrap = document.createElement( 'div' );
  elem.parentNode.insertBefore( wrap, elem );
  elem.className += ( elem.className
        ? ' '
        : '' ) + 'fluidvids-item';
  elem.setAttribute( 'data-fluidvids', 'loaded' );
  wrap.className += 'fluidvids';
  wrap.style.paddingTop = getRatio( elem.height, elem.width );
  wrap.appendChild( elem );
}

function addStyles() {
  let div = document.createElement( 'div' );
  div.innerHTML = '<p>x</p><style>' + css + '</style>';
  head.appendChild( div.childNodes[1] );
}

fluidvids.render = function () {
  let nodes = document.querySelectorAll( fluidvids.selector.join() );
  let i = nodes.length;
  while ( i-- ) {
      fluid( nodes[i] );
    }
};

fluidvids.init = function ( obj ) {
  for ( let key in obj ) {
      fluidvids[key] = obj[key];
    }
  fluidvids.render();
  addStyles();
};

module.exports = fluidvids;
