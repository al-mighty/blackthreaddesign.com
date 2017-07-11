import * as THREE from 'three';

import WaveLine from '../objects/WaveLine.js';

import morphLineVert from '../shaders/morphLine.vert';
import morphLineFrag from '../shaders/morphLine.frag';

import visibleHeightAtZDepth from 'utilities/three/visibleHeightAtZDepth.js';
import visibleWidthAtZDepth from 'utilities/three/visibleWidthAtZDepth.js';

function initMaterial( opacity ) {
  // return new THREE.MeshBasicMaterial( {
  //   morphTargets: true,
  //   transparent: true,
  //   side: THREE.DoubleSide,
  // })
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

  for ( let i = 0; i < 18; i++ ) {
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

    const wave = new WaveLine( spec );

    animationGroup.add( wave );

    group.add( wave );
  }

  return {
    group,
    mixer,
  };
}

export function createGroup2( camera ) {
  const group = new THREE.Group();

  const animationGroup = new THREE.AnimationObjectGroup();
  const mixer = initAnimation( 20, animationGroup );

  const z = -15;
  const material = initMaterial( 0.3 ); 
  const spec = {
    z,
    initialParams: {
      thickness: 2,
      yOffset: 3,
      points: [
        new THREE.Vector2( 0, -3.0 ),
        new THREE.Vector2( 0.25, 2 ),
        new THREE.Vector2( 0.75, -2 ),
        new THREE.Vector2( 1.0, 5 ),
      ],
    },
    finalParams: {
      thickness: 2,
      yOffset: 4,
      points:[
        new THREE.Vector2( 0, 2.0 ),
        new THREE.Vector2( 0.25, -2.4 ),
        new THREE.Vector2( 0.75, 0.0 ),
        new THREE.Vector2( 1.0, 0.0 ),
      ],
    },
    material,
    canvasWidth: visibleWidthAtZDepth( z, camera ),
    canvasHeight: visibleHeightAtZDepth( z, camera ),
  };

  const wave = new WaveLine( spec );

  animationGroup.add( wave );

  group.add( wave );

  return {
    group,
    mixer,
  };
}

export function createGroup3( camera ) {
  const group = new THREE.Group();

  const animationGroup = new THREE.AnimationObjectGroup();
  const mixer = initAnimation( 8, animationGroup );

  const z = -2;
  const material = initMaterial( 1.0 ); 
  const spec = {
    z,
    initialParams: {
      thickness: 0.005,
    },
    finalParams: {
      thickness: 0.005,
    },
    material,
    canvasWidth: visibleWidthAtZDepth( z, camera ),
    canvasHeight: visibleHeightAtZDepth( z, camera ),
  };

  for ( let i = 0; i < 45; i++ ){
    const a = i * 0.02;
    spec.initialParams.points = [
      new THREE.Vector2( 0, 1.0 + a ),
      new THREE.Vector2( 0.25, 0.4 - a ),
      new THREE.Vector2( 0.6, 0.5 + a ),
      new THREE.Vector2( 1.0, -0.0 - a ),
    ];

    spec.finalParams.points = [
      new THREE.Vector2( 0, 1.0 - a ),
      new THREE.Vector2( 0.4, 0.0 + a ),
      new THREE.Vector2( 0.9, 0.5 - a ),
      new THREE.Vector2( 1.0, -0.0 + a ),
    ];

    const wave = new WaveLine( spec );

    animationGroup.add( wave );

    group.add( wave );
  }

  return {
    group,
    mixer,
  };
}
