// import * as THREE from 'three';
// import threeUtils from '../../App/threeUtils.js';

export const visibleHeightAtZDepth = ( depth, camera ) => {
  const vFOV = camera.fov * Math.PI / 180;
  return 2 * Math.tan( vFOV / 2 ) * depth; // visible height
};

export const visibleWidthAtZDepth = ( depth, camera ) => {
  const height = visibleHeightAtZDepth( depth, camera );
  return height * camera.aspect;
};
