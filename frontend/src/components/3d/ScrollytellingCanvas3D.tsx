"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere, Torus, MeshDistortMaterial, RoundedBox, Html } from "@react-three/drei";
import * as THREE from "three";

interface ScrollytellingCanvas3DProps {
  progress: number; // 0.0 to 1.0 scroll progress
  mousePos: { x: number; y: number };
}

// ----------------------------------------------------
// SCENE 1 & GLOBAL: High-Density Gold Particle Neural Swarm
// ----------------------------------------------------
const HighDensityParticleSwarm: React.FC<{ progress: number; mousePos: { x: number; y: number } }> = ({
  progress,
  mousePos,
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const { positions, colors, linePositions } = useMemo(() => {
    const count = 850;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const linePos: number[] = [];

    const goldColor = new THREE.Color("#FFD700");
    const softAmber = new THREE.Color("#F6C453");
    const cyanAccent = new THREE.Color("#00F2FE");
    const whiteColor = new THREE.Color("#FFFFFF");

    const pts: THREE.Vector3[] = [];

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 26;
      const y = (Math.random() - 0.5) * 26;
      const z = (Math.random() - 0.5) * 26;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      pts.push(new THREE.Vector3(x, y, z));

      const rand = Math.random();
      const mixedColor = rand > 0.55 ? goldColor : rand > 0.3 ? softAmber : rand > 0.15 ? cyanAccent : whiteColor;
      col[i * 3] = mixedColor.r;
      col[i * 3 + 1] = mixedColor.g;
      col[i * 3 + 2] = mixedColor.b;
    }

    for (let i = 0; i < 160; i++) {
      for (let j = i + 1; j < 160; j++) {
        if (pts[i].distanceTo(pts[j]) < 3.2) {
          linePos.push(pts[i].x, pts[i].y, pts[i].z);
          linePos.push(pts[j].x, pts[j].y, pts[j].z);
        }
      }
    }

    return {
      positions: pos,
      colors: col,
      linePositions: new Float32Array(linePos),
    };
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.05 + mousePos.x * 0.2;
      pointsRef.current.rotation.x = t * 0.03 + mousePos.y * 0.2;
    }
    if (linesRef.current) {
      linesRef.current.rotation.y = t * 0.05 + mousePos.x * 0.2;
      linesRef.current.rotation.x = t * 0.03 + mousePos.y * 0.2;
    }
  });

  const opacity = progress > 0.9 ? 0.9 : progress > 0.35 && progress < 0.85 ? 0.35 : 0.8;

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.07}
          vertexColors
          transparent
          opacity={opacity}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color="#FFD700"
          transparent
          opacity={opacity * 0.35}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
};

// ----------------------------------------------------
// SCENE 2 & 10: 3D Metallic AI Core & Orbiting Social Icons
// ----------------------------------------------------
const AICoreAndOrbits: React.FC<{ progress: number }> = ({ progress }) => {
  const coreRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);

  let scale = 0.001;
  let explodeFactor = 0;

  if (progress <= 0.1) {
    scale = Math.max(0.001, progress * 10);
  } else if (progress <= 0.2) {
    scale = 1.0;
  } else if (progress <= 0.3) {
    scale = Math.max(0.001, 1.0 - (progress - 0.2) * 8);
    explodeFactor = (progress - 0.2) * 10;
  } else if (progress >= 0.88) {
    scale = Math.max(0.001, (progress - 0.88) * 8.33);
  }

  const isVisible = scale > 0.01;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.3 + progress * Math.PI * 4;
      coreRef.current.rotation.x = Math.sin(t * 0.2) * 0.2;
    }
  });

  const platforms = [
    { name: "Instagram", color: "#E1306C", r: 3.2, offset: 0 },
    { name: "Facebook", color: "#1877F2", r: 3.6, offset: 0.8 },
    { name: "Threads", color: "#FFFFFF", r: 2.8, offset: 1.6 },
    { name: "LinkedIn", color: "#0A66C2", r: 3.9, offset: 2.4 },
    { name: "TikTok", color: "#00F2FE", r: 3.4, offset: 3.2 },
    { name: "YouTube", color: "#FF0000", r: 4.1, offset: 4.0 },
    { name: "Pinterest", color: "#E60023", r: 3.0, offset: 4.8 },
    { name: "X / Twitter", color: "#1DA1F2", r: 3.7, offset: 5.6 },
  ];

  return (
    <group visible={isVisible} ref={coreRef} scale={[scale, scale, scale]}>
      {/* Central Glowing Distorted Energy Sphere */}
      <Sphere ref={sphereRef} args={[1.8, 64, 64]}>
        <MeshDistortMaterial
          color="#050507"
          distort={0.4}
          speed={3}
          roughness={0.1}
          metalness={0.9}
          emissive="#FFD700"
          emissiveIntensity={0.7}
          wireframe
        />
      </Sphere>

      {/* Inner Metallic Gold Processor Core */}
      <RoundedBox args={[1.3, 1.3, 0.45]} radius={0.18} smoothness={4}>
        <meshStandardMaterial
          color="#FFD700"
          emissive="#F6C453"
          emissiveIntensity={0.8}
          metalness={0.95}
          roughness={0.1}
        />
      </RoundedBox>

      {/* Orbiting Concentric Gold Energy Rings */}
      {[2.5, 3.3, 4.1].map((r, idx) => (
        <Torus key={idx} args={[r + explodeFactor * 0.5, 0.022, 16, 100]} rotation={[Math.PI / 3, idx * 0.6, 0]}>
          <meshStandardMaterial
            color="#FFD700"
            emissive="#FFD700"
            emissiveIntensity={0.8 - idx * 0.2}
            transparent
            opacity={0.75}
          />
        </Torus>
      ))}

      {/* Orbiting Social Platforms */}
      {platforms.map((p, i) => {
        const radius = p.r + explodeFactor * 2;
        const angle = p.offset + progress * Math.PI * 6;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(angle * 2) * 0.8;

        return (
          <group key={i} position={[x, y, z]}>
            <Sphere args={[0.25, 16, 16]}>
              <meshStandardMaterial color={p.color} emissive={p.color} emissiveIntensity={0.8} />
            </Sphere>
            <Html center distanceFactor={12}>
              <div
                className="px-2.5 py-1 rounded-lg text-[10px] font-bold text-white shadow-[0_0_25px_rgba(255,215,0,0.35)] pointer-events-none whitespace-nowrap backdrop-blur-xl border"
                style={{ backgroundColor: `${p.color}cc`, borderColor: p.color }}
              >
                {p.name}
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
};

// ----------------------------------------------------
// SCENE 3, 4 & 5: 3D Floating VisionOS Glass Device Frame & Exploding Cards
// ----------------------------------------------------
const FloatingDeviceAndModules3D: React.FC<{ progress: number }> = ({ progress }) => {
  const isVisible = progress >= 0.18 && progress <= 0.55;
  const localProgress = (progress - 0.2) / 0.25;

  const modules = [
    { title: "Analytics Engine", color: "#FFD700", pos: [-4.5, 2.3, -1] },
    { title: "Smart Scheduler", color: "#00F2FE", pos: [4.5, 2.6, -2] },
    { title: "Media Library", color: "#E1306C", pos: [-5.2, -2.1, -1.5] },
    { title: "Reports Export", color: "#10B981", pos: [5.2, -2.4, -1] },
    { title: "AI Copilot Studio", color: "#8B5CF6", pos: [0, 3.5, -3] },
    { title: "Notifications Queue", color: "#F59E0B", pos: [-2.2, -3.6, -2] },
    { title: "Command Center", color: "#3B82F6", pos: [2.6, -3.4, -1] },
    { title: "Social Accounts", color: "#EC4899", pos: [0, -4.4, -2.5] },
  ];

  return (
    <group visible={isVisible}>
      {/* Central 3D VisionOS Glass Display Frame */}
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3} position={[0, 0, -2]}>
        <RoundedBox args={[7.5, 4.5, 0.2]} radius={0.25} smoothness={4}>
          <meshStandardMaterial
            color="#0f1117"
            metalness={0.9}
            roughness={0.1}
            emissive="#FFD700"
            emissiveIntensity={0.15}
            transparent
            opacity={0.8}
          />
        </RoundedBox>
      </Float>

      {/* Exploding / Assembling 3D Glass Cards */}
      {modules.map((m, idx) => {
        const spread = Math.sin(Math.max(0, Math.min(1, localProgress)) * Math.PI);
        const x = m.pos[0] * spread;
        const y = m.pos[1] * spread;
        const z = m.pos[2] * spread;

        return (
          <Float key={idx} speed={2} rotationIntensity={0.4} floatIntensity={0.4} position={[x, y, z]}>
            <RoundedBox args={[2.3, 1.3, 0.14]} radius={0.12}>
              <meshStandardMaterial
                color="#0a0a0f"
                metalness={0.85}
                roughness={0.15}
                emissive={m.color}
                emissiveIntensity={0.3}
                transparent
                opacity={0.85}
              />
            </RoundedBox>
            <Html center distanceFactor={10}>
              <div
                className="w-38 p-3 rounded-2xl backdrop-blur-xl border text-center shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                style={{ background: "rgba(10, 10, 15, 0.9)", borderColor: m.color }}
              >
                <span className="text-xs font-extrabold tracking-wider uppercase text-white" style={{ color: m.color }}>
                  {m.title}
                </span>
              </div>
            </Html>
          </Float>
        );
      })}
    </group>
  );
};

// ----------------------------------------------------
// SCENE 6: 3D Parametric Data Mountain Terrain & Wireframe Globe
// ----------------------------------------------------
const AnalyticsDataTerrain: React.FC<{ progress: number }> = ({ progress }) => {
  const isVisible = progress >= 0.48 && progress <= 0.65;

  const planeRef = useRef<THREE.Mesh>(null);
  const globeRef = useRef<THREE.Group>(null);

  const terrainGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(32, 32, 42, 42);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const u = pos.getX(i);
      const v = pos.getY(i);
      const z = Math.sin(u * 0.4) * Math.cos(v * 0.4) * 2.6 + Math.sin(u * 0.8) * 0.8;
      pos.setZ(i, z);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (planeRef.current) {
      planeRef.current.rotation.z = t * 0.05;
    }
    if (globeRef.current) {
      globeRef.current.rotation.y = t * 0.2;
    }
  });

  return (
    <group visible={isVisible} position={[0, -2, -4]}>
      {/* Mountain Data Wireframe Mesh */}
      <mesh ref={planeRef} geometry={terrainGeo} rotation={[-Math.PI / 2.8, 0, 0]}>
        <meshStandardMaterial
          color="#050507"
          wireframe
          emissive="#FFD700"
          emissiveIntensity={0.75}
        />
      </mesh>

      {/* Floating Glowing Audience Wireframe Globe */}
      <group ref={globeRef} position={[6.5, 4.2, -2]}>
        <Sphere args={[2.3, 32, 32]}>
          <meshStandardMaterial color="#00F2FE" wireframe emissive="#00F2FE" emissiveIntensity={0.6} />
        </Sphere>
      </group>
    </group>
  );
};

// Internal R3F Camera Scene Manager
const SceneManager: React.FC<{ progress: number; mousePos: { x: number; y: number } }> = ({ progress, mousePos }) => {
  useFrame(({ camera }) => {
    let targetX = mousePos.x * 0.8;
    let targetY = mousePos.y * 0.8;
    let targetZ = 10;

    if (progress <= 0.1) {
      targetZ = 10 - progress * 20;
    } else if (progress <= 0.2) {
      const angle = (progress - 0.1) * Math.PI * 4;
      targetX = Math.sin(angle) * 3 + mousePos.x;
      targetZ = Math.cos(angle) * 3 + 8;
    } else if (progress <= 0.3) {
      targetZ = 12;
    } else if (progress <= 0.4) {
      targetZ = 5 - (progress - 0.3) * 15;
    } else if (progress <= 0.5) {
      targetX = (progress - 0.4) * 5;
      targetZ = 6;
    } else if (progress <= 0.6) {
      targetY = 1.5;
      targetZ = 7;
    } else if (progress <= 0.7) {
      targetX = -2;
      targetZ = 8;
    } else if (progress <= 0.8) {
      targetX = 2;
      targetZ = 9;
    } else if (progress <= 0.9) {
      targetX = 0;
      targetZ = 7;
    } else {
      targetZ = 8.5;
    }

    camera.position.x += (targetX - camera.position.x) * 0.08;
    camera.position.y += (targetY - camera.position.y) * 0.08;
    camera.position.z += (targetZ - camera.position.z) * 0.08;
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 15, 10]} intensity={2.4} color="#FFD700" />
      <pointLight position={[-10, -10, -10]} intensity={1.5} color="#00F2FE" />

      <HighDensityParticleSwarm progress={progress} mousePos={mousePos} />
      <AICoreAndOrbits progress={progress} />
      <FloatingDeviceAndModules3D progress={progress} />
      <AnalyticsDataTerrain progress={progress} />
    </>
  );
};

// Main Export Component
export const ScrollytellingCanvas3D: React.FC<ScrollytellingCanvas3DProps> = ({ progress, mousePos }) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      className="w-full h-full"
    >
      <SceneManager progress={progress} mousePos={mousePos} />
    </Canvas>
  );
};
