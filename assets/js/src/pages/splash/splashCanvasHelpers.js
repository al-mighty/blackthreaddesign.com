import * as THREE from 'three';

import explodeModifier from 'utilities/three/explodeModifier.js';
import tessellateRecursive from 'utilities/three/tessellateRecursive.js';
import positionTextGeometry from 'utilities/three/positionTextGeometry.js';

const v = new THREE.Vector3();

export const randomPointInDisk = ( radius ) => {
  const r = THREE.Math.randFloat( 0, 1 );
  const t = THREE.Math.randFloat( 0, Math.PI * 2 );

  v.x = Math.sqrt( r ) * Math.cos( t ) * radius;
  v.y = Math.sqrt( r ) * Math.sin( t ) * radius;

  return v;
};

export const randomPointInSphere = ( radius ) => {
  const x = THREE.Math.randFloat( -1, 1 );
  const y = THREE.Math.randFloat( -1, 1 );
  const z = THREE.Math.randFloat( -1, 1 );
  const normalizationFactor = 1 / Math.sqrt( x * x + y * y + z * z );

  v.x = x * normalizationFactor * radius;
  v.y = y * normalizationFactor * radius;
  v.z = z * normalizationFactor * radius;

  return v;
};


// computed using least squares fit from a few tests
export const cameraZPos = ( aspect ) => {
  if ( aspect <= 0.9 ) return -960 * aspect + 1350;
  else if ( aspect <= 1.2 ) return -430 * aspect + 900;
  else if ( aspect <= 3 ) return -110 * aspect + 500;
  else if ( aspect <= 4.5 ) return -40 * aspect + 300;
  return 100;
};

export const createTextGeometry = ( font, text =  'Black Thread Design' ) => {
  const textGeometry = new THREE.TextGeometry( text, {
    size: 40,
    height: 3,
    font,
    weight: 'normal',
    style: 'normal',
    curveSegments: 24,
    bevelSize: 2,
    bevelThickness: 2,
    bevelEnabled: true,
  } );

  positionTextGeometry( textGeometry, { x: 0.5, y: 0.0, z: 0.0 } );

  const tessellationLevel = ( window.innerWidth >= 1300 ) ? 2 : 1;

  tessellateRecursive( textGeometry, 1.0, tessellationLevel );

  explodeModifier( textGeometry );

  return textGeometry;

};
