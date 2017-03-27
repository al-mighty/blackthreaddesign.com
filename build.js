const rollup = require( 'rollup' );
const watch = require( 'rollup-watch' );
const babel = require( 'rollup-plugin-babel' );
const nodeResolve = require( 'rollup-plugin-node-resolve' );
const commonjs = require( 'rollup-plugin-commonjs' );
const glslify = require( 'glslify' );

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
const config = (entry, dest, plugins ) => {
  return {
    entry: entry,
    dest: dest,
    format: 'iife',
    // sourceMap: true,
    plugins: plugins
  }
}

const mainConfig = config( 'assets/js/src/main.js', 'assets/js/main.js', defaultPlugins );

const watcher = watch( rollup, mainConfig );

// stderr to stderr to keep `rollup main.js > bundle.js` from breaking
const stderr = console.error.bind( console );

const eventHandler = (event) => {
  switch ( event.code ) {
    case 'STARTING':
      stderr( 'checking rollup-watch version...' );
      break;
    case 'BUILD_START':
      stderr( 'bundling...' );
      break;
    case 'BUILD_END':
      stderr( `bundled in ${event.duration}ms. Watching for changes...` );
      break;
    case 'ERROR':
      stderr( `error: ${event.error}` );
      break;
    default:
      stderr( `unknown event: ${event}` );
  }
};

watcher.on( 'event', eventHandler );