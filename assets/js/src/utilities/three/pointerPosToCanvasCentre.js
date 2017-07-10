import pointerPos from '../pointerPos.js';

const pointerPosToCanvasCentre = ( canvas, offsetY = 0, offsetX = 0 ) => {
  const halfWidth = canvas.clientWidth / 2 + offsetX;
  const halfHeight = ( canvas.clientHeight / 2 ) + offsetY;
  return {
    x: ( pointerPos.x <= halfWidth )
      ? -halfWidth + pointerPos.x
      : pointerPos.x - halfWidth,
    y: halfHeight - pointerPos.y
  };
};

export default pointerPosToCanvasCentre;
