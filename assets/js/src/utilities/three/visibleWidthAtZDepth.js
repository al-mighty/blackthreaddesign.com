import visibleHeightAtZDepth from './visibleHeightAtZDepth.js';

const visibleWidthAtZDepth = ( depth, camera ) => {
  const height = visibleHeightAtZDepth( depth, camera );
  return height * camera.aspect;
};

export default visibleWidthAtZDepth;
