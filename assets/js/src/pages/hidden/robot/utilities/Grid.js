import * as THREE from 'three';
import loaders from './loaders.js';

/**
 * Forked from the THREE.GridHelper to allow non-square grid, add coords etc
 */

const createTextMesh = ( font, text, color ) => {

  color = color || 0xeeeeee;

  const textMat = new THREE.LineBasicMaterial( { color } );

  const textGeometry = new THREE.TextBufferGeometry( text, {
    size: 4,
    height: 0.1,
    font,
    curveSegments: 12,
  } );

  textGeometry.rotateX( -Math.PI / 2 );
  textGeometry.translate( 0, 3, 0 );

  return new THREE.Mesh( textGeometry, textMat );

};

export default class Grid {

  constructor( width, length, widthDivisions, colorCenterLine, colorGrid ) {

    this.height = 2;
    this.width = width || 10;
    this.length = length || 10;
    this.widthDivisions = widthDivisions || 10;
    this.colorCenterLine = new THREE.Color( colorCenterLine !== undefined ? colorCenterLine : 0x444444 ).toArray();
    this.colorGrid = new THREE.Color( colorGrid !== undefined ? colorGrid : 0x888888 ).toArray();

    this.group = new THREE.Group();

    this.group.visible = true;

    this.initGrid();
    this.initCenterCircle();
    this.initCoords();
    this.initText();

  }

  set enabled( bool ) {

    this.group.visible = bool;

  }

  initGrid() {

    const step = this.length / this.widthDivisions;
    const halfWidth = this.width / 2;

    const lengthDivisions = this.width / step;
    const halfLength = this.length / 2;

    const widthCenter = this.widthDivisions / 2;
    const lengthCenter = lengthDivisions / 2;

    const vertices = [];
    const colors = [];

    // vertical lines
    for ( let i = 0, j = 0, k = -halfLength; i <= this.widthDivisions; i++, k += step ) {

      // create a vertex at either end of the  line
      vertices.push( -halfWidth, this.height, k, halfWidth, this.height, k );

      const color = ( i === widthCenter ) ? this.colorCenterLine : this.colorGrid;

      // push the color details twice (once for each vertex)
      colors.push( ...color, ...color );

    }

    // horizontal lines
    for ( let i = 0, k = -halfWidth; i <= lengthDivisions; i++, k += step ) {

      vertices.push( k, this.height, -halfLength, k, this.height, halfLength );

      const color = ( i === lengthCenter ) ? this.colorCenterLine : this.colorGrid;

      colors.push( ...color, ...color );

    }

    const geometry = new THREE.BufferGeometry();
    geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    geometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

    const material = new THREE.LineBasicMaterial( { vertexColors: THREE.VertexColors } );

    this.group.add( new THREE.LineSegments( geometry, material ) );

  }

  initCenterCircle() {

    const geometry = new THREE.CircleBufferGeometry( 13.5, 64 );
    geometry.rotateX( -Math.PI / 2 );
    geometry.translate( 0, this.height, 0 );
    const material = new THREE.LineBasicMaterial( { color: this.colorGrid } );
    const edges = new THREE.EdgesGeometry( geometry );

    const line = new THREE.LineSegments( edges, material );

    this.group.add( line );

  }

  initCoords() {

    const position = 40;

    const geometry = new THREE.CircleBufferGeometry( 2, 32 );
    geometry.rotateX( -Math.PI / 2 );
    geometry.translate( 0, this.height, 0 );

    const material = new THREE.MeshBasicMaterial( { color: this.colorCenterLine } );

    const center = new THREE.Mesh( geometry, material );
    center.position.set( 0, 0, 0 );

    const upperLeft = new THREE.Mesh( geometry, material );
    upperLeft.position.set( position, 0, -position );

    this.group.add( center, upperLeft );

  }

  initText() {

    loaders.fontLoader( '/assets/fonts/json/droid_sans_mono_regular.typeface.json' ).then( ( font ) => {

      const centerText = createTextMesh( font, '(0,0)' );
      centerText.position.set( 3, 0, -2 );

      const upperLeftText = createTextMesh( font, '(-40,40)' );
      upperLeftText.position.set( -43, 0, -38 );

      const upperRightText = createTextMesh( font, '(40,40)' );
      upperRightText.position.set( 43, 0, -38 );

      const lowerLeftText = createTextMesh( font, '(-40,-40)' );
      lowerLeftText.position.set( -43, 0, 38 );

      const lowerRightText = createTextMesh( font, '(40,-40)' );
      lowerRightText.position.set( 43, 0, 38 );

      this.group.add( centerText, upperLeftText, upperRightText, lowerLeftText, lowerRightText );

    } );

  }

}
