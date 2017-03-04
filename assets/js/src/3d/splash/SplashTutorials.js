
import StatisticsOverlay from '../StatisticsOverlay.js';
import App from '../App.js';

import backgroundVert from '../shaders/splashBackground.vert';
import backgroundFrag from '../shaders/splashBackground.frag';

import { pointerPos } from '../../utilities.js';

export default class SplashTutorials {

  constructor( showStats ) {

    const canvas = document.querySelector( '#splash-tutorials-canvas' );

    const container = document.querySelector( '#splash-tutorials-canvas-container' );

    const app = new App( canvas );

    app.renderer = new THREE.WebGLRenderer({ canvas: app.canvas, antialias: true, alpha: true });

    app.camera.position.z = 2;

    const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x283844, 1.2 );
    app.scene.add( hemiLight );

    // TODO: not working in Edge
    let statisticsOverlay;
    if ( showStats ) statisticsOverlay = new StatisticsOverlay( app, container );

    let book;

    const textureLoader = new THREE.TextureLoader();
    const cover = textureLoader.load( '/assets/models/book/Book_Cover.jpg' );


    const JSONloader = new THREE.ObjectLoader();

    JSONloader.load(
        '/assets/models/book/book.json',
        ( obj ) => {
          book = obj.children[0];
          // book.geometry.normalize();
          book.scale.set( 5, 5, 5 );
          book.position.set( 0, 0, 0 );
          book.material = new THREE.MeshBasicMaterial( { map: cover, color: 0x000000 } );
          console.log( book );
          app.scene.add( book );
        },
    );


    app.onUpdate = function () {

      if ( book ) {

        book.rotation.x += 0.0001 * app.delta;
        book.rotation.y += 0.0005 * app.delta;

      }

      if ( showStats ) statisticsOverlay.updateStatistics( app.delta );

    };

    // app.onWindowResize = function () {};

    app.play();

  }

  initCube() {
    const geometry = new THREE.BoxBufferGeometry( 200, 200, 200 );
    const material = new THREE.MeshStandardMaterial( {color: 0xffffff} );
    const cube = new THREE.Mesh( geometry, material );
    return cube;
  }

}
