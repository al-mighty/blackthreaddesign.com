import * as THREE from 'three';
import HTMLControl from './HTMLControl.js';

export default class Grid {

  constructor() {

    this.enabled = true;

    this.scene = new THREE.Scene();
    // this.scene.background = 0xff00ff;

    this.initCamera();

    this.initFrame();
    this.initObjects();

  }

  initFrame() {

    const width = 250;
    const height = 190;
    const x = 10;
    const y = HTMLControl.canvas.height - height - 10;

    this.frame = {
      x,
      y,
      height,
      width,
      center: new THREE.Vector3(

        // to place at left
        // -HTMLControl.canvas.width / 2 + this.frame.width / 2 + this.frame.x,

        // to place at right
        HTMLControl.canvas.width / 2 - width / 2 - x,

        // top place at top
        -HTMLControl.canvas.height / 2 + height / 2 + y,

        // to place at bottom
        // HTMLControl.canvas.height / 2 - this.frame.height / 2 - this.frame.y,

        0
      ),
    }
  }


  // create a camera the full size of the canvas
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

    this.initBackGround();
    this.initBorder();
    this.initField();
    this.initGoalsHelper();
    // this.initNaoHelper();
    // this.initBallHelper();

    // this.initArrowHelper();

  }

  initBackGround() {

    const plane = new THREE.PlaneBufferGeometry( this.frame.width, this.frame.height );
    const mesh = new THREE.Mesh( plane, new THREE.MeshBasicMaterial( { color: 0x909090, transparent: true, opacity: 0.1 } ) );

    mesh.position.copy( this.frame.center );

    this.scene.add( mesh );

  }

  initBorder() {

    const plane = new THREE.PlaneBufferGeometry( this.frame.width, this.frame.height, 1, 1 );

    const edges = new THREE.EdgesGeometry( plane );
    const line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x202020, transparent: true, opacity: 0.75 } ) );

    line.position.copy( this.frame.center );

    this.scene.add( line );

  }

  initField() {

    const plane = new THREE.PlaneBufferGeometry( this.frame.width - 50, this.frame.height - 50, 1, 1 );
    const mesh = new THREE.Mesh( plane, new THREE.MeshBasicMaterial( { color: 0x75B82B } ) );

    mesh.position.copy( this.frame.center );

    this.scene.add( mesh );

  }

  initGoalsHelper() {

    const geo = new THREE.BoxBufferGeometry( 50, 5, 5 );
    const mat = new THREE.MeshBasicMaterial( { color: 0x00ffff } );
    const mesh = new THREE.Mesh( geo, mat );

    mesh.position.set(
      this.frame.center.x + 50,
      this.frame.center.y,
      0
    )

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



  initArrowHelper() {

    const dir = new THREE.Vector3( 1, 2, 0 );
    const origin = new THREE.Vector3( 0, 0, 0 );
    const length = 1;
    this.arrowHelper = new THREE.ArrowHelper( dir, origin, length, 0xffff00 );

  }

  render( renderer ) {

    // if ( !this.enabled ) return;

    // const origAutoClearSetting = renderer.autoClear;

    // renderer.autoClear = false; // To allow render overlay
    // renderer.clearDepth();
    renderer.render( this.scene, this.camera, null, true );
    // renderer.render( this.scene, this.camera, null, false );
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
