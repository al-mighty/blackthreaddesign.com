import * as THREE from 'three';

import App from '../../../App/App.js';

// import utils from '../../../../utilities.js';
import './escherSketchCanvasSetup.js';

import StatisticsOverlay from '../../../App/StatisticsOverlay.js';

import RegularHyperbolicTesselation from './utilities/RegularHyperbolicTesselation.js';

let mastHeadHeight = document.querySelector( '.masthead' ).clientHeight;

export default class EscherSketchCanvas {

  constructor( showStats ) {

    const self = this;

    self.container = document.querySelector( '.canvas-container' );

    self.app = new App( document.querySelector( '#escherSketch-canvas' ) );

    self.app.camera.position.set( 0, 0, 100 );

    // TODO: not working in Edge
    let statisticsOverlay;
    if ( showStats ) statisticsOverlay = new StatisticsOverlay( self.app, self.container );



    self.app.onUpdate = function () {

      if ( showStats ) statisticsOverlay.updateStatistics( self.app.delta );

    };

    self.app.onWindowResize = function () { 
      mastHeadHeight = document.querySelector( '.masthead' ).clientHeight;
    };

    self.app.play();

  }

  static initTiling( spec ) {

    const imagesPath = '/assets/images/work/escherSketch/';

    spec = spec || {
      wireframe: false,
      p: 6,
      q: 6,
      textures: [`${imagesPath}fish-black.png`, `${imagesPath}fish-white.png`],
      edgeAdjacency: [ //array of length p
                      [1, //edge_0 orientation (-1 = reflection, 1 = rotation)
                        5, //edge_0 adjacency (range p - 1)
                      ],
                      [1, 4], //edge_1 orientation, adjacency
                      [1, 3], [1, 2], [1, 1], [1, 0]],
      minPolygonSize: 0.05,
    };

    const tesselation = new RegularHyperbolicTesselation( spec );

    return tesselation.generateTiling( true );
  }

}
