uniform float uTime;
uniform vec2 pointer;

attribute vec2 aAnimation;
attribute vec3 aEndPosition;

varying vec2 screenUV;

float ease(float t, float b, float c, float d) {
  return c*((t=t/d - 1.0)*t*t + 1.0) + b;
}

void main() {
  // Inverse of distance from pointer to end vertex
  float d = length( position.xy - pointer );
  float dist = 1.0 / d;

  // float animTime = clamp( uTime +  ( dist / 4.0 ), 0.0, 1.0 );

  // Set up animation
  float tDelay = aAnimation.x;
  float tDuration = aAnimation.y;

  float tTime = clamp(uTime - tDelay, 0.0, tDuration);
  float tProgress = ease(tTime, 0.0, 1.0, tDuration);
 
  // Mix between initial and final position
  vec3 transformed = mix(position, aEndPosition, tProgress);

  float moveAmount= 0.0;
  if(uTime <= 0.1) moveAmount = clamp( dist * 200.0, 0.0, 10.0 );

  transformed.x = transformed.x + moveAmount;
  transformed.y = transformed.y + moveAmount;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( transformed, 1.0 );

  // Calculate screenspace UV 
  screenUV = vec2( gl_Position.xy / gl_Position.z ) * 0.5;
}
