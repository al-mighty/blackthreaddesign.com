import * as THREE from 'three';

export function createGeometry( polygon ) {

  const divisions = polygon.numDivisions || 1;
  const p = 1 / divisions;

  const bufferGeometry = new THREE.BufferGeometry();
  const uvs = [];
  const positions = [];

  let edgeStartingVertex = 0;

  // loop over each interior edge of the polygon's subdivion mesh and create faces and uvs
  for ( let i = 0; i < divisions; i++ ) {
    // edge divisions reduce by one for each interior edge
    const m = divisions - i + 1;

    positions.push(
      polygon.mesh[edgeStartingVertex].x,
      polygon.mesh[edgeStartingVertex].y,
      polygon.mesh[edgeStartingVertex].z,

      polygon.mesh[edgeStartingVertex + m].x,
      polygon.mesh[edgeStartingVertex + m].y,
      polygon.mesh[edgeStartingVertex + m].z,


      polygon.mesh[edgeStartingVertex + 1].x,
      polygon.mesh[edgeStartingVertex + 1].y,
      polygon.mesh[edgeStartingVertex + 1].z,

    );
    uvs.push(
      i * p, 0,
      ( i + 1 ) * p, 0,
      ( i + 1 ) * p, p,
    );

    // range m-2 because we are ignoring the edges first vertex which was
    // used in the previous positions.push
    // Each loop creates 2 faces
    for ( let j = 0; j < m - 2; j++ ) {

      positions.push(
        // Face 1
        polygon.mesh[edgeStartingVertex + j + 1].x,
        polygon.mesh[edgeStartingVertex + j + 1].y,
        polygon.mesh[edgeStartingVertex + j + 1].z,

        polygon.mesh[edgeStartingVertex + m + j].x,
        polygon.mesh[edgeStartingVertex + m + j].y,
        polygon.mesh[edgeStartingVertex + m + j].z,

        polygon.mesh[edgeStartingVertex + m + 1 + j].x,
        polygon.mesh[edgeStartingVertex + m + 1 + j].y,
        polygon.mesh[edgeStartingVertex + m + 1 + j].z,

        // Face 2
        polygon.mesh[edgeStartingVertex + j + 1].x,
        polygon.mesh[edgeStartingVertex + j + 1].y,
        polygon.mesh[edgeStartingVertex + j + 1].z,

        polygon.mesh[edgeStartingVertex + m + 1 + j].x,
        polygon.mesh[edgeStartingVertex + m + 1 + j].y,
        polygon.mesh[edgeStartingVertex + m + 1 + j].z,

        polygon.mesh[edgeStartingVertex + j + 2].x,
        polygon.mesh[edgeStartingVertex + j + 2].y,
        polygon.mesh[edgeStartingVertex + j + 2].z,
      );

      uvs.push(
        // Face 1 uvs
        ( i + 1 + j ) * p, ( 1 + j ) * p,
        ( i + 1 + j ) * p, j * p,
        ( i + j + 2 ) * p, ( j + 1 ) * p,

        // Face 2 uvs
        ( i + 1 + j ) * p, ( 1 + j ) * p,
        ( i + 2 + j ) * p, ( j + 1 ) * p,
        ( i + j + 2 ) * p, ( j + 2 ) * p,
      );

    }
    edgeStartingVertex += m;
  }

  bufferGeometry.addAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );

  bufferGeometry.addAttribute( 'uv', new THREE.Float32BufferAttribute( uvs, 2 ) );

  return bufferGeometry;
}