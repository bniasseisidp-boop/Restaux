import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Sparkles, MeshDistortMaterial, Environment, Stars } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'

function FloatingPlate({ position, scale = 1 }) {
  const meshRef = useRef()
  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
  })
  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
      <group position={position}>
        {/* Plate base */}
        <mesh ref={meshRef} scale={scale}>
          <cylinderGeometry args={[1.2, 1.2, 0.08, 64]} />
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.1}
            metalness={0.6}
            envMapIntensity={2}
          />
        </mesh>
        {/* Plate rim */}
        <mesh scale={scale}>
          <torusGeometry args={[1.15, 0.06, 16, 64]} />
          <meshStandardMaterial color="#e8e8e8" roughness={0.05} metalness={0.8} />
        </mesh>
        {/* Food on plate - glowing sphere */}
        <mesh position={[0, 0.15, 0]} scale={scale * 0.5}>
          <sphereGeometry args={[0.6, 32, 32]} />
          <MeshDistortMaterial
            color="#e01e37"
            distort={0.3}
            speed={2}
            roughness={0.2}
            metalness={0.1}
            emissive="#8b0000"
            emissiveIntensity={0.5}
          />
        </mesh>
      </group>
    </Float>
  )
}

function CandleFlame({ position }) {
  const flameRef = useRef()
  const lightRef = useRef()

  useFrame((state) => {
    if (!flameRef.current || !lightRef.current) return
    const t = state.clock.elapsedTime
    flameRef.current.scale.x = 1 + Math.sin(t * 8) * 0.05
    flameRef.current.scale.y = 1 + Math.sin(t * 6) * 0.1
    lightRef.current.intensity = 1.5 + Math.sin(t * 7) * 0.5
    lightRef.current.color.setHSL(0.06 + Math.sin(t * 5) * 0.01, 1, 0.5)
  })

  return (
    <group position={position}>
      {/* Candle body */}
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.06, 0.07, 0.8, 16]} />
        <meshStandardMaterial color="#fffde7" roughness={0.8} />
      </mesh>
      {/* Wick */}
      <mesh position={[0, 0.01, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.1, 8]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      {/* Flame */}
      <mesh ref={flameRef} position={[0, 0.15, 0]}>
        <coneGeometry args={[0.04, 0.18, 8]} />
        <meshStandardMaterial
          color="#ff6b00"
          emissive="#ff3300"
          emissiveIntensity={3}
          transparent
          opacity={0.9}
        />
      </mesh>
      {/* Point light */}
      <pointLight
        ref={lightRef}
        color="#ff6b00"
        intensity={2}
        distance={3}
        decay={2}
      />
    </group>
  )
}

function EmberParticles() {
  const count = 200
  const ref = useRef()

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12
      pos[i * 3 + 1] = Math.random() * 8 - 2
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8
    }
    return pos
  }, [])

  const speeds = useMemo(() => {
    return Array.from({ length: count }, () => 0.2 + Math.random() * 0.8)
  }, [])

  useFrame((state) => {
    if (!ref.current) return
    const positions = ref.current.geometry.attributes.position.array
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 1] += speeds[i] * 0.008
      if (positions[i * 3 + 1] > 6) {
        positions[i * 3 + 1] = -2
        positions[i * 3] = (Math.random() - 0.5) * 12
        positions[i * 3 + 2] = (Math.random() - 0.5) * 8
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#ff4500"
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function SceneContent() {
  return (
    <>
      {/* Ambient and directional lights */}
      <ambientLight intensity={0.1} />
      <directionalLight position={[5, 5, 5]} intensity={0.3} color="#ffffff" />
      <pointLight position={[-5, 3, -5]} intensity={1} color="#e01e37" distance={10} />
      <pointLight position={[5, 3, -5]} intensity={0.5} color="#ff6600" distance={10} />
      <pointLight position={[0, -2, 0]} intensity={0.5} color="#c1121f" distance={8} />

      {/* Main floating plate - center */}
      <FloatingPlate position={[0, 0, 0]} scale={1.2} />

      {/* Side plates */}
      <FloatingPlate position={[-3.5, -0.5, -1]} scale={0.7} />
      <FloatingPlate position={[3.5, 0.3, -1]} scale={0.8} />
      <FloatingPlate position={[-2, 1.5, -2]} scale={0.5} />
      <FloatingPlate position={[2.5, 1.2, -2]} scale={0.45} />

      {/* Candles */}
      <CandleFlame position={[-1.5, -1.5, 1]} />
      <CandleFlame position={[1.5, -1.5, 1]} />
      <CandleFlame position={[0, -1.5, 0.5]} />

      {/* Ember particles */}
      <EmberParticles />

      {/* Stars in background */}
      <Stars
        radius={50}
        depth={50}
        count={1000}
        factor={2}
        saturation={0}
        fade
        speed={0.5}
      />

      {/* Sparkles */}
      <Sparkles
        count={80}
        scale={[12, 8, 6]}
        size={2}
        speed={0.4}
        color="#e01e37"
        opacity={0.6}
      />

      {/* Environment for reflections */}
      <Environment preset="night" />

      {/* Post processing */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.3}
          luminanceSmoothing={0.9}
          intensity={1.5}
          radius={0.8}
        />
        <Vignette eskil={false} offset={0.3} darkness={0.8} />
      </EffectComposer>
    </>
  )
}

export default function RestaurantScene() {
  return (
    <Canvas
      className="three-canvas"
      camera={{ position: [0, 0, 6], fov: 60 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 2]}
    >
      <SceneContent />
    </Canvas>
  )
}
