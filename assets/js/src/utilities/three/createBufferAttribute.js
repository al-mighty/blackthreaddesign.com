import * as THREE from 'three';

// Add an attribute to a bufferGeometry and return a reference to the attribute

const createBufferAttribute = ( bufferGeometry, name, itemSize, count ) => {
  const buffer = new Float32Array( count * itemSize );
  const attribute = new THREE.BufferAttribute( buffer, itemSize );

  bufferGeometry.addAttribute( name, attribute );

  return attribute;
};

export default createBufferAttribute;
