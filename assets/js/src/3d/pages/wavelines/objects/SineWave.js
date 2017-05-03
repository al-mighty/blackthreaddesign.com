import * as THREE from 'three';

import { sineWave } from '../wavelinesCanvasHelpers.js';

// * ***********************************************************************
// *
// *  SINE WAVE CLASS
// *
// *************************************************************************
// const spec = {
//    material: new THREE.someKindOfMaterial,
//    z: -1, //how far from the camera to create the line
//    color: 0xffffff,
//    //the following array must all be of the same size, >=2
//    xInitial: [], //first should be 0, last 100 to cover screen
//    xFinal: [], ////first should be 0, last 100 to cover screen
//    yInitial: [],
//    yFinal: [],
// }
export default class SineWave {
  constructor( spec ) {

    this.spec = spec || {};

    return this.createMesh();
  }

  createWave( ) {
    const l = this.spec.fineness;

    const positions = new Float32Array( l * 3 * 2 );
    const morphPositions = new Float32Array( l * 3 * 2 );
    const indices = new Uint16Array( ( ( l * 2 ) - 2 ) * 3 );

    const xInitial = -this.spec.canvasWidth / 2;

    const dist = this.spec.canvasWidth;

    const step = dist / l;

    const init = this.spec.initialParams;
    const final = this.spec.finalParams;

    const points = init.points.map( ( v ) => {
      // map the passed in x value in [0, 1] to screen width
      v.x = xInitial + ( dist * v.x ); 
      return v;
    } );

    const morphPoints = final.points.map( ( v ) => {
      v.x = xInitial + ( dist * v.x ); 
      return v;
    } );

    // also test getSpacedPoints
    const initialPositions = new THREE.SplineCurve( points ).getSpacedPoints( l - 1 );

    const finalPositions = new THREE.SplineCurve( morphPoints ).getSpacedPoints( l - 1 );

    // generate forward and reverse positions on top and bottom of wave
    for ( let i = 0; i < l; i++ ) {
      const offset = i * 6;

      positions[ offset ] = positions[ offset + 3 ] = initialPositions[i].x;
      morphPositions[ offset ] = morphPositions[ offset + 3 ] = finalPositions[i].x;

      positions[ offset + 1 ] = initialPositions[i].y + init.yOffset;
      positions[ offset + 4 ] = initialPositions[i].y - init.thickness + init.yOffset;

      morphPositions[ offset + 1 ] = finalPositions[i].y + final.yOffset;
      morphPositions[ offset + 4 ] = finalPositions[i].y - final.thickness + final.yOffset;

      positions[ offset + 2 ] = positions[ offset + 5 ] = morphPositions[ offset + 2 ] = morphPositions[ offset + 5 ] = this.spec.z;

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

    geometry.morphAttributes.position = [];
    geometry.morphAttributes.position[0] = new THREE.BufferAttribute( morphPositions, 3 );

    // Hack required to get Mesh to have morphTargetInfluences attribute
    geometry.morphTargets = [];
    geometry.morphTargets.push( 0 );

    return geometry;
  }

  createMesh() {
    const geometry = this.createWave();

    const mesh = new THREE.Mesh( geometry, this.spec.material );

    return mesh;
  }
}
