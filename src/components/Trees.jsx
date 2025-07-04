import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Trees() {
const treePositions = [
    // Background trees (original)
    { position: [-8, 0, -8], scale: [1, 1.5, 1], type: 'pine' },
    { position: [-6, 0, -10], scale: [0.8, 1.2, 0.8], type: 'pine' },
    { position: [-10, 0, -6], scale: [1.2, 1.8, 1.2], type: 'oak' },
    { position: [8, 0, -8], scale: [0.9, 1.3, 0.9], type: 'pine' },
    { position: [10, 0, -5], scale: [1.1, 1.6, 1.1], type: 'oak' },
    { position: [6, 0, -12], scale: [0.7, 1.1, 0.7], type: 'pine' },
    { position: [-12, 0, 2], scale: [1.3, 2.0, 1.3], type: 'oak' },
    { position: [12, 0, 3], scale: [1.0, 1.4, 1.0], type: 'pine' },
    { position: [-5, 0, 8], scale: [0.8, 1.2, 0.8], type: 'oak' },
    { position: [7, 0, 9], scale: [0.9, 1.3, 0.9], type: 'pine' },
    { position: [0, 0, -15], scale: [1.4, 2.2, 1.4], type: 'oak' },
    { position: [-15, 0, 0], scale: [1.2, 1.8, 1.2], type: 'pine' },
    { position: [15, 0, -2], scale: [1.1, 1.6, 1.1], type: 'oak' },
    // Additional trees
    { position: [-13, 0, -10], scale: [1.0, 1.5, 1.0], type: 'pine' },
    { position: [13, 0, -11], scale: [1.2, 1.7, 1.2], type: 'oak' },
    { position: [-9, 0, 12], scale: [0.9, 1.3, 0.9], type: 'pine' },
    { position: [9, 0, 13], scale: [1.1, 1.5, 1.1], type: 'oak' },
    { position: [-16, 0, 5], scale: [1.3, 2.0, 1.3], type: 'pine' },
    { position: [16, 0, 6], scale: [1.0, 1.4, 1.0], type: 'oak' },
    { position: [-3, 0, -17], scale: [1.2, 1.8, 1.2], type: 'pine' },
    { position: [3, 0, -18], scale: [1.1, 1.6, 1.1], type: 'oak' },
    { position: [0, 0, 16], scale: [1.4, 2.2, 1.4], type: 'pine' },
    { position: [-17, 0, -3], scale: [1.2, 1.8, 1.2], type: 'oak' },
    { position: [17, 0, 2], scale: [1.1, 1.6, 1.1], type: 'pine' },
]

  return (
    <group>
      {treePositions.map((tree, i) => (
        <Tree
          key={`tree-${i}`}
          position={tree.position}
          scale={tree.scale}
          type={tree.type}
          index={i}
        />
      ))}
    </group>
  )
}

function Tree({ position, scale, type, index }) {
  const treeRef = useRef()
  const leavesRefs = useRef([])

  useFrame((state) => {
    // Gentle swaying in the wind
    if (treeRef.current) {
      const time = state.clock.elapsedTime
      treeRef.current.rotation.z = Math.sin(time * 0.5 + index) * 0.02
      treeRef.current.rotation.x = Math.cos(time * 0.3 + index) * 0.01
    }

    // Animate leaves
    leavesRefs.current.forEach((leaves, i) => {
      if (leaves) {
        const time = state.clock.elapsedTime
        leaves.rotation.y = Math.sin(time * 0.8 + index + i) * 0.05
        leaves.rotation.z = Math.cos(time * 0.6 + index + i) * 0.03
      }
    })
  })

  if (type === 'pine') {
    return (
      <group ref={treeRef} position={position} scale={scale}>
        {/* Pine trunk */}
        <mesh position={[0, 2, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.2, 4, 8]} />
          <meshStandardMaterial
            color="#4a3728"
            roughness={0.9}
            metalness={0}
          />
        </mesh>
        
        {/* Pine foliage layers */}
        {[0, 1, 2, 3].map((layer) => (
          <mesh
            key={`pine-layer-${layer}`}
            ref={el => leavesRefs.current[layer] = el}
            position={[0, 3 + layer * 0.6, 0]}
            castShadow
          >
            <coneGeometry args={[
              1.2 - layer * 0.2,
              1.5 - layer * 0.1,
              8
            ]} />
            <meshStandardMaterial
              color={new THREE.Color().setHSL(
                0.3, 0.6, 0.2 + layer * 0.05
              )}
              roughness={0.8}
              metalness={0}
            />
          </mesh>
        ))}
      </group>
    )
  } else {
    // Oak tree
    return (
      <group ref={treeRef} position={position} scale={scale}>
        {/* Oak trunk */}
        <mesh position={[0, 2.5, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.3, 5, 8]} />
          <meshStandardMaterial
            color="#5d4e37"
            roughness={0.9}
            metalness={0}
          />
        </mesh>
        
        {/* Oak branches */}
        {[0, 1, 2, 3, 4].map((branch) => {
          const angle = (branch / 5) * Math.PI * 2
          const x = Math.cos(angle) * 0.8
          const z = Math.sin(angle) * 0.8
          return (
            <mesh
              key={`branch-${branch}`}
              position={[x, 4 + branch * 0.2, z]}
              rotation={[
                (Math.random() - 0.5) * 0.5,
                angle,
                Math.PI / 4 + (Math.random() - 0.5) * 0.3
              ]}
              castShadow
            >
              <cylinderGeometry args={[0.05, 0.08, 1.5, 6]} />
              <meshStandardMaterial
                color="#4a3728"
                roughness={0.9}
                metalness={0}
              />
            </mesh>
          )
        })}
        
        {/* Oak foliage clusters */}
        {Array.from({ length: 8 }, (_, cluster) => {
          const angle = (cluster / 8) * Math.PI * 2 + Math.random() * 0.5
          const radius = 0.8 + Math.random() * 0.4
          const x = Math.cos(angle) * radius
          const z = Math.sin(angle) * radius
          return (
            <mesh
              key={`oak-cluster-${cluster}`}
              ref={el => leavesRefs.current[cluster] = el}
              position={[x, 4.5 + Math.random() * 0.5, z]}
              castShadow
            >
              <sphereGeometry args={[0.6 + Math.random() * 0.3, 8, 6]} />
              <meshStandardMaterial
                color={new THREE.Color().setHSL(
                  0.25 + Math.random() * 0.1,
                  0.7,
                  0.3 + Math.random() * 0.2
                )}
                roughness={0.8}
                metalness={0}
              />
            </mesh>
          )
        })}
      </group>
    )
  }
}