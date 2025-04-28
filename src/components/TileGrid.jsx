import React, { useRef, useMemo } from 'react'
import AnimatedTile from './AnimatedTile'

export default function TileGrid({ width, height, selected, onSelect }) {
  const prevKeys = useRef(new Set())

  const tiles = useMemo(() => {
    const next = new Set()
    const arr = []
    for (let x = 0; x < width; x++) {
      for (let z = 0; z < height; z++) {
        const key  = `${x}-${z}`
        next.add(key)
        const isNew = !prevKeys.current.has(key)
        arr.push({ key, x, z, isNew })
      }
    }
    prevKeys.current = next
    return arr
  }, [width, height])

  return tiles.map(({ key, x, z, isNew }) => (
    <AnimatedTile
      key={key}
      x={x}
      z={z}
      isNew={isNew}
      selected={selected}
      onSelect={onSelect}
    />
  ))
}
