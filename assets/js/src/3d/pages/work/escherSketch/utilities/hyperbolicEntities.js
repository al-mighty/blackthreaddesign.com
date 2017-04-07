import * as E from './mathFunctions.js';
import { Point, Circle } from './euclideanEntities.js';

// * ***********************************************************************
// *
// *  HYPERBOLIC ARC CLASS
// *  Represents a hyperbolic arc on the Poincare disk, which is a
// *  Euclidean straight line if it goes through the origin
// *
// *************************************************************************

class HyperbolicArc {
  constructor( startPoint, endPoint ) {
    this.startPoint = startPoint;
    this.endPoint = endPoint;

    if ( E.throughOrigin( startPoint, endPoint ) ) {
      this.straightLine = true;
      this.arcLength = E.distance( startPoint, endPoint );
      this.curvature = 0;
    } else {
      this.calculateArc();
      this.arcLength = E.arcLength( this.circle, this.startAngle, this.endAngle );
      this.curvature = ( this.arcLength ) / ( this.circle.radius );
    }
  }

  // Calculate the arc using Dunham's method
  calculateArc() {
    // calculate centre of the circle the arc lies on relative to unit disk
    const hp = E.hyperboloidCrossProduct(
      this.startPoint.poincareToHyperboloid(),
      this.endPoint.poincareToHyperboloid(),
    );

    const arcCentre = new Point( hp.x / hp.z, hp.y / hp.z );
    const arcRadius = Math.sqrt(
      ( this.startPoint.x - arcCentre.x, 2 ) ** 2
      + ( this.startPoint.y - arcCentre.y, 2 ) ** 2,
    );

    // translate points to origin and calculate arctan
    this.startAngle = Math.atan2(
      this.startPoint.y - arcCentre.y,
      this.startPoint.x - arcCentre.x,
    );
    this.endAngle = Math.atan2(
      this.endPoint.y - arcCentre.y,
      this.endPoint.x - arcCentre.x,
    );

    // angles are in (-pi, pi), transform to (0,2pi)
    this.startAngle = ( this.startAngle < 0 )
                      ? 2 * Math.PI + this.startAngle
                      : this.startAngle;
    this.endAngle = ( this.endAngle < 0 )
                      ? 2 * Math.PI + this.endAngle
                      : this.endAngle;

    this.circle = new Circle( arcCentre.x, arcCentre.y, arcRadius );
  }

}

// * ***********************************************************************
// *
// *  (TRIANGULAR) HYPERBOLIC POLYGON CLASS
// *
// *************************************************************************
// NOTE: sometimes polygons will be backwards facing. Solved with DoubleSide material
// but may cause problems
// materialIndex: which tile to use
export class HyperbolicPolygon {
  constructor( vertices, materialIndex = 0 ) {

    this.materialIndex = materialIndex;
    this.vertices = vertices;

    this.edges = [
      new HyperbolicArc( this.vertices[0], this.vertices[1] ),
      new HyperbolicArc( this.vertices[1], this.vertices[2] ),
      new HyperbolicArc( this.vertices[2], this.vertices[0] ),
    ];
  }

  // Apply a Transform to the polygon
  transform( transform, materialIndex = this.materialIndex ) {
    const newVertices = [];
    for ( let i = 0; i < this.vertices.length; i++ ) {
      newVertices.push( this.vertices[i].transform( transform ) );
    }
    return new HyperbolicPolygon( newVertices, materialIndex );
  }
}
