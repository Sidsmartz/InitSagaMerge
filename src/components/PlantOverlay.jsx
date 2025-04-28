import React from 'react'
import { Canvas } from '@react-three/fiber'
import { BoxGeometry } from 'three'

export default function PlantOverlay({ plant, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-plant-gray text-plant-green rounded-lg shadow-lg p-6 w-2/3 h-2/3 relative flex">
        <button onClick={onClose} className="absolute top-4 right-4 text-xl font-sans text-gray-600 hover:text-black">×</button>

        {/* Left: 3D Model */}
        <div className="w-1/2 h-full">
          <Canvas>
            <ambientLight />
            <directionalLight position={[5,5,5]} />
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="gray" />
            </mesh>
            {/* Load same GLB for now */}
          </Canvas>
        </div>

        {/* Right: Plant Info */}
        <div className="w-1/2 p-4 flex flex-col">
          <h2 className="text-2xl mb-4">hello</h2>
          <p>hi</p>
        </div>
      </div>
    </div>
  )
}
