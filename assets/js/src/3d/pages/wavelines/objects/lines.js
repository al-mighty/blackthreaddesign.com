import * as THREE from 'three';

import WaveLine from '../objects/WaveLine.js';

import morphLineVert from '../shaders/morphLine.vert';
import morphLineFrag from '../shaders/morphLine.frag';

import { visibleHeightAtZDepth, visibleWidthAtZDepth } from '../wavelinesCanvasHelpers.js';

function initMaterial( opacity ) {
  return new THREE.ShaderMaterial( {
    uniforms: {
      opacity: {
        value: opacity,
      },
      morphTargetInfluences: {
        value: [0, 0, 0, 0],
      },
    },
    vertexShader: morphLineVert,
    fragmentShader: morphLineFrag,
    morphTargets: true,
    transparent: true,
    // side: THREE.DoubleSide,
  } );
}

function initAnimation( length, group ) {
  const keyFrame = new THREE.NumberKeyframeTrack( '.morphTargetInfluences', [0.0, length / 2, length], [0.0, 1.0, 0], THREE.InterpolateSmooth );

  const clip = new THREE.AnimationClip( 'wavelineMorphTargetsClip', -1, [keyFrame] );

  const mixer = new THREE.AnimationMixer( group );
  const animationAction = mixer.clipAction( clip );

  // animationAction.loop = THREE.LoopRepeat;

  animationAction.play();

  return mixer;
}



export function createWave( camera ) {
  const animLength = 5;

  // const z = THREE.Math.randFloat( -5, -50 );
  const z = -10;
  const canvasWidth = visibleWidthAtZDepth( z, camera );
  const material = initMaterial( 1.0 );
  const spec = {
    z,
    fineness: 100,
    initialParams: {
      thickness: 0.04,
      yOffset: 0,
    },
    finalParams: {
      thickness: 0.04,
      yOffset: 0,
    },
    material,
    width: canvasWidth,
  };


  let v1, v2;
  if ( THREE.Math.randInt( 0, 1 ) ) {
    v1 = new THREE.Vector2( 0.25, THREE.Math.randFloat( -5, 1 ) );
    v2 = new THREE.Vector2( 0.75, THREE.Math.randFloat( -3, 3 ) );
  } else {
    v1 = new THREE.Vector2( 0.75, THREE.Math.randFloat( -3, 3 ) );
    v2 = new THREE.Vector2( 0.25, THREE.Math.randFloat( -5, 1 ) );
  }


  spec.initialParams.points = [
    new THREE.Vector2( 0, THREE.Math.randFloat( -7, 1 ) ),
    v1,
    new THREE.Vector2( 1.0, THREE.Math.randFloat( -3, 5 ) ),
  ];

  spec.finalParams.points = [
    new THREE.Vector2( 0, THREE.Math.randFloat( -7, 1 ) ),
    v2,
    new THREE.Vector2( 1.0, THREE.Math.randFloat( -3, 5 ) ),
  ];

  const wave = new WaveLine( spec );

  const mixer = initAnimation( animLength, wave );

  mixer.update( THREE.Math.randFloat( 0, animLength ) );

  return {
    wave,
    mixer,
  };
}
