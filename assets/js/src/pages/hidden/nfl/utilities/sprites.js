import * as THREE from 'three';
// import throttle from 'lodash.throttle';
import canvas from '../canvas.js';
import HTMLControl from './HTMLControl.js';
// import loaders from './loaders.js';


const start = new THREE.Vector3();
const end = new THREE.Vector3();

class Sprite {

  constructor( texture, attribute, target ) {

    this.attribute = attribute;
    this.target = target || new THREE.Vector3();

    const material = new THREE.SpriteMaterial( { map: texture, color: 0xff0000 } );

    this.object = new THREE.Sprite( material );

    // make sure the sprite is always drawn on top
    this.object.renderOrder = 999;

    this.object.scale.x = 50;
    this.object.scale.y = 50;

    this.enabled = false;
    this.visible = false;

    canvas.app.scene.add( this.object );

  }

  init() {

  }

  set visible( bool ) {

    this.object.visible = bool;

  }

  enable() {

    if ( this.enabled ) return;

    this.object.position.copy( this.target );
    this.enabled = true;
    this.visible = true;

    this.object.onBeforeRender = ( renderer ) => { renderer.clearDepth(); };

  }

  disable() {

    if ( !this.enabled ) return;

    this.object.onBeforeRender = () => {};
    this.enabled = false;
    this.visible = false;

  }

  update( delta ) {

    if ( !this.enabled ) return;

    end.copy( this.target );

    const distance = end.distanceTo( this.object.position );

    if ( Math.abs( distance ) > 0.001 ) {

      start.copy( this.object.position );

      const direction = start.sub( end ).normalize();

      direction.multiplyScalar( distance * delta );

      this.object.position.sub( direction );

    }

    // this.object.position.copy( this.target );

  }

}

// bypass problems with using 'this' in update function
const targets = {};
const positions = {};

class Sprites {

  constructor() {

    this.attributes = HTMLControl.attributes;

    this.loadTexture();

    this.sprites = {};

    this.arm = 'right';

  }

  init( player ) {

    this.player = player;

    this.initTargets();
    this.initPositions();
    this.initSprites();

  }

  loadTexture() {

    this.testTexture = new THREE.TextureLoader().load( '/assets/images/nfl/power_bar.png' );

  }

  // hold references to bones
  initTargets() {

    targets.rightArm = this.player.getObjectByName( 'mixamorigRightShoulder' );
    targets.leftArm = this.player.getObjectByName( 'mixamorigLeftShoulder' );

  }

  // getters to return positions in world space relative to target bones
  initPositions() {

    const self = this;

    const armPos = new THREE.Vector3();

    Object.defineProperties( positions, {

      arms: {

        get() {

          if ( self.arm === 'right' || self.arm === 'both' ) {

            targets.rightArm.getWorldPosition( armPos );
            armPos.x -= 60;

          } else {

            targets.leftArm.getWorldPosition( armPos );
            armPos.x = 60;

          }

          armPos.y -= 25;
          // armPos.z += 20;

          return armPos;

        },

      },

    } );

  }

  initSprites() {

    this.sprites.armStrength = new Sprite(
      this.testTexture,
      this.attributes[ 'arm-strength' ],
      positions.arms,
    );

  }

  // set to right, left or both
  setArm( arm ) {

    arm = arm || 'right';

    this.arm = arm;

  }

  hideAll() {

    Object.values( this.sprites ).forEach( ( sprite ) => {

      sprite.visible = false;

    } );

  }

  showAllEnabled() {

    Object.values( this.sprites ).forEach( ( sprite ) => {

      if ( sprite.enabled ) sprite.visible = true;

    } );

  }

  disableAll() {

    Object.values( this.sprites ).forEach( ( sprite ) => {

      sprite.disable();

    } );

  }

  enable( spriteName ) {

    // this.hideAll();

    const sprite = this.sprites[ spriteName ];

    if ( sprite === undefined ) {

      console.warn( 'Sprite ' + spriteName + ' doesn\'t exist!' );
      return;

    }

    sprite.enable();

  }

  disable( spriteName ) {

    const sprite = this.sprites[ spriteName ];

    if ( sprite === undefined ) {

      console.warn( 'Sprite ' + spriteName + ' doesn\'t exist!' );
      return;

    }

    sprite.disable();

  }

  update( delta ) {

    Object.values( this.sprites ).forEach( ( sprite ) => {

      sprite.update( delta );

    } );

    // weird hack (force positions.arms to update )
    positions.arms;
  }


}

const sprites = new Sprites();

export default sprites;
