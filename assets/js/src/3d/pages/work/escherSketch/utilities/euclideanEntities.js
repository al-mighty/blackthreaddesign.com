import * as E from './mathFunctions';

// * ***********************************************************************
// *
// *   CIRCLE CLASS
// *   A circle in the Poincare disk is identical to a circle in Euclidean space
// *
// *************************************************************************

export class Circle {
  constructor( centreX, centreY, radius ) {
    this.centre = { x: centreX, y: centreY, z: 0 };
    this.radius = radius;
  }
}
