uniform float uTime;
uniform vec3 uAxis;
uniform float uAngle;
attribute vec2 aAnimation;
attribute vec3 aEndPosition;
attribute vec4 aAxisAngle;
varying vec2 screenUV;


float ease(float t, float b, float c, float d) {
  return c*((t=t/d - 1.0)*t*t + 1.0) + b;
}

vec4 quatFromAxisAngle(vec3 axis, float angle) {
    float halfAngle = angle * 0.5;
    return vec4(axis.xyz * sin(halfAngle), cos(halfAngle));
}


void main() {
  float tDelay = aAnimation.x;
  float tDuration = aAnimation.y;
  float tTime = clamp(uTime - tDelay, 0.0, tDuration);
  float tProgress = ease(tTime, 0.0, 1.0, tDuration);

  vec3 transformed = vec3( position );
 
  transformed = mix(transformed, aEndPosition, tProgress);
  float angle = aAxisAngle.w * tProgress;
  vec4 tQuat = quatFromAxisAngle(aAxisAngle.xyz, angle);

  vec4 mvPosition = modelViewMatrix * vec4( transformed, 1.0 );

  gl_Position = projectionMatrix * mvPosition;

  screenUV = vec2( gl_Position.xy / gl_Position.z ) * 0.5;
}
