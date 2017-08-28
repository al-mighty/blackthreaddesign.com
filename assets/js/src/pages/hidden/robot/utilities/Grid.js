import * as THREE from 'three';
import HTMLControl from './HTMLControl.js';

export default class Grid {

  constructor() {

    this.enabled = true;

    this.scene = new THREE.Scene();

    this.initCamera();
    this.initObjects();

  }

  initCamera() {

    this.camera = new THREE.OrthographicCamera(
      -HTMLControl.canvas.width / 2,
      HTMLControl.canvas.width / 2,
      HTMLControl.canvas.height / 2,
      -HTMLControl.canvas.height / 2,
      0.1,
      1000,
    );

    this.camera.position.set( 0, 0, 2 );

  }

  initObjects() {

    this.initGrid();
    this.initField();
    this.initNaoHelper();
    this.initBallHelper();
    this.initGoalsHelper();
    this.initArrowHelper();

    this.addObjects();

  }

  initGrid() {

    this.grid = new THREE.GridHelper( 200, 20 );
    this.scene.add( this.grid );

  }

  initField() {

    const plane = new THREE.PlaneBufferGeometry( 256, 256 );
    const mesh = new THREE.Mesh( plane, new THREE.MeshBasicMaterial( { color: 0xff0000 } ) );

    mesh.position.set( 0, 0, 0 );
    mesh.scale.set( 1, 1, 1 );

    this.scene.add( mesh );

  }

  initNaoHelper() {

    const geo = new THREE.CylinderBufferGeometry( 2, 2, 12, 4, false );
    const mat = new THREE.MeshBasicMaterial( { color: 0xff00ff } );
    this.naoHelper = new THREE.Mesh( geo, mat );

  }

  initBallHelper() {

    const geo = new THREE.CylinderBufferGeometry( 2, 2, 12, 4, false );
    const mat = new THREE.MeshBasicMaterial( { color: 0xff00ff } );
    this.ballHelper = new THREE.Mesh( geo, mat );

  }

  initGoalsHelper() {

    const geo = new THREE.BoxBufferGeometry( 50, 5, 5, 1, 1, 1 );
    const mat = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    this.goalsHelper = new THREE.Mesh( geo, mat );

  }

  initArrowHelper() {

    const dir = new THREE.Vector3( 1, 2, 0 );
    const origin = new THREE.Vector3( 0, 0, 0 );
    const length = 1;
    this.arrowHelper = new THREE.ArrowHelper( dir, origin, length, 0xffff00 );

  }

  addObjects() {

    this.scene.add( this.grid, this.naoHelper, this.ballHelper, this.arrowHelper, this.goalsHelper );

  }

  render( renderer ) {

    // if ( !this.enabled ) return;

    // const origAutoClearSetting = renderer.autoClear;

    // renderer.autoClear = false; // To allow render overlay
    // renderer.clearDepth();
    renderer.render( this.scene, this.camera, null, false );

    // renderer.autoClear = origAutoClearSetting; // Restore original setting

  }

  resize() {

    this.initFrame();

    this.camera.left = -this.frame.width / 2;
    this.camera.right = this.frame.width / 2;
    this.camera.top = this.frame.height / 2;
    this.camera.bottom = -this.frame.height / 2;
    this.camera.updateProjectionMatrix();

    this.update();

  }

  reset() {

    //

  }

  update( renderer, positions, slope ) {

    //

  }

}
