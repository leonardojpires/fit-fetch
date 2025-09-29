import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { useRef, useMemo } from 'react';

function ParticleField() {
  const ref = useRef(null);

  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      // rotação geral
      ref.current.rotation.x = state.clock.elapsedTime * 0.02;
      ref.current.rotation.y = state.clock.elapsedTime * 0.05;

      // piscar partículas
      ref.current.material.opacity = 0.6 + Math.sin(state.clock.elapsedTime * 2) * 0.2;

      // leve oscilação vertical
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.5;
    }
  });

  return (
    <Points ref={ref} positions={particlesPosition}>
      <PointMaterial
        transparent
        color="#ff6f31"        // laranja gym vibrante
        size={0.035}
        sizeAttenuation
        depthWrite={false}
        opacity={0.7}
        emissive="#ff6f31"     // glow subtil
      />
    </Points>
  );
}

export default function ParticleBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 75 }}
        style={{ background: '#1e1e1e' }} // cinza escuro moderno
      >
        {/* luz ambiente suave */}
        <ambientLight intensity={0.2} color="#cccccc" />

        {/* luz direcional energética */}
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={0.5}
          color="#ff7f2a"
        />

        {/* luz pontual complementar */}
        <pointLight 
          position={[-5, -5, 5]} 
          intensity={0.4}
          color="#ff9f1c"
        />

        {/* partículas */}
        <ParticleField />
      </Canvas>
    </div>
  );
}
