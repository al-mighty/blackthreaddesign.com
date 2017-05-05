import * as THREE from 'three';

// * ***********************************************************************
// *
// *  CIRCLE WAVE CLASS
// *
// *************************************************************************

export default class CircleWave {
  constructor( spec ) {

    this.spec = spec || {};

    this.radius = spec.canvasHeight;

    return this.createMesh();
  }

  createPoints(){
    const outerPoints = [];
    const innerPoints = [];

    const segments = THREE.Math.randInt( 8, 12 );

    for ( let s = 0; s <= segments; s++ ) { 
      const angle = 0 + s / segments * ( Math.PI * 2 );

      const radius = Math.random() * 0.2 + this.radius;
      outerPoints.push( new THREE.Vector2(
        radius * Math.cos( angle ),
        radius * Math.sin( angle ),
      ) );

      innerPoints.push( new THREE.Vector2(
        ( radius - this.spec.thickness ) * Math.cos( angle ),
        ( radius - this.spec.thickness ) * Math.sin( angle ),
      ) );

    }

    outerPoints[ outerPoints.length - 1 ] = outerPoints[0];
    innerPoints[ innerPoints.length - 1 ] = innerPoints[0];

    return {
      outerPoints,
      innerPoints,
    }
  }

  createWave( ) {
    const points = this.createPoints();

    const l = this.spec.fineness;

    const positions = new Float32Array( l * 3 * 2 );
    const indices = new Uint16Array( ( ( l * 2 ) - 2 ) * 3 );

    const outerPositions = new THREE.SplineCurve( points.outerPoints ).getSpacedPoints( l - 1 );

    const innerPositions = new THREE.SplineCurve( points.innerPoints ).getSpacedPoints( l - 1 );

    for ( let i = 0; i < l; i++ ) {
      const offset = i * 6;

      positions[ offset ] = positions[ offset + 3 ] = outerPositions[i].x;

      positions[ offset + 1 ] = outerPositions[i].y;

      positions[ offset + 4 ] = innerPositions[i].y;

      positions[ offset + 2 ] = positions[ offset + 5 ] = this.spec.z;

    }

    for ( let j = 0;  j < ( ( l * 2 ) - 2 ) / 2; j++ ) {

      const k = j * 2;
      const offset = j * 6;

      indices[ offset ] =  k;
      indices[ offset + 1 ] = k + 1;
      indices[ offset + 2 ] = k + 2;

      indices[ offset + 3 ] = k + 1;
      indices[ offset + 4 ] = k + 3;
      indices[ offset + 5 ] = k + 2;
    }

    const geometry = new THREE.BufferGeometry();

    geometry.setIndex( new THREE.BufferAttribute( indices, 1 ) );
    geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );

    return geometry;
  }

  createMesh() {
    const geometry = this.createWave();

    const mesh = new THREE.Mesh( geometry, this.spec.material );

    // mesh.position.set( 0, -this.radius, 0 );

    return mesh;
  }
}
