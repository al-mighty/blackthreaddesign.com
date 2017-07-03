const vertices = document.querySelector( '#vertices' );
const faces = document.querySelector( '#faces' );

const addModelInfo = ( renderer ) => {

  faces.innerHTML = renderer.info.render.faces;
  vertices.innerHTML = renderer.info.render.vertices;

};

export default addModelInfo;
