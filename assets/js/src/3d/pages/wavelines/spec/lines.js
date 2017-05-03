import * as THREE from 'three';

// function cubicBezier( t,
//   p0, p1, p2, p3)
// {
//   float u = 1 – t;
//   float tt = t*t;
//   float uu = u*u;
//   float uuu = uu * u;
//   float ttt = tt * t;
 
//   const p = p0.clone();
//   p = uuu * p0; //first term
//   p += 3 * uu * t * p1; //second term
//   p += 3 * u * tt * p2; //third term
//   p += ttt * p3; //fourth term
 
//   return p;
// }

export default {
  l1: {
    opacity: 0.5,
    z: -10,
    initialParams: {
      thickness: 1,
      yOffset: 0.0,
      // array of x, y, pairs between 0 and 1
      // first x must be 0, final x must be 1, x must increase
      points: [ 
        new THREE.Vector2( 0, 2.5 ),
        new THREE.Vector2( 0.25, 0.2 ),
        new THREE.Vector2( 0.6, 2.6 ),
        new THREE.Vector2( 1.0, 1.0 ),
      ],
    },
    finalParams: {
      thickness: 1,
      yOffset: 0.0,
      points: [ 
        new THREE.Vector2( 0, -2.1 ),
        new THREE.Vector2( 0.1, 0.5 ),
        new THREE.Vector2( 0.7, -2.6 ),
        new THREE.Vector2( 1.0, 0.6 ),
      ],
    },
  },
}
