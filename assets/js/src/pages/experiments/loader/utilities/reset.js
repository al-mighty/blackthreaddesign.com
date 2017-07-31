import * as THREE from 'three';

import HTMLControl from './HTMLControl.js';

const textureDispose = ( mat ) => {

  Object.keys( mat ).forEach( ( key ) => {

    const value = mat[key];

    if ( value instanceof THREE.Texture ) value.dispose();

  } );

};

const clearChildren = ( object ) => {

  for ( let i = 0; i < object.children.length; i++ ) {

    let child = object.children[ i ];

    object.remove( child );
    child = null;

    // console.log( child );

    // if ( child.userData.keepOnReset !== true ) {

    //   if ( child.children.length > 0 ) {

    //     clearChildren( child );

    //   }

    //   if ( child.geometry !== undefined ) {

    //     child.geometry.dispose();

    //   }
    //   if ( child.material !== undefined ) {

    //     // add check for multimaterials array here

    //     // textureDispose( node.material );
    //     // node.material.dispose();

    //   }


    //   object.remove( node );

    // }

  }

};

export default ( loadedModels ) => {

  HTMLControl.setInitialState();

  clearChildren( loadedModels );

};
