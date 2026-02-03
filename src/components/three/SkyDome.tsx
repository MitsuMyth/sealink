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
  uniform vec3 uTopColor;
  uniform vec3 uHorizonColor;
  uniform vec3 uSunColor;
  uniform vec3 uSunDirection;

  void main() {
    vec3 dir = normalize(vWorldPosition);
    float y = dir.y;

    // Sky gradient: horizon to zenith
    float t = smoothstep(-0.05, 0.8, y);
    vec3 sky = mix(uHorizonColor, uTopColor, t);

    // Sun glow
    float sunDot = max(dot(dir, uSunDirection), 0.0);
    float sunDisc = pow(sunDot, 800.0) * 3.0;
    float sunGlow = pow(sunDot, 8.0) * 0.4;
    float sunHaze = pow(sunDot, 3.0) * 0.15;
    sky += uSunColor * (sunDisc + sunGlow + sunHaze);

    // Warm horizon haze
    float horizonHaze = 1.0 - smoothstep(0.0, 0.15, abs(y));
    sky = mix(sky, uHorizonColor * 1.2, horizonHaze * 0.3);

    gl_FragColor = vec4(sky, 1.0);
  }
`;

export default function SkyDome() {
  const uniforms = useMemo(() => ({
    uTopColor: { value: new THREE.Color('#3a8fd4') },
    uHorizonColor: { value: new THREE.Color('#c8dff5') },
    uSunColor: { value: new THREE.Color('#fff5e0') },
    uSunDirection: { value: new THREE.Vector3(0.5, 0.6, 0.3).normalize() },
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
