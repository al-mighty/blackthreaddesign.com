import * as THREE from 'three';
import Time from './Time.js';

/**
 * @author Lewy Blue / https://github.com/looeee
 *
 */

function App( canvas ) {

  const self = this;

  let _canvas;
  let _scene;
  let _camera;
  let _renderer;

  let _currentAnimationFrameID;

  if ( canvas !== undefined ) _canvas = canvas;

  this.autoRender = true;

  this.autoResize = true;

  this.frameCount = 0;

  this.delta = 0;

  this.isPlaying = false;
  this.isPaused = false;

  this.time = new Time();

  const setRendererSize = function () {
    _renderer.setSize( _canvas.clientWidth, _canvas.clientHeight, false );
  };

  const setCameraAspect = function () {
    _camera.aspect = _canvas.clientWidth / _canvas.clientHeight;
    _camera.updateProjectionMatrix();
  };

  this.onWindowResize = function () {};

  const onWindowResize = function () {

    if ( !self.autoResize ) return;

    if ( _camera.type !== 'PerspectiveCamera' ) {

      console.warn( 'THREE.APP: AutoResize only works with PerspectiveCamera' );
      return;

    }

    setCameraAspect();

    setRendererSize();

    self.onWindowResize();

  };

  window.addEventListener( 'resize', onWindowResize, false );

  Object.defineProperties( this, {

    canvas: {

      get() {

        if ( _canvas === undefined ) {

          _canvas = document.body.appendChild( document.createElement( 'canvas' ) );
          _canvas.style.position = 'absolute';
          _canvas.style.width = _canvas.style.height = '100%';

        }

        return _canvas;

      },

      set( newCanvas ) {

        _canvas = newCanvas;

      },
    },

    camera: {

      get() {

        if ( _camera === undefined ) {

          _camera = new THREE.PerspectiveCamera( 50, this.canvas.clientWidth / this.canvas.clientHeight, 1, 1000 );

        }

        return _camera;

      },

      set( camera ) {

        _camera = camera;
        setCameraAspect();

      },
    },

    scene: {

      get() {

        if ( _scene === undefined ) {

          _scene = new THREE.Scene();

        }

        return _scene;

      },

      set( scene ) {

        _scene = scene;

      },
    },

    renderer: {

      get() {

        if ( _renderer === undefined ) {

          _renderer = new THREE.WebGLRenderer( { canvas: this.canvas, antialias: true } );
          _renderer.setPixelRatio( window.devicePixelRatio );
          _renderer.setSize( this.canvas.clientWidth, this.canvas.clientHeight, false );

        }

        return _renderer;

      },

      set( renderer ) {

        _renderer = renderer;
        setRendererSize();

      },

    },

    averageFrameTime: {

      get() {

        return ( this.frameCount !== 0 ) ? this.time.unscaledTotalTime / this.frameCount : 0;

      },

    },

  } );

  this.play = function () {

    this.time.start();

    this.isPlaying = true;
    this.isPaused = false;

    function animationHandler() {

      self.frameCount ++;
      self.delta = self.time.delta;

      self.onUpdate();

      if ( self.autoRender ) self.renderer.render( self.scene, self.camera );

      _currentAnimationFrameID = requestAnimationFrame( () => { animationHandler(); } );

    }

    animationHandler();

  };

  this.pause = function () {

    this.isPaused = true;

    this.time.pause();

    cancelAnimationFrame( _currentAnimationFrameID );

  };

  this.stop = function () {

    this.isPlaying = false;
    this.isPaused = false;

    this.time.stop();
    this.frameCount = 0;

    cancelAnimationFrame( _currentAnimationFrameID );

  };

  this.onUpdate = function () {};

  this.toJSON = function ( object ) {
    if ( typeof object.toJSON === 'function' ) {
      const json = object.toJSON();

      window.open( 'data:application/json;' + ( JSON.stringify( json ) ) );
    } else {
      console.error( 'App.toJSON error: object does not have a toJSON function.' );
    }
  };

}

export default App;
