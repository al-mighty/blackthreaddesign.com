import * as THREE from 'three';

import canvas from './Canvas.js';

import Loaders from './utilities/Loaders.js';

const loaders = new Loaders();

export default class Simulation {

  constructor() {

    this.loadingPromises = [];

    this.loadModels();

    canvas.app.controls.rotateUp( Math.PI / 12 );

  }

  loadModels() {

    const fieldPromise = loaders.fbxLoader( '/assets/models/robot/field.fbx' ).then( ( result ) => {

      // field width width ~140cm, length ~200cm
      canvas.addObjectToScene( result );

    } );

    const naoPromise = loaders.fbxLoader( '/assets/models/robot/nao.fbx' ).then( ( result ) => {

      result.position.set( -50, 0, 0 );

      canvas.addObjectToScene( result );

      this.nao = result;

    } );

    const ballPromise = loaders.fbxLoader( '/assets/models/robot/ball.fbx' ).then( ( result ) => {

      result.position.set( 0, 5, 0 );
      result.rotation.set( 0, - Math.PI / 2, 0 );

      canvas.addObjectToScene( result );

      this.ball = result;

      console.log( result )

    } );

    this.loadingPromises = [ fieldPromise, naoPromise, ballPromise ];

  }


}

