import * as THREE from 'three';
import dat from '../../vendor/dat.gui.js';

export default class LightHelperExtended {
  constructor( light, showHelper = true ) {
    if ( !light.isLight ) {
      console.error( 'LightHelperExtended: object is not a light!' );
      return;
    }

    this.light = light;

    this.type = this.getType();
    if ( this.type === '' ) {
      console.error( 'LightHelperExtended: unsupported light type!' );
      return;
    }

    if ( showHelper && !light.parent && this.type !== 'Ambient' ) {
      console.warn( 'LightHelperExtended: to show light helper add the light to the scene first.' );
    } else if ( showHelper ) {
      light.parent.add( new THREE[ this.type + 'LightHelper']( this.light ) );
    }
  }

  getType() {
    if ( this.light.isAmbientLight ) return 'Ambient';
    else if ( this.light.isDirectionalLight ) return 'Directional';
    else if ( this.light.isHemisphereLight ) return 'Hemisphere';
    else if ( this.light.isPointLight ) return 'Point';
    else if ( this.light.isRectAreaLight ) return 'RectArea';
    else if ( this.light.isSpotLight ) return 'Spot';
    return ''; // unsupported light
  }
}