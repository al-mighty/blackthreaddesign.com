import * as THREE from 'three';

// import { sineWave, visibleWidthAtZDepth } from '../wavelinesCanvasHelpers.js';

const sineWave = ( amp, time, freq, phase ) => amp * Math.sin( 2 * Math.PI * freq * time + phase );


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

  // create a line geometry to be used either for a mesh or as a morph target
  createLine( xArray, yArray ) {
    // create an upper curve
    const upperPoints = xArray.map( ( l, i ) => new THREE.Vector2( l, yArray[i] ) );
    // create a lower curve separated by desired thickness from the first
    // and going in the opposite direction
    const lowerPoints = xArray.map( ( l, i ) => new THREE.Vector2( l, yArray[i] - this.spec.thickness ) )
      .reverse();

    const line = new THREE.Shape();
    line.moveTo( upperPoints[0].x, upperPoints[0].y ); // starting point
    // upper curve through the rest of the upperPoints array
    line.splineThru( upperPoints.slice( 1, upperPoints.length ) );
    line.lineTo( lowerPoints[0].x, lowerPoints[0].y );
    // lower curve
    line.splineThru( lowerPoints.slice( 1, lowerPoints.length ) );

    return line;
  }

  createWave( initialSpec = {}, finalSpec = {} ) {
    const l = this.spec.fineness;
    const positions = new Float32Array( l * 3 * 2 );

    const indices = new Uint16Array( ( ( l * 2 ) - 2 ) * 3 );

    const xInitial = -this.spec.canvasWidth / 2;

    const dist = this.spec.canvasWidth;

    const step = dist / l;

    // generate forward and reverse positions on top and bottom of wave
    for ( let i = 0; i < l; i++ ) {
      const offset = i * 6;
      const currentXPos = xInitial + step * i;


      const y = sineWave( 0.5, currentXPos, 2, 0 );

      positions[ offset ] = positions [ offset + 3 ] = currentXPos;
      positions[ offset + 1 ] = y;
      positions[ offset + 4 ] = y - this.spec.thickness;
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

    const wave = new THREE.BufferGeometry();

    wave.setIndex( new THREE.BufferAttribute( indices, 1 ) );
    wave.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );

    return wave;
  }

  // create the line geometry and add morph targets
  lineGeometry() {
    const line = this.createLine(
      this.spec.xInitial,
      this.spec.yInitial,
    );

    const geometry =  new THREE.ShapeGeometry( line, this.spec.meshFineness );

    const morphLine = this.createLine( this.spec.xFinal, this.spec.yFinal );
    const morphGeometry = new THREE.ShapeGeometry( morphLine, this.spec.meshFineness );

    geometry.morphTargets.push( {
      name: 'movement',
      vertices: morphGeometry.vertices,
    } );


    const l = geometry.vertices.length;
    geometry.faces = [];
    for ( let i = 0; i < ( l - 2 ) / 2; i++ ) {
      geometry.faces.push( new THREE.Face3( i, l - 1 - i, l - 2 - i ) );
      geometry.faces.push( new THREE.Face3( i, l - 2 - i, i + 1 ) );
    }

    return geometry;
  }

  createMesh() {
    const geometry = this.createWave();

    const mesh = new THREE.Mesh( geometry, this.spec.material );

    // mesh.position.z = this.spec.zDepth;

    return mesh;
  }
}
