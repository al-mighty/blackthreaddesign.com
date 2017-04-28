import * as THREE from 'three';

// * ***********************************************************************
// *
// *  WAVELINE CLASS
// *
// *************************************************************************
// const spec = {
//    material: new THREE.someKindOfMaterial,
//    zDepth: -1, //how far from the camera to create the line
//    color: 0xffffff,
//    //the following array must all be of the same size, >=2
//    xInitial: [], //first should be 0, last 100 to cover screen
//    xFinal: [], ////first should be 0, last 100 to cover screen
//    yInitial: [],
//    yFinal: [],
// }
export default class Waveline {
  constructor( spec ) {

    this.spec = spec || {};
    
    this.calculateParams();
    return this.createMesh();
  }

  //check the spec is correct and map points to screen space
  calculateParams() {
    //warn if all initialisation arrays are not the same length
    const checkArrays = (() => {
      const len = this.spec.xInitial.length;
      Object.keys(this.spec)
        .forEach(key => {
          if (this.spec[key] instanceof Array) {
            if (this.spec[key].length !== len) {
              console.warn('Waveline: Warning: all initialisation arrays must be the same length');
            }
          }
        });
      if (len < 2) console.error('Waveline: all initialisation arrays must have length >= 2!');
    })();
    // this.spec.xInitial = this.spec.xInitial.map(x => xCoord(x));
    // this.spec.xFinal = this.spec.xFinal.map(x => xCoord(x));
    // this.spec.yInitial = this.spec.yInitial.map(y => yCoord(y));
    // this.spec.yFinal = this.spec.yFinal.map(y => yCoord(y));
    this.meshFineness = 24;
  }

  //create a line geometry to be used either for a mesh or as a morph target
  createLine(xArray, yArray) {
    //create an upper curve
    const upperPoints = xArray.map((l, i) => new THREE.Vector2(l, yArray[i]));
    //create a lower curve seperated by 1 from the first
    //and going in the opposite direction
    const lowerPoints = xArray.map((l, i) => new THREE.Vector2(l, yArray[i] - 1))
      .reverse();

    const line = new THREE.Shape();
    line.moveTo(upperPoints[0].x, upperPoints[0].y); //starting point
    //upper curve through the rest of the upperPoints array
    line.splineThru(upperPoints.slice(1, upperPoints.length));
    line.lineTo(lowerPoints[0].x, lowerPoints[0].y);
    //lower curve
    line.splineThru(lowerPoints.slice(1, lowerPoints.length));

    // return line.extractAllPoints(this.meshFineness)
    //  .shape;
    return new THREE.ShapeGeometry(line, 12);
  }

  //create the line geometry and add morphtargets
  lineGeometry() {
    const geometry = this.createLine(
      this.spec.xInitial,
      this.spec.yInitial,
    );

    const morphGeometry = this.createLine(this.spec.xFinal, this.spec.yFinal);
    geometry.morphTargets.push({
      name: 'movement',
      vertices: morphGeometry.vertices,
    });

    const l = geometry.vertices.length;
    geometry.faces = [];
    for (let i = 0; i < (l - 2) / 2; i++) {
      geometry.faces.push(new THREE.Face3(i, l - 1 - i, l - 2 - i));
      geometry.faces.push(new THREE.Face3(i, l - 2 - i, i + 1));
    }

    return geometry;
  }

  createMesh() {
    const line = this.lineGeometry();

    const mesh = new THREE.Mesh(line, this.spec.material);
  
    mesh.position.z = this.spec.zDepth;
    // console.log(mesh);
    return mesh;
  }
}
