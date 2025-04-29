import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function PlantDetails({ plant }) {
  return (
    <div className="bg-black/20 p-6 rounded-lg mt-2 text-white/90 h-screen">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg text-emerald-400 mb-3 font-extralight">Growing Conditions</h3>
          <div className="space-y-2 font-extralight">
            <p>
              <span className="text-emerald-300">Sun Requirements:</span>{" "}
              {plant.sun?.min} to {plant.sun?.max}
            </p>
            <p>
              <span className="text-emerald-300">Hardiness Zone:</span>{" "}
              {plant.hardinessZone?.min} - {plant.hardinessZone?.max}
            </p>
            <p>
              <span className="text-emerald-300">Soil Impact:</span>{" "}
              {plant.soilImpact || "Unknown"}
            </p>
          </div>
        </div>
        <div>
          <h3 className="text-lg text-emerald-400 mb-3 font-extralight">Planting Information</h3>
          <div className="space-y-2 font-extralight">
            <p>
              <span className="text-emerald-300">Species:</span>{" "}
              {plant.species}
            </p>
            <p>
              <span className="text-emerald-300">Cultivation:</span>{" "}
              {plant.cultivationCategory}
            </p>
            <p>
              <span className="text-emerald-300">Planting Seasons:</span>{" "}
              {plant.plantingSeasons?.join(", ") || "Unknown"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PlantCardsPage() {
  const [plants, setPlants] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);

  useEffect(() => {
    async function fetchPlants() {
      try {
        const modules = import.meta.glob("./plants/*.json");
        const plantPromises = Object.values(modules).map((load) => load());
        const plantData = await Promise.all(plantPromises);
        const flattened = plantData.map((p) =>
          p.default?.content
            ? { ...p.default, ...p.default.content }
            : p.default
        );
        setPlants(flattened);
      } catch (error) {
        console.error("Error loading plant data:", error);
      }
    }
    fetchPlants();
  }, []);

  const handleRowClick = (plant) => {
    if (selectedPlant?.name === plant.name) {
      setSelectedPlant(null);
    } else {
      setSelectedPlant(plant);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-extralight">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-10 bg-gray-800/50 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl text-emerald-400 font-extralight">Plants Database</h1>
          <Link
            to="/tile"
            className="px-4 py-2 rounded bg-emerald-400 text-gray-900 font-extralight hover:bg-emerald-300"
          >
            Back to Garden
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 px-4 pb-8 max-w-7xl mx-auto">
        <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto max-h-[100vh]">
            {/* Set the max-height and enable scrolling here */}
            <table className="w-full">
              <thead>
                <tr className="bg-black/40">
                  <th className="px-6 py-4 text-left text-emerald-400 font-extralight">Name</th>
                  <th className="px-6 py-4 text-left text-emerald-400 font-extralight">Species</th>
                  <th className="px-6 py-4 text-left text-emerald-400 font-extralight">Cultivation</th>
                  <th className="px-6 py-4 text-left text-emerald-400 font-extralight">Seasons</th>
                </tr>
              </thead>
              <tbody className="font-extralight">
                {plants.map((plant, idx) => (
                  <React.Fragment key={idx}>
                    <tr 
                      onClick={() => handleRowClick(plant)}
                      className={`border-t border-white/10 cursor-pointer transition-colors hover:bg-white/5 ${selectedPlant?.name === plant.name ? 'bg-white/10' : ''}`}
                    >
                      <td className="px-6 py-4">{plant.name}</td>
                      <td className="px-6 py-4">{plant.species}</td>
                      <td className="px-6 py-4">{plant.cultivationCategory}</td>
                      <td className="px-6 py-4">{plant.plantingSeasons?.join(", ") || "Unknown"}</td>
                    </tr>
                    {selectedPlant?.name === plant.name && (
                      <tr>
                        <td colSpan="4" className="px-6 py-4">
                          <PlantDetails plant={plant} />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
