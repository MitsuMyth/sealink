import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function FloatingBuoy() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const time = clock.getElapsedTime();
    // Realistic bobbing synced with waves
    groupRef.current.position.y = Math.sin(time * 0.48) * 0.18 + Math.cos(time * 0.72) * 0.06 - 0.15;
    groupRef.current.rotation.z = Math.sin(time * 0.55) * 0.06;
    groupRef.current.rotation.x = Math.cos(time * 0.42) * 0.04;
  });

  return (
    <group ref={groupRef} position={[1, 0, -1]}>
      {/* Water line ring */}
      <mesh position={[0, -0.05, 0]}>
        <torusGeometry args={[0.32, 0.07, 12, 24]} />
        <meshStandardMaterial color="#d97706" roughness={0.6} metalness={0.3} />
      </mesh>

      {/* Main body - lower cylinder */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.22, 0.28, 0.4, 20]} />
        <meshStandardMaterial color="#dc2626" roughness={0.5} metalness={0.2} />
      </mesh>

      {/* Upper dome */}
      <mesh position={[0, 0.42, 0]}>
        <sphereGeometry args={[0.2, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#dc2626" roughness={0.5} metalness={0.2} />
      </mesh>

      {/* Antenna mast */}
      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.018, 0.015, 0.55, 8]} />
        <meshStandardMaterial color="#374151" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Solar panel on mast */}
      <mesh position={[0, 0.65, 0.04]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.1, 0.005, 0.07]} />
        <meshStandardMaterial color="#1e3a5f" roughness={0.2} metalness={0.5} />
      </mesh>

      {/* Light beacon */}
      <mesh position={[0, 1.02, 0]}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshStandardMaterial
          color="#22c55e"
          emissive="#22c55e"
          emissiveIntensity={3}
          toneMapped={false}
        />
      </mesh>
      {/* Light glow */}
      <pointLight position={[0, 1.02, 0]} color="#22c55e" intensity={0.5} distance={2} />

      {/* White reflective stripe */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.285, 0.285, 0.06, 20]} />
        <meshStandardMaterial color="#ffffff" roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Submerged keel weight */}
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 0.25, 12]} />
        <meshStandardMaterial color="#1f2937" roughness={0.8} metalness={0.4} />
      </mesh>
    </group>
  );
}
