import React, { useRef, useMemo } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Camera controller component to move the camera smoothly
function CameraController({ target, zoomedPlantTile }) {
  const { camera, controls } = useThree();
  useFrame((_, delta) => {
    if (zoomedPlantTile && target) {
      // Zoom in on the plant
      const desired = new THREE.Vector3(target[0], 1, target[2] + 1.5);
      camera.position.lerp(desired, delta * 2);
      camera.lookAt(target[0], 0.15, target[2]);
      if (controls) controls.enabled = true;
    } else if (target) {
      const desired = new THREE.Vector3(target[0], 5, target[2] + 5);
      camera.position.lerp(desired, delta * 2);
      camera.lookAt(target[0], 0, target[2]);
      if (controls) controls.enabled = false;
    }
  });
  return null;
}

// Plant model component
function PlantModel({ position, onClick, onDoubleClick, visible }) {
  const { scene } = useGLTF('/models/plant.glb');
  if (!visible) return null;
  return (
    <primitive
      object={scene.clone()}
      position={[position[0], 0.15, position[2]]}
      scale={[0.3, 0.3, 0.3]}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      castShadow
      receiveShadow
    />
  );
}

// AnimatedTile component with pop-up animation using GSAP
function AnimatedTile({ x, z, isNew, selected, onSelect, plant, onPlantClick, zoomedPlantTile, onPlantDoubleClick, hoveredTile, setHoveredTile }) {
  const ref = useRef();
  const startRef = useRef();
  const isZoomed = zoomedPlantTile && zoomedPlantTile.x === x && zoomedPlantTile.z === z;
  const isHovered = hoveredTile && hoveredTile.x === x && hoveredTile.z === z;

  useFrame((state, delta) => {
    const mesh = ref.current;
    if (!mesh) return;
    if (isNew) {
      if (!startRef.current) startRef.current = state.clock.elapsedTime;
      const t = Math.min((state.clock.elapsedTime - startRef.current) * 4, 1);
      mesh.scale.set(t, t, t);
      const y = THREE.MathUtils.lerp(-0.05, 0, t);
      mesh.position.set(x, y, z);
    } else {
      // Hover effect: raise tile if hovered, else default or selected logic
      let targetY = 0;
      if (isHovered) {
        targetY = 0.3;
      } else {
        const isSelectedWithPlant = selected && selected.x === x && selected.z === z && plant;
        targetY = isSelectedWithPlant ? 0 : (selected && selected.x === x && selected.z === z ? 0.3 : 0);
      }
      mesh.position.y = THREE.MathUtils.lerp(mesh.position.y, targetY, delta * 5);
      mesh.scale.set(1, 1, 1);
      mesh.position.x = x;
      mesh.position.z = z;
    }
  });

  // Green if selected
  const isSelected = selected && selected.x === x && selected.z === z;
  const color = isSelected ? 'limegreen' : 'gray';

  // Only show plant if not zoomed, or if this is the zoomed plant
  const showPlant = plant && (!zoomedPlantTile || isZoomed);

  return (
    <group>
      <mesh
        ref={ref}
        onClick={() => onSelect({ x, z })}
        onPointerOver={() => setHoveredTile({ x, z })}
        onPointerOut={() => setHoveredTile(null)}
      >
        <boxGeometry args={[1, 0.1, 1]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <PlantModel
        position={[x, 0, z]}
        onClick={(e) => {
          e.stopPropagation();
          onPlantClick({ x, z, plant });
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          if (showPlant && plant) onPlantDoubleClick({ x, z, plant });
        }}
        visible={showPlant}
      />
    </group>
  );
}

// TileGrid component to generate the tiles and manage tile states
function TileGrid({ width, height, selected, onSelect, tilePlants, onPlantClick, zoomedPlantTile, onPlantDoubleClick, hoveredTile, setHoveredTile }) {
  const prevKeys = useRef(new Set());
  const tiles = useMemo(() => {
    const next = new Set();
    const arr = [];
    for (let x = 0; x < width; x++) {
      for (let z = 0; z < height; z++) {
        const key = `${x}-${z}`;
        next.add(key);
        const isNew = !prevKeys.current.has(key);
        arr.push({ key, x, z, isNew });
      }
    }
    prevKeys.current = next;
    return arr;
  }, [width, height]);
  return tiles.map(({ key, x, z, isNew }) => (
    <AnimatedTile
      key={key}
      x={x}
      z={z}
      isNew={isNew}
      selected={selected}
      onSelect={onSelect}
      plant={tilePlants[key]}
      onPlantClick={onPlantClick}
      zoomedPlantTile={zoomedPlantTile}
      onPlantDoubleClick={onPlantDoubleClick}
      hoveredTile={hoveredTile}
      setHoveredTile={setHoveredTile}
    />
  ));
}

// Overlay for picking a plant
export function PlantPickerOverlay({ onPick, onClose }) {
  const samplePlants = [
    { id: 'plant1', name: 'Sample Plant', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=256&h=256', model: '/models/plant.glb', description: 'A beautiful sample plant.' }
  ];
  return (
    <div style={{ position: 'fixed', left: 0, right: 0, bottom: 0, background: 'rgba(30,30,30,0.95)', padding: 16, display: 'flex', justifyContent: 'center', zIndex: 100 }}>
      {samplePlants.map(plant => (
        <div key={plant.id} style={{ margin: 8, textAlign: 'center', cursor: 'pointer' }} onClick={() => onPick(plant)}>
          <img src={plant.img} alt={plant.name} style={{ width: 64, height: 64, borderRadius: 8, objectFit: 'cover', border: '2px solid #4ade80' }} />
          <div style={{ color: 'white', marginTop: 4 }}>{plant.name}</div>
        </div>
      ))}
      <button onClick={onClose} style={{ marginLeft: 24, color: '#fff', background: '#222', border: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer' }}>Cancel</button>
    </div>
  );
}

// Overlay for plant info
export function PlantInfoOverlay({ plant, onClose, onRemove }) {
  if (!plant) return null;
  return (
    <div style={{ position: 'fixed', left: 0, right: 0, bottom: 0, background: 'rgba(30,30,30,0.97)', padding: 24, zIndex: 101, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <img src={plant.img} alt={plant.name} style={{ width: 80, height: 80, borderRadius: 12, objectFit: 'cover', marginRight: 24 }} />
      <div>
        <h2 style={{ fontSize: 24, margin: 0 }}>{plant.name}</h2>
        <p style={{ margin: '8px 0 0 0' }}>{plant.description}</p>
      </div>
      <button onClick={onClose} style={{ marginLeft: 32, color: '#fff', background: '#222', border: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer' }}>Close</button>
      {onRemove && (
        <button onClick={onRemove} style={{ marginLeft: 16, color: '#fff', background: '#e53e3e', border: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer' }}>Remove Plant</button>
      )}
    </div>
  );
}

// TilePage component with input for grid generation and camera controls
export const TilePage = ({width, height, selectedTile, setSelectedTile, tilePlants, onSelect, onPlantClick, zoomedPlantTile, onPlantDoubleClick, hoveredTile, setHoveredTile}) => {
  // For camera, pass the correct target
  const cameraTarget = zoomedPlantTile
    ? [zoomedPlantTile.x, 0, zoomedPlantTile.z]
    : (selectedTile ? [selectedTile.x, 0, selectedTile.z] : null);
  return (
    <>
      <ambientLight intensity={0.5} castShadow color={"green"}/>
      <directionalLight position={[5, 5, 5]} intensity={2} castShadow />
      <OrbitControls enableZoom={!!zoomedPlantTile} enablePan={!!zoomedPlantTile} />
      <CameraController target={cameraTarget} zoomedPlantTile={zoomedPlantTile} />
      <TileGrid
        width={width}
        height={height}
        selected={selectedTile}
        onSelect={onSelect}
        tilePlants={tilePlants}
        onPlantClick={onPlantClick}
        zoomedPlantTile={zoomedPlantTile}
        onPlantDoubleClick={onPlantDoubleClick}
        hoveredTile={hoveredTile}
        setHoveredTile={setHoveredTile}
      />
    </>
  );
};
