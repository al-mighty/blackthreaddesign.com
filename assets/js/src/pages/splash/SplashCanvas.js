import * as THREE from 'three';

import loadingOverlay from 'utilities/init/initLoadingOverlay.js';

import pointerPosToCanvasCentre from 'utilities/three/pointerPosToCanvasCentre.js';
import computeCentroid from 'utilities/three/computeCentroid.js';
import createBufferAttribute from 'utilities/three/createBufferAttribute.js';
import setBufferGeometryIndicesFromFaces from 'utilities/three/setBufferGeometryIndicesFromFaces.js';
import createBufferPositionsAttribute from 'utilities/three/createBufferPositionsAttribute.js';

import fontLoader from 'utilities/three/loaders/fontLoader.js';

import pointerPos from 'utilities/pointerPos.js';
import './splashCanvasSetup.js';

import App from 'App/App.js';
import OrbitControls from 'modules/OrbitControls.module.js';

import backgroundVert from './shaders/background.vert';
import backgroundFrag from './shaders/background.frag';
import textVert from './shaders/text.vert';
import textFrag from './shaders/text.frag';

import { randomPointInSphere, cameraZPos, createTextGeometry } from './splashCanvasHelpers.js';

export default class SplashCanvas {

  constructor() {

    const self = this;

    this.app = new App( document.querySelector( '#splash-canvas' ) );

    this.app.camera.fov = 75;
    this.app.camera.position.set( 0, 0, cameraZPos( this.app.camera.aspect ) );
    this.app.camera.updateProjectionMatrix();

    this.initMaterials();

    this.addBackground();

    this.addText();

    // this.initControls();

    // this.pauseWhenOffscreen();

    const updateMaterials = function () {
        // Pan events on mobile sometimes register as (0,0); ignore these
      if ( pointerPos.x !== 0 && pointerPos.y !== 0 ) {
        const offsetX = pointerPos.x / self.app.canvas.clientWidth;
        let offsetY = 1 - pointerPos.y / self.app.canvas.clientHeight;

        // make the line well defined when moving the pointer off the top of the canvas
        offsetY = ( offsetY > 0.99 ) ? 0.999 : offsetY;

        self.offset.set( offsetX, offsetY );
        self.smooth.set( 1.0, offsetY );

        const pointer = pointerPosToCanvasCentre( self.app.canvas, 0 );
        self.pointer.set( pointer.x, pointer.y );
      }
    };

    let uTime = 1.0;
    const minTime = 0.1;
    let animSpeed = 8000;

    const updateAnimation = function () {

      // set on repeat (for testing)
      // if ( uTime <= minTime ) uTime = 1.0;

      // Ignore large values of delta (caused by window not be being focused for a while)
      if ( uTime >= minTime && self.app.delta < 100 ) {
        uTime -= self.app.delta / animSpeed;
      }

      self.textMat.uniforms.uTime.value = uTime;

      // speed up the animation as it progresses
      animSpeed -= 15;

    };

    this.app.onUpdate = function () {
      updateMaterials();

      updateAnimation();

    //   if ( self.controls && self.controls.enableDamping === true ) self.controls.update();
    };

    this.app.onWindowResize = function () {

      self.app.camera.position.set( 0, 0, cameraZPos( self.app.camera.aspect ) );

    };


    THREE.DefaultLoadingManager.onLoad = () => {

      loadingOverlay.fadeOut();
      self.app.play();

    };

  }


  addText() {

    const self = this;

    fontLoader( '/assets/fonts/json/droid_sans_mono_regular.typeface.json' )
    .then( ( font ) => {

      const textGeometry = createTextGeometry( font );

      const bufferGeometry = new THREE.BufferGeometry( textGeometry );

      self.initBufferAnimation( bufferGeometry, textGeometry );

      const textMesh = new THREE.Mesh( bufferGeometry, self.textMat );

      self.app.scene.add( textMesh );
    } );

  }

  initBufferAnimation( bufferGeometry, geometry ) {
    const faceCount = geometry.faces.length;
    const vertexCount = geometry.vertices.length;

    setBufferGeometryIndicesFromFaces( bufferGeometry, faceCount, geometry.faces );
    createBufferPositionsAttribute( bufferGeometry, geometry.vertices );

    const aAnimation = createBufferAttribute( bufferGeometry, 'aAnimation', 2, vertexCount );
    const aEndPosition = createBufferAttribute( bufferGeometry, 'aEndPosition', 3, vertexCount );

    let i;
    let i2;
    let i3;
    // let i4;
    let v;

    const maxDelay = 0.0;
    const minDuration = 1.0;
    const maxDuration = 100.0;

    const stretch = 0.1;
    const lengthFactor = 0.0001;

    const maxLength = geometry.boundingBox.max.length();

    this.animationDuration = maxDuration + maxDelay + stretch + lengthFactor * maxLength;
    this._animationProgress = 0;

    for ( i = 0, i2 = 0, i3 = 0; i < faceCount; i++, i2 += 6, i3 += 9 ) {
      const face = geometry.faces[i];

      const centroid = computeCentroid( geometry, face );

      // animation
      const delay = ( maxLength - centroid.length() ) * lengthFactor;
      const duration = THREE.Math.randFloat( minDuration, maxDuration );

      for ( v = 0; v < 6; v += 2 ) {
        aAnimation.array[i2 + v] = delay + stretch * 0.5;
        aAnimation.array[i2 + v + 1] = duration;
      }

      // end position
      const point = randomPointInSphere( 1200 );

      for ( v = 0; v < 9; v += 3 ) {
        aEndPosition.array[i3 + v] = point.x;
        aEndPosition.array[i3 + v + 1] = point.y;
        aEndPosition.array[i3 + v + 2] = point.z;
      }

    }
  }

  addBackground() {
    const geometry = new THREE.PlaneBufferGeometry( 2, 2, 1 );
    this.bgMesh = new THREE.Mesh( geometry, this.backgroundMat );
    this.app.scene.add( this.bgMesh );
  }

  initMaterials() {
    const loader = new THREE.TextureLoader();
    const noiseTexture = loader.load( '/assets/images/textures/noise-1024.jpg' );
    noiseTexture.wrapS = noiseTexture.wrapT = THREE.RepeatWrapping;

    this.offset = new THREE.Vector2( 0, 0 );
    this.smooth = new THREE.Vector2( 1.0, 1.0 );
    this.pointer = new THREE.Vector2( 100, 100 );

    const colA = new THREE.Color( 0xffffff );
    const colB = new THREE.Color( 0x283844 );

    const uniforms = {
      noiseTexture: { value: noiseTexture },
      offset: { value: this.offset },
      smooth: { value: this.smooth },
    };

    this.textMat = new THREE.ShaderMaterial( {
      uniforms: Object.assign( {
        color1: { value: colB },
        color2: { value: colA },
        uTime: { value: 0.0 },
        pointer: { value: this.pointer },
      }, uniforms ),
      vertexShader: textVert,
      fragmentShader: textFrag,
      side: THREE.DoubleSide,
    } );

    this.backgroundMat = new THREE.RawShaderMaterial( {
      uniforms: Object.assign( {
        color1: { value: colA },
        color2: { value: colB },
      }, uniforms ),
      vertexShader: backgroundVert,
      fragmentShader: backgroundFrag,
    } );
  }

  // Pause if the canvas is not onscreen
  // TODO: Make this a part of App
  // TODO: Currently only works when scrolling down
  // pauseWhenOffscreen() {
  //   window.addEventListener( 'scroll', () => {
  //     if ( !this.app.isPaused && window.scrollY > ( this.app.canvas.offsetTop + this.app.canvas.clientHeight ) ) {
  //       this.app.pause();
  //     } else if ( this.app.isPaused ) {
  //       this.app.play();
  //     }
  //   } );
  // }

  initControls() {
    const controls = new OrbitControls( this.app.camera, this.canvas );

    controls.enableZoom = false;
    controls.enablePan = false;

    // controls.autoRotate = true;
    // controls.autoRotateSpeed = -1.0;

    // How far you can orbit horizontally, upper and lower limits.
    // If set, must be a sub-interval of the interval [ - Math.PI, Math.PI ].
    controls.minAzimuthAngle = -Math.PI / 12; // radians
    controls.maxAzimuthAngle = Math.PI / 12; // radians

    // How far you can orbit vertically, upper and lower limits.
    // Range is 0 to Math.PI radians.
    controls.minPolarAngle = Math.PI * 0.25;
    controls.maxPolarAngle = Math.PI * 0.5;

    controls.enableDamping = true;
    controls.dampingFactor = 0.25;

    controls.enableKeys = false;

    controls.rotateSpeed = 0.01;

    this.controls = controls;
  }

}
