import * as THREE from 'three';

import SineWave from '../objects/SineWave.js';

import basicVert from '../shaders/basic.vert';
import basicFrag from '../shaders/basic.frag';

import { visibleHeightAtZDepth, visibleWidthAtZDepth } from '../wavelinesCanvasHelpers.js';

function initMaterial( opacity ) {
  return  new THREE.ShaderMaterial( {
    uniforms: {
      opacity: {
        value: opacity,
      },
      morphTargetInfluences: {
        value: [0, 0, 0, 0],
      },
    },
    vertexShader: basicVert,
    fragmentShader: basicFrag,
    morphTargets: true,
    transparent: true,
    // side: THREE.DoubleSide,
  } );
}

function initAnimation( length, group ) {
  const keyFrame = new THREE.NumberKeyframeTrack( 'geometry.morphTargetInfluences', [0.0, length], [0.0, 1.0], THREE.InterpolateSmooth );
  const clip = new THREE.AnimationClip( 'wavelineMorphTargetsClip', length, [keyFrame] );

  const mixer = new THREE.AnimationMixer( group );
  const animationAction = mixer.clipAction( clip );

  animationAction.loop = THREE.LoopPingPong;

  animationAction.play();

  return mixer;
}

export function createGroup1( camera ) {
  const group = new THREE.Group();

  const animationGroup = new THREE.AnimationObjectGroup();
  const mixer = initAnimation( 15, animationGroup );

  const z = -10;
  const material = initMaterial( 1.0 ); 
  const spec = {
    z,
    initialParams: {},
    finalParams: {},
    material,
    canvasWidth: visibleWidthAtZDepth( z, camera ),
    canvasHeight: visibleHeightAtZDepth( z, camera ),
  };

  for ( let i = 0; i < 18; i++ ){
    const a = i * 0.1;
    spec.initialParams.points = [
      new THREE.Vector2( 0, 2.0 ),
      new THREE.Vector2( 0.3, -2.4  + a ),
      new THREE.Vector2( 0.8, 0.0 + ( 2 * a) ),
      new THREE.Vector2( 1.0, -1.0 - ( 2 * a ) ),
    ];

    spec.finalParams.points = [
      new THREE.Vector2( 0, -a * 3 ),
      new THREE.Vector2( 0.4, 0.0 + a ),
      new THREE.Vector2( 0.8, 1.0 - ( 2 * a ) ),
      new THREE.Vector2( 1.0, -2.4 - ( 2 * a ) ),
    ];

    const sineWave = new SineWave( spec );

    animationGroup.add( sineWave );

    group.add( sineWave );
  }

  return {
    group,
    mixer,
  };
}