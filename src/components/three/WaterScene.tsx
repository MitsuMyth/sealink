import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  uniform float uTime;
  varying vec3 vWorldPosition;
  varying vec3 vNormal;
  varying vec2 vUv;
  varying float vWaveHeight;

  vec3 gerstnerWave(vec2 pos, float steepness, float wavelength, float speed, vec2 direction, float time) {
    float k = 6.28318 / wavelength;
    float c = sqrt(9.81 / k);
    vec2 d = normalize(direction);
    float f = k * (dot(d, pos) - c * speed * time);
    float a = steepness / k;
    return vec3(d.x * a * cos(f), a * sin(f), d.y * a * cos(f));
  }

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

  // Sum all Gerstner waves at a given position
  vec3 totalWave(vec2 p, float t) {
    vec3 w = vec3(0.0);
    w += gerstnerWave(p, 0.20, 9.0,  0.7, vec2(1.0, 0.2),   t);
    w += gerstnerWave(p, 0.16, 7.0,  0.6, vec2(0.6, 0.8),   t);
    w += gerstnerWave(p, 0.11, 4.5,  0.85, vec2(-0.3, 1.0),  t);
    w += gerstnerWave(p, 0.08, 2.8,  1.0, vec2(0.85, -0.3), t);
    w += gerstnerWave(p, 0.05, 1.6,  1.2, vec2(-0.5, 0.7),  t);
    w += gerstnerWave(p, 0.03, 0.9,  1.5, vec2(0.4, -0.85), t);
    w += gerstnerWave(p, 0.015, 0.45, 1.8, vec2(-0.7, -0.4), t);
    return w;
  }

  void main() {
    vUv = uv;
    vec3 pos = position;
    vec2 xz = pos.xy;
    float t = uTime;

    vec3 wave = totalWave(xz, t);

    // Organic micro-detail
    float nd = 0.0;
    nd += snoise(vec3(xz * 0.7, t * 0.25)) * 0.03;
    nd += snoise(vec3(xz * 1.8, t * 0.4))  * 0.012;
    nd += snoise(vec3(xz * 4.5, t * 0.7))  * 0.004;

    pos.x += wave.x;
    pos.y += wave.z + nd;

    vWaveHeight = wave.y + wave.z;

    // Normal via finite differences on the 4 major wave layers
    float eps = 0.06;
    vec3 w1 = totalWave(xz + vec2(eps, 0.0), t);
    vec3 w2 = totalWave(xz - vec2(eps, 0.0), t);
    vec3 w3 = totalWave(xz + vec2(0.0, eps), t);
    vec3 w4 = totalWave(xz - vec2(0.0, eps), t);

    // Add noise perturbation to normals for micro-shimmer
    float nx = snoise(vec3(xz * 6.0 + t * 0.3, 0.0)) * 0.06;
    float nz = snoise(vec3(0.0, xz * 6.0 + t * 0.35)) * 0.06;

    float hx = (w1.y + w1.z) - (w2.y + w2.z);
    float hz = (w3.y + w3.z) - (w4.y + w4.z);
    vec3 computedNormal = normalize(vec3(-hx / (2.0 * eps) + nx, 1.0, -hz / (2.0 * eps) + nz));

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
  uniform vec3 uWaterMid;
  uniform vec3 uWaterShallow;
  uniform vec3 uSkyZenith;
  uniform vec3 uSkyHorizon;
  varying vec3 vWorldPosition;
  varying vec3 vNormal;
  varying vec2 vUv;
  varying float vWaveHeight;

  void main() {
    vec3 V = normalize(cameraPosition - vWorldPosition);
    vec3 N = normalize(vNormal);
    vec3 L = normalize(uSunDirection);

    // ── Fresnel (Schlick, water IOR 1.33 → F0 ≈ 0.02) ──
    float NdotV = max(dot(N, V), 0.0);
    float fresnel = 0.02 + 0.98 * pow(1.0 - NdotV, 5.0);
    // Clamp fresnel so it never goes fully white
    fresnel = min(fresnel, 0.65);

    // ── Water body color (3-stop gradient by height) ──
    float d1 = smoothstep(-0.5, 0.1, vWorldPosition.y);
    float d2 = smoothstep(0.05, 0.35, vWorldPosition.y);
    vec3 waterColor = mix(uWaterDeep, uWaterMid, d1);
    waterColor = mix(waterColor, uWaterShallow, d2 * 0.5);

    // ── Sub-surface scattering ──
    // Light transmitting through wave crests gives that iconic teal glow
    vec3 sssDir = normalize(-L + N * 0.35);
    float sssDot = pow(max(dot(V, sssDir), 0.0), 4.0);
    float crestMask = smoothstep(-0.05, 0.25, vWaveHeight);
    vec3 sssColor = vec3(0.0, 0.35, 0.3) * sssDot * (0.15 + crestMask * 0.25);

    // ── Sky reflection (gradient, not flat white) ──
    vec3 R = reflect(-V, N);
    float skyT = smoothstep(-0.05, 0.7, R.y);
    vec3 skyRef = mix(uSkyHorizon, uSkyZenith, skyT);
    // Darken sky reflection to prevent white washing
    skyRef *= 0.85;

    // ── Combine via Fresnel ──
    vec3 color = mix(waterColor + sssColor, skyRef, fresnel);

    // ── Specular sun highlight (concentrated, not broad) ──
    vec3 H = normalize(L + V);
    float NdotH = max(dot(N, H), 0.0);
    // Tight sun disc only
    float specSun = pow(NdotH, 800.0) * 3.0;
    // Very subtle broad glint
    float specGlint = pow(NdotH, 80.0) * 0.04;
    color += uSunColor * (specSun + specGlint);

    // ── Atmospheric depth fade (into horizon color, NOT white) ──
    float dist = length(cameraPosition - vWorldPosition);
    float fog = 1.0 - exp(-dist * 0.015);
    color = mix(color, uSkyHorizon * 0.75, fog * 0.3);

    // ── ACES filmic tone mapping ──
    color *= 1.1; // slight exposure boost
    vec3 a = color * (color + 0.0245786) - 0.000090537;
    vec3 b = color * (0.983729 * color + 0.4329510) + 0.238081;
    color = a / b;

    // Gamma
    color = pow(clamp(color, 0.0, 1.0), vec3(1.0 / 2.2));

    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function WaterScene() {
  const meshRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uSunDirection: { value: new THREE.Vector3(0.5, 0.55, 0.35).normalize() },
    uSunColor: { value: new THREE.Color('#ffefd5') },
    uWaterDeep: { value: new THREE.Color('#04152e') },
    uWaterMid: { value: new THREE.Color('#0a3d62') },
    uWaterShallow: { value: new THREE.Color('#0c6980') },
    uSkyZenith: { value: new THREE.Color('#5b9fd4') },
    uSkyHorizon: { value: new THREE.Color('#8cb8d4') },
  }), []);

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.getElapsedTime() * 0.45;
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, 0]}>
      <planeGeometry args={[40, 40, 280, 280]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.FrontSide}
      />
    </mesh>
  );
}
