import { useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function GrassCursor() {
  const group = useRef();
  const grassModel = useLoader(GLTFLoader, "models/grass.glb");

  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [prevMouse, setPrevMouse] = useState({ x: 0, y: 0 });
  const [grassBlades, setGrassBlades] = useState([]);

  const totalBlades = 100;
  const target = useRef(new THREE.Vector3());

  useEffect(() => {
    const handleMouseMove = (event) => {
      setPrevMouse(mouse); // store previous mouse
      setMouse({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouse]);

  useEffect(() => {
    // Initialize grass blades
    const initialBlades = [];
    for (let i = 0; i < totalBlades; i++) {
      initialBlades.push(createBlade(i));
    }
    setGrassBlades(initialBlades);
  }, []);

  useFrame((state) => {
    if (!group.current) return;

    const { x, y } = mouse;
    const vec = new THREE.Vector3(x, y, 0.5);
    vec.unproject(state.camera);

    target.current.lerp(vec, 0.2);
    group.current.position.lerp(target.current, 0.1);

    // group.current.position.z +=
    //   Math.sin(state.clock.getElapsedTime() * 3) * 0.002;

    const dx = mouse.x - prevMouse.x;
    const dy = mouse.y - prevMouse.y;

    if (dx === 0 && dy === 0) return; // no movement, do nothing

    const movementVec = new THREE.Vector2(dx, dy).normalize(); // movement direction vector

    // Update each blade
    setGrassBlades((prevBlades) =>
      prevBlades.map((blade) => {
        const bladePos = new THREE.Vector2(
          blade.position[0],
          blade.position[1]
        ).normalize();
        const dot = bladePos.dot(movementVec); // dot product to check alignment

        let newVisibility = blade.visibility;

        if (dot > 0.2) {
          // blade is in movement direction -> appear
          newVisibility = Math.min(newVisibility + 0.02, 1);
        } else if (dot < -0.2) {
          // blade is opposite to movement -> disappear
          newVisibility = Math.max(newVisibility - 0.02, 0);
        }
        // else: no major change if perpendicular

        return { ...blade, visibility: newVisibility };
      })
    );
  });

  const createBlade = (i) => {
    const radius = Math.pow(Math.random(), 0.7) * 0.4;

    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.acos(2 * Math.random() - 1);

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    return {
      id: i,
      position: [x, y, Math.abs(z) * 0.5],
      rotation: [
        (Math.random() - 0.5) * Math.PI * 0.1,
        (Math.random() - 0.5) * Math.PI * 0.5,
        (Math.random() - 0.5) * Math.PI * 0.1,
      ],
      visibility: 0, // initially invisible
    };
  };

  return (
    <group ref={group} scale={[0.08, 0.08, 0.08]}>
      {grassBlades.map((blade) => (
        <primitive
          object={grassModel.scene.clone()}
          key={blade.id}
          position={blade.position}
          scale={[
            0.15 * blade.visibility, // scale grows based on visibility
            0.15 * blade.visibility,
            0.15 * blade.visibility,
          ]}
          rotation={blade.rotation}
        />
      ))}
    </group>
  );
}
