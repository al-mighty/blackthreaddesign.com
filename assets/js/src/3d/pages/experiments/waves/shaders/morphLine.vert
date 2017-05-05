uniform float morphTargetInfluences[ 4 ];

void main() {

  vec3 transformed = vec3( position );

  transformed += ( morphTarget0 - position ) * morphTargetInfluences[ 0 ];
	// transformed += ( morphTarget1 - position ) * morphTargetInfluences[ 1 ];
	// transformed += ( morphTarget2 - position ) * morphTargetInfluences[ 2 ];
	// transformed += ( morphTarget3 - position ) * morphTargetInfluences[ 3 ];

	gl_Position = projectionMatrix * modelViewMatrix * vec4( transformed, 1.0 );
}