import throttle from 'lodash.throttle';
import OnLoadCallbacks from './onLoadCallbacks.js';
import Loaders from './Loaders';
import HTMLControl from './HTMLControl.js';

const loaders = new Loaders();

HTMLControl.demos.FBX.addEventListener( 'click', throttle( () => {

  OnLoadCallbacks.onFBXLoad( '/assets/models/loader/xsi_man_skinning.fbx' );
  OnLoadCallbacks.onFBXLoad( '/assets/models/loader/nurbs.fbx' );

}, 3000 ), false );

HTMLControl.demos.GLTF.addEventListener( 'click', throttle( ( e ) => {

  e.preventDefault();

  OnLoadCallbacks.onGLTFLoad( '/assets/models/loader/CesiumMan.glb' );

}, 3000 ), false );

HTMLControl.demos.JSONGeo.addEventListener( 'click', throttle( ( e ) => {

  e.preventDefault();

  OnLoadCallbacks.onJSONGeometryLoad( '/assets/models/loader/platform_geo.json' );

}, 3000 ), false );

HTMLControl.demos.JSONBuffer.addEventListener( 'click', throttle( ( e ) => {

  e.preventDefault();

  OnLoadCallbacks.onJSONBufferGeometryLoad( '/assets/models/loader/suzanne.json' );

}, 3000 ), false );

HTMLControl.demos.JSONScene.addEventListener( 'click', throttle( ( e ) => {

  e.preventDefault();

  OnLoadCallbacks.onJSONObjectLoad( '/assets/models/loader/pump.json' );

}, 3000 ), false );

HTMLControl.demos.Collada.addEventListener( 'click', throttle( ( e ) => {

  e.preventDefault();

  OnLoadCallbacks.onDAELoad( '/assets/models/loader/avatar.dae' );

}, 3000 ), false );

HTMLControl.demos.OBJ.addEventListener( 'click', throttle( ( e ) => {

  e.preventDefault();

  loaders.setMtlLoaderPath( '/assets/models/loader/' );

  const promise = loaders.mtlLoader( 'male02_dds.mtl' );

  promise.then( ( materials ) => {

    materials.preload();
    loaders.assignObjectLoaderMtls( materials.materials );

    OnLoadCallbacks.onOBJLoad( '/assets/models/loader/male02_dds.obj' );

  } );

}, 3000 ), false );

