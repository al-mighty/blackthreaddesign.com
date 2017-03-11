uniform float uTime;
uniform vec3 uAxis;
uniform float uAngle;
attribute vec2 aAnimation;
attribute vec3 aEndPosition;
// attribute vec4 aAxisAngle;
varying vec2 screenUV;


float ease(float t, float b, float c, float d) {
  return c*((t=t/d - 1.0)*t*t + 1.0) + b;
}

void main() {
  float tDelay = aAnimation.x;
  float tDuration = aAnimation.y;

  float tTime = clamp(uTime - tDelay, 0.0, tDuration);
  float tProgress = ease(tTime, 0.0, 1.0, tDuration);
 
  vec3 transformed = mix(position, aEndPosition, tProgress);

  gl_Position = projectionMatrix * modelViewMatrix * vec4( transformed, 1.0 );

  screenUV = vec2( gl_Position.xy / gl_Position.z ) * 0.5;
}
