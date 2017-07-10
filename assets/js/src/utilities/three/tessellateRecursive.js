import tessellate from './tessellate.js';

// recursive version of tesselate
const tessellateRecursive = ( geometry, maxEdgeLength, depth ) => {
  for ( let i = 0; i < depth; i++ ) {
    tessellate( geometry, maxEdgeLength );
  }
};

export default tessellateRecursive;
