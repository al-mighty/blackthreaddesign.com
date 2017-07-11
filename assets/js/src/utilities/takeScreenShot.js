  takeScreenShot( app, width, height ) {

    // set camera and renderer to screenshot size
    app.camera.aspect = width / height;
    app.camera.updateProjectionMatrix();
    app.renderer.setSize( width, height, false );

    // render scene at new size
    app.renderer.render( app.scene, app.camera, null, false );

    const img = new Image();
    img.src = app.renderer.domElement.toDataURL();
    document.querySelector( '#screenshot' ).appendChild( img );

    // reset the renderer and camera to original size
    app.camera.aspect = app.canvas.clientWidth / app.canvas.clientHeight;
    app.camera.updateProjectionMatrix();
    app.renderer.setSize( app.canvas.clientWidth, app.canvas.clientHeight, false );

  }