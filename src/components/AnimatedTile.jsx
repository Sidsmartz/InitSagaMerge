import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function AnimatedTile({ x, z, isNew, selected, onSelect }) {
  const ref       = useRef()
  const startRef  = useRef()

  useFrame((state, delta) => {
    const mesh = ref.current
    if (!mesh) return

    if (isNew) {
      if (!startRef.current) startRef.current = state.clock.elapsedTime
      const t = Math.min((state.clock.elapsedTime - startRef.current) * 4, 1)
      mesh.scale.set(t, t, t)
      const y = THREE.MathUtils.lerp(-0.05, 0, t)
      mesh.position.set(x, y, z)
    } else {
      // on selection hover
      const targetY = selected && selected.x === x && selected.z === z ? 0.3 : 0
      mesh.position.y = THREE.MathUtils.lerp(mesh.position.y, targetY, delta * 5)
      mesh.scale.set(1, 1, 1)
      mesh.position.x = x
      mesh.position.z = z
    }
  })

  return (
    <mesh
      ref={ref}
      onClick={() => onSelect({ x, z })}
    >
      <boxGeometry args={[1, 0.1, 1]} />
      <meshStandardMaterial
        color={
          selected && selected.x === x && selected.z === z
            ? 'limegreen'
            : 'gray'
        }
      />
    </mesh>
  )
}
