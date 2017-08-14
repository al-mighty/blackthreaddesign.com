const UglifyJS = require( 'uglify-js' );
// const CleanCSS = require( 'clean-css' );

const fs = require( 'fs' );

const inputPath = 'assets/js/build/';

const outputPath = 'assets/js/build-min/';

const uglifyJSOptions = {

  compress: {

    sequences: true,
    properties: true,
    dead_code: true,
    drop_debugger: true,
    unsafe: false,
    unused: true,
    hoist_funs: true,
    hoist_vars: true,
    if_return: true,
    join_vars: true,
    cascade: true,
    loops: false,
    negate_iife: true,
    warnings: true,

  },
  // ie8: false,
  mangle: true,

};


const minifyFile = ( file ) => {

  console.log( 'Minifying ' + file );

  const inputFile = inputPath + file;
  const outputFile = outputPath + file;

  const inputCode = fs.readFileSync( inputFile, 'utf8' );

  // minify input code
  const outputCode = UglifyJS.minify( inputCode, uglifyJSOptions ).code;

  fs.writeFileSync( outputFile, outputCode, 'utf8' );

  console.log( 'Finished minifying ' + file );

}

// pass in a single filename, e.g. 'main' to process only that file
if ( process.argv[ 2 ] !== undefined ) {

  const name = process.argv[ 2 ] + '.js';

  fs.readdir( 'assets/js/src/entry', ( err, files ) => {
    files.forEach( ( file ) => {

      if ( file !== name ) return;

      minifyFile( file );

    } );

  } );

} else {

  // Process js files
  fs.readdir( inputPath, ( err, files ) => {

    files.forEach( ( file ) => {

      minifyFile( file );

    } );

  } );

}
