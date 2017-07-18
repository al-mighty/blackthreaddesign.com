// Note - this currently get the info from the three.js renderer rather than the model.
// The number of faces / vertices that aare rendered by three.js may be different than the
// number in the original model, since quads (4-sided polygons) are not supported in WebGL
// - these are subdivided into tris 

const vertices = document.querySelector( '#vertices' );
const faces = document.querySelector( '#faces' );

const addModelInfo = ( renderer ) => {

  faces.innerHTML = renderer.info.render.faces;
  vertices.innerHTML = renderer.info.render.vertices;

};

export default addModelInfo;
