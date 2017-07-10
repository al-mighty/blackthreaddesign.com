import * as THREE from 'three';

// set the .index property of a bufferGeometry from faces
const setBufferGeometryIndicesFromFaces = ( bufferGeometry, faceCount, faces ) => {
  const indexBuffer = new Uint32Array( faceCount * 3 );

  bufferGeometry.setIndex( new THREE.BufferAttribute( indexBuffer, 1 ) );

  for ( let i = 0, offset = 0; i < faceCount; i++, offset += 3 ) {
    const face = faces[i];

    indexBuffer[offset] = face.a;
    indexBuffer[offset + 1] = face.b;
    indexBuffer[offset + 2] = face.c;
  }
};

export default setBufferGeometryIndicesFromFaces;
