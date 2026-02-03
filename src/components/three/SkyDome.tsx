import { useMemo } from 'react';
import * as THREE from 'three';

const skyVertexShader = `
  varying vec3 vWorldPosition;
  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const skyFragmentShader = `
  varying vec3 vWorldPosition;
  uniform vec3 uZenith;
  uniform vec3 uHorizon;
  uniform vec3 uSunColor;
  uniform vec3 uSunDirection;

  void main() {
    vec3 dir = normalize(vWorldPosition);
    float y = dir.y;

    // Rich sky gradient
    float t = smoothstep(-0.02, 0.85, y);
    vec3 sky = mix(uHorizon, uZenith, t);

    // Sun
    float sunDot = max(dot(dir, uSunDirection), 0.0);
    float sunDisc = pow(sunDot, 1200.0) * 2.5;
    float sunGlow = pow(sunDot, 12.0) * 0.2;
    float sunHaze = pow(sunDot, 3.5) * 0.08;
    sky += uSunColor * (sunDisc + sunGlow + sunHaze);

    // Warm band at horizon
    float horizonBand = exp(-abs(y) * 12.0) * 0.15;
    sky += vec3(0.9, 0.8, 0.65) * horizonBand;

    gl_FragColor = vec4(sky, 1.0);
  }
`;

export default function SkyDome() {
  const uniforms = useMemo(() => ({
    uZenith: { value: new THREE.Color('#4a90c4') },
    uHorizon: { value: new THREE.Color('#b8d4e8') },
    uSunColor: { value: new THREE.Color('#fff0d0') },
    uSunDirection: { value: new THREE.Vector3(0.5, 0.55, 0.35).normalize() },
  }), []);

  return (
    <mesh scale={[50, 50, 50]}>
      <sphereGeometry args={[1, 32, 32]} />
      <shaderMaterial
        vertexShader={skyVertexShader}
        fragmentShader={skyFragmentShader}
        uniforms={uniforms}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}
