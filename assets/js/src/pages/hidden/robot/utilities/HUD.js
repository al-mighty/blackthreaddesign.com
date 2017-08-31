import * as THREE from 'three';
import canvas from '../Canvas.js';
import HTMLControl from './HTMLControl.js';

export default class HUD {

  constructor() {

    this.enabled = false;

    this.scene = new THREE.Scene();

    this.initCamera();
    this.initFrame();

    this.initObjects();

  }

  init( position ) {

    this.position = position;

    this.initBallHelper( position );
    this.initArrowHelper();

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
    this.initGoals();

  }

  initBackGround() {

    const plane = new THREE.PlaneBufferGeometry( this.frame.width, this.frame.height );
    const mesh = new THREE.Mesh( plane, new THREE.MeshBasicMaterial( { color: 0x909090, transparent: true, opacity: 0.1 } ) );

    mesh.position.copy( this.frame.center );

    this.scene.add( mesh );

  }

  initBorder() {

    const plane = new THREE.PlaneBufferGeometry( this.frame.width, this.frame.height );

    const edges = new THREE.EdgesGeometry( plane );
    const line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x202020, transparent: true, opacity: 0.75 } ) );

    line.position.copy( this.frame.center );

    this.scene.add( line );

  }

  initField() {

    const plane = new THREE.PlaneBufferGeometry( this.frame.width - 50, this.frame.height - 50 );
    const mesh = new THREE.Mesh( plane, new THREE.MeshBasicMaterial( { color: 0x75B82B } ) );

    mesh.position.copy( this.frame.center );

    this.scene.add( mesh );

  }

  initGoals() {

    const plane = new THREE.PlaneBufferGeometry( 5, 50 );
    const mesh = new THREE.Mesh( plane, new THREE.MeshBasicMaterial( { color: 0x000080 } ) );

    mesh.position.set(
      this.frame.center.x + 73,
      this.frame.center.y,
      this.frame.center.z + 1,
    );

    this.scene.add( mesh );

  }

  initBallHelper( position ) {

    if ( position === undefined ) position = this.position;

    const geo = new THREE.CircleBufferGeometry( 5, 12 );
    this.ballHelper = new THREE.Mesh( geo, new THREE.MeshBasicMaterial( { color: 0xC60000 } ) );
    this.ballHelper.position.set(
      this.frame.center.x + position.x,
      this.frame.center.y - position.z,
      this.frame.center.z,
     );

    this.scene.add( this.ballHelper );

  }

  initArrowHelper() {

    const dir = new THREE.Vector3( 1, 0, 0 );
    const origin = this.ballHelper.position.clone();
    this.arrowHelper = new THREE.ArrowHelper( dir, origin, 40, 0x000000, 20, 10 );

    this.scene.add( this.arrowHelper );

  }

  render() {

    // required to draw the renderer's background in the main scene
    canvas.app.renderer.clear();

    if ( !this.enabled ) return;

    canvas.app.renderer.render( this.scene, this.camera, null, true );

  }

  resize() {

    this.initFrame();
    this.initCamera();
    this.scene = new THREE.Scene();
    this.initObjects();

  }

  reset() {

    this.scene.remove( this.arrowHelper );
    this.scene.remove( this.ballHelper );

  }

  update( directionVector ) {

    this.arrowHelper.setDirection( directionVector );

  }

}
