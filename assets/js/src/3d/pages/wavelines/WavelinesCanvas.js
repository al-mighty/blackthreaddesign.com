import * as THREE from 'three';

import utils from '../../../utilities.js';



import StatisticsOverlay from '../../App/StatisticsOverlay.js';

import App from '../../App/App.js';

import SineWave from './objects/SineWave.js';

import basicVert from './shaders/basic.vert';
import basicFrag from './shaders/basic.frag';

import { createGroup1 } from './spec/lines.js';
import { visibleHeightAtZDepth, visibleWidthAtZDepth } from './wavelinesCanvasHelpers.js';

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

      self.canvasHeight = visibleHeightAtZDepth( self.lineDepth, self.app.camera );
      self.canvasWidth = visibleWidthAtZDepth( self.lineDepth, self.app.camera );
 
   };

    self.canvasHeight = visibleHeightAtZDepth( self.lineDepth, self.app.camera );
    self.canvasWidth = visibleWidthAtZDepth( self.lineDepth, self.app.camera );

    self.initLines();

    self.centreCircle();

    self.app.play();
  }

  // For testing
  centreCircle() {
    const geom = new THREE.SphereBufferGeometry( 1.5, 32, 32 );
    const mesh = new THREE.Mesh( geom, new THREE.MeshBasicMaterial( { color: 0xff00ff } ) );

    mesh.position.set( 0, 0, -5 );

    this.circle = mesh;

    this.app.scene.add( mesh );
  }

  initLines() {
    const group1 = createGroup1( this.app.camera );

    this.app.scene.add( group1.group );

    this.mixers.push( group1.mixer );

  }

  animateCamera() {
    const pointerY = utils.pointerPos.y;

    this.app.camera.position.y = pointerY / window.innerHeight;

    this.circle.position.y = pointerY / window.innerHeight;
  }

}
