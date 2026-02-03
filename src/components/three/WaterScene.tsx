import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  uniform float uTime;
  varying vec3 vWorldPosition;
  varying vec3 vNormal;
  varying vec2 vUv;

  // Simplex-style noise helpers
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  float getWaveHeight(vec3 pos, float time) {
    float height = 0.0;
    // Large slow swell
    height += snoise(vec3(pos.x * 0.15, pos.z * 0.12, time * 0.3)) * 0.35;
    // Medium waves
    height += snoise(vec3(pos.x * 0.4 + time * 0.2, pos.z * 0.35, time * 0.5)) * 0.15;
    // Small ripples
    height += snoise(vec3(pos.x * 1.2 + time * 0.4, pos.z * 1.0, time * 0.8)) * 0.05;
    // Micro detail
    height += snoise(vec3(pos.x * 3.0 + time * 0.6, pos.z * 2.8, time * 1.2)) * 0.02;
    return height;
  }

  void main() {
    vUv = uv;
    vec3 pos = position;

    float h = getWaveHeight(pos, uTime);
    pos.y += h;

    // Compute normal via finite differences
    float eps = 0.05;
    float hx = getWaveHeight(pos + vec3(eps, 0.0, 0.0), uTime) - getWaveHeight(pos - vec3(eps, 0.0, 0.0), uTime);
    float hz = getWaveHeight(pos + vec3(0.0, 0.0, eps), uTime) - getWaveHeight(pos - vec3(0.0, 0.0, eps), uTime);
    vec3 computedNormal = normalize(vec3(-hx / (2.0 * eps), 1.0, -hz / (2.0 * eps)));

    vNormal = normalize(normalMatrix * computedNormal);
    vWorldPosition = (modelMatrix * vec4(pos, 1.0)).xyz;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec3 uSunDirection;
  uniform vec3 uSunColor;
  uniform vec3 uWaterDeep;
  uniform vec3 uWaterShallow;
  uniform vec3 uSkyColor;
  varying vec3 vWorldPosition;
  varying vec3 vNormal;
  varying vec2 vUv;

  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    vec3 normal = normalize(vNormal);

    // Fresnel effect — more reflection at grazing angles
    float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 4.0);
    fresnel = clamp(fresnel, 0.05, 0.95);

    // Water color blending based on depth/angle
    float depthFactor = smoothstep(-0.5, 0.3, vWorldPosition.y);
    vec3 waterColor = mix(uWaterDeep, uWaterShallow, depthFactor);

    // Specular sun reflection
    vec3 halfDir = normalize(uSunDirection + viewDir);
    float specular = pow(max(dot(normal, halfDir), 0.0), 256.0);
    float specularBroad = pow(max(dot(normal, halfDir), 0.0), 32.0);

    // Sub-surface scattering approximation
    float sss = pow(max(dot(viewDir, -uSunDirection + normal * 0.3), 0.0), 3.0) * 0.15;
    vec3 sssColor = vec3(0.0, 0.6, 0.5) * sss;

    // Sky reflection
    vec3 reflectDir = reflect(-viewDir, normal);
    float skyGradient = smoothstep(-0.1, 0.5, reflectDir.y);
    vec3 skyReflection = mix(vec3(0.6, 0.75, 0.85), uSkyColor, skyGradient);

    // Combine
    vec3 color = mix(waterColor + sssColor, skyReflection, fresnel);
    color += uSunColor * specular * 1.5;
    color += uSunColor * specularBroad * 0.08;

    // Slight fog / atmospheric perspective
    float dist = length(cameraPosition - vWorldPosition);
    float fogFactor = 1.0 - exp(-dist * 0.02);
    color = mix(color, uSkyColor * 0.9, fogFactor * 0.3);

    // Tone mapping
    color = color / (color + vec3(1.0));
    color = pow(color, vec3(1.0 / 2.2));

    gl_FragColor = vec4(color, 0.95);
  }
`;

export default function WaterScene() {
  const meshRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uSunDirection: { value: new THREE.Vector3(0.5, 0.6, 0.3).normalize() },
    uSunColor: { value: new THREE.Color('#fff5e6') },
    uWaterDeep: { value: new THREE.Color('#0a2e5c') },
    uWaterShallow: { value: new THREE.Color('#0e7490') },
    uSkyColor: { value: new THREE.Color('#87ceeb') },
  }), []);

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.getElapsedTime() * 0.6;
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, 0]}>
      <planeGeometry args={[30, 30, 200, 200]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
