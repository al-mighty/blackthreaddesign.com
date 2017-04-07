import * as THREE from 'three';
import * as E from './utilities/mathFunctions.js';

// The longest edge with radius > 0 should be used to calculate how finely
// the polygon gets subdivided
function findSubdivisionEdge( polygon ) {
  // curvature === 0 means this edge goes through origin
  // in which case subdivide based on next longest edge
  const a = ( polygon.edges[0].curvature === 0 ) 
            ? 0
            : polygon.edges[0].arcLength;
  const b = ( polygon.edges[1].curvature === 0 )
            ? 0
            : polygon.edges[1].arcLength;
  const c = ( polygon.edges[2].curvature === 0 )
            ? 0
            : polygon.edges[2].arcLength;
  if ( a > b && a > c ) return 0;
  else if ( b > c ) return 1;
  return 2;
}

// Subdivide the edge into lengths calculated by calculateSpacing()
function subdivideHyperbolicArc( arc, numDivisions ) {
  // calculate the spacing for subdividing the edge into an even number of pieces.
  // For the first ( longest ) edge this will be calculated based on spacing
  // then for the rest of the edges it will be calculated based on the number of
  // subdivisions of the first edge ( so that all edges are divided into an equal
  // number of pieces)

  // calculate the number of subdivisions required to break the arc into an
  // even number of pieces (or 1 in case of tiny polygons)
  numDivisions = numDivisions || ( arc.arcLength > 0.01 )
                  ? 2 * Math.ceil( arc.arcLength / 2 )
                  : 1;

  // calculate spacing based on number of points
  const spacing = arc.arcLength / numDivisions;

  const points = [arc.startPoint];

  // tiny pgons near the edges of the disk don't need to be subdivided
  if ( arc.arcLength > spacing ) {
    let p = ( !arc.straightLine )
      ? E.directedSpacedPointOnArc( arc.circle, arc.startPoint, arc.endPoint, spacing )
      : E.directedSpacedPointOnLine( arc.startPoint, arc.endPoint, spacing );
    points.push( p );

    for ( let i = 0; i < numDivisions - 2; i++ ) {
      p = ( !arc.straightLine )
        ? E.directedSpacedPointOnArc( arc.circle, p, arc.endPoint, spacing )
        : E.directedSpacedPointOnLine( p, arc.endPoint, spacing );
      points.push( p );
    }
  }
  // push the final vertex
  points.push( arc.endPoint );

  return points;
}

// subdivide the subdivision edge, then subdivide the other two edges with the
// same number of points as the subdivision
function subdivideHyperbolicPolygonEdges( polygon ) {
  const subdivisionEdge = findSubdivisionEdge( polygon );

  const edge1Points = subdivideHyperbolicArc( polygon.edges[subdivisionEdge] );

  const numDivisions = edge1Points.length - 1;

  polygon.numDivisions = numDivisions;

  const edge2Points = subdivideHyperbolicArc( polygon.edges[( subdivisionEdge + 1 ) % 3], numDivisions );
  const edge3Points = subdivideHyperbolicArc( polygon.edges[( subdivisionEdge + 2 ) % 3], numDivisions );

  const edges = [];

  edges[subdivisionEdge] = edge1Points;
  edges[( subdivisionEdge + 1 ) % 3] = edge2Points;
  edges[( subdivisionEdge + 2 ) % 3] = edge3Points;

  edges[3] = numDivisions;

  return edges;
}

// find the points along the arc between opposite subdivions of the second two
// edges of the polygon. Each subsequent arc will have one less subdivision
function subdivideInteriorArc( startPoint, endPoint, arcIndex ) {
  const circle = new HyperbolicArc( startPoint, endPoint ).circle;
  this.mesh.push( startPoint );

  // for each arc, the number of divisions will be reduced by one
  const divisions = this.numDivisions - arcIndex;

  // if the line get divided add points along line to mesh
  if ( divisions > 1 ) {
    const spacing = E.distance( startPoint, endPoint ) / ( divisions );
    let nextPoint = E.directedSpacedPointOnArc( circle, startPoint, endPoint, spacing );
    for ( let j = 0; j < divisions - 1; j++ ) {
      this.mesh.push( nextPoint );
      nextPoint = E.directedSpacedPointOnArc( circle, nextPoint, endPoint, spacing );
    }
  }

  this.mesh.push( endPoint );
}

// Alternative to subdivideInteriorArc using lines instead of arcs
// ( quality seems the same and may be faster )
function subdivideLine( startPoint, endPoint, numDivisions, arcIndex ) {
  const points = [startPoint];

  const divisions = numDivisions - arcIndex;

  // if the line get divided add points along line to mesh
  if ( divisions > 1 ) {
    const spacing = E.distance( startPoint, endPoint ) / ( divisions );
    let nextPoint = E.directedSpacedPointOnLine( startPoint, endPoint, spacing );
    for ( let j = 0; j < divisions - 1; j++ ) {
      points.push( nextPoint );
      nextPoint = E.directedSpacedPointOnLine( nextPoint, endPoint, spacing );
    }
  }

  points.push( endPoint );

  return points;
}

// Given a hyperbolic polygon, return an array representing a subdivided  triangular
// mesh across it's surface
function subdivideHyperbolicPolygon( polygon ) {
  const subdividedEdges = subdivideHyperbolicPolygonEdges( polygon );

  const numDivisions = subdividedEdges[3];

  const points = [].concat( subdividedEdges[0] );


  for ( let i = 1; i < numDivisions; i++ ) {
    const startPoint = subdividedEdges[2][( numDivisions - i )];
    const endPoint = subdividedEdges[1][i];
    // this.subdivideInteriorArc( startPoint, endPoint, i );
    const newPoints = subdivideLine( startPoint, endPoint, i ) 

    points.push( ...newPoints );

  }

  // push the final vertex
  points.push( subdividedEdges[2][0] );


  return points;
}

// Given a hyperbolic polygon, create a bufferGeometry
export function createGeometry( polygon ) {

  const vertices = subdivideHyperbolicPolygon( polygon );

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
      vertices[edgeStartingVertex].x,
      vertices[edgeStartingVertex].y,
      vertices[edgeStartingVertex].z,

      vertices[edgeStartingVertex + m].x,
      vertices[edgeStartingVertex + m].y,
      vertices[edgeStartingVertex + m].z,


      vertices[edgeStartingVertex + 1].x,
      vertices[edgeStartingVertex + 1].y,
      vertices[edgeStartingVertex + 1].z,

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
        vertices[edgeStartingVertex + j + 1].x,
        vertices[edgeStartingVertex + j + 1].y,
        vertices[edgeStartingVertex + j + 1].z,

        vertices[edgeStartingVertex + m + j].x,
        vertices[edgeStartingVertex + m + j].y,
        vertices[edgeStartingVertex + m + j].z,

        vertices[edgeStartingVertex + m + 1 + j].x,
        vertices[edgeStartingVertex + m + 1 + j].y,
        vertices[edgeStartingVertex + m + 1 + j].z,

        // Face 2
        vertices[edgeStartingVertex + j + 1].x,
        vertices[edgeStartingVertex + j + 1].y,
        vertices[edgeStartingVertex + j + 1].z,

        vertices[edgeStartingVertex + m + 1 + j].x,
        vertices[edgeStartingVertex + m + 1 + j].y,
        vertices[edgeStartingVertex + m + 1 + j].z,

        vertices[edgeStartingVertex + j + 2].x,
        vertices[edgeStartingVertex + j + 2].y,
        vertices[edgeStartingVertex + j + 2].z,
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