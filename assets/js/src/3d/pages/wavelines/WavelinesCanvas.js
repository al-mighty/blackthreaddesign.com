import * as THREE from 'three';

import utils from '../../../utilities.js';
import StatisticsOverlay from '../../App/StatisticsOverlay.js';
import App from '../../App/App.js';

import { createGroup1, createGroup2, createGroup3 } from './objects/lines.js';

export default class WavelinesCanvas {

  constructor( showStats ) {

    const self = this;

    self.container = document.querySelector( '.canvas-container' );

    self.app = new App( document.querySelector( '#wavelines-canvas' ) );

    self.app.renderer.setClearColor( 0xffffff );
    self.app.camera.position.set( 0, 0, 1 );

    // TODO: not working in Edge
    let statisticsOverlay;
    if ( showStats ) statisticsOverlay = new StatisticsOverlay( self.app, self.container );

    self.mixers = [];

    self.app.onUpdate = function () {

      self.animateCamera();

      self.mixers.forEach( mixer => mixer.update( self.app.delta * 0.001 ) );

      if ( showStats ) statisticsOverlay.updateStatistics( self.app.delta );

    };

    self.app.onWindowResize = function () {

    };

    self.initLines();

    self.centreCircle();

    self.app.play();
  }

  // For testing
  centreCircle() {
    const map = new THREE.TextureLoader().load( '/assets/images/work/wavelines/blueball-trans.png' );
    const geom = new THREE.SphereBufferGeometry( 0.5, 32, 32 );

    const mat = new THREE.MeshBasicMaterial( {
      color: 0xffffff,
      map,
      transparent: true,
    } );

    const mesh = new THREE.Mesh( geom, mat );

    mesh.position.set( 0, 0, -1 );

    this.circle = mesh;

    this.app.scene.add( mesh );
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

    this.circle.position.y = pointerY / window.innerHeight;
  }

}
