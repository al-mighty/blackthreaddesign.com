import * as THREE from 'three';

// Fix for bug in FBXLoader
// https://github.com/mrdoob/three.js/issues/11911
// This will hopefully be added to the FBXLoader eventually, in the meantime...
export default function invertMirroredFBX( object ) {

  object.traverse( ( child ) => {

    if ( child instanceof THREE.Mesh ) {

      if ( child.matrixWorld.determinant() < 0 ) {

        const l = child.geometry.attributes.position.array.length;

        for ( let i = 0; i < l; i += 9 ) {

              // reverse winding order
          const tempX = child.geometry.attributes.position.array[ i ];
          const tempY = child.geometry.attributes.position.array[ i + 1 ];
          const tempZ = child.geometry.attributes.position.array[ i + 2 ];

          child.geometry.attributes.position.array[ i ] = child.geometry.attributes.position.array[ i + 6 ];
          child.geometry.attributes.position.array[ i + 1 ] = child.geometry.attributes.position.array[ i + 7 ];
          child.geometry.attributes.position.array[ i + 2 ] = child.geometry.attributes.position.array[ i + 8 ];


          child.geometry.attributes.position.array[ i + 6 ] = tempX;
          child.geometry.attributes.position.array[ i + 7 ] = tempY;
          child.geometry.attributes.position.array[ i + 8 ] = tempZ;

              // switch vertex normals
          const tempNX = child.geometry.attributes.normal.array[ i ];
          const tempNY = child.geometry.attributes.normal.array[ i + 1 ];
          const tempNZ = child.geometry.attributes.normal.array[ i + 2 ];

          child.geometry.attributes.normal.array[ i ] = child.geometry.attributes.normal.array[ i + 6 ];
          child.geometry.attributes.normal.array[ i + 1 ] = child.geometry.attributes.normal.array[ i + 7 ];
          child.geometry.attributes.normal.array[ i + 2 ] = child.geometry.attributes.normal.array[ i + 8 ];


          child.geometry.attributes.normal.array[ i + 6 ] = tempNX;
          child.geometry.attributes.normal.array[ i + 7 ] = tempNY;
          child.geometry.attributes.normal.array[ i + 8 ] = tempNZ;

        }

      }

    }

  } );

}
