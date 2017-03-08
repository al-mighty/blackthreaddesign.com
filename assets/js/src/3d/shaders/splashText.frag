uniform sampler2D map;

varying vec2 screenUV;

void main() {
  gl_FragColor = texture2D( map, screenUV );
}
