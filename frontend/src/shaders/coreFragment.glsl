uniform float uTime;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {

    vec2 uv = vUv;

    float scan =
        sin((uv.y * 180.0) - uTime * 6.0) * 0.5 + 0.5;

    float energy =
        sin(length(vPosition.xy) * 18.0 - uTime * 4.0) * 0.5 + 0.5;

    float pulse =
        sin(uTime * 2.5) * 0.5 + 0.5;

    vec3 colorA = vec3(0.0, 0.45, 1.0);
    vec3 colorB = vec3(0.55, 0.95, 1.0);

    vec3 color = mix(colorA, colorB, energy);

    float fresnel =
        pow(1.0 - abs(dot(normalize(vNormal), vec3(0.0,0.0,1.0))), 2.5);

    float alpha =
        0.30 +
        fresnel * 0.55 +
        scan * 0.15 +
        pulse * 0.08;

    gl_FragColor = vec4(color, alpha);

}