import throttle from 'lodash.throttle';
import OnLoadCallbacks from './onLoadCallbacks.js';

document.querySelector( '#demo1' ).addEventListener( 'click', throttle( () => {

  OnLoadCallbacks.onFBXLoad( '/assets/models/loader/xsi_man_skinning.fbx' );
  OnLoadCallbacks.onFBXLoad( '/assets/models/loader/nurbs.fbx' );

}, 3000 ) );

document.querySelector( '#demo2' ).addEventListener( 'click', throttle( () => {

  OnLoadCallbacks.onGLTFLoad( '/assets/models/loader/CesiumMan.glb' );

}, 3000 ) );

document.querySelector( '#demo3' ).addEventListener( 'click', throttle( () => {

  OnLoadCallbacks.onJSONBufferGeometryLoad( '/assets/models/loader/suzanne.json' );

}, 3000 ) );

document.querySelector( '#demo4' ).addEventListener( 'click', throttle( () => {

  OnLoadCallbacks.onJSONObjectLoad( '/assets/models/loader/pump.json' );

}, 3000 ) );

document.querySelector( '#demo5' ).addEventListener( 'click', throttle( () => {

  OnLoadCallbacks.onJSONObjectLoad( '/assets/models/loader/pump.json' );

}, 3000 ) );

