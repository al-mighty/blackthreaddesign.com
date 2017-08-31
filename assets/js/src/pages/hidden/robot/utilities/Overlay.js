// Simple wrapper for Grid and HUD
import throttle from 'lodash.throttle';
import * as THREE from 'three';

import Grid from './Grid.js';
import HUD from './HUD.js';
import HTMLControl from './HTMLControl.js';


export default class Overlay {

  constructor() {

    this.grid = new Grid( 160, 100, 10, 0xeeeeee, 0x888888 );

    this.hud = new HUD();

    this.initListeners();

  }

  set enabled( bool ) {

    this.grid.enabled = bool;
    this.hud.enabled = bool;

  }

  init( position ) {

    this.grid.init( position );
    this.hud.init( position );
  }

  render() {

    this.hud.render();

  }

  update( slope ) {

    const angle = Math.atan( slope );
    const x = Math.cos( angle );
    const y = Math.sin( angle );

    // direction of arrow is in 2D x, y plane (vertical to screen)
    this.hud.update( new THREE.Vector3( x, y, 0 ).normalize() );

    // direction of arrow is in 3D x, -z plane (into screen)
    this.grid.update( new THREE.Vector3( x, 0, -y ).normalize() );

  }

  reset() {

    this.hud.reset();
    this.grid.reset();

  }

  resize() {

    throttle( () => { this.hud.resize(); }, 250 );

  }

  initListeners() {

    HTMLControl.controls.slope.addEventListener( 'input', ( e ) => {

      e.preventDefault();

      this.update( e.target.value );

    }, false );

    HTMLControl.controls.showGrid.addEventListener( 'click', ( e ) => {

      this.enabled = e.target.checked;

    }, false );

  }

}
