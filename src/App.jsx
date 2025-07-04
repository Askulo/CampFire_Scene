import React from 'react'
import * as THREE from 'three'
import { OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Environment, Stats } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import './App.css'
import Ground from './components/Ground'
import Logs from './components/Logs' // Uncomment if you want to use Logs component
import Trees from './components/Trees'
import Pots from './components/Pot' // Uncomment if you want to use Pots component
import BoilingWater from './components/BoilingWater' // Uncomment if you want to use BoilingWater component
import Fire from './components/Fire' // Uncomment if you want to use Fire component


const App = () => {
  return (
    <div  className='app'>
      <Canvas
      camera={{position: [0, 5, 8], fov: 60}}
      shadows
      gl={{ antialias: true, alpha: false }}
      onCreated={({gl}) => {
        gl.setClearColor('gray', 1) // Set background color
        gl.shadowMap.enabled = true
        gl.shadowMap.type = THREE.PCFSoftShadowMap // or THREE.PCFShadowMap
      }}
      >

         {/* Lighting */}
        <ambientLight intensity={0.6} color="#1a1a2e" />
        <pointLight 
          position={[0, 4, 0]} 
          intensity={1.4} 
          color="#ff4500" 
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={20}
          shadow-bias={-0.0001}
        />


         {/* Environment */}
        <Environment preset="night" />
        <fog attach="fog" args={['#0a0a0a', 5, 25]} />
        


          {/* Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={15}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
        />

         {/* Post Processing */}
        <EffectComposer>
          <Bloom 
            intensity={0.5}
            luminanceThreshold={0.3}
            luminanceSmoothing={0.9}
            height={300}
          />
        </EffectComposer>
         <Stats />

        {/* Scene Objects */}
        
       <Ground/>
       <Logs/>
       <Trees/>
       <Pots  />
       <BoilingWater  />
       <Fire/>

      </Canvas>

       {/* UI Controls */}
      <div className="controls">
        <h3>🔥 Campfire Scene</h3>
        <p>Use mouse to orbit around</p>
        <p>Scroll to zoom in/out</p>
        <div className="stats">
          <div>🌲 Forest Environment</div>
          <div>🔥 Animated Fire</div>
          <div>🍲 Boiling Water</div>
          <div>💨 Steam Effects</div>
        </div>
      </div>
    </div>
      
    
  )
}

export default App
