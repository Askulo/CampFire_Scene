import React from 'react'
import * as THREE from 'three'

export default function Logs() {
  // Create wood texture
  const woodTexture = new THREE.TextureLoader().load('data:image/svg+xml;base64,' + btoa(`
    <svg width="256" height="256" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="wood" x="0" y="0" width="32" height="256" patternUnits="userSpaceOnUse">
          <rect width="32" height="256" fill="#8B4513"/>
          <rect x="0" y="0" width="2" height="256" fill="#654321"/>
          <rect x="8" y="0" width="1" height="256" fill="#654321"/>
          <rect x="16" y="0" width="2" height="256" fill="#654321"/>
          <rect x="24" y="0" width="1" height="256" fill="#654321"/>
          <rect x="30" y="0" width="2" height="256" fill="#654321"/>
        </pattern>
      </defs>
      <rect width="256" height="256" fill="url(#wood)"/>
    </svg>
  `))
  
  woodTexture.wrapS = THREE.RepeatWrapping
  woodTexture.wrapT = THREE.RepeatWrapping
  woodTexture.repeat.set(1, 4)

  const logPositions = [
    // Bottom layer - foundation logs
    { position: [0, 0.05, 0], rotation: [0, 0, 0], scale: [0.8, 0.1, 0.1] },
    { position: [0, 0.05, 0], rotation: [0, Math.PI / 2, 0], scale: [0.8, 0.1, 0.1] },
    
    // Second layer - crossed logs
    { position: [0.3, 0.15, 0.3], rotation: [0, Math.PI / 4, 0], scale: [0.9, 0.08, 0.08] },
    { position: [-0.3, 0.15, -0.3], rotation: [0, Math.PI / 4, 0], scale: [0.9, 0.08, 0.08] },
    { position: [-0.3, 0.15, 0.3], rotation: [0, -Math.PI / 4, 0], scale: [0.9, 0.08, 0.08] },
    { position: [0.3, 0.15, -0.3], rotation: [0, -Math.PI / 4, 0], scale: [0.9, 0.08, 0.08] },
    
    // Third layer - leaning logs
    { position: [0.4, 0.3, 0], rotation: [0, 0, Math.PI / 12], scale: [0.7, 0.07, 0.07] },
    { position: [-0.4, 0.3, 0], rotation: [0, 0, -Math.PI / 12], scale: [0.7, 0.07, 0.07] },
    { position: [0, 0.3, 0.4], rotation: [Math.PI / 12, 0, 0], scale: [0.7, 0.07, 0.07] },
    { position: [0, 0.3, -0.4], rotation: [-Math.PI / 12, 0, 0], scale: [0.7, 0.07, 0.07] },
  ]

  return (
    <group>
      {logPositions.map((log, i) => (
        <group key={`log-${i}`} position={log.position} rotation={log.rotation}>
          {/* Main log body */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[log.scale[1], log.scale[1], log.scale[0], 12]} />
            <meshStandardMaterial
              map={woodTexture}
              color="#8B4513"
              roughness={0.8}
              metalness={0.1}
            />
          </mesh>
          
          {/* Log end caps */}
          <mesh position={[log.scale[0] / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[log.scale[1], log.scale[1], 0.02, 12]} />
            <meshStandardMaterial
              color="#654321"
              roughness={0.9}
              metalness={0.05}
            />
          </mesh>
          
          <mesh position={[-log.scale[0] / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[log.scale[1], log.scale[1], 0.02, 12]} />
            <meshStandardMaterial
              color="#654321"
              roughness={0.9}
              metalness={0.05}
            />
          </mesh>
          
          {/* Add some bark texture with small bumps */}
          {Array.from({ length: 3 }, (_, j) => (
            <mesh
              key={`bark-${j}`}
              position={[
                (Math.random() - 0.5) * log.scale[0] * 0.8,
                (Math.random() - 0.5) * log.scale[1] * 0.5,
                log.scale[1] + 0.01
              ]}
              rotation={[Math.random(), Math.random(), Math.random()]}
              castShadow
            >
              <sphereGeometry args={[0.01, 6, 4]} />
              <meshStandardMaterial
                color="#4a3728"
                roughness={1}
                metalness={0}
              />
            </mesh>
          ))}
        </group>
      ))}
      
      {/* Some scattered wood chips and debris */}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh
          key={`debris-${i}`}
          position={[
            (Math.random() - 0.5) * 2,
            0.01,
            (Math.random() - 0.5) * 2
          ]}
          rotation={[Math.random(), Math.random(), Math.random()]}
          castShadow
        >
          <boxGeometry args={[
            Math.random() * 0.05 + 0.02,
            Math.random() * 0.02 + 0.01,
            Math.random() * 0.03 + 0.01
          ]} />
          <meshStandardMaterial
            color="#654321"
            roughness={0.9}
            metalness={0}
          />
        </mesh>
      ))}
      
      {/* Charred areas on logs */}
      {logPositions.slice(0, 4).map((log, i) => (
        <mesh
          key={`char-${i}`}
          position={[...log.position]}
          rotation={[...log.rotation]}
          scale={[log.scale[0] * 1.02, log.scale[1] * 1.02, log.scale[2] * 1.02]}
        >
          <cylinderGeometry args={[log.scale[1] * 1.02, log.scale[1] * 1.02, log.scale[0] * 0.3, 12]} />
          <meshStandardMaterial
            color="#1a1a1a"
            roughness={0.95}
            metalness={0}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  )
}