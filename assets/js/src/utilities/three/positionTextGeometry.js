import * as THREE from 'three';

const positionTextGeometry = ( geometry, anchor ) => {
  geometry.computeBoundingBox();

  const size = geometry.boundingBox.getSize();
  const anchorX = size.x * -anchor.x;
  const anchorY = size.y * -anchor.y;
  const anchorZ = size.z * -anchor.z;
  const matrix = new THREE.Matrix4().makeTranslation( anchorX, anchorY, anchorZ );

  geometry.applyMatrix( matrix );

  return geometry;
};

export default positionTextGeometry;
