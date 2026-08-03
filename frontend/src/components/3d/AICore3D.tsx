"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Float, Sphere, Box, RoundedBox, Torus, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

// SVG Brand Social Icons
const InstagramIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.74a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2z" />
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.99 3.66 9.12 8.44 9.88v-6.99H7.9v-2.89h2.54V9.8c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.89h-2.34v6.99C18.34 21.12 22 16.99 22 12z" />
  </svg>
);

const ThreadsIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 21.5c-5.2 0-9.5-4.3-9.5-9.5S6.8 2.5 12 2.5s9.5 4.3 9.5 9.5c0 3.5-1.9 6.6-4.8 8.2l-.9-1.5c2.4-1.3 3.9-3.9 3.9-6.7 0-4.3-3.5-7.8-7.7-7.8S4.3 7.7 4.3 12s3.5 7.8 7.7 7.8c1.8 0 3.5-.6 4.9-1.8l1.2 1.2c-1.7 1.4-3.9 2.3-6.1 2.3z" />
  </svg>
);

const TiktokIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-2.85V7.6a6.34 6.34 0 0 0-5.11 6.16 6.34 6.34 0 1 0 11.45-3.83 8.33 8.33 0 0 0 4.77 1.49V7.98a4.85 4.85 0 0 1-1-.29z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const PinterestIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.42 7.63 11.17-.11-.95-.2-2.41.04-3.45.22-.94 1.42-6 1.42-6s-.36-.72-.36-1.78c0-1.67.97-2.92 2.17-2.92 1.02 0 1.51.77 1.51 1.69 0 1.03-.66 2.56-1 3.98-.28 1.19.6 2.16 1.77 2.16 2.13 0 3.77-2.25 3.77-5.49 0-2.87-2.06-4.88-5.01-4.88-3.41 0-5.42 2.56-5.42 5.2 0 1.03.4 2.13.9 2.74.1.12.11.23.08.35l-.34 1.42c-.05.23-.19.28-.43.17-1.57-.73-2.55-3.03-2.55-4.87 0-3.97 2.89-7.62 8.32-7.62 4.37 0 7.76 3.11 7.76 7.27 0 4.34-2.73 7.84-6.53 7.84-1.28 0-2.48-.66-2.89-1.45l-.79 3.01c-.28 1.1-1.05 2.48-1.56 3.32C9.57 23.82 10.76 24 12 24c6.63 0 12-5.37 12-12S18.63 0 12 0z" />
  </svg>
);

const XIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// Floating 3D AI Neural Chip Core
const FloatingAICore = () => {
  const coreRef = useRef<THREE.Group>(null);
  const chipMesh = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (coreRef.current) {
      coreRef.current.rotation.y = clock.getElapsedTime() * 0.25;
      coreRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.8) * 0.15;
    }
    if (chipMesh.current) {
      chipMesh.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.5) * 0.2;
    }
  });

  return (
    <group ref={coreRef}>
      {/* Outer Glowing Distorted Energy Sphere */}
      <Sphere args={[2.0, 64, 64]}>
        <MeshDistortMaterial
          color="#0f1115"
          attach="material"
          distort={0.35}
          speed={2.2}
          roughness={0.1}
          metalness={0.9}
          wireframe={true}
          emissive="#FFD700"
          emissiveIntensity={0.3}
        />
      </Sphere>

      {/* Central 3D AI Processor Chip */}
      <Float speed={2} rotationIntensity={0.6} floatIntensity={0.6}>
        <RoundedBox ref={chipMesh} args={[1.4, 1.4, 0.4]} radius={0.15} smoothness={4}>
          <meshStandardMaterial
            color="#FFD700"
            metalness={0.95}
            roughness={0.15}
            emissive="#F6C453"
            emissiveIntensity={0.5}
          />
        </RoundedBox>
      </Float>

      {/* Concentric Golden Ring Orbits */}
      {[2.5, 3.3, 4.1].map((r, idx) => (
        <Torus key={idx} args={[r, 0.02, 16, 100]} rotation={[Math.PI / 3, idx * 0.5, 0]}>
          <meshStandardMaterial
            color="#FFD700"
            emissive="#FFD700"
            emissiveIntensity={0.6 - idx * 0.15}
            transparent
            opacity={0.6}
          />
        </Torus>
      ))}
    </group>
  );
};

// Orbiting Social Media Badge Component
const OrbitingIcon: React.FC<{
  radius: number;
  speed: number;
  offset: number;
  icon: React.ComponentType;
  color: string;
  label: string;
}> = ({ radius, speed, offset, icon: IconComp, color, label }) => {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime() * speed + offset;
      const x = Math.cos(t) * radius;
      const z = Math.sin(t) * radius;
      const y = Math.sin(t * 2) * 0.7;
      ref.current.position.set(x, y, z);
    }
  });

  return (
    <group ref={ref}>
      <Html center distanceFactor={11}>
        <div
          className="group relative flex items-center justify-center p-3 rounded-2xl glass-card transition-all duration-300 hover:scale-125 cursor-pointer shadow-[0_10px_30px_rgba(255,215,0,0.35)]"
          style={{
            background: "rgba(15, 17, 21, 0.92)",
            borderColor: color,
            boxShadow: `0 0 30px ${color}50`,
          }}
        >
          <div
            className="w-8 h-8 flex items-center justify-center rounded-xl text-white font-bold"
            style={{ color: color }}
          >
            <IconComp />
          </div>
          <span className="absolute -bottom-7 opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 text-amber-400 text-xs font-bold px-2.5 py-0.5 rounded-md whitespace-nowrap border border-amber-500/30">
            {label}
          </span>
        </div>
      </Html>
    </group>
  );
};

// Particle Streams & Connecting Neural Lines
const GoldenParticleStreams = () => {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const count = 1000;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const goldColor = new THREE.Color("#FFD700");
    const accentColor = new THREE.Color("#F6C453");

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 2.5 + Math.random() * 1.2;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const mixedColor = Math.random() > 0.4 ? goldColor : accentColor;
      col[i * 3] = mixedColor.r;
      col[i * 3 + 1] = mixedColor.g;
      col[i * 3 + 2] = mixedColor.b;
    }
    return [pos, col];
  }, []);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.06;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export const AICore3D: React.FC = () => {
  const socialPlatforms = [
    { label: "Instagram", icon: InstagramIcon, color: "#E1306C", radius: 3.3, speed: 0.38, offset: 0 },
    { label: "LinkedIn", icon: LinkedinIcon, color: "#0A66C2", radius: 3.6, speed: 0.28, offset: 0.8 },
    { label: "Facebook", icon: FacebookIcon, color: "#1877F2", radius: 3.1, speed: 0.42, offset: 1.6 },
    { label: "TikTok", icon: TiktokIcon, color: "#00F2FE", radius: 3.8, speed: 0.34, offset: 2.4 },
    { label: "YouTube", icon: YoutubeIcon, color: "#FF0000", radius: 3.4, speed: 0.25, offset: 3.2 },
    { label: "Threads", icon: ThreadsIcon, color: "#FFFFFF", radius: 3.0, speed: 0.46, offset: 4.0 },
    { label: "Pinterest", icon: PinterestIcon, color: "#E60023", radius: 2.9, speed: 0.48, offset: 4.8 },
    { label: "X / Twitter", icon: XIcon, color: "#1DA1F2", radius: 3.7, speed: 0.3, offset: 5.6 },
  ];

  return (
    <div className="w-full h-[580px] lg:h-[740px] relative flex items-center justify-center">
      <div className="absolute inset-0 bg-radial from-amber-400/30 via-amber-300/10 to-transparent blur-3xl rounded-full pointer-events-none" />

      <Canvas
        camera={{ position: [0, 0, 8.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        className="z-10"
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[10, 15, 10]} intensity={2.0} color="#FFD700" />
        <pointLight position={[-10, -10, -10]} intensity={1.5} color="#F6C453" />

        <FloatingAICore />
        <GoldenParticleStreams />

        {socialPlatforms.map((sp) => (
          <OrbitingIcon
            key={sp.label}
            radius={sp.radius}
            speed={sp.speed}
            offset={sp.offset}
            icon={sp.icon}
            color={sp.color}
            label={sp.label}
          />
        ))}
      </Canvas>
    </div>
  );
};
