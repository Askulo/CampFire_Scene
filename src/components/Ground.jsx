import React from 'react';
import * as THREE from 'three';




const Ground = () => {

    const groundTexture = new THREE.TextureLoader().load('data:image/svg+xml;base64,' + btoa(`
    <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="noise">
          <feTurbulence baseFrequency="0.9" numOctaves="4" result="noise"/>
          <feColorMatrix in="noise" type="saturate" values="0"/>
        </filter>
      </defs>
      <rect width="512" height="512" fill="#2d1810" filter="url(#noise)"/>
      <circle cx="100" cy="100" r="3" fill="#1a1a0a" opacity="0.6"/>
      <circle cx="200" cy="150" r="2" fill="#1a1a0a" opacity="0.5"/>
      <circle cx="300" cy="80" r="4" fill="#1a1a0a" opacity="0.7"/>
      <circle cx="400" cy="200" r="2" fill="#1a1a0a" opacity="0.4"/>
      <circle cx="150" cy="300" r="3" fill="#1a1a0a" opacity="0.6"/>
      <circle cx="350" cy="350" r="2" fill="#1a1a0a" opacity="0.5"/>
    </svg>
  `))

  groundTexture.wrapS = THREE.RepeatWrapping;
  groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(4, 4);
  return (
    <group>
        <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        receiveShadow
        >
       <planeGeometry args={[200, 200]} />
       <meshStandardMaterial
       map={groundTexture}
       color="#3d2817"
       roughness={0.8}
       metalness={0.05}
       />

        </mesh>

        {/* Scattered leaves and forest debris */}
      {Array.from({ length: 30 }, (_, i) => (
        <mesh
          key={`leaf-${i}`}
          position={[
            (Math.random() - 0.5) * 15,
            0.001 + Math.random() * 0.01,
            (Math.random() - 0.5) * 15
          ]}
          rotation={[
            -Math.PI / 2 + (Math.random() - 0.5) * 0.2,
            Math.random() * Math.PI * 2,
            (Math.random() - 0.5) * 0.3
          ]}
        >
          <planeGeometry args={[
            Math.random() * 0.15 + 0.05,
            Math.random() * 0.1 + 0.03
          ]} />
          <meshStandardMaterial
            color={new THREE.Color().setHSL(
              0.08 + Math.random() * 0.1, // Brown to yellow hues
              0.6 + Math.random() * 0.4,
              0.2 + Math.random() * 0.3
            )}
            roughness={0.8}
            metalness={0}
            transparent
            opacity={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
       {/* Rocks around the campfire */}
      {Array.from({ length: 20 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2
        const radius = 1.5 + Math.random() * 1.5
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        
        return (
          <mesh
            key={`rock-${i}`}
            position={[x, Math.random() * 0.05, z]}
            rotation={[
              (Math.random() - 0.5) * 0.3,
              Math.random() * Math.PI * 2,
              (Math.random() - 0.5) * 0.3
            ]}
            castShadow
            receiveShadow
          >
            <dodecahedronGeometry args={[Math.random() * 0.15 + 0.1]} />
            <meshStandardMaterial
              color={new THREE.Color().setHSL(
                0, 0, 0.3 + Math.random() * 0.3
              )}
              roughness={0.9}
              metalness={0.1}
            />
          </mesh>

        )
      })}

        {/* Small twigs and sticks */}
      {Array.from({ length: 15 }, (_, i) => (
        <mesh
          key={`stick-${i}`}
          position={[
            (Math.random() - 0.5) * 10,
            0.01,
            (Math.random() - 0.5) * 10
          ]}
          rotation={[
            0,
            Math.random() * Math.PI * 2,
            0
          ]}
          castShadow
        >
          <cylinderGeometry args={[
            Math.random() * 0.01 + 0.005,
            Math.random() * 0.01 + 0.005,
            Math.random() * 0.3 + 0.1,
            6
          ]} />
          <meshStandardMaterial
            color="#654321"
            roughness={0.8}
            metalness={0}
          />
        </mesh>
      ))}

      {/* Moss patches */}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh
          key={`moss-${i}`}
          position={[
            (Math.random() - 0.5) * 12,
            0.002,
            (Math.random() - 0.5) * 12
          ]}
          rotation={[-Math.PI / 2, 0, Math.random() * Math.PI * 2]}
        >
          <circleGeometry args={[Math.random() * 0.3 + 0.2]} />
          <meshStandardMaterial
            color="#2d4a2d"
            roughness={1}
            metalness={0}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
    </group>
  )
}

export default Ground
