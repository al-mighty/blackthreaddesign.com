import robotCanvas from '../RobotCanvas.js';
import Loaders from './Loaders.js';

const loaders = new Loaders();

export default class OnLoadCallbacks {

  static onFBXLoad( file ) {

    console.log( 'Using THREE.FBXLoader' );

    const promise = loaders.fbxLoader( file );

    promise.then( ( result ) => {

      robotCanvas.addObjectToScene( result );

    } );

    return promise;

  }

}
