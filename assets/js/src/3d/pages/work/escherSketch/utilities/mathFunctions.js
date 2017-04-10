// * ***********************************************************************
// *
// *   MATH FUNCTIONS
// *
// *************************************************************************

export const distance = ( point1, point2 ) =>
  Math.sqrt( Math.pow( ( point2.x - point1.x ), 2 ) + Math.pow( ( point2.y - point1.y ), 2 ) );

// does the line connecting p1, p2 go through the point (0,0)?
export const throughOrigin = ( point1, point2 ) => {
  // vertical line through centre
  if ( ( Math.abs( point1.x ) <= 0.00001 ) && ( Math.abs( point2.x ) <= 0.00001 ) ) {
    return true;
  }
  const test = ( -point1.x * point2.y + point1.x * point1.y ) / ( point2.x - point1.x ) + point1.y;

  if ( Math.abs( test ) <= 0.00001 ) return true;
  return false;
};


// Find the length of the smaller arc between two angles on a given circle
export const arcLength = ( radius, startAngle, endAngle ) => {
  return ( Math.abs( startAngle - endAngle ) > Math.PI )
    ? radius * ( 2 * Math.PI - Math.abs( startAngle - endAngle ) )
    : radius * ( Math.abs( startAngle - endAngle ) );
};

// find the two points a distance from a point on the circumference of a circle
// in the direction of point2
export const directedSpacedPointOnArc = ( arc, spacing ) => {
  const cosTheta = -( ( spacing * spacing ) / ( 2 * arc.radius * arc.radius ) - 1 );
  const sinThetaPos = Math.sqrt( 1 - ( cosTheta * cosTheta ) );
  const sinThetaNeg = -sinThetaPos;

  const xPos = arc.centre.x + cosTheta
    * ( arc.startPoint.x - arc.centre.x ) - sinThetaPos
    * ( arc.startPoint.y - arc.centre.y );
  const xNeg = arc.centre.x + cosTheta
    * ( arc.startPoint.x - arc.centre.x ) - sinThetaNeg
    * ( arc.startPoint.y - arc.centre.y );
  const yPos = arc.centre.y + sinThetaPos
    * ( arc.startPoint.x - arc.centre.x ) + cosTheta
    * ( arc.startPoint.y - arc.centre.y );
  const yNeg = arc.centre.y + sinThetaNeg
    * ( arc.startPoint.x - arc.centre.x ) + cosTheta
    * ( arc.startPoint.y - arc.centre.y );

  const p1 = { x: xPos, y: yPos, z: 0 };
  const p2 = { x: xNeg, y: yNeg, z: 0 };

  const a = distance( p1, arc.endPoint );
  const b = distance( p2, arc.endPoint );
  return ( a < b ) ? p1 : p2;
};

// calculate the normal vector given 2 points
export const normalVector = ( p1, p2 ) => {
  const d = Math.sqrt( Math.pow( p2.x - p1.x, 2 ) + Math.pow( p2.y - p1.y, 2 ) );
  return { x:  ( p2.x - p1.x ) / d, y: ( p2.y - p1.y ) / d, z: 0 };
};

// find the point at a distance from point1 along line defined by point1, point2,
// in the direction of point2
export const directedSpacedPointOnLine = ( point1, point2, spacing ) => {
  const dv = normalVector( point1, point2 );
  return { x:  point1.x + spacing * dv.x, y: point1.y + spacing * dv.y, z: 0 };
};

export const randomFloat = ( min, max ) => Math.random() * ( max - min ) + min;

export const randomInt = ( min, max ) => Math.floor( Math.random() * ( max - min + 1 ) + min );

// are the angles alpha, beta in clockwise order on unit disk?
export const clockwise = ( alpha, beta ) => {
  // let cw = true;
  const a = ( beta > 3 * Math.PI / 2 && alpha < Math.PI / 2 );
  const b = ( beta - alpha > Math.PI );
  const c = ( ( alpha > beta ) && !( alpha - beta > Math.PI ) );
  // if (a || b || c) {
    // cw = false;
  // }
  // return (a || b || c) ? false : true;
  return !( a || b || c );
};

export const multiplyMatrices = ( m1, m2 ) => {
  const result = [];
  for ( let i = 0; i < m1.length; i++ ) {
    result[i] = [];
    for ( let j = 0; j < m2[0].length; j++ ) {
      let sum = 0;
      for ( let k = 0; k < m1[0].length; k++ ) {
        sum += m1[i][k] * m2[k][j];
      }
      result[i][j] = sum;
    }
  }
  return result;
};

// create nxn identityMatrix
export const identityMatrix = n =>
  Array( ...new Array( n ) ).map( ( x, i, a ) =>
    a.map( ( y, k ) => {
      return ( i === k ) ? 1 : 0;
    } ),
  );

export const hyperboloidCrossProduct = ( point3D1, point3D2 ) => {
  return {
    x: point3D1.y * point3D2.z - point3D1.z * point3D2.y,
    y: point3D1.z * point3D2.x - point3D1.x * point3D2.z,
    z: -point3D1.x * point3D2.y + point3D1.y * point3D2.x,
  };
}

export const poincareToHyperboloid = ( x, y ) => {
  const factor = 1 / ( 1 - x * x - y * y );
  const xH = 2 * factor * x;
  const yH = 2 * factor * y;
  const zH = factor * ( 1 + x * x + y * y );
  const p = { x: xH, y: yH, z: zH };
  return p;
};

export const hyperboloidToPoincare = ( x, y, z ) => {
  const factor = 1 / ( 1 + z );
  const xH = factor * x;
  const yH = factor * y;
  return { x: xH, y: yH, z: 0 };
};

// move the point to hyperboloid (Weierstrass) space, apply the transform, then move back
export const transformPoint = ( transform, x, y ) => {
  const mat = transform.matrix;
  const p = poincareToHyperboloid( x, y );
  const xT = p.x * mat[0][0] + p.y * mat[0][1] + p.z * mat[0][2];
  const yT = p.x * mat[1][0] + p.y * mat[1][1] + p.z * mat[1][2];
  const zT = p.x * mat[2][0] + p.y * mat[2][1] + p.z * mat[2][2];

  return hyperboloidToPoincare( xT, yT, zT );
}
