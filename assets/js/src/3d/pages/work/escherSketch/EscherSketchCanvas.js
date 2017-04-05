import * as THREE from 'three';

import App from '../../../App/App.js';

import './escherSketchCanvasSetup.js';

import StatisticsOverlay from '../../../App/StatisticsOverlay.js';

import RegularHyperbolicTesselation from './utilities/RegularHyperbolicTesselation.js';


export default class EscherSketchCanvas {

  constructor( showStats ) {

    const self = this;

    self.container = document.querySelector( '.canvas-container' );

    self.app = new App( document.querySelector( '#escherSketch-canvas' ) );

    self.app.camera.position.set( 0, 0, 150 );

    // TODO: not working in Edge
    let statisticsOverlay;
    if ( showStats ) statisticsOverlay = new StatisticsOverlay( self.app, self.container );

    self.initPQControls();

    self.initSpec();

    self.initMaterials();

    this.buildTiling();

    self.app.onUpdate = function () {

      if ( showStats ) statisticsOverlay.updateStatistics( self.app.delta );

    };

    self.app.onWindowResize = function () {

    };

    self.app.play();

  }

  initPQControls() {
    const self = this;

    const p = document.querySelector( '#p-value' );
    const q = document.querySelector( '#q-value' );

    const pValue = () => parseInt( p.innerHTML, 10 );

    const qValue = () => parseInt( q.innerHTML, 10 );

    const observer = new MutationObserver( ( ) => {

      const newP = pValue();
      const newQ = qValue();

      if ( this.spec.p === newP && this.spec.q === newQ ) return;

      this.spec.p = newP;
      this.spec.q = newQ;

      // TODO: display a warning here saying p, q can't both be 4
      if ( pValue() === 4 && qValue() === 4 ) return; 

      // Add a slight delay before rebuilding the tiling to allow the displayed
      // value p / q to update
      setTimeout( () => self.buildTiling(), 200 );

    } );

    observer.observe( p, { childList: true } );
    observer.observe( q, { childList: true } );

  }

  buildTiling() {
    this.clearTiling();

    console.time( 'Generate Tiling' );
    const tiling = new RegularHyperbolicTesselation( this.spec ).generateTiling( false );
    console.timeEnd( 'Generate Tiling' );

    console.time( 'Draw Tiling' );
    this.generatePolygonArray( tiling );
    console.timeEnd( 'Draw Tiling' );
  }

  clearTiling() {
    while ( this.app.scene.children.length > 0 ) {
      const object = this.app.scene.children[0];

      if ( object.type === 'Mesh' ) {
        object.geometry.dispose();
        this.app.scene.remove( object );
      }

    }
  }

  initSpec() {
    const imagesPath = '/assets/images/work/escherSketch/tiles/';

    this.spec = {
      wireframe: false,
      p: 6,
      q: 6,
      radius: 100,
      textures: [`${imagesPath}fish-black.png`, `${imagesPath}fish-white.png`],
      edgeAdjacency: [ // array of length p
          [
            1, // edge_0 orientation (-1 = reflection, 1 = rotation)
            5, //edge_0 adjacency (range p - 1)
          ],
          [1, 4], // edge_1 orientation, adjacency
          [1, 3], [1, 2], [1, 1], [1, 0]
        ],
      minPolygonSize: 0.05,
    };
  }

  createPolygon( polygon ) {
    this.spec.radius = 100;
    const divisions = polygon.numDivisions || 1;
    const p = 1 / divisions;
    const geometry = new THREE.Geometry();
    geometry.faceVertexUvs[0] = [];

    if ( polygon.needsResizing ) {
      for ( let i = 0; i < polygon.mesh.length; i++ ) {
        geometry.vertices.push(
          new THREE.Vector3( polygon.mesh[i].x * this.spec.radius, polygon.mesh[i].y * this.spec.radius, 0 ),
        );
      }
    } else {
      geometry.vertices = polygon.mesh;
    }


    let edgeStartingVertex = 0;
    // loop over each interior edge of the polygon's subdivion mesh
    for ( let i = 0; i < divisions; i++ ) {
      // edge divisions reduce by one for each interior edge
      const m = divisions - i + 1;
      geometry.faces.push(
        new THREE.Face3(
          edgeStartingVertex,
          edgeStartingVertex + m,
          edgeStartingVertex + 1,
        ) );
      geometry.faceVertexUvs[0].push(
        [
          new THREE.Vector3( i * p, 0, 0 ),
          new THREE.Vector3( ( i + 1 ) * p, 0, 0 ),
          new THREE.Vector3( ( i + 1 ) * p, p, 0 ),
        ] );

      // range m-2 because we are ignoring the edges first vertex which was
      // used in the previous faces.push
      for ( let j = 0; j < m - 2; j++ ) {
        geometry.faces.push(
          new THREE.Face3(
            edgeStartingVertex + j + 1,
            edgeStartingVertex + m + j,
            edgeStartingVertex + m + 1 + j,
          ) );
        geometry.faceVertexUvs[0].push(
          [
            new THREE.Vector3( ( i + 1 + j ) * p, ( 1 + j ) * p, 0 ),
            new THREE.Vector3( ( i + 1 + j ) * p, j * p, 0 ),
            new THREE.Vector3( ( i + j + 2 ) * p, ( j + 1 ) * p, 0 ),
          ] );
        geometry.faces.push(
          new THREE.Face3(
            edgeStartingVertex + j + 1,
            edgeStartingVertex + m + 1 + j,
            edgeStartingVertex + j + 2,
          ) );
        geometry.faceVertexUvs[0].push(
          [
            new THREE.Vector3( ( i + 1 + j ) * p, ( 1 + j ) * p, 0 ),
            new THREE.Vector3( ( i + 2 + j ) * p, ( j + 1 ) * p, 0 ),
            new THREE.Vector3( ( i + j + 2 ) * p, ( j + 2 ) * p, 0 ),
          ] );
      }
      edgeStartingVertex += m;
    }
    
    const mesh = new THREE.Mesh( geometry, this.pattern.materials[polygon.materialIndex] );
    this.app.scene.add( mesh );
  }

  generatePolygonArray( array ) {
    for ( let i = 0; i < array.length; i++ ) {
      this.createPolygon( array[i] );
    }
  }

  initMaterials( ) {
    this.pattern = new THREE.MultiMaterial();

    for ( let i = 0; i < this.spec.textures.length; i++ ) {
      const material = new THREE.MeshBasicMaterial( {
        color: 0xffffff,
        wireframe: this.spec.wireframe,
        side: THREE.DoubleSide,
      } );

      const texture = new THREE.TextureLoader().load( this.spec.textures[i] );

      material.map = texture;
      this.pattern.materials.push( material );
    }
  }

}