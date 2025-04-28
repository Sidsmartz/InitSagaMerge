import { Canvas } from "@react-three/fiber";
import "./App.css";
import { Experience } from "./components/Experience";
import { useState } from "react";
import { TilePage, PlantPickerOverlay } from "./components/TilePage";
import { Link, Routes, Route, useLocation } from "react-router-dom";

function RightPane({
  width, setWidth, height, setHeight,
  selectedTile, tilePlants, onAddPlant, onRemovePlant, onShowPicker, showPlantPicker, onPickPlant, onClosePicker, zoomedPlantTile
}) {
  const key = selectedTile ? `${selectedTile.x}-${selectedTile.z}` : null;
  const plant = key ? tilePlants[key] : null;
  // Mock data for plant details
  const generalInfo = plant ? {
    type: 'Fern',
    season: 'Spring',
    waterNeeded: 'Medium',
    seedRate: '5g/m²',
    ...plant.generalInfo
  } : null;
  const zoomedInfo = plant ? {
    lastWatered: '2 days ago',
    sunlight: '18 hours',
    health: 87,
    waterThisWeek: 20,
    waterGoal: 100,
    ...plant.zoomedInfo
  } : null;
  const isZoomed = zoomedPlantTile && selectedTile && zoomedPlantTile.x === selectedTile.x && zoomedPlantTile.z === selectedTile.z;
  return (
    <div className="fixed top-6 right-6 z-20 bg-white/10 border border-white/20 backdrop-blur-md rounded-xl shadow-lg p-6 flex flex-col min-w-[220px] max-w-[320px] text-white">
      <div className="flex items-center justify-between mb-4">
        <span className="font-sans text-lg">Customise</span>
        <Link
          to="/"
          className="ml-2 px-3 py-1 rounded bg-plant-green text-plant-gray hover:bg-green-400 text-sm font-sans"
        >
          Home
        </Link>
      </div>
      <div className="mb-4">
        <label className="text-xs text-white/80 mb-1 block">Grid Width</label>
        <input
          type="number"
          min="1"
          className="border border-white/20 bg-white/10 text-white rounded p-2 w-full mb-2"
          value={width}
          onChange={(e) => setWidth(+e.target.value)}
          placeholder="Width"
        />
        <label className="text-xs text-white/80 mb-1 block">Grid Height</label>
        <input
          type="number"
          min="1"
          className="border border-white/20 bg-white/10 text-white rounded p-2 w-full"
          value={height}
          onChange={(e) => setHeight(+e.target.value)}
          placeholder="Height"
        />
      </div>
      {selectedTile && (
        <div className="mt-4 border-t border-white/20 pt-4">
          <div className="font-sans mb-2">Selected Tile: ({selectedTile.x}, {selectedTile.z})</div>
          {plant ? (
            <div className="flex flex-col items-center">
              <img src={plant.img} alt={plant.name} className="w-20 h-20 rounded mb-2 object-cover border-2 border-emerald-400" />
              <div className="font-sans text-base mb-1">{plant.name}</div>
              {isZoomed ? (
                <div className="w-full text-xs text-white/80 mb-2 text-center">
                  <div className="mb-1">Last watered: <span className="text-green-300">{zoomedInfo.lastWatered}</span></div>
                  <div className="mb-1">Sunlight this week: <span className="text-green-300">{zoomedInfo.sunlight}</span></div>
                  <div className="mb-1">Health: <span className="text-green-300">{zoomedInfo.health}%</span></div>
                  <div className="mb-1">Water this week: <span className="text-green-300">{zoomedInfo.waterThisWeek}/{zoomedInfo.waterGoal}</span></div>
                </div>
              ) : (
                <div className="w-full text-xs text-white/80 mb-2 text-center">
                  <div className="mb-1">Type: <span className="text-green-300">{generalInfo.type}</span></div>
                  <div className="mb-1">Season: <span className="text-green-300">{generalInfo.season}</span></div>
                  <div className="mb-1">Water needed: <span className="text-green-300">{generalInfo.waterNeeded}</span></div>
                  <div className="mb-1">Seed rate: <span className="text-green-300">{generalInfo.seedRate}</span></div>
                  <div className="mb-1">{plant.description}</div>
                </div>
              )}
              <button
                onClick={onRemovePlant}
                className="px-4 py-1 rounded bg-red-500 text-white text-xs font-sans hover:bg-red-600 mt-1"
              >
                Remove Plant
              </button>
            </div>
          ) : (
            <button
              onClick={onShowPicker}
              className="px-4 py-2 rounded bg-emerald-400 text-gray-900 font-sans hover:bg-emerald-300 w-full mt-2"
            >
              Add Plant
            </button>
          )}
        </div>
      )}
      {showPlantPicker && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
          <PlantPickerOverlay
            onPick={onPickPlant}
            onClose={onClosePicker}
          />
        </div>
      )}
    </div>
  );
}

function TilePageWithUI({ width, setWidth, height, setHeight, selectedTile, setSelectedTile }) {
  // Overlay and plant state
  const [tilePlants, setTilePlants] = useState({}); // { 'x-z': plantObj }
  const [showPlantPicker, setShowPlantPicker] = useState(false);
  const [plantPickerTile, setPlantPickerTile] = useState(null);
  const [zoomedPlantTile, setZoomedPlantTile] = useState(null);
  const [hoveredTile, setHoveredTile] = useState(null);

  // Handle tile selection/deselection
  const handleSelect = ({ x, z }) => {
    const key = `${x}-${z}`;
    if (selectedTile && selectedTile.x === x && selectedTile.z === z) {
      setSelectedTile(null);
      setShowPlantPicker(false);
    } else {
      setSelectedTile({ x, z });
      setPlantPickerTile({ x, z });
      setShowPlantPicker(false);
    }
    setZoomedPlantTile(null);
  };

  // Show plant picker for selected tile
  const handleShowPicker = () => {
    setPlantPickerTile(selectedTile);
    setShowPlantPicker(true);
  };

  // Handle plant pick for a tile
  const handlePlantPick = (plant) => {
    if (plantPickerTile) {
      setTilePlants(prev => ({ ...prev, [`${plantPickerTile.x}-${plantPickerTile.z}`]: plant }));
      setShowPlantPicker(false);
      setPlantPickerTile(null);
    }
  };

  // Remove plant from tile
  const handleRemovePlant = () => {
    if (selectedTile) {
      const key = `${selectedTile.x}-${selectedTile.z}`;
      setTilePlants(prev => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
    }
  };

  // Handle double click to zoom
  const handlePlantDoubleClick = ({ x, z, plant }) => {
    setZoomedPlantTile({ x, z });
  };

  return (
    <div className="relative w-screen h-screen">
      <header className="fixed top-0 left-0 w-full z-10 bg-gray-800 font-sans bg-transparent p-4">
        <h1 className="text-green-400 font-sans text-2xl text-center">Reimagine and Recreate your Plants here!</h1>
      </header>
      <Canvas
        camera={{
          fov: 60,
          position: [2.3, 1.5, 2.3],
        }}
        className="absolute inset-0"
      >
        <TilePage
          width={width}
          height={height}
          selectedTile={selectedTile}
          setSelectedTile={setSelectedTile}
          tilePlants={tilePlants}
          onSelect={handleSelect}
          onPlantClick={() => {}}
          zoomedPlantTile={zoomedPlantTile}
          onPlantDoubleClick={handlePlantDoubleClick}
          hoveredTile={hoveredTile}
          setHoveredTile={setHoveredTile}
        />
      </Canvas>
      <RightPane
        width={width}
        setWidth={setWidth}
        height={height}
        setHeight={setHeight}
        selectedTile={selectedTile}
        tilePlants={tilePlants}
        onAddPlant={handleShowPicker}
        onRemovePlant={handleRemovePlant}
        onShowPicker={handleShowPicker}
        showPlantPicker={showPlantPicker}
        onPickPlant={handlePlantPick}
        onClosePicker={() => setShowPlantPicker(false)}
        zoomedPlantTile={zoomedPlantTile}
      />
    </div>
  );
}

function App() {
  const [width, setWidth] = useState(5);
  const [height, setHeight] = useState(5);
  const [selectedTile, setSelectedTile] = useState(null);
  const location = useLocation();

  return (
    <Routes>
      <Route path="/" element={
        <Canvas>
          <Experience />
        </Canvas>
      } />
      <Route path="/tile" element={
        <TilePageWithUI
          width={width}
          setWidth={setWidth}
          height={height}
          setHeight={setHeight}
          selectedTile={selectedTile}
          setSelectedTile={setSelectedTile}
        />
      } />
    </Routes>
  );
}

export default App;
