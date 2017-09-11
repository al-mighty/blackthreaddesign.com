import * as THREE from 'three';
import throttle from 'lodash.throttle';
import canvas from '../canvas.js';
import HTMLControl from './HTMLControl.js';

const start = new THREE.Vector3();
const end = new THREE.Vector3();

// holds reference to the positions of the bones that are targets for the sprite
const targets = {

  default: new THREE.Vector3(),

};

// positions of the actual sprite, calculated relative to the bone. Note that these are only
// recalculated each time the relevant target it used, so they must always be used in pairs,
// with the target being accessed first
const positions = {

  default: new THREE.Vector3(),

};


class Sprite {

  constructor( texture, attribute, name ) {

    // clone the texture since each sprite will need to control the offset individually
    this.texture = texture;
    this.attribute = attribute;
    this.name = name || 'default';

    this.initLine();
    this.initObject();
    this.initListener();

    this.setPosition();

    canvas.app.scene.add( this.object, this.line );

    this.visible = false;

  }

  initObject() {

    this.spriteMat = new THREE.SpriteMaterial( { map: this.texture, transparent: true, opacity: 0 } );

    this.object = new THREE.Sprite( this.spriteMat );

    // make sure the sprite is always drawn on top
    this.object.renderOrder = 999;
    this.object.onBeforeRender = ( renderer ) => { renderer.clearDepth(); };

    this.object.scale.x = 50;
    this.object.scale.y = 50;

  }

  initLine() {

    this.lineMat = new THREE.LineBasicMaterial( { color: 0x000000, transparent: true, opacity: 0 } );
    this.lineGeo = new THREE.Geometry();
    this.lineGeo.vertices.push( targets[ this.name ].clone(), positions[ this.name ].clone() );
    this.line = new THREE.Line( this.lineGeo, this.lineMat );

  }

  initListener() {

    this.attribute.addEventListener( 'input', throttle( ( e ) => {

      e.preventDefault();

      this.updateValue( e.target.value );

    }, 100 ), false );

  }

  updateValue( value ) {

    const offset = ( value - 1 ) / 10;

    this.texture.offset.set( offset, 0 );

  }

  set visible( bool ) {

    this.object.visible = bool;
    this.line.visible = bool;

  }

  get visible() {

    return this.object.visible;

  }

  // directly set the position to prevent jumps when fading in
  setPosition() {

    this.lineGeo.vertices[0].copy( targets[ this.name ] );
    this.object.position.copy( positions[ this.name ] );
    this.lineGeo.vertices[1].copy( positions[ this.name ] );
    this.lineGeo.verticesNeedUpdate = true;

  }

  fadeIn() {

    if ( this.visible ) return;

    this.setPosition();
    this.visible = true;

    clearInterval( this.fadeIntervalID );

    let opacity = this.lineMat.opacity;

    // fade in over 1 seconds
    const step = 1 / 60;

    this.fadeIntervalID = setInterval( () => {

      if ( opacity <= 1 ) {

        console.log( 'fadeIn' );

        opacity += step;
        this.lineMat.opacity = opacity;
        this.spriteMat.opacity = opacity;

      } else {

        clearInterval( this.fadeIntervalID );

      }

    }, 17 );
  }

  fadeOut() {

    if ( !this.visible ) return;

    clearInterval( this.fadeIntervalID );

    let opacity = this.lineMat.opacity;

    // fade out over 1 seconds
    const step = 1 / 60;

    this.fadeIntervalID = setInterval( () => {

      if ( opacity >= 0 ) {

        opacity -= step;
        this.lineMat.opacity = opacity;
        this.spriteMat.opacity = opacity;

      } else {

        clearInterval( this.fadeIntervalID );
        this.visible = false;

      }

    }, 17 );
  }

  update( delta ) {

    if ( this.visible === false ) return;

    // update line origin
    this.lineGeo.vertices[0].copy( targets[ this.name ] );

    // update sprite position
    end.copy( positions[ this.name ] );

    const distance = end.distanceTo( this.object.position );

    if ( Math.abs( distance ) > 0.01 ) {

      start.copy( this.object.position );

      const direction = start.sub( end ).normalize();

      direction.multiplyScalar( distance * delta );

      this.object.position.sub( direction );

    }

    // this.object.position.copy( positions[ this.name ] );

    // update line end
    this.lineGeo.vertices[1].copy( this.object.position );
    this.lineGeo.verticesNeedUpdate = true;

  }

}

class Sprites {

  constructor() {

    this.attributes = HTMLControl.attributes;

    this.loadTexture();

    this.sprites = {};

    this.arm = 'right';

  }

  init( player ) {

    this.player = player;

    this.initPositions();
    this.initTargets();

    this.initSprites();

  }

  loadTexture() {

    this.texture = new THREE.TextureLoader().load( '/assets/images/nfl/power_bar_sheet.png' );
    this.texture.wrapS = this.texture.wrapT = THREE.RepeatWrapping;
    // texture is a sprite sheet 10 frames wide and 1 tall
    this.texture.repeat.set( 0.1, 1 );
    // initialize the texture to the middle frame
    this.texture.offset.set( 0.4, 0 );

  }

  // hold references to bones
  initTargets() {

    const self = this;
    const pos = new THREE.Vector3();

    targets.rightArm = this.player.getObjectByName( 'mixamorigRightShoulder' );
    targets.leftArm = this.player.getObjectByName( 'mixamorigLeftShoulder' );

    Object.defineProperties( targets, {

      armStrength: {

        get: () => {

          if ( self.arm === 'right' || self.arm === 'both' ) {

            targets.rightArm.getWorldPosition( pos );
            positions.armStrength.copy( pos );
            positions.armStrength.x -= 45;

          } else {

            targets.leftArm.getWorldPosition( pos );
            positions.armStrength.copy( pos );
            positions.armStrength.x += 45;

          }

          pos.y -= 25;
          positions.armStrength.y += 15;

          return pos;

        },

      },

    } );

  }

  initPositions() {

    positions.armStrength = new THREE.Vector3();

  }

  initSprites() {

    this.sprites.armStrength = new Sprite(
      this.texture,
      this.attributes[ 'arm-strength' ],
      'armStrength',
    );

  }

  // set to right, left or both
  setArm( arm ) {

    arm = arm || 'right';

    this.arm = arm;

  }

  hideAll() {

    Object.values( this.sprites ).forEach( ( sprite ) => {

      sprite.fadeOut();

    } );

  }

  hideAllExcept( spriteName ) {

    Object.values( this.sprites ).forEach( ( sprite ) => {

      if ( sprite.name === spriteName ) sprite.fadeIn();
      else sprite.fadeOut();

    } );

  }

  update( delta ) {

    Object.values( this.sprites ).forEach( ( sprite ) => {

      sprite.update( delta );

    } );

  }


}

const sprites = new Sprites();

export default sprites;
