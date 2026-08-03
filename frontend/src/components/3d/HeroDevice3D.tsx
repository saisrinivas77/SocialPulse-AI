"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Sphere, Box, RoundedBox, Torus } from "@react-three/drei";
import * as THREE from "three";

// Custom Brand SVG Social Icons
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

// Orbiting Social Media Icon Component
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
      const y = Math.sin(t * 2) * 0.6;
      ref.current.position.set(x, y, z);
    }
  });

  return (
    <group ref={ref}>
      <Html center distanceFactor={10}>
        <div
          className="p-3 rounded-2xl bg-white/90 backdrop-blur-xl border border-amber-400/40 shadow-[0_10px_30px_rgba(212,175,55,0.35)] hover:scale-125 transition-transform duration-300 cursor-pointer"
          style={{ color: color }}
        >
          <IconComp />
        </div>
      </Html>
    </group>
  );
};

// Concentric Glowing Gold Floor Rings (as seen in reference design hero)
const GoldenFloorRings = () => {
  const ringRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <group ref={ringRef} position={[0, -2.4, 0]} rotation={[-Math.PI / 2.3, 0, 0]}>
      {[2.2, 3.1, 4.0].map((r, idx) => (
        <Torus key={idx} args={[r, 0.02, 16, 100]}>
          <meshStandardMaterial
            color="#FFD700"
            emissive="#FFD700"
            emissiveIntensity={0.6 - idx * 0.15}
            transparent
            opacity={0.7 - idx * 0.18}
          />
        </Torus>
      ))}
    </group>
  );
};

// 3D Smartphone Device Mockup Component
const FloatingDeviceMockup = () => {
  const deviceGroup = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (deviceGroup.current) {
      deviceGroup.current.position.y = Math.sin(clock.getElapsedTime() * 0.8) * 0.15;
      deviceGroup.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.4) * 0.1 - 0.2;
    }
  });

  return (
    <group ref={deviceGroup} rotation={[0.2, -0.25, 0.1]} position={[0, 0.2, 0]}>
      {/* 3D Phone Body Frame */}
      <RoundedBox args={[2.5, 4.8, 0.22]} radius={0.12} smoothness={4}>
        <meshStandardMaterial
          color="#0f1115"
          metalness={0.95}
          roughness={0.1}
          emissive="#F6C453"
          emissiveIntensity={0.1}
        />
      </RoundedBox>

      {/* Screen Frame Bezel */}
      <Box args={[2.4, 4.68, 0.02]} position={[0, 0, 0.115]}>
        <meshStandardMaterial color="#050505" roughness={0.2} />
      </Box>

      {/* Interactive HTML UI Display inside 3D Phone Screen */}
      <Html
        transform
        wrapperClass="phone-screen"
        distanceFactor={3.2}
        position={[0, 0, 0.13]}
        className="w-[280px] h-[520px] rounded-[36px] bg-[#fafafa] p-4 text-gray-900 overflow-hidden shadow-2xl flex flex-col justify-between select-none"
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-gray-600 border-b pb-2">
            <span>Overview</span>
            <span className="text-[10px] text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
              Live Pulse
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-1">
            <span className="text-[10px] text-gray-500 uppercase font-semibold">Followers</span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-extrabold text-gray-900">25.6K</span>
              <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                +12.3%
              </span>
            </div>
            <svg className="w-full h-8 stroke-amber-500" fill="none" viewBox="0 0 100 30" strokeWidth="3">
              <path d="M0,25 Q20,10 40,18 T80,5 T100,12" />
            </svg>
          </div>

          <div className="p-3 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-1">
            <span className="text-[10px] text-gray-500 uppercase font-semibold">Engagement Rate</span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-extrabold text-amber-600">8.45%</span>
              <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                +8.1%
              </span>
            </div>
            <div className="h-16 flex items-center justify-center">
              <svg className="w-14 h-14" viewBox="0 0 36 36">
                <path
                  className="stroke-amber-400"
                  strokeWidth="4"
                  strokeDasharray="75, 100"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="p-2 rounded-xl bg-gray-100 flex items-center justify-around text-[10px] font-bold text-gray-600">
          <span className="text-amber-600 font-extrabold">Overview</span>
          <span>Analytics</span>
          <span>AI Insights</span>
        </div>
      </Html>
    </group>
  );
};

export const HeroDevice3D: React.FC = () => {
  const socialPlatforms = [
    { label: "Instagram", icon: InstagramIcon, color: "#E1306C", radius: 3.1, speed: 0.4, offset: 0 },
    { label: "X", icon: XIcon, color: "#1DA1F2", radius: 3.4, speed: 0.32, offset: 0.8 },
    { label: "Threads", icon: ThreadsIcon, color: "#000000", radius: 2.9, speed: 0.45, offset: 1.6 },
    { label: "TikTok", icon: TiktokIcon, color: "#00F2FE", radius: 3.6, speed: 0.36, offset: 2.4 },
    { label: "LinkedIn", icon: LinkedinIcon, color: "#0A66C2", radius: 3.2, speed: 0.28, offset: 3.2 },
    { label: "YouTube", icon: YoutubeIcon, color: "#FF0000", radius: 3.5, speed: 0.42, offset: 4.0 },
    { label: "Pinterest", icon: PinterestIcon, color: "#E60023", radius: 2.8, speed: 0.5, offset: 4.8 },
    { label: "Facebook", icon: FacebookIcon, color: "#1877F2", radius: 3.3, speed: 0.3, offset: 5.6 },
  ];

  return (
    <div className="w-full h-[560px] lg:h-[720px] relative flex items-center justify-center">
      <div className="absolute inset-0 bg-radial from-amber-400/25 via-amber-300/10 to-transparent blur-3xl rounded-full pointer-events-none" />

      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        className="z-10"
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[10, 15, 10]} intensity={2.0} color="#FFD700" />
        <pointLight position={[-10, -10, -10]} intensity={1.5} color="#F6C453" />

        <GoldenFloorRings />
        <FloatingDeviceMockup />

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
