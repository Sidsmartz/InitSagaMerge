import { Canvas } from "@react-three/fiber";
import "./App.css";
import { Experience } from "./components/Experience";
import { useState, useEffect } from "react";
import { TilePage, PlantPickerOverlay } from "./components/TilePage";
import { Link, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import WeatherEffects from "./components/WeatherEffects"; // Import WeatherEffects component
import axios from "axios";
import { GardenPreferences } from './components/GardenPreferences';
import { getGardenSuggestions } from './services/geminiService';
import { GardenOverlay } from './components/GardenOverlay';
import PlantCardsPage from "./components/PlantsCardPage";

function RightPane({
  width,
  setWidth,
  height,
  setHeight,
  selectedTile,
  tilePlants,
  onAddPlant,
  onRemovePlant,
  onShowPicker,
  showPlantPicker,
  onPickPlant,
  onClosePicker,
  zoomedPlantTile,
  onChangeWeather,
  weather,
  onLocationSearch,
  onClose,
  weatherInfo,
  weatherError,
}) {
  const [location, setLocation] = useState("");
  const textColor = weather === "sunny" ? "text-black" : "text-white";
  const accentColor = weather === "sunny" ? "text-emerald-800" : "text-emerald-400";
  const labelColor = weather === "sunny" ? "text-black/80" : "text-white/80";

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  const handleSearch = () => {
    if (location.trim()) {
      onLocationSearch(location);
    }
  };

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
    <>
      {/* Controls Panel */}
      <div className={`fixed top-6 right-6 z-20 bg-white/10 border border-white/20 backdrop-blur-md rounded-xl shadow-lg p-6 flex flex-col min-w-[220px] max-w-[320px] ${textColor} max-h-[calc(100vh-4rem)] overflow-y-auto`}>
        <div className="flex items-center justify-between mb-4 sticky top-0 bg-white/10 backdrop-blur-md p-2 rounded">
          <span className={`font-sans text-lg ${textColor}`}>Controls</span>
          <Link
            to="/"
            className="px-3 py-1 rounded bg-plant-green text-plant-gray hover:bg-green-400 text-sm font-sans"
          >
            Home
          </Link>
        </div>

        {/* Weather Controls */}
        <div className="mb-4">
          <label className={`text-xs ${labelColor} mb-1 block`}>Weather</label>
          <div className="flex space-x-2 mb-2">
            <button
              onClick={() => onChangeWeather("sunny")}
              className={`px-3 py-1 rounded text-xs font-sans ${weather === "sunny" ? 'bg-yellow-500' : 'bg-yellow-500/50'}`}
            >
              Sunny
            </button>
            <button
              onClick={() => onChangeWeather("rainy")}
              className={`px-3 py-1 rounded text-xs font-sans ${weather === "rainy" ? 'bg-blue-500' : 'bg-blue-500/50'}`}
            >
              Rainy
            </button>
            <button
              onClick={() => onChangeWeather("snowy")}
              className={`px-3 py-1 rounded text-white text-xs font-sans ${weather === "snowy" ? 'bg-white' : 'bg-white/50'}`}
            >
              Snowy
            </button>
          </div>
          
          {/* Weather Info Display */}
          {weatherInfo && (
            <div className="bg-white/10 rounded-lg p-3 mb-2 text-sm">
              <p className={accentColor}>Current Weather in {weatherInfo.location}</p>
              <p className={textColor}>{weatherInfo.condition}</p>
              <p className={textColor}>{weatherInfo.temp_c}°C / {weatherInfo.temp_f}°F</p>
            </div>
          )}
          {weatherError && (
            <div className="bg-red-500/20 text-red-200 rounded-lg p-3 mb-2 text-sm">
              {weatherError}
            </div>
          )}
        </div>

        {/* Location Search */}
        <div className="mb-4">
          <label className={`text-xs ${labelColor} mb-1 block`}>Search Location</label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={location}
              onChange={handleLocationChange}
              className={`flex-1 border border-white/20 bg-white/10 ${textColor} rounded p-2`}
              placeholder="Enter location"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 rounded bg-emerald-400 text-gray-900 font-sans hover:bg-emerald-300"
            >
              Search
            </button>
          </div>
        </div>

        {/* Grid Settings */}
        <div className="mb-4">
          <label className={`text-xs ${labelColor} mb-1 block`}>Grid Width</label>
          <input
            type="number"
            min="1"
            className={`border border-white/20 bg-white/10 ${textColor} rounded p-2 w-full mb-2`}
            value={width}
            onChange={(e) => setWidth(+e.target.value)}
            placeholder="Width"
          />
          <label className={`text-xs ${labelColor} mb-1 block`}>Grid Height</label>
          <input
            type="number"
            min="1"
            className={`border border-white/20 bg-white/10 ${textColor} rounded p-2 w-full`}
            value={height}
            onChange={(e) => setHeight(+e.target.value)}
            placeholder="Height"
          />
        </div>

        {/* Add Plant Button */}
        {selectedTile && !plant && (
          <button
            onClick={onShowPicker}
            className="px-4 py-2 rounded bg-emerald-400 text-gray-900 font-sans hover:bg-emerald-300 w-full mt-2"
          >
            Add Plant
          </button>
        )}
      </div>

      {/* Plant Info Panel */}
      {selectedTile && plant && (
        <div className={`fixed top-6 left-6 z-20 bg-white/10 border border-white/20 backdrop-blur-md rounded-xl shadow-lg p-8 flex flex-col min-w-[360px] max-w-[480px] ${textColor} max-h-[calc(100vh-4rem)] overflow-y-auto`}>
          <div className="flex flex-col items-center">
            <img
              src={plant.img}
              alt={plant.name}
              className="w-32 h-32 rounded-lg mb-4 object-cover border-2 border-emerald-400"
            />
            <h2 className={`font-sans text-2xl mb-3 ${accentColor}`}>{plant.name}</h2>
            <div className="w-full p-4 bg-black/20 rounded-lg mb-4">
              <div className={`font-sans text-sm mb-2 ${accentColor}`}>Position: ({selectedTile.x}, {selectedTile.z})</div>
              <div className={`font-sans text-sm mb-2 ${accentColor}`}>Size: {plant.size[0]}x{plant.size[1]} tiles</div>
            </div>
            {isZoomed ? (
              <div className="w-full text-sm mb-4 space-y-3">
                <div className="p-4 bg-black/20 rounded-lg">
                  <h3 className={`text-lg mb-2 ${accentColor}`}>Plant Status</h3>
                  <div className="mb-2">
                    Last watered: <span className={accentColor}>{zoomedInfo.lastWatered}</span>
                  </div>
                  <div className="mb-2">
                    Sunlight this week: <span className={accentColor}>{zoomedInfo.sunlight}</span>
                  </div>
                  <div className="mb-2">
                    Health: <span className={accentColor}>{zoomedInfo.health}%</span>
                  </div>
                  <div className="mb-2">
                    Water this week: <span className={accentColor}>{zoomedInfo.waterThisWeek}/{zoomedInfo.waterGoal}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full text-sm mb-4 space-y-3">
                <div className="p-4 bg-black/20 rounded-lg">
                  <h3 className={`text-lg mb-2 ${accentColor}`}>Plant Details</h3>
                  <div className="mb-2">
                    Type: <span className={accentColor}>{generalInfo.type}</span>
                  </div>
                  <div className="mb-2">
                    Season: <span className={accentColor}>{generalInfo.season}</span>
                  </div>
                  <div className="mb-2">
                    Water needed: <span className={accentColor}>{generalInfo.waterNeeded}</span>
                  </div>
                  <div className="mb-2">
                    Seed rate: <span className={accentColor}>{generalInfo.seedRate}</span>
                  </div>
                </div>
                <div className="p-4 bg-black/20 rounded-lg">
                  <h3 className={`text-lg mb-2 ${accentColor}`}>Description</h3>
                  <p className={`${textColor}/90 leading-relaxed`}>{plant.description}</p>
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
        </div>
      )}

      {showPlantPicker && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
          <PlantPickerOverlay onPick={onPickPlant} onClose={onClose} />
        </div>
      )}
    </>
  );
}

function TilePageWithUI({
  width,
  setWidth,
  height,
  setHeight,
  selectedTile,
  setSelectedTile,
}) {
  const [tilePlants, setTilePlants] = useState({});
  const [showPlantPicker, setShowPlantPicker] = useState(false);
  const [plantPickerTile, setPlantPickerTile] = useState(null);
  const [zoomedPlantTile, setZoomedPlantTile] = useState(null);
  const [hoveredTile, setHoveredTile] = useState(null);
  const [weather, setWeather] = useState("sunny");
  const [showOverlay, setShowOverlay] = useState(true);
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [weatherError, setWeatherError] = useState(null);

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

  const handleShowPicker = () => {
    setPlantPickerTile(selectedTile);
    setShowPlantPicker(true);
  };

  const handlePlantPick = (plant) => {
    if (plantPickerTile) {
      // Check if the plant can be placed at the selected location
      const canPlace = checkPlantPlacement(plantPickerTile.x, plantPickerTile.z, plant.size);
      
      if (canPlace) {
      setTilePlants((prev) => ({
        ...prev,
        [`${plantPickerTile.x}-${plantPickerTile.z}`]: plant,
      }));
      setShowPlantPicker(false);
      setPlantPickerTile(null);
      } else {
        // You could show a notification here that the plant can't be placed
        alert("Cannot place plant here. Make sure there's enough space and no overlapping plants.");
      }
    }
  };

  const checkPlantPlacement = (x, z, size) => {
    // Check if the plant would extend beyond the grid
    if (x + size[0] > width || z + size[1] > height) {
      return false;
    }

    // Check if any tile in the plant's footprint is already occupied
    for (let dx = 0; dx < size[0]; dx++) {
      for (let dz = 0; dz < size[1]; dz++) {
        const checkX = x + dx;
        const checkZ = z + dz;
        
        // Check each tile position in tilePlants
        for (const [key, existingPlant] of Object.entries(tilePlants)) {
          const [baseX, baseZ] = key.split('-').map(Number);
          if (
            checkX >= baseX && 
            checkX < baseX + existingPlant.size[0] &&
            checkZ >= baseZ && 
            checkZ < baseZ + existingPlant.size[1]
          ) {
            return false;
          }
        }
      }
    }
    return true;
  };

  const handleRemovePlant = () => {
    if (selectedTile) {
      // Find the base tile of the plant to remove
      for (const [key, plant] of Object.entries(tilePlants)) {
        const [baseX, baseZ] = key.split('-').map(Number);
        if (
          selectedTile.x >= baseX && 
          selectedTile.x < baseX + plant.size[0] &&
          selectedTile.z >= baseZ && 
          selectedTile.z < baseZ + plant.size[1]
        ) {
      setTilePlants((prev) => {
        const copy = { ...prev };
            delete copy[`${baseX}-${baseZ}`];
        return copy;
      });
          break;
        }
      }
    }
  };

  const handlePlantDoubleClick = ({ x, z, plant }) => {
    setZoomedPlantTile({ x, z });
  };

  // Fetch weather data for location
  const fetchWeatherData = async (location) => {
    try {
      const response = await axios.get("https://weatherapi-com.p.rapidapi.com/current.json", {
      params: { q: location },
      headers: {
          "x-rapidapi-key": "2ddf0943bbmsh2bab9cde13a630cp1b374bjsnb81ab8107196",
        "x-rapidapi-host": "weatherapi-com.p.rapidapi.com",
      },
      });

      const data = response.data;
      const weatherInfo = {
        location: data.location.name,
        condition: data.current.condition.text,
        temp_c: data.current.temp_c,
        temp_f: data.current.temp_f
      };
      
      // Update weather state based on condition
      const weatherCondition = data.current.condition.text.toLowerCase();
      if (weatherCondition.includes("sunny") || weatherCondition.includes("clear")) {
        setWeather("sunny");
      } else if (weatherCondition.includes("rain") || weatherCondition.includes("drizzle")) {
        setWeather("rainy");
      } else if (weatherCondition.includes("snow") || weatherCondition.includes("sleet")) {
        setWeather("snowy");
      }
      
      // Update weather info in the RightPane
      setWeatherInfo(weatherInfo);
      setWeatherError(null);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      let errorMessage = "Failed to fetch weather data. Please try again.";
      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = "Invalid location. Please enter a valid city name.";
        } else if (error.response.status === 403) {
          errorMessage = "API key error. Please try again later.";
        }
      } else if (error.request) {
        errorMessage = "Network error. Please check your internet connection.";
      }
      setWeatherError(errorMessage);
      setWeatherInfo(null);
    }
  };

  const handleSuggest = async (prompt) => {
    try {
      return await getGardenSuggestions(prompt);
    } catch (error) {
      console.error('Error getting suggestions:', error);
      throw error;
    }
  };

  return (
    <div className="relative w-screen h-screen">
      <header className="fixed top-0 left-0 w-full z-10 bg-gray-800 font-sans bg-transparent p-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-green-400 font-sans text-2xl">
          Reimagine and Recreate your Plants here!
        </h1>
        </div>
      </header>

      <Canvas
        camera={{
          fov: 60,
          position: [2.3, 1.5, 2.3],
        }}
        className="absolute inset-0"
      >
        <WeatherEffects weather={weather} />
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

      {/* Overlay Toggle Button - Bottom Right */}
      <button
        onClick={() => setShowOverlay(!showOverlay)}
        className="fixed bottom-6 right-6 z-20 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors shadow-lg"
      >
        {showOverlay ? 'Hide Panel' : 'Show Panel'}
      </button>

      {showOverlay && (
        <GardenOverlay
          width={width}
          height={height}
          selectedTile={selectedTile}
          tilePlants={tilePlants}
          onClose={() => setShowOverlay(false)}
          onSuggest={handleSuggest}
          onRemovePlant={handleRemovePlant}
          zoomedPlantTile={zoomedPlantTile}
        />
      )}

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
        onChangeWeather={setWeather}
        weather={weather}
        onLocationSearch={fetchWeatherData}
        onClose={() => setShowPlantPicker(false)}
        weatherInfo={weatherInfo}
        weatherError={weatherError}
      />

      {showPlantPicker && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
          <PlantPickerOverlay onPick={handlePlantPick} onClose={() => setShowPlantPicker(false)} />
        </div>
      )}
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
      <Route
        path="/"
        element={
          <Canvas>
            <Experience />
          </Canvas>
        }
      />
      <Route
        path="/tile"
        element={
          <TilePageWithUI
            width={width}
            setWidth={setWidth}
            height={height}
            setHeight={setHeight}
            selectedTile={selectedTile}
            setSelectedTile={setSelectedTile}
          />
        }
      />
      <Route path="/plants" element={<PlantCardsPage/>}/>
    </Routes>
  );
}

export default App;
