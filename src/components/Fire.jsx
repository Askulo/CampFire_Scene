import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending } from 'three'
import * as THREE from 'three'

export default function Fire() {
  const fireGroup = useRef()
  const flamesRefs = useRef([])
  const smokeRefs = useRef([])
  const sparkRefs = useRef([])

  // Create flame particles
  const flames = useMemo(() => {
    const flameData = []
    for (let i = 0; i < 8; i++) {
      flameData.push({
        position: [
          (Math.random() - 0.5) * 0.5,
          Math.random() * 0.5,
          (Math.random() - 0.5) * 0.5
        ],
        scale: Math.random() * 0.5 + 0.3,
        speed: Math.random() * 0.02 + 0.01
      })
    }
    return flameData
  }, [])

  // Create smoke particles
  const smoke = useMemo(() => {
    const smokeData = []
    for (let i = 0; i < 12; i++) {
      smokeData.push({
        position: [
          (Math.random() - 0.5) * 0.3,
          Math.random() * 2 + 1,
          (Math.random() - 0.5) * 0.3
        ],
        scale: Math.random() * 0.8 + 0.4,
        speed: Math.random() * 0.01 + 0.005
      })
    }
    return smokeData
  }, [])

  // Create sparks
  const sparks = useMemo(() => {
    const sparkData = []
    for (let i = 0; i < 15; i++) {
      sparkData.push({
        position: [
          (Math.random() - 0.5) * 0.8,
          Math.random() * 1.5,
          (Math.random() - 0.5) * 0.8
        ],
        velocity: [
          (Math.random() - 0.5) * 0.02,
          Math.random() * 0.03 + 0.01,
          (Math.random() - 0.5) * 0.02
        ],
        life: Math.random() * 100 + 50
      })
    }
    return sparkData
  }, [])

  useFrame((state) => {
    const time = state.clock.elapsedTime

    // Animate flames
    flamesRefs.current.forEach((flame, i) => {
      if (flame) {
        const flameData = flames[i]
        flame.position.y = Math.sin(time * 8 + i) * 0.1 + flameData.position[1] + 0.5
        flame.scale.setScalar(
          flameData.scale * (1 + Math.sin(time * 10 + i) * 0.3)
        )
        flame.rotation.z = Math.sin(time * 5 + i) * 0.2
        
        // Color animation
        const intensity = 0.8 + Math.sin(time * 12 + i) * 0.2
        flame.material.color.setHSL(0.08, 1, intensity)
      }
    })

    // Animate smoke
    smokeRefs.current.forEach((smokeParticle, i) => {
      if (smokeParticle) {
        const smokeData = smoke[i]
        smokeParticle.position.y += smokeData.speed
        smokeParticle.position.x += Math.sin(time + i) * 0.002
        smokeParticle.position.z += Math.cos(time + i) * 0.002
        
        // Reset smoke when it goes too high
        if (smokeParticle.position.y > 4) {
          smokeParticle.position.y = 1
          smokeParticle.position.x = smokeData.position[0]
          smokeParticle.position.z = smokeData.position[2]
        }
        
        // Fade out as it rises
        smokeParticle.material.opacity = Math.max(0, 0.3 - (smokeParticle.position.y - 1) * 0.1)
      }
    })

    // Animate sparks
    sparkRefs.current.forEach((spark, i) => {
      if (spark) {
        const sparkData = sparks[i]
        spark.position.x += sparkData.velocity[0]
        spark.position.y += sparkData.velocity[1]
        spark.position.z += sparkData.velocity[2]
        
        // Apply gravity
        sparkData.velocity[1] -= 0.0008
        
        sparkData.life--
        
        // Reset spark when life ends
        if (sparkData.life <= 0 || spark.position.y < 0) {
          spark.position.set(...sparkData.position)
          sparkData.velocity = [
            (Math.random() - 0.5) * 0.02,
            Math.random() * 0.03 + 0.01,
            (Math.random() - 0.5) * 0.02
          ]
          sparkData.life = Math.random() * 100 + 50
        }
      }
    })
  })

  return (
    <group ref={fireGroup} position={[0, 0.2, 0]}>
      {/* Main Fire Core */}
      <pointLight
        position={[0, 0.5, 0]}
        intensity={2}
        color="#ff4500"
        distance={5}
        decay={2}
      />
      
      {/* Flame Particles */}
      {/* {flames.map((flame, i) => (
        <mesh
          key={`flame-${i}`}
          ref={el => flamesRefs.current[i] = el}
          position={flame.position}
        >
          <planeGeometry args={[flame.scale, flame.scale]} />
          <meshBasicMaterial
            color="#ff6600"
            transparent
            opacity={0.8}
            blending={AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
       */}
      {/* Smoke Particles */}
      {smoke.map((smokeParticle, i) => (
        <mesh
          key={`smoke-${i}`}
          ref={el => smokeRefs.current[i] = el}
          position={smokeParticle.position}
        >
          <planeGeometry args={[smokeParticle.scale, smokeParticle.scale]} />
          <meshBasicMaterial
            color="#444444"
            transparent
            opacity={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      
      {/* Sparks */}
      {sparks.map((spark, i) => (
        <mesh
          key={`spark-${i}`}
          ref={el => sparkRefs.current[i] = el}
          position={spark.position}
        >
          <sphereGeometry args={[0.02]} />
          <meshBasicMaterial
            color="#ffaa00"
            transparent
            opacity={0.9}
            blending={AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  )
}