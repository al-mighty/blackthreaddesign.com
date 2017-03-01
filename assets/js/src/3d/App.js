import Time from './Time.js';

/**
 * @author Lewy Blue / https://github.com/looeee
 *
 */

function App( canvas ) {

  let _canvas,
    _scene,
    _camera,
    _renderer;

  let _currentAnimationFrameID;

  if ( canvas !== undefined ) _canvas = canvas;

  this.autoRender = true;

  this.autoResize = true;

  this.frameCount = 0;

  this.delta = 0;

  this.time = new Time();

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

      set( canvas ) {

        _canvas = canvas;

      },
    },

    camera: {

      get() {

        if ( _camera === undefined ) {

          _camera = new THREE.PerspectiveCamera( 75, this.canvas.clientWidth / this.canvas.clientHeight, 1, 1000 );

        }

        return _camera;

      },

      set( camera ) {

        _camera = camera;

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

    const self = this;

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

    this.time.pause();

    cancelAnimationFrame( _currentAnimationFrameID );

  };

  this.stop = function () {

    this.time.stop();
    this.frameCount = 0;

    cancelAnimationFrame( _currentAnimationFrameID );

  };

  this.onUpdate = function () {};

  this.onWindowResize = function () {};

  const onWindowResize =	function () {

    if ( !this.autoResize ) return;

    this.onWindowResize();

    if ( this.camera.type !== 'PerspectiveCamera' ) {

      console.warn( 'THREE.APP: AutoResize only works with PerspectiveCamera' );
      return;

    }

    const newWidth = this.canvas.clientWidth;
    const newHeight = this.canvas.clientHeight;

    this.camera.aspect = newWidth / newHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( newWidth, newHeight, false );

  };

  window.addEventListener( 'resize', onWindowResize.bind( this ), false );

}

export default App;
