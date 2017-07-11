/* ******************************************************** */
// STATS overlay. Don't use this in production as it
// causes issues in some browsers!
import S from 'three/examples/js/libs/stats.min';


export default class Stats {
  constructor( container, styleString ) {

    this.s = new S();

    if ( styleString !== undefined ) {

      this.s.dom.style  = styleString;

    } else {

      this.s.dom.style = `position: absolute;
      top: 0;
      right: 0;
      cursor: pointer;
      opacity: 0.9;
      z-index: 1;
      width: 100px;`;

    }


    if ( container !== undefined ) {

      container.appendChild( this.s.dom );

    } else { 

      document.body.appendChild( this.s.dom );

    }
    
  }

  update() {

    this.s.update();

  }
}