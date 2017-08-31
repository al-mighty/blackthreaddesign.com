import throttle from 'lodash.throttle';
import HTMLControl from './HTMLControl.js';
import cameraControl from './cameraControl.js';

export default class AttributeControls {

  constructor() {

    this.attributes = HTMLControl.attributes;

    this.init();

  }

  init() {

    this.initSize();
    this.initAthleticAbility();
    this.initFootQuickness();
    this.initDominantHand();
    this.initReleaseQuickness();
    this.initDelivery();
    this.initMechanics();
    this.initArmStrength();
    this.initAnticipation();
    this.initAccuracyShort();
    this.initTouchShort();
    this.initAccuracyLong();
    this.initTouchLong();
    this.initDecisionMaking();
    this.initReadCoverage();
    this.initPocketPresence();
    this.initPoise();
    this.initMobility();
    this.initThrowOnMove();
    this.initRunningAbility();
    this.initClutchProduction();
    this.initAbilityToWin();

  }

  initAnimationControls( controls ) {

    this.animationControls = controls;

  }

  enableControls() {

    Object.values( this.attributes ).forEach( ( attribute ) => { attribute.disabled = false; } );

    this.attributes[ 'dominant-hand' ].left.disabled = false;
    this.attributes[ 'dominant-hand' ].right.disabled = false;
    this.attributes[ 'dominant-hand' ].both.disabled = false;

  }

  initSize() {

    this.attributes.size.addEventListener( 'input', throttle( ( e ) => {

      e.preventDefault();

      const animName = 'idle';

      const value = ( e.target.value === 1 ) ? 2 : e.target.value;

      const timeScale = Math.log10( value * 2 );

      this.animationControls.setTimeScale( timeScale, animName );

      this.animationControls.playAction( animName );

      cameraControl.focusOnWholeBody();

    }, 100 ), false );

  }

  initAthleticAbility() {

    this.attributes[ 'athletic-ability' ].addEventListener( 'input', throttle( ( e ) => {

      e.preventDefault();

      const animName = 'catch_2';

      const value = ( e.target.value === 1 ) ? 2 : e.target.value;

      const timeScale = Math.log10( value * 2 );

      this.animationControls.setTimeScale( timeScale, animName );

      this.animationControls.playAction( animName );

    }, 100 ), false );

  }

  initFootQuickness() {

    this.attributes[ 'foot-quickness' ].addEventListener( 'input', throttle( ( e ) => {

      e.preventDefault();

      const animName = 'catch_3';

      const value = ( e.target.value === 1 ) ? 2 : e.target.value;

      const timeScale = Math.log10( value * 2 );

      this.animationControls.setTimeScale( timeScale, animName );

      this.animationControls.playAction( animName );

    }, 100 ), false );

  }

  initDominantHand() {

    this.attributes[ 'dominant-hand' ].left.addEventListener( 'click', throttle( ( e ) => {

      e.preventDefault();

      console.log( e );

    }, 100 ), false );

    this.attributes[ 'dominant-hand' ].right.addEventListener( 'click', throttle( ( e ) => {

      e.preventDefault();
      console.log( e );

    }, 100 ), false );

    this.attributes[ 'dominant-hand' ].both.addEventListener( 'click', throttle( ( e ) => {

      e.preventDefault();

      console.log( e );

    }, 100 ), false );

  }

  initReleaseQuickness() {

    this.attributes[ 'release-quickness' ].addEventListener( 'input', throttle( ( e ) => {

      e.preventDefault();

      const animName = 'hike';

      const value = ( e.target.value === 1 ) ? 2 : e.target.value;

      const timeScale = Math.log10( value * 2 );

      this.animationControls.setTimeScale( timeScale, animName );

      this.animationControls.playAction( animName );

    }, 100 ), false );

  }

  initDelivery() {

    this.attributes.delivery.addEventListener( 'input', throttle( ( e ) => {

      e.preventDefault();

      const animName = 'pass';

      const value = ( e.target.value === 1 ) ? 2 : e.target.value;

      const timeScale = Math.log10( value * 2 );

      this.animationControls.setTimeScale( timeScale, animName );

      this.animationControls.playAction( animName );

    }, 100 ), false );

  }

  initMechanics() {

    this.attributes.mechanics.addEventListener( 'input', throttle( ( e ) => {

      e.preventDefault();

      const animName = 'stance';

      const value = ( e.target.value === 1 ) ? 2 : e.target.value;

      const timeScale = Math.log10( value * 2 );

      this.animationControls.setTimeScale( timeScale, animName );

      this.animationControls.playAction( animName );

    }, 100 ), false );

  }

  initArmStrength() {

    this.attributes[ 'arm-strength' ].addEventListener( 'input', throttle( ( e ) => {

      e.preventDefault();

      const animName = 'idle';

      const value = ( e.target.value === 1 ) ? 2 : e.target.value;

      const timeScale = Math.log10( value * 2 );

      this.animationControls.setTimeScale( timeScale, animName );

      this.animationControls.playAction( animName );

      cameraControl.focusOnUpperBody();

    }, 100 ), false );

  }

  initAnticipation() {

    this.attributes.anticipation.addEventListener( 'input', throttle( ( e ) => {

      e.preventDefault();

      const animName = 'on_front_to_stand';

      const value = ( e.target.value === 1 ) ? 2 : e.target.value;

      const timeScale = Math.log10( value * 2 );

      this.animationControls.setTimeScale( timeScale, animName );

      this.animationControls.playAction( animName );

    }, 100 ), false );

  }

  initAccuracyShort() {

    this.attributes[ 'accuracy-short' ].addEventListener( 'input', throttle( ( e ) => {

      e.preventDefault();

      const animName = 'on_back_to_stand';

      const value = ( e.target.value === 1 ) ? 2 : e.target.value;

      const timeScale = Math.log10( value * 2 );

      this.animationControls.setTimeScale( timeScale, animName );

      this.animationControls.playAction( animName );

    }, 100 ), false );

  }

  initTouchShort() {

    this.attributes[ 'touch-short' ].addEventListener( 'input', throttle( ( e ) => {

      e.preventDefault();

      const animName = 'idle';

      const value = ( e.target.value === 1 ) ? 2 : e.target.value;

      const timeScale = Math.log10( value * 2 );

      this.animationControls.setTimeScale( timeScale, animName );

      this.animationControls.playAction( animName );

    }, 100 ), false );

  }

  initAccuracyLong() {

    this.attributes[ 'accuracy-long' ].addEventListener( 'input', throttle( ( e ) => {

      e.preventDefault();

      const animName = 'idle';

      const value = ( e.target.value === 1 ) ? 2 : e.target.value;

      const timeScale = Math.log10( value * 2 );

      this.animationControls.setTimeScale( timeScale, animName );

      this.animationControls.playAction( animName );

    }, 100 ), false );

  }

  initTouchLong() {

    this.attributes[ 'touch-long' ].addEventListener( 'input', throttle( ( e ) => {

      e.preventDefault();

      const animName = 'idle';

      const value = ( e.target.value === 1 ) ? 2 : e.target.value;

      const timeScale = Math.log10( value * 2 );

      this.animationControls.setTimeScale( timeScale, animName );

      this.animationControls.playAction( animName );

    }, 100 ), false );

  }

  initDecisionMaking() {

    this.attributes[ 'decision-making' ].addEventListener( 'input', throttle( ( e ) => {

      e.preventDefault();

      const animName = 'idle';

      const value = ( e.target.value === 1 ) ? 2 : e.target.value;

      const timeScale = Math.log10( value * 2 );

      this.animationControls.setTimeScale( timeScale, animName );

      this.animationControls.playAction( animName );

    }, 100 ), false );

  }

  initReadCoverage() {

    this.attributes[ 'read-coverage' ].addEventListener( 'input', throttle( ( e ) => {

      e.preventDefault();

      const animName = 'idle';

      const value = ( e.target.value === 1 ) ? 2 : e.target.value;

      const timeScale = Math.log10( value * 2 );

      this.animationControls.setTimeScale( timeScale, animName );

      this.animationControls.playAction( animName );

    }, 100 ), false );

  }

  initPocketPresence() {

    this.attributes[ 'pocket-presence' ].addEventListener( 'input', throttle( ( e ) => {

      e.preventDefault();

      const animName = 'idle';

      const value = ( e.target.value === 1 ) ? 2 : e.target.value;

      const timeScale = Math.log10( value * 2 );

      this.animationControls.setTimeScale( timeScale, animName );

      this.animationControls.playAction( animName );

    }, 100 ), false );

  }

  initPoise() {

    this.attributes.poise.addEventListener( 'input', throttle( ( e ) => {

      e.preventDefault();

      const animName = 'idle';

      const value = ( e.target.value === 1 ) ? 2 : e.target.value;

      const timeScale = Math.log10( value * 2 );

      this.animationControls.setTimeScale( timeScale, animName );

      this.animationControls.playAction( animName );

    }, 100 ), false );

  }

  initMobility() {

    this.attributes.mobility.addEventListener( 'input', throttle( ( e ) => {

      e.preventDefault();

      const animName = 'idle';

      const value = ( e.target.value === 1 ) ? 2 : e.target.value;

      const timeScale = Math.log10( value * 2 );

      this.animationControls.setTimeScale( timeScale, animName );

      this.animationControls.playAction( animName );

    }, 100 ), false );

  }

  initThrowOnMove() {

    this.attributes[ 'throw-on-move' ].addEventListener( 'input', throttle( ( e ) => {

      e.preventDefault();

      const animName = 'idle';

      const value = ( e.target.value === 1 ) ? 2 : e.target.value;

      const timeScale = Math.log10( value * 2 );

      this.animationControls.setTimeScale( timeScale, animName );

      this.animationControls.playAction( animName );

    }, 100 ), false );

  }

  initRunningAbility() {

    this.attributes[ 'running-ability' ].addEventListener( 'input', throttle( ( e ) => {

      e.preventDefault();

      const value = ( e.target.value === 1 ) ? 2 : e.target.value;

      const timeScale = Math.log10( value * 2 );

      this.animationControls.setTimeScale( timeScale, 'run' );

      this.animationControls.playAction( 'run' );

    }, 100 ), false );

  }

  initClutchProduction() {

    this.attributes[ 'clutch-production' ].addEventListener( 'input', throttle( ( e ) => {

      e.preventDefault();

      const animName = 'idle';

      const value = ( e.target.value === 1 ) ? 2 : e.target.value;

      const timeScale = Math.log10( value * 2 );

      this.animationControls.setTimeScale( timeScale, animName );

      this.animationControls.playAction( animName );

    }, 100 ), false );

  }

  initAbilityToWin() {

    this.attributes[ 'ability-to-win' ].addEventListener( 'input', throttle( ( e ) => {

      e.preventDefault();

      const animName = 'idle';

      const value = ( e.target.value === 1 ) ? 2 : e.target.value;

      const timeScale = Math.log10( value * 2 );

      this.animationControls.setTimeScale( timeScale, animName );

      this.animationControls.playAction( animName );

    }, 100 ), false );

  }

}
