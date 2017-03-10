import * as THREE from 'three';

import threeUtils from '../threeUtils.js';
import StatisticsOverlay from '../StatisticsOverlay.js';
import App from '../App.js';
import OrbitControls from '../controls/OrbitControls.js';

import backgroundVert from '../shaders/splashBackground.vert';
import backgroundFrag from '../shaders/splashBackground.frag';
import textVert from '../shaders/splashText.vert';
import textFrag from '../shaders/splashText.frag';

import utils from '../../utilities.js';

const v = new THREE.Vector3();
const G = Math.PI * ( 3 - Math.sqrt( 5 ) );
function fibSpherePoint( i, n, radius ) {
  const step = 2.0 / n;

  const phi = i * G;

  v.y = i * step - 1 + ( step * 0.5 );
  const r = Math.sqrt( 1 - v.y * v.y );
  v.x = Math.cos( phi ) * r;
  v.z = Math.sin( phi ) * r;

  radius = radius || 1;

  v.x *= radius;
  v.y *= radius;
  v.z *= radius;

  return v;
}

export default class SplashHero {

  constructor( showStats ) {

    const self = this;

    self.container = document.querySelector( '#splash-hero-container' );

    self.app = new App( document.querySelector( '#splash-hero-canvas' ) );

    const cameraZPos = () => {
      return -112 * self.app.camera.aspect + 500;
    }

    self.app.camera.position.set( 0, 0, cameraZPos() );

    // TODO: not working in Edge
    let statisticsOverlay;
    if ( showStats ) statisticsOverlay = new StatisticsOverlay( self.app, self.container );

    self.initMaterials();

    self.addBackground();

    self.addText();

    // self.addControls();

    this.pauseWhenOffscreen();

    const updateMaterials = function () {
        // Pan events on mobile sometimes register as (0,0); ignore these
      if ( utils.pointerPos.x !== 0 && utils.pointerPos.y !== 0 ) {
        const offsetX = utils.pointerPos.x / self.app.canvas.clientWidth;
        let offsetY = 1 - utils.pointerPos.y / self.app.canvas.clientHeight;

        // make the line well defined when moving the pointer off the top of the screen
        offsetY = ( offsetY > 0.99 ) ? 0.999 : offsetY;

        self.offset.set( offsetX, offsetY );
        self.smooth.set( 1.0, offsetY );
      }
    };

    let uTime = 1.0;
    let direction = -1.0;

    const updateAnimation = function () {
      if ( uTime >= 1.5 || uTime <= -0.5 ) {
        uTime = 1.0;
      }

      if ( uTime >= 0 ) {
        uTime += ( direction * self.app.delta / 8000 );
      }

      // if ( uTime <= 1.0 && uTime >= 0.0 ) {
      //   uTime += ( direction * self.app.delta / 8000 );
      // } else {
      //   uTime -= ( direction * self.app.delta / 8000 );
      //   direction *= -1.0;
      // }

      self.textMat.uniforms.uTime.value = uTime;
    };

    self.app.onUpdate = function () {
      updateMaterials();

      updateAnimation();

      // console.log( "camera z: " + self.app.camera.position.z );
      // console.log( "camera aspect: " + self.app.camera.aspect);
      // console.log( "canvas width : " + self.app.canvas.clientWidth);
      // console.log( "canvas height : " + self.app.canvas.clientHeight);

      if ( showStats ) statisticsOverlay.updateStatistics( self.app.delta );

    };


    self.app.onWindowResize = function () { 
      self.app.camera.position.set( 0, 0, cameraZPos() );
    };

    self.app.play();

  }

  addText() {
    const self = this;

    threeUtils.fontLoader( 'assets/fonts/json/droid_sans_mono_regular.typeface.json' )
    .then( ( font ) => {

      const textGeometry = self.createTextGeometry( font );

      const bufferGeometry = new THREE.BufferGeometry( textGeometry );

      self.initBufferAnimation( bufferGeometry, textGeometry );

      const textMesh = new THREE.Mesh( bufferGeometry, self.textMat );

      self.app.scene.add( textMesh );
    });

  }

  initBufferAnimation( bufferGeometry, geometry ) {
      const faceCount = geometry.faces.length;
      const vertexCount = geometry.vertices.length;

      threeUtils.setBufferGeometryIndicesFromFaces( bufferGeometry, faceCount, geometry.faces );
      threeUtils.bufferPositions( bufferGeometry, geometry.vertices );

      const aAnimation = threeUtils.createBufferAttribute( bufferGeometry, 'aAnimation', 2, vertexCount );
      const aEndPosition = threeUtils.createBufferAttribute( bufferGeometry, 'aEndPosition', 3, vertexCount );
      const aAxisAngle = threeUtils.createBufferAttribute( bufferGeometry, 'aAxisAngle', 4, vertexCount );

      let i;
      let i2;
      let i3;
      let i4;
      let v;

      const maxDelay = 0.0;
      const minDuration = 1.0;
      const maxDuration = 1.0;
      const stretch = 0.05;
      const lengthFactor = 0.001;
      const maxLength = geometry.boundingBox.max.length();

      this.animationDuration = maxDuration + maxDelay + stretch + lengthFactor * maxLength;
      this._animationProgress = 0;

      const axis = new THREE.Vector3();
      let angle;

      for ( i = 0, i2 = 0, i3 = 0, i4 = 0; i < faceCount; i++, i2 += 6, i3 += 9, i4 += 12 ) {
        const face = geometry.faces[i];
        const centroid = threeUtils.computeCentroid( geometry, face );
        const centroidN = new THREE.Vector3().copy( centroid ).normalize();

        // animation
        const delay = ( maxLength - centroid.length() ) * lengthFactor;
        const duration = THREE.Math.randFloat( minDuration, maxDuration );

        for ( v = 0; v < 6; v += 2 ) {
          aAnimation.array[i2 + v] = delay + stretch * Math.random();
          aAnimation.array[i2 + v + 1] = duration;
        }

        // end position
        const point = fibSpherePoint( i, faceCount, 200 );

        for ( v = 0; v < 9; v += 3 ) {
          aEndPosition.array[i3 + v] = point.x;
          aEndPosition.array[i3 + v + 1] = point.y;
          aEndPosition.array[i3 + v + 2] = point.z;
        }

        // axis angle
        axis.x = centroidN.x;
        axis.y = -centroidN.y;
        axis.z = -centroidN.z;

        axis.normalize();

        angle = Math.PI * THREE.Math.randFloat( 0.5, 2.0 );

        for ( v = 0; v < 12; v += 4 ) {
          aAxisAngle.array[i4 + v] = axis.x;
          aAxisAngle.array[i4 + v + 1] = axis.y;
          aAxisAngle.array[i4 + v + 2] = axis.z;
          aAxisAngle.array[i4 + v + 3] = angle;
        }
      }
  }

  createTextGeometry( font ) {
    const textGeometry = threeUtils.generateTextGeometry( 'Black Thread Design', {
        size: 40,
        height: 3,
        font: font,
        weight: 'normal',
        style: 'normal',
        curveSegments: 24,
        bevelSize: 2,
        bevelThickness: 2,
        bevelEnabled: true,
        anchor: { x: 0.5, y: 0.0, z: 0.0 },
      } );

      threeUtils.tessellateRecursive( textGeometry, 1.0, 2 );

      threeUtils.explodeModifier( textGeometry );

      return textGeometry;
  }

  addBackground() {
    const geometry = new THREE.PlaneBufferGeometry( 2, 2, 1 );
    this.bgMesh = new THREE.Mesh( geometry, this.backgroundMat );
    this.app.scene.add( this.bgMesh );
  }

  initMaterials () {
    const loader = new THREE.TextureLoader();
    const noiseTexture = loader.load( '/assets/images/textures/noise-1024.jpg' );
    noiseTexture.wrapS = noiseTexture.wrapT = THREE.RepeatWrapping;

    this.offset = new THREE.Vector2( 0, 0 );
    this.smooth = new THREE.Vector2( 1.0, 1.0 );

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
          uTime: { value: 0.0 }
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
  pauseWhenOffscreen() {
    window.addEventListener( 'scroll', () => {
      if ( !this.app.isPaused && window.scrollY > ( this.app.canvas.offsetTop + this.app.canvas.clientHeight ) ) {
        this.app.pause();
      } else if ( this.app.isPaused ) {
        this.app.play();
      }
    } );
  }

  addControls() {
    this.controls = new OrbitControls( this.app.camera, this.app.renderer.domElement );
  }

}
