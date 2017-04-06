import * as THREE from 'three';

export function createGeometry( polygon ) {

  const divisions = polygon.numDivisions || 1;
  const p = 1 / divisions;
  const geometry = new THREE.Geometry();
  geometry.faceVertexUvs[0] = [];

  geometry.vertices = polygon.mesh;

  let edgeStartingVertex = 0;
  // loop over each interior edge of the polygon's subdivion mesh
  for ( let i = 0; i < divisions; i++ ) {
    // edge divisions reduce by one for each interior edge
    const m = divisions - i + 1;
    geometry.faces.push(
      new THREE.Face3(
        edgeStartingVertex,
        edgeStartingVertex + m,
        edgeStartingVertex + 1,
      ) );
    geometry.faceVertexUvs[0].push(
      [
        new THREE.Vector3( i * p, 0, 0 ),
        new THREE.Vector3( ( i + 1 ) * p, 0, 0 ),
        new THREE.Vector3( ( i + 1 ) * p, p, 0 ),
      ] );

    // range m-2 because we are ignoring the edges first vertex which was
    // used in the previous faces.push
    for ( let j = 0; j < m - 2; j++ ) {
      geometry.faces.push(
        new THREE.Face3(
          edgeStartingVertex + j + 1,
          edgeStartingVertex + m + j,
          edgeStartingVertex + m + 1 + j,
        ) );
      geometry.faceVertexUvs[0].push(
        [
          new THREE.Vector3( ( i + 1 + j ) * p, ( 1 + j ) * p, 0 ),
          new THREE.Vector3( ( i + 1 + j ) * p, j * p, 0 ),
          new THREE.Vector3( ( i + j + 2 ) * p, ( j + 1 ) * p, 0 ),
        ] );
      geometry.faces.push(
        new THREE.Face3(
          edgeStartingVertex + j + 1,
          edgeStartingVertex + m + 1 + j,
          edgeStartingVertex + j + 2,
        ) );
      geometry.faceVertexUvs[0].push(
        [
          new THREE.Vector3( ( i + 1 + j ) * p, ( 1 + j ) * p, 0 ),
          new THREE.Vector3( ( i + 2 + j ) * p, ( j + 1 ) * p, 0 ),
          new THREE.Vector3( ( i + j + 2 ) * p, ( j + 2 ) * p, 0 ),
        ] );
    }
    edgeStartingVertex += m;
  }

  return geometry;
}