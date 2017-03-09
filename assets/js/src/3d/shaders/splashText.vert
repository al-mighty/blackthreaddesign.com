uniform float uTime;
uniform vec3 uAxis;
uniform float uAngle;
attribute vec2 aAnimation;
attribute vec3 aEndPosition;
attribute vec4 aAxisAngle;
varying vec2 screenUV;


vec3 cubicBezier(vec3 p0, vec3 c0, vec3 c1, vec3 p1, float t){
    vec3 tp;
    float tn = 1.0 - t;

    tp.xyz = tn * tn * tn * p0.xyz + 3.0 * tn * tn * t * c0.xyz + 3.0 * tn * t * t * c1.xyz + t * t * t * p1.xyz;

    return tp;
}

float ease(float t, float b, float c, float d) {
  return c*((t=t/d - 1.0)*t*t + 1.0) + b;
}

vec3 rotateVector(vec4 q, vec3 v) {
    return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
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

  // gl_Position = projectionMatrix * modelViewMatrix * vec4( position.xy, -1.0, 1.0 );

  screenUV = vec2( gl_Position.xy / gl_Position.z ) * 0.5;
}
