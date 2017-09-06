import * as THREE from 'three';
// import throttle from 'lodash.throttle';
import canvas from '../canvas.js';
import HTMLControl from './HTMLControl.js';
// import loaders from './loaders.js';

class Sprite {

  constructor( texture, attribute, target ) {

    this.attribute = attribute;
    this.positionTarget = target;

    const material = new THREE.SpriteMaterial( { map: texture, color: 0xff0000 } );

    this.object = new THREE.Sprite( material );
    this.object.frustumCulled = false;
    this.object.scale.x = 50;
    this.object.scale.y = 50;

    canvas.app.scene.add( this.object );

    this.enabled = false;

  }

  set visible( bool ) {

    this.object.visible = bool;

  }

  enable() {

    this.enabled = true;
    this.visible = true;

  }

  update( position ) {

    if ( !this.enabled ) return;

    this.object.position.copy( position );

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

    this.initTargets();
    this.initPositions();
    this.initSprites();

  }

  loadTexture() {

    this.testTexture = new THREE.TextureLoader().load( '/assets/images/nfl/power_bar.png' );

  }

  initTargets() {

    this.targets = {

      rightArm: this.player.getObjectByName( 'mixamorigRightShoulder' ),
      leftArm: this.player.getObjectByName( 'mixamorigLeftShoulder' ),

    };

  }

  initPositions() {

    const armPos = new THREE.Vector3();

    this.positions = {

      get arms() {

        console.log( this.arms)

        if ( this.arm === 'right' || this.arm === 'both' ) {

          console.log(this.targets, this.targets.rightArm)

          this.targets.rightArm.getWorldPosition( armPos );
          armPos.x += 25;

        } else {

          this.targets.leftArm.getWorldPosition( armPos );
          armPos.x -= 25;

        }

        armPos.y -= 25;

        return armPos;

      },

    };

  }

  initSprites() {

    this.sprites.armStrength = new Sprite( this.testTexture, this.attributes[ 'arm-strength' ], this.positions.arms );

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

    this.stopAnimation();

  }

  showAllEnabled() {

    Object.values( this.sprites ).forEach( ( sprite ) => {

      if ( sprite.enabled ) sprite.visible = true;

    } );

    this.animate();

  }

  enable( spriteName ) {

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

  animate() {

    this.animationFrameID = null;

    const update = () => {

      Object.values( this.sprites ).forEach( ( sprite ) => {

        if ( sprite.enabled ) sprite.update();

      } );

      this.animationFrameID = requestAnimationFrame( update );

    };

  }

  stopAnimation() {

    cancelAnimationFrame( this.animationFrameID );

  }

}

const sprites = new Sprites();

export default sprites;
