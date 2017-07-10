import createBufferAttribute from './createBufferAttribute.js';

  // create an attribute 'positions' from a set of vertices
const createBufferPositionsAttribute = ( bufferGeometry, vertices ) => {
  const vertexCount = vertices.length;
  const positionBuffer = createBufferAttribute( bufferGeometry, 'position', 3, vertexCount ).array;

  for (let i = 0, offset = 0; i < vertexCount; i++, offset += 3) {
    const vertex = vertices[i];

    positionBuffer[offset    ] = vertex.x;
    positionBuffer[offset + 1] = vertex.y;
    positionBuffer[offset + 2] = vertex.z;
  }
};

export default createBufferPositionsAttribute;
