import * as THREE from 'three';

import utils from '../../../../utilities.js';
import App from '../../../App/App.js';

import { createGroup1, createGroup2, createGroup3 } from './objects/lines.js';

export default class WavelinesCanvas {

  constructor( showStats ) {

    const self = this;

    this.container = document.querySelector( '.canvas-container' );

    this.app = new App( document.querySelector( '#wavelines-canvas' ) );

    this.app.renderer.setClearColor( 0xffffff );
    this.app.camera.position.set( 0, 0, 1 );
    this.app.camera.fov = 75;
    this.app.camera.updateProjectionMatrix();

    self.mixers = [];

    self.app.onUpdate = function () {

      self.animateCamera();

      self.mixers.forEach( mixer => mixer.update( self.app.delta * 0.001 ) );

    };

    self.app.onWindowResize = function () {

    };

    self.initLines();

    self.app.play();
  }

  initLines() {
    const groups = [
      createGroup1( this.app.camera ),
      createGroup2( this.app.camera ),
      createGroup3( this.app.camera ),
    ];

    groups.forEach( ( group ) => {
      this.app.scene.add( group.group );
      this.mixers.push( group.mixer );
    } );
  }

  animateCamera() {
    const pointerY = utils.pointerPos.y;

    this.app.camera.position.y = pointerY / window.innerHeight;

  }

}
