import React, { useRef, useMemo } from 'react'
import AnimatedTile from './AnimatedTile'

export default function TileGrid({ width, height, selected, onSelect, tilePlants, onPlantClick, zoomedPlantTile, onPlantDoubleClick, hoveredTile, setHoveredTile }) {
  const prevKeys = useRef(new Set())

  // Check if a tile is part of any plant
  const getTilePlant = (x, z) => {
    for (const [key, plant] of Object.entries(tilePlants)) {
      const [baseX, baseZ] = key.split('-').map(Number);
      if (x >= baseX && x < baseX + plant.size[0] &&
          z >= baseZ && z < baseZ + plant.size[1]) {
        return { plant, isBase: x === baseX && z === baseZ };
      }
    }
    return { plant: null, isBase: false };
  };

  const tiles = useMemo(() => {
    const next = new Set()
    const arr = []
    for (let x = 0; x < width; x++) {
      for (let z = 0; z < height; z++) {
        const key = `${x}-${z}`
        next.add(key)
        const isNew = !prevKeys.current.has(key)
        const { plant, isBase } = getTilePlant(x, z)
        arr.push({ key, x, z, isNew, plant: isBase ? plant : null })
      }
    }
    prevKeys.current = next
    return arr
  }, [width, height, tilePlants])

  // Check if a plant can be placed at the given position
  const canPlacePlant = (x, z, plantSize) => {
    // Check if any tile in the plant's footprint is already occupied
    for (let dx = 0; dx < plantSize[0]; dx++) {
      for (let dz = 0; dz < plantSize[1]; dz++) {
        const checkX = x + dx;
        const checkZ = z + dz;
        
        // Check if tile is within grid bounds
        if (checkX >= width || checkZ >= height) {
          return false;
        }
        
        // Check if tile is part of another plant
        const { plant } = getTilePlant(checkX, checkZ);
        if (plant) {
          return false;
        }
      }
    }
    return true;
  };

  return tiles.map(({ key, x, z, isNew, plant }) => (
    <AnimatedTile
      key={key}
      x={x}
      z={z}
      isNew={isNew}
      selected={selected}
      onSelect={onSelect}
      plant={plant}
      onPlantClick={onPlantClick}
      zoomedPlantTile={zoomedPlantTile}
      onPlantDoubleClick={onPlantDoubleClick}
      hoveredTile={hoveredTile}
      setHoveredTile={setHoveredTile}
    />
  ))
}
