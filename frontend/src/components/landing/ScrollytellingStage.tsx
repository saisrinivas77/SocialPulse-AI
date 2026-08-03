"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SceneOverlays } from "@/components/landing/SceneOverlays";

// Dynamically import 3D Canvas with ssr: false for WebGL RSC compatibility
const ScrollytellingCanvas3D = dynamic(
  () => import("@/components/3d/ScrollytellingCanvas3D").then((m) => m.ScrollytellingCanvas3D),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-[#050507]">
        <div className="w-8 h-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
      </div>
    ),
  }
);

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const ScrollytellingStage: React.FC = () => {
  const stageRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Mouse Move Position Listener for 3D & Particle Physics
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Lenis Smooth Scroll & GSAP ScrollTrigger Integration
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.1,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Update ScrollTrigger on Lenis scroll
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // GSAP ScrollTrigger scrubbing 0 to 1 progress across 1000vh stage
    if (stageRef.current) {
      const trigger = ScrollTrigger.create({
        trigger: stageRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
        onUpdate: (self) => {
          setProgress(self.progress);
        },
      });

      return () => {
        trigger.kill();
        lenis.destroy();
      };
    }
  }, []);

  return (
    <div ref={stageRef} className="relative w-full h-[1000vh] bg-[#050507]">
      {/* STICKY FULLSCREEN VIEWPORT STAGE */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#050507] flex items-center justify-center">
        {/* Fullscreen 3D Canvas Background */}
        <div className="absolute inset-0 z-0">
          <ScrollytellingCanvas3D progress={progress} mousePos={mousePos} />
        </div>

        {/* DOM Scene Overlays & Micro-Interactions */}
        <div className="absolute inset-0 z-10">
          <SceneOverlays progress={progress} />
        </div>
      </div>
    </div>
  );
};
