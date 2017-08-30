import * as THREE from 'three';

/**
 * Forked from the THREE.GridHelper to allow non-square grid
 */

export default function Grid( width, length, divisions, color ) {

  width = width || 10;
  length = length || 10;
  divisions = divisions || 10;
  color = color !== undefined ? color : 0x888888;

  // if ( ( ( length % divisions ) !== 0 ) || ( ( width % divisions ) !== 0 )  ) {

  //   console.error( 'Grid: Length and Width should both be multiples of number of divisions.' );
  //   return;

  // }

  const step = length / divisions;
  const halfWidth = width / 2;

  const lengthDivisions = width / step;
  const halfLength = length / 2;

  const vertices = [];

  // vertical lines
  for ( let i = 0, k = -halfLength; i <= divisions; i++, k += step ) {

    vertices.push( -halfWidth, 0, k, halfWidth, 0, k );

  }

  // horizontal lines
  for ( let i = 0, j = -halfWidth; i <= lengthDivisions; i++, j += step ) {

    vertices.push( j, 0, -halfLength, j, 0, halfLength );

  }

  const geometry = new THREE.BufferGeometry();
  geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

  const material = new THREE.LineBasicMaterial( { color } );

  THREE.LineSegments.call( this, geometry, material );

}

Grid.prototype = Object.create( THREE.LineSegments.prototype );
Grid.prototype.constructor = Grid;
