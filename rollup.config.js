import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import glslify from 'glslify';

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

export default {
  entry: 'assets/js/src/main.js',
  plugins: [
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
  ],
  // sourceMap: true,
  targets: [
    {
      format: 'iife',
      dest: 'assets/js/main.js',
    },
  ],
};
