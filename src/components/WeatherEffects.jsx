import { useEffect, useMemo, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function WeatherEffects({ weather }) {
  const { scene } = useThree();
  const particlesRef = useRef();
  const count = 500;

  const particlesGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, []);

  useEffect(() => {
    if (weather === "sunny") {
      scene.background = new THREE.Color("#87ceeb");
    } else if (weather === "rainy") {
      scene.background = new THREE.Color("#000000");
    } else if (weather === "snowy") {
      scene.background = new THREE.Color("#000000");
    }
  }, [weather, scene]);

  useFrame((_, delta) => {
    if (!particlesRef.current) return;

    const positions = particlesRef.current.geometry.attributes.position.array;

    for (let i = 0; i < count; i++) {
      const yIndex = i * 3 + 1;
      const xIndex = i * 3;

      if (weather === "rainy") {
        positions[yIndex] -= 2 * delta;
        if (positions[yIndex] < -5) {
          positions[yIndex] = 5;
          positions[xIndex] = (Math.random() - 0.5) * 10;
        }
      } else if (weather === "snowy") {
        positions[yIndex] -= 2 * delta;
        positions[xIndex] += Math.sin(i + performance.now() / 1000) * 0.001;

        if (positions[yIndex] < -5) {
          positions[yIndex] = 5;
          positions[xIndex] = (Math.random() - 0.5) * 10;
        }
      }
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  if (weather === "rainy") {
    return (
      <points ref={particlesRef}>
        <pointsMaterial color="#3399ff" size={0.02} sizeAttenuation />
        <bufferGeometry attach="geometry" {...particlesGeometry} />
      </points>
    );
  }

  if (weather === "snowy") {
    return (
      <points ref={particlesRef}>
        <pointsMaterial color="#ffffff" size={0.1} sizeAttenuation />
        <bufferGeometry attach="geometry" {...particlesGeometry} />
      </points>
    );
  }

  return null;
}
export default WeatherEffects;
