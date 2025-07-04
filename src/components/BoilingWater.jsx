import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function BoilingWater() {
  const waterRef = useRef()
  const bubbleRefs = useRef([])
  const steamRefs = useRef([])



  // Create bubbles
  const bubbles = useMemo(() => {
    const bubbleData = []
    for (let i = 0; i < 20; i++) {
      bubbleData.push({
        position: [
          (Math.random() - 0.5) * 1.2,
          -0.2,
          (Math.random() - 0.5) * 1.2
        ],
        scale: Math.random() * 0.05 + 0.02,
        speed: Math.random() * 0.02 + 0.01,
        life: Math.random() * 200 + 100
      })
    }
    return bubbleData
  }, [])

  // Create steam particles
  const steam = useMemo(() => {
    const steamData = []
    for (let i = 0; i < 15; i++) {
      steamData.push({
        position: [
          (Math.random() - 0.5) * 0.8,
          0.1,
          (Math.random() - 0.5) * 0.8
        ],
        scale: Math.random() * 0.3 + 0.1,
        speed: Math.random() * 0.015 + 0.008
      })
    }
    return steamData
  }, [])

  useFrame((state) => {
    const time = state.clock.elapsedTime

    // Animate water surface
    if (waterRef.current) {
      const positions = waterRef.current.geometry.attributes.position
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i)
        const z = positions.getZ(i)
        const wave1 = Math.sin(time * 4 + x * 10) * 0.01
        const wave2 = Math.cos(time * 3 + z * 8) * 0.008
        const wave3 = Math.sin(time * 6 + (x + z) * 5) * 0.005
        positions.setY(i, wave1 + wave2 + wave3)
      }
      positions.needsUpdate = true
    }

    // Animate bubbles
    bubbleRefs.current.forEach((bubble, i) => {
      if (bubble) {
        const bubbleData = bubbles[i]
        bubble.position.y += bubbleData.speed
        
        // Add some wobble to bubbles
        bubble.position.x += Math.sin(time * 8 + i) * 0.001
        bubble.position.z += Math.cos(time * 6 + i) * 0.001
        
        bubbleData.life--
        
        // Reset bubble when it reaches surface or life ends
        if (bubble.position.y > 0.15 || bubbleData.life <= 0) {
          bubble.position.set(
            (Math.random() - 0.5) * 1.2,
            -0.2,
            (Math.random() - 0.5) * 1.2
          )
          bubbleData.life = Math.random() * 200 + 100
        }
        
        // Scale bubbles as they rise
        const scaleMultiplier = 1 + (bubble.position.y + 0.2) * 2
        bubble.scale.setScalar(bubbleData.scale * scaleMultiplier)
      }
    })

    // Animate steam
    steamRefs.current.forEach((steamParticle, i) => {
      if (steamParticle) {
        const steamData = steam[i]
        steamParticle.position.y += steamData.speed
        steamParticle.position.x += Math.sin(time * 2 + i) * 0.003
        steamParticle.position.z += Math.cos(time * 1.5 + i) * 0.003
        
        // Reset steam when it goes too high
        if (steamParticle.position.y > 2) {
          steamParticle.position.y = 0.1
          steamParticle.position.x = steamData.position[0]
          steamParticle.position.z = steamData.position[2]
        }
        
        // Fade and scale steam as it rises
        const height = steamParticle.position.y
        steamParticle.material.opacity = Math.max(0, 0.4 - height * 0.2)
        steamParticle.scale.setScalar(steamData.scale * (1 + height * 0.5))
      }
    })
  })

  return (
    <group  position={[0, 1.2, 0]}>
      {/* Water Surface */}
      <mesh
        ref={waterRef}
        position={[0, 0.05, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[1.4, 1.4, 32, 32]} />
        <meshStandardMaterial
          color="#4a9eff"
          transparent
          opacity={0.8}
          metalness={0.1}
          roughness={0.1}
          envMapIntensity={1}
        />
      </mesh>
      
      {/* Bubbles */}
      {bubbles.map((bubble, i) => (
        <mesh
          key={`bubble-${i}`}
          ref={el => bubbleRefs.current[i] = el}
          position={bubble.position}
        >
          <sphereGeometry args={[bubble.scale, 8, 6]} />
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.6}
            metalness={0}
            roughness={0.1}
          />
        </mesh>
      ))}
      
      {/* Steam Particles */}
      {steam.map((steamParticle, i) => (
        <mesh
          key={`steam-${i}`}
          ref={el => steamRefs.current[i] = el}
          position={steamParticle.position}
        >
          <planeGeometry args={[steamParticle.scale, steamParticle.scale]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      
      {/* Boiling Sound Indicator (Visual) */}
      <BoilingSoundWaves />
    </group>
  )
}

function BoilingSoundWaves() {
  const waveRefs = useRef([])
  
  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    waveRefs.current.forEach((wave, i) => {
      if (wave) {
        const scale = 0.5 + Math.sin(time * 10 + i * 2) * 0.3
        wave.scale.setScalar(scale)
        wave.material.opacity = 0.1 + Math.sin(time * 8 + i * 1.5) * 0.05
      }
    })
  })
  
  return (
    <group position={[0, 0.1, 0]}>
      {[0, 1, 2].map((i) => (
        <mesh
          key={`wave-${i}`}
          ref={el => waveRefs.current[i] = el}
          position={[0, i * 0.02, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[0.2 + i * 0.1, 0.3 + i * 0.1, 16]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}