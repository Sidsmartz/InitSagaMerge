import { OrbitControls, ScrollControls } from "@react-three/drei";
import { Office } from "./Office";
import { Overlay } from "./Overlay";
import { TilePage } from "./TilePage";
import { useState } from "react";

export const Experience = () => {
  const [cameraAngle, setCameraAngle] = useState({
    position: [2, 5, 5], // Example custom camera position
    lookAt: [0, 0, 0],   // Example custom camera target
  });

  return (
    <>
      {/* Ambient light for overall illumination */}
      <ambientLight intensity={0.5} />

      {/* Directional light for realistic shadows */}
      <directionalLight
        position={[5, 1, 5]}
        intensity={2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* Scroll and Orbit controls */}
      <OrbitControls enableZoom={false} />
      <ScrollControls pages={3} damping={0.5} html>
        <Office cameraAngle={cameraAngle} /> {/* Pass cameraAngle to Office */}
        <Overlay />
      </ScrollControls>
    </>
  );
};
