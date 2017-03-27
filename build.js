const rollup = require( 'rollup' );
const watch = require( 'rollup-watch' );
const babel = require( 'rollup-plugin-babel' );
const nodeResolve = require( 'rollup-plugin-node-resolve' );
const commonjs = require( 'rollup-plugin-commonjs' );

const glslify = require( 'glslify' );

const fs = require( 'fs' );

const glsl = () => {
  return {
    transform( code, id ) {

      if ( !/\.glsl$|\.vert$|\.frag$/.test( id ) ) return;
      //
      const res = glslify( code );
      //
      return 'export default ' + JSON.stringify(
        res
        .replace( /[ \t]*\/\/.*\n/g, '' )
        .replace( /[ \t]*\/\*[\s\S]*?\*\//g, '' )
        .replace( /\n{2,}/g, '\n' )
      ) + ';';
    },
  };
};

const defaultPlugins = [
  nodeResolve( {
    // jsnext: true,
    // module: true,
    // browser: true,
  } ),
  commonjs( {
    namedExports: {
      // left-hand side can be an absolute path, a path
      // relative to the current directory, or the name
      // of a module in node_modules
      // 'hammerjs': [ 'Hammer' ]
    },
  } ),
  glsl(),
  babel( {
    compact: false,
    exclude: ['node_modules/**', 'src/shaders/**'],
    // babelrc: false,
    presets: ['es2015-loose-rollup'],

  } ),
];

// config to feed the watcher function
const config = ( entry, dest, moduleName, plugins ) => {
  return {
    entry,
    dest,
    format: 'iife',
    // sourceMap: true,
    moduleName,
    plugins,
  }
}

// const mainConfig = config( 'assets/js/src/entry/main.js', 'assets/js/main.js', defaultPlugins );

// stderr to stderr to keep `rollup main.js > bundle.js` from breaking
const stderr = console.error.bind( console );

const eventHandler = ( file ) => {
  return ( event ) => {
    switch ( event.code ) {
      case 'STARTING':
        stderr( 'checking rollup-watch version...' );
        break;
      case 'BUILD_START':
        stderr( `bundling ${file}...` );
        break;
      case 'BUILD_END':
        stderr( `bundled ${file} in ${event.duration}ms. Watching for changes...` );
        break;
      case 'ERROR':
        stderr( `error: ${event.error} with ${file}` );
        break;
      default:
        stderr( `unknown event: ${event} from ${file}` );
    }
  };
};

// const watcher = watch( rollup, mainConfig );

// watcher.on( 'event', eventHandler );

// Read all files in a folder
fs.readdir( 'assets/js/src/entry', ( err, files ) => {
  files.forEach( ( file ) => {
    const entryConfig = config( 'assets/js/src/entry/' + file, 'assets/js/build/' + file, file, defaultPlugins );
    const watcher = watch( rollup, entryConfig );
    const entryEventHandler = eventHandler( file );
    watcher.on( 'event', entryEventHandler );
  } );
} );

