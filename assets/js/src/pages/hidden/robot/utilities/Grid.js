import * as THREE from 'three';
import loaders from './loaders.js';
import canvas from '../Canvas.js';

const createTextMesh = ( font, text, color ) => {

  color = ( color === undefined ) ? 0xeeeeee : color;

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

    canvas.app.scene.add( this.group );

    this.group.visible = false;

    this.initGrid();
    this.initCenterCircle();
    this.initCoords();

  }

  set enabled( bool ) {

    this.group.visible = bool;

  }

  init( position ) {

    this.initArrow( position );
    this.initText( position );

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
    const height = this.height + 0.1;

    const geometry = new THREE.CircleBufferGeometry( 2, 32 );
    geometry.rotateX( -Math.PI / 2 );
    geometry.translate( 0, height, 0 );

    const material = new THREE.MeshBasicMaterial( { color: this.colorCenterLine } );

    const center = new THREE.Mesh( geometry, material );
    center.position.set( 0, 0, 0 );

    const upperLeft = new THREE.Mesh( geometry, material );
    upperLeft.position.set( -position, 0, -position );

    const upperRight = new THREE.Mesh( geometry, material );
    upperRight.position.set( position, 0, -position );

    const lowerLeft = new THREE.Mesh( geometry, material );
    lowerLeft.position.set( -position, 0, position );

    const lowerRight = new THREE.Mesh( geometry, material );
    lowerRight.position.set( position, 0, position );

    this.group.add( center, upperLeft, upperRight, lowerLeft, lowerRight );

  }

  initText( position ) {

    const createBallText = () => {

      this.ballText = createTextMesh( this.font, '(' + position.x + ',' + position.z + ')', 0x000000 );
      this.ballText.position.set( position.x - 29.5, 2, position.z + 7 );

      this.group.add( this.ballText );

    };

    // if the font is already loaded then this is not the first time
    // the function has been called and only ball text needs updating
    if ( this.font ) {

      createBallText();

    } else {

      loaders.fontLoader( '/assets/fonts/json/droid_sans_mono_regular.typeface.json' ).then( ( font ) => {

        this.font = font;

        const centerText = createTextMesh( this.font, '(0,0)', this.colorCenterLine );
        centerText.position.set( 3, 0, -2 );

        const upperLeftText = createTextMesh( this.font, '(-40,40)', this.colorCenterLine );
        upperLeftText.position.set( -38, 0, -42 );

        const upperRightText = createTextMesh( this.font, '(40,40)', this.colorCenterLine );
        upperRightText.position.set( 43, 0, -42 );

        const lowerLeftText = createTextMesh( this.font, '(-40,-40)', this.colorCenterLine );
        lowerLeftText.position.set( -38, 0, 38 );

        const lowerRightText = createTextMesh( this.font, '(40,-40)', this.colorCenterLine );
        lowerRightText.position.set( 43, 0, 38 );

        this.group.add( centerText, upperLeftText, upperRightText, lowerLeftText, lowerRightText );

        createBallText();

      } );

    }

  }

  initArrow( position ) {

    const height = this.height + 3;

    // arrow
    const dir = new THREE.Vector3( 1, 0, 0 );
    const origin = new THREE.Vector3( position.x, height, position.z );
    this.arrowHelper = new THREE.ArrowHelper( dir, origin, 30, 0x000000 );

    this.group.add( this.arrowHelper );

    this.arrowHelper.cone.scale.set( 3, 15, 3 );
    this.arrowHelper.cone.updateMatrix();

    // circle around ball
    const geometry = new THREE.CircleBufferGeometry( 8, 64 );
    geometry.rotateX( -Math.PI / 2 );
    geometry.translate( 0, height, 0 );
    const material = new THREE.LineBasicMaterial( { color: 0x000000 } );
    const edges = new THREE.EdgesGeometry( geometry );

    this.ballCircle = new THREE.LineSegments( edges, material );
    this.ballCircle.position.set( position.x, 0, position.z );

    this.group.add( this.ballCircle );

  }

  update( directionVector ) {

    this.arrowHelper.setDirection( directionVector );

  }

  reset() {

    this.group.remove( this.arrowHelper, this.ballCircle, this.ballText );

  }

}
