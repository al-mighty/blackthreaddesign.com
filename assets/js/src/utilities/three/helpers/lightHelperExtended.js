import * as THREE from 'three';
import dat from 'vendor/dat.gui.js';

export default class LightHelperExtended {

  constructor( light, showHelper = true, showGUI = true ) {

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

    if ( showHelper && this.type !== 'Ambient' ) this.initHelper();

    if ( showGUI ) this.buildGUI();

    // this.getObjectKeys();

  }

  initHelper() {
    if ( !this.light.parent ) {

      console.warn( 'LightHelperExtended: to show light helper add the light to the scene first.' );

    } else {

      this.helper = new THREE[ this.type + 'LightHelper']( this.light );
      this.light.parent.add( this.helper );

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

  // Helper function to check that all parameter are covered.
  getObjectKeys() {
    Object.keys( this.light ).forEach( ( key ) => {

      if ( Object.prototype.hasOwnProperty.call( this.light, key ) ) {

        console.log( key );

      }

    } );
  }

  buildGUI() {
    if ( typeof dat.GUI !== 'function' ) {
      console.warn( 'LightHelperExtended: can\'t find dat.GUI!' );
      return;
    }

    if ( !window.THREEHelperExtendedGUI ) window.THREEHelperExtendedGUI = new dat.GUI();

    this.guiFolder = window.THREEHelperExtendedGUI.addFolder( this.type + 'Light' );
    this.guiFolder.open();

    this.initInfoGUI( this.light );
    this.iniTransformGUI( this.light );
    this.initLightGUI( this.light );

  }

  initInfoGUI( object ) {
    const info = this.guiFolder.addFolder( 'Info' );
    info.open();

    const params = {
      uuid: object.uuid,
      name: object.name,
      frustumCulled: object.frustumCulled,
      layers: object.layers,
      matrixAutoUpdate: object.matrixAutoUpdate,
      matrixWorldNeedsUpdate: object.matrixWorldNeedsUpdate,
      visible: object.visible,
      castShadow: object.castShadow,
      receiveShadow: object.receiveShadow,
      renderOrder: object.renderOrder,
    };

    info.add( params, 'uuid' );
    info.add( params, 'name' );
    info.add( params, 'frustumCulled' ).onChange( ( val ) => { object.frustumCulled = val; } );

    // info.add( params, 'layers' ).onChange( ( val ) => { object.layers = val; } );

    info.add( params, 'matrixAutoUpdate' ).onChange( ( val ) => { object.matrixAutoUpdate = val; } );

    info.add( params, 'matrixWorldNeedsUpdate' ).onChange( ( val ) => {
      object.matrixWorldNeedsUpdate = val;
      params.matrixWorldNeedsUpdate = false; // resets to false after use

    } );
    info.add( params, 'visible' ).onChange( ( val ) => { object.visible = val; } );
    info.add( params, 'castShadow' ).onChange( ( val ) => { object.castShadow = val; } );
    // info.add( params, 'receiveShadow' ).onChange( ( val ) => { object.receiveShadow = val; } );
    info.add( params, 'renderOrder' ).onChange( ( val ) => { object.renderOrder = val; } );

  }

  iniTransformGUI( object ) {
    const transform = this.guiFolder.addFolder( 'Transform' );
    transform.open();

    const params = {
      'position.x': object.position.x,
      'position.y': object.position.y,
      'position.z': object.position.z,
      'scale.x': object.scale.x,
      'scale.y': object.scale.y,
      'scale.z': object.scale.z,
    };



    const setRotationParams = () => {
      params[ 'rotation.x' ] = object.rotation.x;
      params[ 'rotation.y' ] = object.rotation.y;
      params[ 'rotation.z' ] = object.rotation.z;
      params[ 'quaternion.x' ] = object.quaternion.x;
      params[ 'quaternion.y' ] = object.quaternion.y;
      params[ 'quaternion.z' ] = object.quaternion.z;
      params[ 'quaternion.w' ] = object.quaternion.w;
    };

    setRotationParams();

    const updateQuaternionParams = () => {
      params[ 'quaternion.x' ] = object.quaternion.x;
      params[ 'quaternion.y' ] = object.quaternion.y;
      params[ 'quaternion.z' ] = object.quaternion.z;
      params[ 'quaternion.w' ] = object.quaternion.w;
    }

    transform.add( params, 'position.x' ).step( 0.1 ).onChange( ( val ) => { object.position.x = val; } );
    transform.add( params, 'position.y' ).step( 0.1 ).onChange( ( val ) => { object.position.y = val; } );
    transform.add( params, 'position.z' ).step( 0.1 ).onChange( ( val ) => { object.position.z = val; } );

    transform.add( params, 'rotation.x', -Math.PI, Math.PI )
      .step( 0.05 )
      .listen()
      .onChange( ( val ) => { object.rotation.x = val; } );

    transform.add( params, 'rotation.y', -Math.PI, Math.PI )
      .step( 0.05 )
      .listen()
      .onChange( ( val ) => { object.rotation.y = val; } );

    transform.add( params, 'rotation.z', -Math.PI, Math.PI )
      .step( 0.05 )
      .listen()
      .onChange( ( val ) => { object.rotation.z = val; } );

    transform.add( params, 'quaternion.x' ).listen().step( 0.05 )
      // .onChange( ( val ) => { object.quaternion.x = val; } );

    transform.add( params, 'quaternion.y' )
      .step( 0.05 )
      .listen()
      // .onChange( ( val ) => { object.quaternion.y = val; } );

    transform.add( params, 'quaternion.z' )
      .step( 0.05 )
      .listen()
      // .onChange( ( val ) => { object.quaternion.z = val; } );

    transform.add( params, 'quaternion.w' )
      .step( 0.05 )
      .listen()
      // .onChange( ( val ) => { object.quaternion.w = val; } );

    transform.add( params, 'scale.x' ).step( 0.1 ).onChange( ( val ) => { object.scale.x = val; } );
    transform.add( params, 'scale.y' ).step( 0.1 ).onChange( ( val ) => { object.scale.y = val; } );
    transform.add( params, 'scale.z' ).step( 0.1 ).onChange( ( val ) => { object.scale.z = val; } );

  }

  initLightGUI( light ) {

    const lightParams = this.guiFolder.addFolder( 'Light Params' );
    lightParams.open();

    // ALL LIGHTS
    const params = {

      color: light.color.getHex(),
      intensity: light.intensity,

    };

    lightParams.addColor( params, 'color' ).onChange( ( val ) => { light.color.setHex( val ); } );
    lightParams.add( params, 'intensity', 0 ).step( 0.1 ).onChange( ( val ) => { light.intensity = val; } );

    // Properties shared by multiple lights will be added with Object.prototype.hasOwnProperty.call( light, key )
    // - this will allow for forward compatibility of properties get added to light ( e.g. decay to RectAreaLight)

    if ( Object.prototype.hasOwnProperty.call( light, 'decay' ) ) {

      params.decay = light.decay;

      lightParams.add( params, 'decay', 0 ).step( 0.1 ).onChange( ( val ) => { light.decay = val; } );

    }

    if ( Object.prototype.hasOwnProperty.call( light, 'distance' ) ) {

      params.distance = light.distance;

      lightParams.add( params, 'distance', 0 ).step( 0.1 ).onChange( ( val ) => {
        light.distance = val;
        if ( this.helper ) this.helper.update();
      } );

    }

    if ( Object.prototype.hasOwnProperty.call( light, 'shadow' ) ) {

      // params.shadow = light.shadow;

      console.log( light.shadow );

    }

    if ( Object.prototype.hasOwnProperty.call( light, 'target' ) ) {

      if ( !light.target.parent ) {

        console.warn( 'LightHelperExtended: Light.target must be added to the scene if moved from default position (0, 0, 0).' );

      }

      params[ 'target.position.x' ] = light.target.position.x;
      params[ 'target.position.y' ] = light.target.position.y;
      params[ 'target.position.z' ] = light.target.position.z;

      lightParams.add( params, 'target.position.x' ).step( 0.1 ).onChange( ( val ) => {

        light.target.position.x = val;
        if ( this.helper ) this.helper.update();

      } );

      lightParams.add( params, 'target.position.y' ).step( 0.1 ).onChange( ( val ) => {

        light.target.position.y = val;
        if ( this.helper ) this.helper.update();

      } );

      lightParams.add( params, 'target.position.z' ).step( 0.1 ).onChange( ( val ) => {

        light.target.position.z = val;
        if ( this.helper ) this.helper.update();

      } );

    }

    if ( this.type === 'Spot' ) {

      params.angle = light.angle;
      params.penumbra = light.penumbra;

      lightParams.add( params, 'angle', 0, Math.PI / 2 ).step( 0.1 ).onChange( ( val ) => {
        light.angle = val;
        if ( this.helper ) this.helper.update();
      } );

      lightParams.add( params, 'penumbra', 0, 5 ).step( 0.1 ).onChange( ( val ) => { light.penumbra = val; } );

    }

    if ( this.type === 'Hemi' ) {

      params.groundColor = light.groundColor;

      lightParams.addColor( params, 'groundColor' ).onChange( ( val ) => { light.groundColor.setHex( val ); } );

    }


    if ( this.type === 'RectArea' ) {

      params.width = light.width;
      params.height = light.height;

      lightParams.add( params, 'width', 0 ).step( 0.1 ).onChange( ( val ) => {

        light.width = val;
        if ( this.helper ) this.helper.update();

      } );

      lightParams.add( params, 'height', 0 ).step( 0.1 ).onChange( ( val ) => {

        light.height = val;
        if ( this.helper ) this.helper.update();

      } );

    }
  }

}
