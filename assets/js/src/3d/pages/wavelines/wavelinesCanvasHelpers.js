// import * as THREE from 'three';
// import threeUtils from '../../App/threeUtils.js';

export const visibleHeightAtZDepth = ( depth, camera ) => {
  // compensate for cameras not positioned at z=0
  const cameraOffset = camera.position.z;
  if ( depth < cameraOffset ) depth -= cameraOffset;
  else depth += cameraOffset;

  // vertical fov in radians
  const vFOV = camera.fov * Math.PI / 180; 
  return 2 * Math.tan( vFOV / 2 ) * Math.abs( depth );
};

export const visibleWidthAtZDepth = ( depth, camera ) => {
  const height = visibleHeightAtZDepth( depth, camera );
  return height * camera.aspect;
};

export const xCoord = ( x, visibleWidth ) => {
  const onePercent = visibleWidth  / 100;
  return x < 50 ? ( -50 + x ) * onePercent : ( x - 50 ) * onePercent;
}

export const yCoord = ( y, visibleHeight ) => {
  const onePercent = visibleHeight / 100;
  return y < 50 ? ( -50 + y ) * onePercent : ( y - 50 ) * onePercent;
}

export const sineWave = ( amp, time, freq, phase, offset ) =>
  amp * Math.cos( 2 * Math.PI * freq * time + phase ) + offset;


// parametrically generated surfaces
// const initialSurfaceFunc = ( x, z ) => x * x * x - z * z * z;

// const finalSurfaceFunc = ( x, z, ) => Math.sin( x * x * x ) - Math.sin( z * z * z );

// // 0 <= x <= 1, 0 <= z <=1
// export const initialSurfaceGen = ( x, z, cam ) => {
//   const height = visibleHeightAtZDepth( z, cam );

//   const y = initialSurfaceFunc( x, z );

//   return yCoord( y * 100, height );
// };

// // 0 <= x <= 1, 0 <= z <=1
// export const finalSurfaceGen = ( x, z, cam ) => {
//   const height = visibleHeightAtZDepth( z, cam );

//   const y = finalSurfaceFunc( x, z );

//   return yCoord( y * 100, height );
// };
