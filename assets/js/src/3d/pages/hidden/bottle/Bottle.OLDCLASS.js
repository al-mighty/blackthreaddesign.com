import * as THREE from 'three';

import bottleModelSrc from './bottle-real-applied.model.json';
import capModelSrc from './bottle-cap.model.json';
import smileySrc from 'app/images/carlsberg-smiley-dark.png';

const pr = (typeof window.devicePixelRatio != 'undefined' ? window.devicePixelRatio : 1);

class Bottle {
  constructor(canvas, labelCanvas) {
    this.canvas = canvas;
    this.labelCanvas = labelCanvas;

    this.bottle = null;
    this.lastRenderTime = 0;
    this.active = false;
    
    this.render = this.render.bind(this);

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    
    this.init();
  }

  init() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xF9F9F9);
    
    this.camera = new THREE.PerspectiveCamera(40, this.canvas.clientWidth/this.canvas.clientHeight, 0.1, 1000);
    this.camera.position.z = 60;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true
    });
    this.renderer.setPixelRatio(pr);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.render(this.scene, this.camera);

    var directionalLight = new THREE.DirectionalLight( 0xFFFFFF, 0.6 );
    directionalLight.position.set(20, 20, 30);
    this.scene.add(directionalLight);

    directionalLight = new THREE.DirectionalLight( 0xFFFFFF, 0.6 );
    directionalLight.position.set(-10, 0, 10);
    this.scene.add( directionalLight );

    this.bottle = new THREE.Object3D();
    this.scene.add( this.bottle );

    // Bottle object
    new THREE.JSONLoader().load(bottleModelSrc, (geometry, mat) => {
      geometry.computeVertexNormals();
      const material = new THREE.MeshPhongMaterial({
        color: 0x541E00,
        specular: 0xCCCCCC,
        transparent: true,
        opacity: 0.75,
        shininess: 230,
        shading: THREE.SmoothShading,
        side: THREE.FrontSide
      });

      this.bottleGlass = new THREE.Mesh(geometry, material);

      this.bottle.add( this.bottleGlass );
    });

    // Bottle cap
    new THREE.JSONLoader().load(capModelSrc, (geometry, mat) => {
      const material = new THREE.MeshLambertMaterial({
        color: 0xFFFFFF,
        shading: THREE.SmoothShading,
        side: THREE.FrontSide
      });

      this.bottleCap = new THREE.Mesh(geometry, material);
      this.bottleCap.scale.set(2.15, 2.5, 2.15);
      this.bottleCap.position.y = 19;

      const capBackMat = new THREE.MeshBasicMaterial({ color: 0xCCCCCC, side: THREE.BackSide });
      const capBack = new THREE.Mesh(geometry, capBackMat);
      const { x, y, z } = this.bottleCap.scale;
      capBack.scale.set(x, y, z);
      capBack.position.y = this.bottleCap.position.y;

      this.bottle.add( this.bottleCap );
      this.bottle.add( capBack );
    });

    // Smiley texture for bottle cap
    new THREE.ImageLoader().load(smileySrc, (image) => {
      var canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      var context = canvas.getContext('2d');
      context.fillStyle = 'transparent';
      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      const texture = new THREE.CanvasTexture(canvas);
      const labelgeo = new THREE.PlaneGeometry(4, 4, 1, 1);
      const labelmat = new THREE.MeshLambertMaterial({
        map: texture,
        side: THREE.FrontSide,
        transparent: true
      });
      const label = new THREE.Mesh(labelgeo, labelmat);
      label.rotation.x = THREE.Math.degToRad(-90);
      label.position.y = 18.95;
      
      this.bottle.add(label);
    });

    // Label object
    const texture = new THREE.CanvasTexture(this.labelCanvas);
    const labelgeo = new THREE.CylinderGeometry(4.93, 4.93, 18, 64, 1, true);
    this.labelmat = new THREE.MeshLambertMaterial({
      map: texture,
      side: THREE.FrontSide,
      shading: THREE.SmoothShading
    });
    const label = new THREE.Mesh(labelgeo, this.labelmat);
    label.position.y = -8;
    label.rotation.y = THREE.Math.degToRad(240);

    const labelBackMat = new THREE.MeshBasicMaterial({
      color: 0xCCCCCC,
      side: THREE.BackSide
    });
    const labelBack = new THREE.Mesh(labelgeo, labelBackMat);
    labelBack.position.y = label.position.y;
    labelBack.rotation.y = label.rotation.y;
    
    this.bottle.add(label);
    this.bottle.add(labelBack);
  }

  setTextureSource(src) {
    if (src != '') {
      const loader = new THREE.ImageLoader();
      loader.setCrossOrigin('anonymous');
      loader.load(src, (image) => {
        var canvas = document.createElement('canvas');
        canvas.width = 2048;
        canvas.height = 1024;
        var context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        const texture = new THREE.CanvasTexture(canvas);
        this.labelmat.map = texture;
      });
    } else {
      const texture = new THREE.CanvasTexture(this.labelCanvas);
      this.labelmat.map = texture;
    }
  }

  onMouseDown(e) {
    let clientY = e.clientY;
    if (typeof clientY === 'undefined' && typeof e.targetTouches !== 'undefined') {
      clientY = e.targetTouches[0].clientY;
    }
    this.draggingFromY = clientY;
    this.initialRotation = this.bottle.rotation.x;
    e.preventDefault();
  }

  onMouseUp() {
    this.draggingFromY = -1;
  }

  onMouseMove(e) {
    if (this.draggingFromY != -1) {
      let clientY = e.clientY;
      if (typeof clientY === 'undefined' && typeof e.targetTouches !== 'undefined') {
        clientY = e.targetTouches[0].clientY;
      }
      const diff = clientY - this.draggingFromY;
      let ang = (diff / this.canvas.clientHeight * 90) * Math.PI / 180;
      ang += this.initialRotation;
      ang = Math.max(Math.min(ang, this.maxRotation), this.minRotation);
      this.bottle.rotation.x = ang;
    }
  }

  onWindowResize() {
    this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
  }

  registerEventHandlers() {
    this.draggingFromY = -1;
    this.initalRotation = 0;
    this.minRotation = -45 * Math.PI / 180;
    this.maxRotation = 90 * Math.PI / 180;

    this.canvas.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('mousemove', this.onMouseMove);
    
    this.canvas.addEventListener('touchstart', this.onMouseDown);
    window.addEventListener('touchend', this.onMouseUp);
    window.addEventListener('touchmove', this.onMouseMove);
    
    window.addEventListener('resize', this.onWindowResize);
  }

  destroy() {
    this.active = false;

    this.canvas.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('mousemove', this.onMouseMove);

    this.canvas.removeEventListener('touchstart', this.onMouseDown);
    window.removeEventListener('touchend', this.onMouseUp);
    window.removeEventListener('touchmove', this.onMouseMove);

    window.removeEventListener('resize', this.onWindowResize);
  }

  start() {
    if (!this.active) {
      this.registerEventHandlers();
      this.active = true;
      this.onWindowResize();
      this.render();
    }
  }

  render() {
    if (!this.active) { return; }
    
    const curTime = new Date().getTime();
    if (this.lastRenderTime > 0) {
      const elapsed = curTime - this.lastRenderTime;
      //this.bottle.rotation.x =  maxRotation * 1;//Math.sin(elapsed / 1000.0);
      this.bottle.rotation.y -= 0.015;
      //this.bottle.rotation.z += 0.002;
    }
    if (typeof this.labelmat != 'undefined') {
      this.labelmat.map.needsUpdate = true;
    }
    this.renderer.render(this.scene, this.camera);
    this.lastRenderTime = curTime;
    
    requestAnimationFrame(this.render);
  }
}

export default Bottle;



// WEBPACK FOOTER //
// ./app/components/Bottle3D/Bottle.js