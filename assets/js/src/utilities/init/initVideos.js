import fluidvids from 'vendor/fluidVids.js';

export default function () {
  fluidvids.init( {
    selector: ['iframe', 'object'], // runs querySelectorAll()
    players: ['www.youtube.com', 'player.vimeo.com'], // players to support
  } );
}
