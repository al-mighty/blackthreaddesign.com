import * as THREE from 'three';

const textureDispose = ( mat ) => {

  Object.keys( mat ).forEach( ( key ) => {

    const value = mat[key];

    if ( value instanceof THREE.Texture ) value.dispose();

  } );

};

const clearChildren = ( object ) => {

  for ( let i = 0; i < object.children.length; i++ ) {

    const node = object.children[ i ];

    // console.log( node );

    if ( node.userData.keepOnReset !== true ) {

      if ( node.children.length > 0 ) {

        clearChildren( node );

      }

      if ( node.geometry !== undefined ) {

        node.geometry.dispose();

      }
      if ( node.material !== undefined ) {

        // add check for multimaterials array here

        // textureDispose( node.material );
        // node.material.dispose();

      }


      object.remove( node );

    }

  }

};

export default ( app ) => {

  // console.log( 'WebGLRenderer.info before calling reset' );
  // console.log( app.renderer.info );

  document.querySelector( '#loading-overlay' ).classList.remove( 'hide' );
  document.querySelector( '#reveal-on-load' ).classList.add( 'hide' );

  document.querySelector( '#file-upload-form' ).classList.remove( 'hide' );
  document.querySelector( '#loading-bar' ).classList.add( 'hide' );
  document.querySelector( '.hide-on-load' ).classList.remove( 'hide' );

  clearChildren( app.scene );

  // console.log( 'WebGLRenderer.info after calling reset' );
  // console.log( app.renderer.info );

};
