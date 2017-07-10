import Stats from 'three/examples/js/libs/stats.min';

let minFrame = 1000000;
let maxFrame = 0;

export default class StatisticsOverlay {

  constructor( app, container ) {
    this.app = app;

    this.container = container || app.renderer.domElement;

    this.show = false;

    this.initStatsContainer();

    this.initHideOverLayCheckbox();

  }

  initHideOverLayCheckbox() {
    const hide = this.container.appendChild( document.createElement( 'div' ) );
    hide.id = 'hideStatsOverlay';
    hide.style = `position: absolute;
      top: 0;
      left: 0;`;

    const checkbox = hide.appendChild( document.createElement( 'input' ) );
    checkbox.type = 'checkbox';

    const label = hide.appendChild( document.createElement( 'span' ) );
    label.innerText = 'Show Stats';
    label.style = 'color: white;';

    checkbox.addEventListener( 'change', () => {

      this.statsElem.classList.toggle( 'hidden' );
      this.show = !this.show;
    } );

  }

  initStatsContainer() {

    this.statsElem = this.container.appendChild( document.createElement( 'div' ) );
    this.statsElem.id = 'infoContainer';
    this.statsElem.style = `text-align: center;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 30%;`;

    this.statsElem.classList.add( 'hidden' );

    const timeCount = this.statsElem.appendChild( document.createElement( 'span' ) );
    timeCount.innerText = 'Total Time: ';
    this.total = timeCount.appendChild( document.createElement( 'span' ) );

    const totalUnscaled = this.statsElem.appendChild( document.createElement( 'span' ) );
    totalUnscaled.innerText = ' Total Unscaled Time: ';
    this.totalUnscaled = totalUnscaled.appendChild( document.createElement( 'span' ) );

    const frameCount = this.statsElem.appendChild( document.createElement( 'span' ) );
    frameCount.innerText = ' Frame Count: ';
    this.frameCount = frameCount.appendChild( document.createElement( 'span' ) );

    this.statsElem.appendChild( document.createElement( 'br' ) );

    const lastFrameTime = this.statsElem.appendChild( document.createElement( 'span' ) );
    lastFrameTime.innerText = 'Last Frame Time: ';
    this.lastFrameTime = lastFrameTime.appendChild( document.createElement( 'span' ) );

    const minFrameTime = this.statsElem.appendChild( document.createElement( 'span' ) );
    minFrameTime.innerText = ' Min Frame Time: ';
    this.minFrameTime = minFrameTime.appendChild( document.createElement( 'span' ) );

    const maxFrameTime = this.statsElem.appendChild( document.createElement( 'span' ) );
    maxFrameTime.innerText = ' Max Frame Time: ';
    this.maxFrameTime = maxFrameTime.appendChild( document.createElement( 'span' ) );

    this.statsElem.appendChild( document.createElement( 'br' ) );

    const avgFrameTime = this.statsElem.appendChild( document.createElement( 'span' ) );
    avgFrameTime.innerText = 'Average Frame Time: ';
    this.avgFrameTime = avgFrameTime.appendChild( document.createElement( 'span' ) );

    const fps = this.statsElem.appendChild( document.createElement( 'span' ) );
    fps.innerText = ' FPS: ';
    this.fps = fps.appendChild( document.createElement( 'span' ) );

    this.hideCheck = document.querySelector( '#hideOverlayChk' );


    this.stats = new Stats();
    this.stats.dom.style = `position: absolute;
    top: 0px;
    right: 0px;
    cursor: pointer;
    opacity: 0.9;`

    this.statsElem.appendChild( this.stats.dom );

  }

  updateStatistics( delta ) {

    if ( !this.show ) return;

    this.total.innerText = Math.floor( this.app.time.totalTime / 1000 );
    this.totalUnscaled.innerText = Math.floor( this.app.time.unscaledTotalTime / 1000 );
    this.frameCount.innerText = this.app.frameCount;

    if ( delta ) {

      const unscaledDelta = Math.floor( delta / this.app.time.timeScale );

      if ( unscaledDelta < minFrame )	this.minFrameTime.innerText = minFrame = unscaledDelta;
      if ( unscaledDelta > maxFrame ) this.maxFrameTime.innerText = maxFrame = unscaledDelta;

      this.lastFrameTime.innerText = unscaledDelta;

    }

    this.avgFrameTime.innerText = Math.floor( this.app.averageFrameTime );
    this.fps.innerText = ( this.app.averageFrameTime !== 0 ) ? Math.floor( 1000 / this.app.averageFrameTime ) : 0;

    this.stats.update();
  }

}
