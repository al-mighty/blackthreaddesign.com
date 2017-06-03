import * as THREE from 'three';

import App from '../../../App/App.js';

import './bottleCanvasSetup.js';

import StatisticsOverlay from '../../../App/StatisticsOverlay.js';

export default class BottleCanvas {

  constructor( showStats ) {

    const self = this;

    self.container = document.querySelector( '.canvas-container' );

    self.app = new App( document.querySelector( '#bottle-canvas' ) );

    self.app.camera.position.set( 0, 0, 5 );
    // self.app.camera.far = 100;

    // TODO: not working in Edge
    let statisticsOverlay;
    if ( showStats ) statisticsOverlay = new StatisticsOverlay( self.app, self.container );

    self.app.onUpdate = function () {

      if ( showStats ) statisticsOverlay.updateStatistics( self.app.delta );


      self.testMesh.rotation.x += self.app.delta * 0.001;
      self.testMesh.rotation.y -= self.app.delta * 0.001;
      self.testMesh.rotation.z += self.app.delta * 0.001;
    };

    self.app.onWindowResize = function () {

    };

    self.initMaterials();
    self.initLights();
    self.initObjects();

    self.app.play();

  }

  initMaterials() {
    this.testMat = new THREE.MeshStandardMaterial();
  }

  initLights() {
    const ambient = new THREE.AmbientLight( 0x404040, 1.0 );

    const directionalLight = new THREE.DirectionalLight( 0xffffff, 1.0 );
    directionalLight.position.set( 0, 10, 0 );

    this.app.scene.add( ambient, directionalLight );
  }

  initObjects() {
    const testCube = new THREE.BoxBufferGeometry( 3, 3, 3 );
    this.testMesh = new THREE.Mesh( testCube, this.testMat );

    this.app.scene.add( this.testMesh );
  }
}
