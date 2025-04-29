import React, { useEffect, useState } from "react";

function PlantCard({ plant }) {
  return (
    <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition">
      <h2 className="text-xl font-bold mb-2">{plant.name}</h2>
      <p>
        <span className="font-semibold">Species:</span> {plant.species}
      </p>
      <p>
        <span className="font-semibold">Cultivation:</span>{" "}
        {plant.cultivationCategory}
      </p>
      <p>
        <span className="font-semibold">Planting Seasons:</span>{" "}
        {plant.plantingSeasons?.join(", ") || "Unknown"}
      </p>
      <p>
        <span className="font-semibold">Sun:</span> {plant.sun?.min} to{" "}
        {plant.sun?.max}
      </p>
      <p>
        <span className="font-semibold">Hardiness Zone:</span>{" "}
        {plant.hardinessZone?.min} - {plant.hardinessZone?.max}
      </p>
      <p>
        <span className="font-semibold">Soil Impact:</span>{" "}
        {plant.soilImpact || "Unknown"}
      </p>
    </div>
  );
}

export default function PlantCardsPage() {
  const [plants, setPlants] = useState([]);

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

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Plants</h1>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {plants.map((plant, idx) => (
          <PlantCard key={idx} plant={plant} />
        ))}
      </div>
    </div>
  );
}
