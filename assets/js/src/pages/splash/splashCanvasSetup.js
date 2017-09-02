import * as THREE from 'three';

// import PNLTRI from 'vendor/pnltri.js';
// Set up THREE
THREE.Cache.enabled = true;

//Use PNLTRI for triangualtion
// THREE.ShapeUtils.triangulateShape = ( () => {
//   const pnlTriangulator = new PNLTRI.Triangulator();
//   function removeDupEndPts( points ) {
//     const l = points.length;
//     if ( l > 2 && points[l - 1].equals( points[0] ) ) {
//       points.pop();
//     }
//   }
//   return function triangulateShape( contour, holes ) {
//     removeDupEndPts( contour );
//     holes.forEach( removeDupEndPts );
//     return pnlTriangulator.triangulate_polygon( [contour].concat( holes ) );
//   };
// } )();

