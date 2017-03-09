import * as THREE from 'three';
import BAS from '../vendor/bas.js';
import threeUtils from '../threeUtils.js';
import StatisticsOverlay from '../StatisticsOverlay.js';
import App from '../App.js';
import OrbitControls from '../controls/OrbitControls.js';

import backgroundVert from '../shaders/splashBackground.vert';
import backgroundFrag from '../shaders/splashBackground.frag';
import textVert from '../shaders/splashText.vert';
import textFrag from '../shaders/splashText.frag';

import { pointerPos } from '../../utilities.js';

function generateTextGeometry( text, params ) {
  const geometry = new THREE.TextGeometry( text, params );

  geometry.computeBoundingBox();

  const size = geometry.boundingBox.getSize();
  const anchorX = size.x * -params.anchor.x;
  const anchorY = size.y * -params.anchor.y;
  const anchorZ = size.z * -params.anchor.z;
  const matrix = new THREE.Matrix4().makeTranslation( anchorX, anchorY, anchorZ );

  geometry.applyMatrix( matrix );

  return geometry;
}

function tesselateGeometry( geometry ) {
  threeUtils.tessellateRepeat( geometry, 1.0, 2 );

  threeUtils.separateFaces( geometry );
}

export default class SplashHero {

  constructor( showStats ) {

    const self = this;

    self.canvas = document.querySelector( '#splash-hero-canvas' );
    self.container = document.querySelector( '#splash-hero-container' );

    self.app = new App( self.canvas );

    self.app.camera.position.set( 0, 0, 500 );

    self.colorA = new THREE.Color( 0xffffff );
    self.colorB = new THREE.Color( 0x283844 );

    self.offset = new THREE.Vector2( 0, 0 );
    self.smooth = new THREE.Vector2( 1.0, 1.0 );

    const loader = new THREE.TextureLoader();
    this.noiseTexture = loader.load( '/assets/images/textures/noise-1024.jpg' );
    this.noiseTexture.wrapS = this.noiseTexture.wrapT = THREE.RepeatWrapping;


    // TODO: not working in Edge
    let statisticsOverlay;
    if ( showStats ) statisticsOverlay = new StatisticsOverlay( self.app, self.container );

    self.addBackground();

    self.addText();

    self.addControls();

    const updateMaterials = function () {
        // For some reason pan events on mobile sometimes register as (0,0); ignore these
      if ( pointerPos.x !== 0 && pointerPos.y !== 0 ) {
        const offsetX = pointerPos.x / self.app.canvas.clientWidth;
        let offsetY = 1 - pointerPos.y / self.app.canvas.clientHeight;

        // make the line well defined when moving the pointer off the top of the screen
        offsetY = ( offsetY > 0.99 ) ? 0.999 : offsetY;

        self.offset.set( offsetX, offsetY );
        self.smooth.set( 1.0, offsetY );
      }
    };

    let uTime = 0.0;
    let direction = 1.0;
    self.app.onUpdate = function () {
      updateMaterials();

      if( uTime >= 1.5 || uTime <= -0.5 ) { 
        uTime = 0.0;
      }

      if( uTime <= 1.0 && uTime >= 0.0 ) {
        uTime += ( direction * self.app.delta / 8000 );
      }
      else {
        uTime -= ( direction * self.app.delta / 8000 );
        direction *= -1.0;
      }

      self.textMat.uniforms.uTime.value = uTime;

      if ( showStats ) statisticsOverlay.updateStatistics( self.app.delta );

    };

    self.app.onWindowResize = function () { };

    self.app.play();

    // Pause if the canvas is not onscreen
    window.addEventListener( 'scroll', () => {
      if ( !self.app.isPaused && window.scrollY > ( self.canvas.offsetTop + self.canvas.clientHeight ) ) {
        self.app.pause();
      } else if ( self.app.isPaused ) {
        self.app.play();
      }
    } );

  }

  addControls() {
    this.controls = new OrbitControls( this.app.camera, this.app.renderer.domElement );
  }

  addBackground() {
    this.backgroundMat = this.initBackgroundMat( );
    const geometry = new THREE.PlaneBufferGeometry( 2, 2, 1 );
    this.bgMesh = new THREE.Mesh( geometry, this.backgroundMat );
    this.app.scene.add( this.bgMesh );
  }


  initBackgroundMat( ) {

    const uniforms = {

      noiseTexture: { value: this.noiseTexture },
      offset: { value: this.offset },
      smooth: { value: this.smooth },
      color1: { value: this.colorA },
      color2: { value: this.colorB },

    };

    return new THREE.RawShaderMaterial( {
      uniforms,
      vertexShader: backgroundVert,
      fragmentShader: backgroundFrag,
      // side: THREE.DoubleSide,
      // transparent: true,
    } );

  }

  addText() {
    const self = this;

    const loader = new THREE.FontLoader();
    this.textMat = this.initTextMat();


    loader.load( 'assets/fonts/json/droid_sans_mono_regular.typeface.json', ( response ) => {
      const textGeometry = generateTextGeometry( 'Black Thread Design', {
        size: 40,
        height: 3,
        font: response,
        weight: 'normal',
        style: 'normal',
        curveSegments: 24,
        bevelSize: 2,
        bevelThickness: 2,
        bevelEnabled: true,
        anchor: { x: 0.5, y: 0.5, z: 0.0 },
      } );

      tesselateGeometry( textGeometry );

      const bufferGeometry = new BAS.ModelBufferGeometry( textGeometry );


      /** *********************************************************************** */
      function FibSpherePointClosure () {
        const v = { x: 0, y: 0, z: 0 };
        const G = Math.PI * ( 3 - Math.sqrt( 5 ) );

        return function ( i, n, radius ) {
          const step = 2.0 / n;
          let r,
            phi;

          v.y = i * step - 1 + ( step * 0.5 );
          r = Math.sqrt( 1 - v.y * v.y );
          phi = i * G;
          v.x = Math.cos( phi ) * r;
          v.z = Math.sin( phi ) * r;

          radius = radius || 1;

          v.x *= radius;
          v.y *= radius;
          v.z *= radius;

          return v;
        };
      };

      const fibSpherePoint = new FibSpherePointClosure();

      const aAnimation = bufferGeometry.createAttribute( 'aAnimation', 2 );
      const aEndPosition = bufferGeometry.createAttribute( 'aEndPosition', 3 );
      const aAxisAngle = bufferGeometry.createAttribute( 'aAxisAngle', 4 );

      const faceCount = bufferGeometry.faceCount;
      let i,
        i2,
        i3,
        i4,
        v;

      const maxDelay = 0.0;
      const minDuration = 1.0;
      const maxDuration = 1.0;
      const stretch = 0.05;
      const lengthFactor = 0.001;
      const maxLength = textGeometry.boundingBox.max.length();

      this.animationDuration = maxDuration + maxDelay + stretch + lengthFactor * maxLength;
      this._animationProgress = 0;

      const axis = new THREE.Vector3();
      let angle;

      for ( i = 0, i2 = 0, i3 = 0, i4 = 0; i < faceCount; i++, i2 += 6, i3 += 9, i4 += 12 ) {
        const face = textGeometry.faces[i];
        const centroid = BAS.Utils.computeCentroid( textGeometry, face );
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


      /** *********************************************************************** */
      const textMesh = new THREE.Mesh( bufferGeometry, this.textMat );

      textMesh.position.set( 0, 0, 100 );

      self.app.scene.add( textMesh );
    } );

  }

  initTextMat() {
    const uniforms = {
      noiseTexture: { value: this.noiseTexture },
      offset: { value: this.offset },
      smooth: { value: this.smooth },
      color1: { value: this.colorB },
      color2: { value: this.colorA },
      uTime: { value: 0.0 },
    };

    return new THREE.ShaderMaterial( {
      uniforms,
      vertexShader: textVert,
      fragmentShader: textFrag,
      // side: THREE.DoubleSide,
      // transparent: true,
    } );

  }

}
