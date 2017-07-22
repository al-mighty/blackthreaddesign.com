---
layout: single
title: "360 viewer temp"
# excerpt: "Bottle product viewer" 
categories: work
permalink: hidden/360_viewer_temp
---

<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/84/three.js"></script>

<script src="https://threejs.org/examples/js/controls/OrbitControls.js"></script>

<canvas id="example-canvas" style="width: 90vmin; height: 70vmin;"></canvas>

<script>
      var canvas = document.querySelector('#example-canvas');

  		var camera, scene, renderer;
			var isUserInteracting = false,
			onMouseDownMouseX = 0, onMouseDownMouseY = 0,
			lon = 0, onMouseDownLon = 0,
			lat = 0, onMouseDownLat = 0,
			phi = 0, theta = 0;

			init();
			animate();

			function init() {
				var container, mesh;


				camera = new THREE.PerspectiveCamera( 75, canvas.clientWidth / canvas.clientHeight, 1, 1100 );

				camera.target = new THREE.Vector3( 0, 0, 0 );

				scene = new THREE.Scene();

				var geometry = new THREE.SphereGeometry( 500, 60, 40 );

				geometry.scale( - 1, 1, 1 );


        var textureEquirec = new THREE.TextureLoader().load('/assets/images/textures/env_maps/dadchahi.jpg' )

				var material = new THREE.MeshBasicMaterial( {
					map: textureEquirec,
				} );

				mesh = new THREE.Mesh( geometry, material );
				scene.add( mesh );

        var geometry = new THREE.SphereBufferGeometry( 5, 32, 32 );

      
        var material = new THREE.MeshStandardMaterial( {
            color: 0xffffff,
            envMap: textureEquirec,
            envMapIntensity: 1.0,
        } );

        var sphereMesh = new THREE.Mesh( geometry, material );

        scene.add( sphereMesh );

				renderer = new THREE.WebGLRenderer( { canvas, } );

				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( canvas.clientWidth, canvas.clientHeight ); 
				
				document.addEventListener( 'mousedown', onDocumentMouseDown, false );
				document.addEventListener( 'mousemove', onDocumentMouseMove, false );
				document.addEventListener( 'mouseup', onDocumentMouseUp, false );
				document.addEventListener( 'wheel', onDocumentMouseWheel, false );
				
				document.addEventListener( 'dragover', function ( event ) {
					event.preventDefault();
					event.dataTransfer.dropEffect = 'copy';
				}, false );
				document.addEventListener( 'dragenter', function ( event ) {
					document.body.style.opacity = 0.5;
				}, false );
				document.addEventListener( 'dragleave', function ( event ) {
					document.body.style.opacity = 1;
				}, false );
				document.addEventListener( 'drop', function ( event ) {
					event.preventDefault();
					var reader = new FileReader();
					reader.addEventListener( 'load', function ( event ) {
						material.map.image.src = event.target.result;
						material.map.needsUpdate = true;
					}, false );
					reader.readAsDataURL( event.dataTransfer.files[ 0 ] );
					document.body.style.opacity = 1;
				}, false );
				//
				window.addEventListener( 'resize', onWindowResize, false );
			}
			function onWindowResize() {
				camera.aspect = canvas.clientWidth / canvas.clientHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( canvas.clientWidth, canvas.clientHeight );
			}
			function onDocumentMouseDown( event ) {
				event.preventDefault();
				isUserInteracting = true;
				onMouseDownMouseX = event.clientX;
				onMouseDownMouseY = event.clientY;
				onMouseDownLon = lon;
				onMouseDownLat = lat;
			}
			function onDocumentMouseMove( event ) {
				if ( isUserInteracting === true ) {
					lon = ( onMouseDownMouseX - event.clientX ) * 0.1 + onMouseDownLon;
					lat = ( event.clientY - onMouseDownMouseY ) * 0.1 + onMouseDownLat;
				}
			}
			function onDocumentMouseUp( event ) {
				isUserInteracting = false;
			}
			function onDocumentMouseWheel( event ) {
				camera.fov += event.deltaY * 0.05;
				camera.updateProjectionMatrix();
			}
			function animate() {
				requestAnimationFrame( animate );
				update();
			}
			function update() {
				if ( isUserInteracting === false ) {
					lon += 0.1;
				}
				lat = Math.max( - 85, Math.min( 85, lat ) );
				phi = THREE.Math.degToRad( 90 - lat ) * 4;
				theta = THREE.Math.degToRad( lon );
				camera.target.x = 500 * Math.sin( phi ) * Math.cos( theta );
				camera.target.y = 500 * Math.cos( phi );
				camera.target.z = 500 * Math.sin( phi ) * Math.sin( theta );
				camera.lookAt( camera.target );
				/*
				// distortion
				camera.position.copy( camera.target ).negate();
				*/
				renderer.render( scene, camera );
			}

</script>
