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
  const keyFrame = new THREE.NumberKeyframeTrack( '.morphTargetInfluences', [0.0, length], [0.0, 1.0], THREE.InterpolateSmooth );
  const clip = new THREE.AnimationClip( 'wavelineMorphTargetsClip', length, [keyFrame] );

  const mixer = new THREE.AnimationMixer( group );
  const animationAction = mixer.clipAction( clip );

  animationAction.loop = THREE.LoopPingPong;

  animationAction.play();

  return mixer;
}

function createGroup1( camera ) {
  // const group = new THREE.Group();

  const morphAnimGroup = new THREE.AnimationObjectGroup();
  // const positionAnimGroup = new THREE.AnimationObjectGroup();
  const morphMixer = initAnimation( 5, morphAnimGroup );

  const z = -10;
  const canvasWidth = visibleWidthAtZDepth( z, camera );
  const material = initMaterial( 1.0 );
  const spec = {
    z,
    fineness: 100,
    initialParams: {
      thickness: 0.03,
      yOffset: 0,
    },
    finalParams: {
      thickness: 0.03,
      yOffset: 0,
    },
    material,
    canvasWidth,
    canvasHeight: visibleHeightAtZDepth( z, camera ),
  };

  spec.initialParams.points = [
    new THREE.Vector2( 0, 2.0 ),
    new THREE.Vector2( 0.3, -2.4 ),
    new THREE.Vector2( 0.8, 0.0 ),
    new THREE.Vector2( 1.0, -1.0 ),
  ];

  spec.finalParams.points = [
    new THREE.Vector2( 0, 0 ),
    new THREE.Vector2( 0.4, 0.0 ),
    new THREE.Vector2( 0.8, 1.0 ),
    new THREE.Vector2( 1.0, -2.4 ),
  ];

  const wave1 = new WaveLine( spec );

  morphAnimGroup.add( wave1 );

  const keyFrame = new THREE.NumberKeyframeTrack( '.position', [0.0, 15], [0, 0, 0, -canvasWidth, 0, 0], THREE.InterpolateLinear );

  const clip = new THREE.AnimationClip( 'wavelinePositionClip', 15, [keyFrame] );

  const positionMixer = new THREE.AnimationMixer( wave1 );
  const animationAction = positionMixer.clipAction( clip );

  animationAction.loop = THREE.LoopRepeat;

  animationAction.play();

  /* *************************   LINE 2 ********************************* */

  const material2 = initMaterial( 1.0 );
  const spec2 = {
    z,
    fineness: 100,
    initialParams: {
      thickness: 0.03,
      yOffset: 0,
    },
    finalParams: {
      thickness: 0.03,
      yOffset: 0,
    },
    material2,
    canvasWidth,
    canvasHeight: visibleHeightAtZDepth( z, camera ),
  };

  spec2.initialParams.points = [
    new THREE.Vector2( 0, 2.0 ),
    new THREE.Vector2( 0.3, -2.4 ),
    new THREE.Vector2( 0.8, 0.0 ),
    new THREE.Vector2( 1.0, -1.0 ),
  ];

  spec2.finalParams.points = [
    new THREE.Vector2( 0, 0 ),
    new THREE.Vector2( 0.4, 0.0 ),
    new THREE.Vector2( 0.8, 1.0 ),
    new THREE.Vector2( 1.0, -2.4 ),
  ];

  const wave2 = new WaveLine( spec2 );

  morphAnimGroup.add( wave2 );

  const keyFrame2 = new THREE.NumberKeyframeTrack( '.position', [0.0, 15], [canvasWidth, 0, 0, 0, 0, 0], THREE.InterpolateLinear );

  const clip2 = new THREE.AnimationClip( 'waveline2PositionClip', 15, [keyFrame2] );

  const positionMixer2 = new THREE.AnimationMixer( wave2 );
  const animationAction2 = positionMixer2.clipAction( clip2 );

  animationAction2.loop = THREE.LoopRepeat;

  animationAction2.play();

  return {
    wave1,
    wave2,
    morphMixer,
    positionMixer,
    positionMixer2,
  };
}

export default [
  createGroup1,
];
