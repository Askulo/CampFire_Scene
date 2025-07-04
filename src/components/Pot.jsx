import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Pot() {
  const potRef = useRef()
  const handleRefs = useRef([])

  useFrame((state) => {
    // Subtle pot shaking from boiling
    if (potRef.current) {
      const time = state.clock.elapsedTime
      potRef.current.rotation.z = Math.sin(time * 15) * 0.003
      potRef.current.position.y = Math.sin(time * 20) * 0.002
      potRef.current.position.y = 1
    }
  })

  return (
    <group ref={potRef}  >
      {/* Main Pot Body */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 0.7, 0.6, 16]} />
        <meshStandardMaterial
          color="#2a2a2a"
          metalness={0.8}
          roughness={0.3}
          envMapIntensity={1}
        />
      </mesh>
      
      {/* Pot Bottom */}
      <mesh position={[0, -0.25, 0]} castShadow>
        <cylinderGeometry args={[0.7, 0.7, 0.1, 16]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>
      
      {/* Pot Rim */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <torusGeometry args={[0.8, 0.05, 8, 16]} />
        <meshStandardMaterial
          color="#333333"
          metalness={0.7}
          roughness={0.4}
        />
      </mesh>
      
      {/* Handle 1 */}
      <mesh
        ref={el => handleRefs.current[0] = el}
        position={[0.9, 0.1, 0]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <torusGeometry args={[0.15, 0.03, 8, 16]} />
        <meshStandardMaterial
          color="#444444"
          metalness={0.6}
          roughness={0.5}
        />
      </mesh>
      
      {/* Handle 2 */}
      <mesh
        ref={el => handleRefs.current[1] = el}
        position={[-0.9, 0.1, 0]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <torusGeometry args={[0.15, 0.03, 8, 16]} />
        <meshStandardMaterial
          color="#444444"
          metalness={0.6}
          roughness={0.5}
        />
      </mesh>
      
      {/* Support Legs/Tripod */}
      {[0, 120, 240].map((angle, i) => {
        const x = Math.cos((angle * Math.PI) / 180) * 0.9
        const z = Math.sin((angle * Math.PI) / 180) * 0.9
        return (
          <mesh
            key={`leg-${i}`}
            position={[x, -0.5, z]}
            rotation={[0, (angle * Math.PI) / 180, Math.PI / 12]}
            castShadow
          >
            <cylinderGeometry args={[0.02, 0.02, 0.4]} />
            <meshStandardMaterial
              color="#555555"
              metalness={0.8}
              roughness={0.4}
            />
          </mesh>
        )
      })}
      
      {/* Steam coming from pot edges */}
      {/*
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const x = Math.cos((angle * Math.PI) / 180) * 0.7
        const z = Math.sin((angle * Math.PI) / 180) * 0.7
        return (
          <SteamPuff
            key={`pot-steam-${i}`}
            position={[x, 0.2, z]}
            delay={i * 0.5}
          />
        )
      })}
      */}
    </group>
  )
}

function SteamPuff({ position, delay = 0 }) {
  const steamRef = useRef()
  
  useFrame((state) => {
    if (steamRef.current) {
      const time = state.clock.elapsedTime + delay
      steamRef.current.position.y = 0.4 + Math.sin(time * 2) * 0.1
      steamRef.current.scale.setScalar(0.1 + Math.sin(time * 3) * 0.05)
      steamRef.current.material.opacity = 0.3 + Math.sin(time * 4) * 0.1
    }
  })
  
  return (
    <mesh ref={steamRef} position={position}>
      <planeGeometry args={[0.2, 0.2]} />
      <meshBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}