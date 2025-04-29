import React, { useState } from 'react';
import { GardenPreferences } from './GardenPreferences';

export const GardenOverlay = ({
  width,
  height,
  selectedTile,
  tilePlants,
  onClose,
  onSuggest,
  onRemovePlant,
  zoomedPlantTile,
}) => {
  const [activeTab, setActiveTab] = useState('plant-info');
  
  const key = selectedTile ? `${selectedTile.x}-${selectedTile.z}` : null;
  const plant = key ? tilePlants[key] : null;
  const generalInfo = plant
    ? {
        type: "Fern",
        season: "Spring",
        waterNeeded: "Medium",
        seedRate: "5g/m²",
        ...plant.generalInfo,
      }
    : null;
  const zoomedInfo = plant
    ? {
        lastWatered: "2 days ago",
        sunlight: "18 hours",
        health: 87,
        waterThisWeek: 20,
        waterGoal: 100,
        ...plant.zoomedInfo,
      }
    : null;
  const isZoomed =
    zoomedPlantTile &&
    selectedTile &&
    zoomedPlantTile.x === selectedTile.x &&
    zoomedPlantTile.z === selectedTile.z;

  return (
    <div className="fixed left-6 top-6 z-30 bg-white/10 border border-white/20 backdrop-blur-md rounded-xl shadow-lg p-8 w-[480px] text-white max-h-[calc(100vh-4rem)] overflow-hidden flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('plant-info')}
            className={`text-lg font-sans ${
              activeTab === 'plant-info'
                ? 'text-emerald-400 border-b-2 border-emerald-400'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Plant Info
          </button>
          <button
            onClick={() => setActiveTab('suggestions')}
            className={`text-lg font-sans ${
              activeTab === 'suggestions'
                ? 'text-emerald-400 border-b-2 border-emerald-400'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Garden Suggestions
          </button>
        </div>
        <button 
          onClick={onClose}
          className="text-white/60 hover:text-white text-2xl"
        >
          ×
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'plant-info' && plant ? (
          <div className="flex flex-col items-center">
            <img
              src={plant.img}
              alt={plant.name}
              className="w-32 h-32 rounded-lg mb-4 object-cover border-2 border-emerald-400"
            />
            <h2 className="font-sans text-2xl mb-3 text-emerald-400">{plant.name}</h2>
            <div className="w-full p-4 bg-black/20 rounded-lg mb-4">
              <div className="font-sans text-sm mb-2 text-emerald-300">Position: ({selectedTile.x}, {selectedTile.z})</div>
              <div className="font-sans text-sm mb-2 text-emerald-300">Size: {plant.size[0]}x{plant.size[1]} tiles</div>
            </div>
            {isZoomed ? (
              <div className="w-full text-sm mb-4 space-y-3">
                <div className="p-4 bg-black/20 rounded-lg">
                  <h3 className="text-lg mb-2 text-emerald-400">Plant Status</h3>
                  <div className="mb-2">
                    Last watered: <span className="text-emerald-300 font-medium">{zoomedInfo.lastWatered}</span>
                  </div>
                  <div className="mb-2">
                    Sunlight this week: <span className="text-emerald-300 font-medium">{zoomedInfo.sunlight}</span>
                  </div>
                  <div className="mb-2">
                    Health: <span className="text-emerald-300 font-medium">{zoomedInfo.health}%</span>
                  </div>
                  <div className="mb-2">
                    Water this week: <span className="text-emerald-300 font-medium">{zoomedInfo.waterThisWeek}/{zoomedInfo.waterGoal}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full text-sm mb-4 space-y-3">
                <div className="p-4 bg-black/20 rounded-lg">
                  <h3 className="text-lg mb-2 text-emerald-400">Plant Details</h3>
                  <div className="mb-2">
                    Type: <span className="text-emerald-300 font-medium">{generalInfo.type}</span>
                  </div>
                  <div className="mb-2">
                    Season: <span className="text-emerald-300 font-medium">{generalInfo.season}</span>
                  </div>
                  <div className="mb-2">
                    Water needed: <span className="text-emerald-300 font-medium">{generalInfo.waterNeeded}</span>
                  </div>
                  <div className="mb-2">
                    Seed rate: <span className="text-emerald-300 font-medium">{generalInfo.seedRate}</span>
                  </div>
                </div>
                <div className="p-4 bg-black/20 rounded-lg">
                  <h3 className="text-lg mb-2 text-emerald-400">Description</h3>
                  <p className="text-white/90 leading-relaxed">{plant.description}</p>
                </div>
              </div>
            )}
            <button
              onClick={onRemovePlant}
              className="px-6 py-2 rounded-lg bg-red-500 text-white text-sm font-sans hover:bg-red-600 transition-colors"
            >
              Remove Plant
            </button>
          </div>
        ) : activeTab === 'suggestions' ? (
          <GardenPreferences
            width={width}
            height={height}
            onSuggest={onSuggest}
            hideHeader
          />
        ) : (
          <div className="text-center text-white/60 py-8">
            Select a plant to view its information
          </div>
        )}
      </div>
    </div>
  );
}; 