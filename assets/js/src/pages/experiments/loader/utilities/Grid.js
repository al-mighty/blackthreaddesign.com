import * as THREE from 'three';
import throttle from 'lodash.throttle';

export default class Grid {

  constructor( size ) {

    this.size = size === undefined ? 5 : size;

    this.gridHelper = new THREE.GridHelper( this.size, this.size );

    this.axisHelper = new THREE.AxisHelper( this.size / 2 );

    this.helpers = new THREE.Group();

    this.helpers.add( this.gridHelper, this.axisHelper );
    this.helpers.visible = false;

    this.initSlider();

  }

  setMaxSize( size ) {

    if ( size % 2 !== 0 ) size++;

    this.slider.max = String( size );

  }

  setSize( size ) {

    this.size = size;
    this.update();

  }

  update() {

    this.updateGrid();
    this.updateAxes();

  }

  updateGrid() {

    const gridHelper = new THREE.GridHelper( this.size, this.size );
    this.helpers.remove( this.gridHelper );
    this.gridHelper = gridHelper;
    this.helpers.add( this.gridHelper );

  }

  updateAxes() {

    const axisHelper = new THREE.AxisHelper( this.size / 2 );
    this.helpers.remove( this.axisHelper );
    this.axisHelper = axisHelper;
    this.helpers.add( this.axisHelper );

  }

  initSlider() {

    this.slider = document.querySelector( '#grid-slider' );

    this.slider.addEventListener( 'input', throttle( ( e ) => {

      e.preventDefault();

      if ( this.slider.value === 0 ) {

        this.helpers.visible = false;

      } else {

        this.helpers.visible = true;

        this.setSize( this.slider.value );

      }

    }, 250 ), false );

  }

}
