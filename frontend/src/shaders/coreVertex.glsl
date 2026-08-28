uniform float uTime;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {

    vUv = uv;

    vNormal = normalize(normalMatrix * normal);

    vec3 pos = position;

    float wave =
        sin(pos.y * 8.0 + uTime * 2.0) * 0.03 +
        sin(pos.x * 12.0 + uTime * 1.5) * 0.02 +
        sin(pos.z * 10.0 + uTime * 1.8) * 0.025;

    pos += normal * wave;

    vPosition = pos;

    gl_Position =
        projectionMatrix *
        modelViewMatrix *
        vec4(pos, 1.0);

}