
import StatisticsOverlay from '../StatisticsOverlay.js';
import App from '../App.js';

import backgroundVert from '../shaders/splashBackground.vert';
import backgroundFrag from '../shaders/splashBackground.frag';

import { pointerPos } from '../../utilities.js';

export default class SplashWork {

  constructor() {

    const canvas = document.querySelector( '#splash__canvas-work' );

    const container = document.querySelector( '#splash__work-container' );

    const app = new App( canvas );

    app.camera.position.z = 350;

    const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x283844, 1.5 );
    app.scene.add( hemiLight );

    //app.camera.far = 5;

    // TODO: not working in Edge
    const statisticsOverlay = new StatisticsOverlay( app, container );

    const cube = this.initCube();

    app.scene.add( cube );


    app.onUpdate = function () {

      cube.rotation.x += 0.0001 * app.delta;
			cube.rotation.y += 0.0005 * app.delta;

      statisticsOverlay.updateStatistics( app.delta );

    };

    // app.onWindowResize = function () {};

    app.play();

  }

  initLights() {
    
  }

  initCube() {
    const geometry = new THREE.BoxBufferGeometry( 200, 200, 200 );
    const material = new THREE.MeshStandardMaterial( {color: 0xffffff} );
    const cube = new THREE.Mesh( geometry, material );
    return cube;
  }

}
