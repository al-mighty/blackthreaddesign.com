import * as THREE from 'three';
// import throttle from 'lodash.throttle';
import canvas from '../Canvas.js';
// import AttributeControls from './AttributeControls.js';
// import animationControls from './AnimationControls.js';

class CameraControl {

  constructor() {

    this.camera = canvas.app.camera;
    this.controls = canvas.app.controls;

    this.targetChanged = false;
    this.zoomLevelChanged = false;
    this.dynamicTracking = false;

    this._zoomLevel = 1;

    this._currentTarget = new THREE.Object3D();

    this._boundingBox = new THREE.Box3();

  }

  set zoomLevel( value ) {

    if ( this._zoomLevel === value ) return;

    this.zoomLevelChanged = true;
    this._zoomLevel = value;

  }

  get zoomLevel() {

    return this._zoomLevel;

  }

  set currentTarget( target ) {

    if ( this._currentTarget.position.equals( target.position ) ) return;

    this._currentTarget = target;
    this.targetChanged = true;

    if ( this._currentTarget.position.equals( this.targets.trackPlayer.position ) ) {

      console.log( this._currentTarget.position.equals( this.targets.trackPlayer.position ) )

      this.dynamicTracking = true;

    } else {

      this.dynamicTracking = false;

    }

  }

  get currentTarget() {

    return this._currentTarget;

  }

  get boundingBox() {

    return this._boundingBox.setFromObject( this.player );

  }

  get center() {

    return this.boundingBox.getCenter();

  }

  initCamera() {

    const boundingBox = this.boundingBox;

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
    this.controls.target.copy( center );

    // prevent camera from zooming out far enough to create far plane cutoff
    this.controls.maxDistance = cameraToFarEdge * 2;

  }

  initControls() {

    this.controls.minPolarAngle = 0;
    this.controls.maxPolarAngle = Math.PI / 2;

    this.controls.enablePan = false;

    // save the initial position. This can be regained with controls.reset()
    this.controls.saveState();

  }

  init( player ) {

    this.player = player;

    // used for targeting
    this.helmet = this.player.getObjectByName( 'WAFPhelmet' );

    this.initCamera();
    this.initControls();

    this.initTargets();

  }

  initTargets() {

    this.targets = {};

    this.targets.head = new THREE.Object3D();
    this.targets.head.position.copy( this.helmet.position );

    this.targets.default = new THREE.Object3D();
    this.targets.default.position.copy( this.controls.target );

    this.targets.torso = this.targets.head.clone();
    this.targets.torso.position.y = ( this.targets.head.position.y + this.targets.default.position.y ) / 2;

    this.targets.head.position.y -= 100;

    this.targets.leftArm = this.targets.torso.clone();
    this.targets.leftArm.position.x += 75;

    this.targets.rightArm = this.targets.torso.clone();
    this.targets.rightArm.position.x -= 75;

    this.targets.armTarget = this.targets.rightArm;

    const geo = new THREE.SphereBufferGeometry( 25, 12, 12 );
    const mat = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
    this.targets.trackPlayer = new THREE.Mesh( geo, mat );
    this.targets.trackPlayer.position.copy( this.targets.default.position );
    this.player.add( this.targets.trackPlayer );

    this.currentTarget = this.targets.default;

    // const addTargetHelper = ( target, color ) => {

    //   const geo = new THREE.SphereBufferGeometry( 25, 12, 12 );
    //   const mat = new THREE.MeshBasicMaterial( { color } );
    //   const mesh = new THREE.Mesh( geo, mat );
    //   mesh.position.copy( target.position );

    //   canvas.app.scene.add( mesh );

    // };

    // addTargetHelper( this.targets.default, 0xff0000 );
    // addTargetHelper( this.targets.head, 0x00ff00 );
    // addTargetHelper( this.targets.torso, 0x0000ff );

    // addTargetHelper( this.targets.leftArm, 0xff0000 );
    // addTargetHelper( this.targets.rightArm, 0x0000ff );
    // addTargetHelper( this.targets.trackPlayer, 0xff0000 );


  }

  updateTarget( delta ) {

    // console.log( this.dynamicTracking )

    if ( this.dynamicTracking ) {

      // console.log( 'center:', this.helmet.position );

      this.targets.trackPlayer.position.set( this.helmet.position.x, this.helmet.position.y - 100, this.helmet.position.z );

    }

    const distance = this.controls.target.distanceTo( this.currentTarget.position );

    if ( distance > 0.1 ) {

      const start = new THREE.Vector3().copy( this.controls.target );

      const direction = start.sub( this.currentTarget.position ).normalize();

      direction.multiplyScalar( distance * delta );

      this.controls.target.sub( direction );

    } else {

      this.targetChanged = false;

    }

  }

  updateZoomLevel( delta ) {

    const diff = ( this.controls.object.zoom - this.zoomLevel ) * delta;

    if ( Math.abs( diff ) > 0.001 ) {

      this.controls.object.zoom -= diff;
      this.controls.object.updateProjectionMatrix();

    } else {

      this.controls.object.zoom = this.zoomLevel;
      this.zoomLevelChanged = false;

    }

  }

  // per frame calculation
  update( delta ) {

    delta /= 1000;

    if ( this.targetChanged || this.dynamicTracking ) this.updateTarget( delta );

    if ( this.zoomLevelChanged ) this.updateZoomLevel( delta );

  }

  focusHead() {

    console.log( 'Focussing: head' );

    this.currentTarget = this.targets.head;
    this.zoomLevel = 3;

  }

  focusTorso() {

    console.log( 'Focussing: torso' );

    this.currentTarget = this.targets.torso;
    this.zoomLevel = 2;


  }


  focusArms() {

    console.log( 'Focussing: arms' );

    this.currentTarget = this.targets.armTarget;
    this.zoomLevel = 2;


  }

  focusDefault() {

    console.log( 'Focussing: default' );

    this.currentTarget = this.targets.default;
    this.zoomLevel = 1;

  }

  focusDynamic() {

    console.log( 'Focussing: dynamic' );

    this.currentTarget = this.targets.trackPlayer;
    this.zoomLevel = 1;


  }

  setArmTarget( arm ) {

    arm = arm || 'right';

    if ( arm === 'right' ) {

      this.targets.armTarget = this.targets.rightArm;
      this.currentTarget = this.targets.armTarget;

    } else if ( arm === 'left' ) {

      this.targets.armTarget = this.targets.leftArm;
      this.currentTarget = this.targets.armTarget;

    } else if ( arm === 'both' ) {

      this.targets.armTarget = this.targets.torso;
      this.currentTarget = this.targets.armTarget;

    }

  }

}

const cameraControl = new CameraControl();

export default cameraControl;
