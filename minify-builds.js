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

// Process js files
fs.readdir( inputPath, ( err, files ) => {

  files.forEach( ( file ) => {

    const inputFile = inputPath + file;
    const outputFile = outputPath + file;

    const inputCode = fs.readFileSync( inputFile, 'utf8' );

    // minify input code
    const outputCode = UglifyJS.minify( inputCode, uglifyJSOptions ).code;

    fs.writeFileSync( outputFile, outputCode, 'utf8' );

  } );

} );

// process css files