uniform vec3 color1;
uniform vec3 color2;
uniform vec2 offset;
uniform vec2 smooth;

uniform sampler2D noiseTexture;
uniform sampler2D portraitTexture;

varying vec2 screenUV;
varying vec2 vUv;

void main() {

	float dst = length(screenUV + offset);
	dst = smoothstep(smooth.x, smooth.y, dst);

	vec3 color = mix(color2, color1, dst);

	// vec3 noise = mix(color, texture2D(noiseTexture, screenUV).rgb, 0.08);

  // vec3 noisyPortrait = mix(noise, texture2D(portraitTexture, vUv).rgb, 0.0);

  vec3 portrait =  color * texture2D(portraitTexture, vUv).rgb; //mix(color, texture2D(portraitTexture, vUv).rgb, 0.75);

	vec4 col = vec4( mix( portrait, vec3( -2.6 ), dot( screenUV, screenUV ) ), 1.0);

	gl_FragColor = col;
}