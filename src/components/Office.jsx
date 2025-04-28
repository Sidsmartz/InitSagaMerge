import {
  useGLTF,
  useScroll,
  CubeCamera,
  useTexture,
}                           from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import gsap                  from "gsap";
import React, {
  useLayoutEffect,
  useRef,
}                           from "react";
import * as THREE            from "three";

/* ─── tweakables ──────────────────────────────────────────────────── */
const WAYPOINTS = [
  { pos: [ 2, -1, 1.5 ], rotY: -Math.PI / 6 },
  { pos: [ -2,  0, 1.75], rotY:  Math.PI / 6 },
  { pos: [ 2, -1,   2 ], rotY:  0            },
];

const FIXED_CAM      = null;               // e.g. [[4,2,7], [0,0,0]]
const ROUGH_INTENSITY = 1;               // 0 = none, 1 = normal, etc.
const MOTION_START = 0.01;                // position where movement begins
const MOTION_LENGTH = 1.0;                // fraction of scroll used for movement
/* ─────────────────────────────────────────────────────────────────── */

export function Office(props) {
  /* ─── load assets ──────────────────────────────────────────────── */
  const { scene, animations } = useGLTF("/models/plant.glb");
  const roughMap = useTexture("/textures/terrain-roughness.jpg");
  roughMap.wrapS = roughMap.wrapT = THREE.RepeatWrapping;

  /* ─── refs & helpers ───────────────────────────────────────────── */
  const group  = useRef();
  const tl     = useRef();
  const mixer  = useRef();
  const action = useRef();
  const scroll = useScroll();
  const { camera } = useThree();

  const clip     = animations?.[0];
  const clipDur  = clip?.duration ?? 1;

  /* ─── per-frame work ───────────────────────────────────────────── */
  useFrame(() => {
    const local = THREE.MathUtils.clamp(
      (scroll.offset - MOTION_START) / MOTION_LENGTH,
      0, 1
    );

    if (FIXED_CAM) {
      camera.position.set(...FIXED_CAM[0]);
      camera.lookAt     (...FIXED_CAM[1]);
      return;
    }

    tl.current?.progress(local);          // make sure the movement timeline scrubs

    if (action.current) {
      action.current.time = local * clipDur;
      mixer.current.update(1e-6);       // tiny delta forces pose update
    }
  });

  /* ─── build timeline & mixer once ──────────────────────────────── */
  useLayoutEffect(() => {
    /* waypoint GSAP timeline */
    const slice = 1 / WAYPOINTS.length;
    tl.current  = gsap.timeline({ paused: true });

    WAYPOINTS.forEach((wp, i) => {
      const at = i * slice;
      tl.current.to(
        group.current.position,
        { duration: slice, ease: "none", x: wp.pos[0], y: wp.pos[1], z: wp.pos[2] },
        at
      );
      tl.current.to(
        group.current.rotation,
        { duration: slice, ease: "none", y: wp.rotY },
        at
      );
    });

    /* animation mixer – run action at timeScale 0 so bindings stay live */
    if (clip) {
      mixer.current  = new THREE.AnimationMixer(scene);
      action.current = mixer.current.clipAction(clip);
      action.current.play();
      action.current.timeScale = 0;
    }

    /* apply roughness map & other material tweaks */
    scene.traverse((node) => {
      if (node.isMesh && node.material) {
        node.castShadow = node.receiveShadow = true;
        node.material.roughnessMap = roughMap;
        node.material.roughness   *= ROUGH_INTENSITY;
        node.material.metalness    = 0.4;
        node.material.envMapIntensity = 1;
        node.material.needsUpdate  = true;
      }
    });
  }, [clip, scene, roughMap]);

  /* ─── JSX ──────────────────────────────────────────────────────── */
  return (
    <group
      {...props}
      ref={group}
      dispose={null}
      position={WAYPOINTS[0].pos}
      rotation={[0, WAYPOINTS[0].rotY, 0]}
    >
      <CubeCamera resolution={256} frames={Infinity}>
        {(env) => {
          scene.traverse((m) => {
            if (m.isMesh && m.material && m.material.envMap !== env) {
              m.material.envMap = env;
              m.material.needsUpdate = true;
            }
          });
          return <primitive object={scene} />;
        }}
      </CubeCamera>
    </group>
  );
}

useGLTF.preload("/models/plant.glb");
