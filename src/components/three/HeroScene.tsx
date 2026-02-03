import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import WaterScene from './WaterScene';
import FloatingBuoy from './FloatingBuoy';
import WaterParticles from './WaterParticles';
import SkyDome from './SkyDome';

export default function HeroScene() {
  return (
    <div className="relative w-full h-72 sm:h-80 lg:h-96 rounded-xl overflow-hidden">
      <Suspense fallback={<HeroFallback />}>
        <Canvas
          camera={{ position: [3, 1.8, 5], fov: 55, near: 0.1, far: 100 }}
          dpr={[1, 2]}
          gl={{ antialias: true, toneMapping: 3 }}
        >
          {/* Sky background */}
          <SkyDome />

          {/* Realistic lighting */}
          <ambientLight intensity={0.35} color="#b0d4f1" />
          <directionalLight
            position={[8, 10, 5]}
            intensity={1.8}
            color="#fff5e6"
            castShadow={false}
          />
          <directionalLight
            position={[-5, 3, -4]}
            intensity={0.3}
            color="#87ceeb"
          />
          <hemisphereLight
            args={['#87ceeb', '#0a2e5c', 0.4]}
          />

          {/* Ocean surface */}
          <WaterScene />

          {/* Floating buoy */}
          <FloatingBuoy />

          {/* Underwater particles */}
          <WaterParticles />

          {/* Fog for depth */}
          <fog attach="fog" args={['#c8dff5', 12, 35]} />

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.3}
            maxPolarAngle={Math.PI / 2.1}
            minPolarAngle={Math.PI / 5}
            target={[0, -0.2, 0]}
          />
        </Canvas>
      </Suspense>

      {/* Overlay text */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent p-6 sm:p-8 pointer-events-none">
        <h2 className="text-white text-xl sm:text-2xl font-bold drop-shadow-lg">
          Marine Monitoring Network
        </h2>
        <p className="text-white/80 text-sm mt-1 drop-shadow">
          Lebanese Coastal Waters &mdash; Real-time Autonomous Analysis
        </p>
      </div>
    </div>
  );
}

function HeroFallback() {
  return (
    <div className="w-full h-full bg-gradient-to-b from-sky-400 via-sky-300 to-cyan-700 flex items-center justify-center rounded-xl">
      <div className="animate-pulse text-white/60 text-sm">Loading ocean...</div>
    </div>
  );
}
