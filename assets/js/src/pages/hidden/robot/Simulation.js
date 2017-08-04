import * as THREE from 'three';

import OnLoadCallbacks from './utilities/onLoadCallbacks.js';
import robotCanvas from './RobotCanvas.js';

export default class Simulation {

  constructor() {

    this.loadModels();

    this.tempBall();

  }

  loadModels() {

    OnLoadCallbacks.onFBXLoad( '/assets/models/robot/field_01.fbx' );
    OnLoadCallbacks.onFBXLoad( '/assets/models/robot/nao_01.fbx' );

  }


  tempBall() {

    const geo = new THREE.SphereBufferGeometry( 100, 16, 16 );

    const mat = new THREE.MeshStandardMaterial( { color: 0xefefef } );

    const ballMesh = new THREE.Mesh( geo, mat );

    robotCanvas.addObjectToScene( ballMesh );

  }


}

