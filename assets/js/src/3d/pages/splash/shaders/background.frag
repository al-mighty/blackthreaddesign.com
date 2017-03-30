precision mediump float;

uniform vec3 color1;
uniform vec3 color2;
uniform vec2 offset;
uniform vec2 smooth;

uniform sampler2D noiseTexture;

varying vec2 uv;

void main() {

	float dst = length(uv - offset);
	dst = smoothstep(smooth.x, smooth.y, dst);

	vec3 color = mix(color1, color2, dst);

	vec3 noise = mix(color, texture2D(noiseTexture, uv).rgb, 0.08);

	vec4 col = vec4( mix( noise, vec3( -2.6 ), dot( uv, uv ) ), 1.0);

	gl_FragColor = col;

}