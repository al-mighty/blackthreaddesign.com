import * as THREE from 'three';
// import throttle from 'lodash.throttle';
import canvas from '../Canvas.js';
// import AttributeControls from './AttributeControls.js';
// import animationControls from './AnimationControls.js';

class CameraControl {

  constructor() {

    this.camera = canvas.app.camera;
    this.controls = canvas.app.controls;

    this.lookAtTargets = {
      current: new THREE.Vector3(),
    };

    this.positionTargets = {
      current: new THREE.Vector3(),
    };

  }

  initCamera() {

    const boundingBox = new THREE.Box3();

    // get bounding box of object - this will be used to setup controls and camera
    boundingBox.setFromObject( this.player );

    const center = boundingBox.getCenter();
    const size = boundingBox.getSize();

    // get the max side of the bounding box
    const maxDim = Math.max( size.x, size.y, size.z );
    const fov = this.camera.fov * ( Math.PI / 180 );
    const cameraZ = Math.abs( maxDim / 4 * Math.tan( fov * 2 ) );

    this.camera.position.z = cameraZ;

    const minZ = boundingBox.min.z;
    const cameraToFarEdge = ( minZ < 0 ) ? -minZ + cameraZ : cameraZ - minZ;

    this.camera.far = cameraToFarEdge * 3;
    this.camera.updateProjectionMatrix();

      // set camera to rotate around center of loaded object
    this.controls.target = center;

    // prevent camera from zooming out far enough to create far plane cutoff
    this.controls.maxDistance = cameraToFarEdge * 2;

  }

  initControls() {

    this.controls.minPolarAngle = 0;
    this.controls.maxPolarAngle = Math.PI / 2;

    // save the initial position. This can be regained with controls.reset()
    this.controls.saveState();

  }

  init( player ) {

    this.player = player;

    this.initCamera();
    this.initControls();

    this.initLookAtTarget();

    this.initPositionTargets();

  }

  initLookAtTarget() {

    this.lookAtTargets.upper = this.player.getObjectByName( 'WAFPhelmet' ).position; // or mixamorigHead

    this.lookAtTargets.default = this.controls.target.clone(); // this.player.getObjectByName( 'mixamorigHips' ).position;

    this.lookAtTargets.current = this.lookAtTargets.default;

    const geo = new THREE.SphereBufferGeometry( 25, 12, 12 );
    const mat = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
    const torsoTarget = new THREE.Mesh( geo, mat );
    torsoTarget.position.copy( this.lookAtTargets.default );
    canvas.app.scene.add( torsoTarget );

    const mat2 = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const upperTarget = new THREE.Mesh( geo, mat2 );
    upperTarget.position.copy( this.lookAtTargets.upper );
    canvas.app.scene.add( upperTarget );


  }

  initPositionTargets() {

    this.positionTargets.head = this.player.getObjectByName( 'mixamorigNeck' ).position; // or mixamorigHead

    this.positionTargets.torso = this.player.getObjectByName( 'mixamorigSpine' ).position; // or mixamorigSpine1 or mixamorigSpine2

    // this.positionTargets.default = this.player.getObjectByName( 'mixamorigHips' ).position;

    // this.positionTargets.current = this.positionTargets.default;

  }


  // per frame calculation
  update( delta ) {

    // console.log( this.controls.scale );

    delta /= 1000;

    const distance = this.controls.target.distanceTo( this.lookAtTargets.current );

    if ( distance > 0.1 ) {

      const start = new THREE.Vector3().copy( this.controls.target );

      const direction = start.sub( this.lookAtTargets.current ).normalize();

      direction.multiplyScalar( distance * delta );

      this.controls.target.sub( direction );

    }

    // this.controls.dollyIn( delta / 1000 );

  }

  focusOnUpperBody() {

    console.log( 'Focussing on upper body' );
    this.lookAtTargets.current = this.lookAtTargets.upper; // this.lookAtTargets.torso

  }

  focusOnWholeBody() {

    console.log( 'Focussing on whole body' );
    this.lookAtTargets.current = this.lookAtTargets.default;

  }


}

const cameraControl = new CameraControl();

export default cameraControl;