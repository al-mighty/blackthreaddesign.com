varying vec2 screenUV;

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position.xy, 1.0, 1.0 );

  screenUV = vec2( gl_Position.xy / gl_Position.z ) * 0.5 + 0.5;
}
