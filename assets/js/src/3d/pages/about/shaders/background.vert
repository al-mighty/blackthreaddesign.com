varying vec2 screenUV;

void main() {
	gl_Position = vec4(vec3(position.x, position.y, 1.0), 1.0);
	screenUV = vec2(position.x, position.y) * 0.5;
}