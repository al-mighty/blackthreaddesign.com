import * as THREE from 'three';
// compute the centroid of a triangular face

const v = new THREE.Vector3();

const computeCentroid = function ( geometry, face ) {
  const a = geometry.vertices[face.a];
  const b = geometry.vertices[face.b];
  const c = geometry.vertices[face.c];

  v.x = ( a.x + b.x + c.x ) / 3;
  v.y = ( a.y + b.y + c.y ) / 3;
  v.z = ( a.z + b.z + c.z ) / 3;

  return v;
};

export default computeCentroid;
