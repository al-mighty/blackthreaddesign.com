import * as THREE from 'three';

// saving function taken from three.js editor
const link = document.createElement( 'a' );
link.style.display = 'none';
document.body.appendChild( link ); // Firefox workaround, see #6594

const save = ( blob, filename ) => {

  link.href = URL.createObjectURL( blob );
  link.download = filename || 'data.json';
  link.click();

};

const saveString = ( text, filename ) => {

  save( new Blob( [ text ], { type: 'text/plain' } ), filename );

};

const exportAsJSON = ( array ) => {

  const anims = [];

  array.forEach( ( anim ) => {

    anims.push( THREE.AnimationClip.toJSON( anim ) );

  } );

  let output = JSON.stringify( anims, null, '\t' );
  // console.log( output );

  // remove first '[' and last ']' from json
  output = output.replace( /[^{]*/i, '' ).replace( /\]$/i, '' );


  // array.metadata = {
  //   type: 'Animation',
  //   generator: 'Three.js',
  //   version: '4',
  // };

  // output = JSON.stringify( output, null, '\t' );;
  // output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );

  saveString( output, 'blackThreadAnimations.json' );

};

export default exportAsJSON;
