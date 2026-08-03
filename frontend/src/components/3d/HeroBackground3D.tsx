"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const HeroBackground3D: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Animated Grid Layer */}
      <div className="absolute inset-0 animated-grid opacity-30" />

      {/* Mouse Reactive Lighting Spotlight */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          background: `radial-gradient(800px circle at ${mousePos.x}% ${mousePos.y}%, rgba(255, 215, 0, 0.08), transparent 40%)`,
        }}
      />

      {/* Aurora Light Beams */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
          rotate: [0, 15, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-[20%] left-[15%] w-[600px] h-[600px] bg-gradient-to-tr from-amber-500/15 via-amber-400/5 to-transparent rounded-full blur-[120px]"
      />

      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.5, 0.2],
          rotate: [0, -20, 0],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-[30%] right-[10%] w-[500px] h-[500px] bg-gradient-to-bl from-amber-300/10 via-yellow-600/5 to-transparent rounded-full blur-[140px]"
      />

      {/* Floating Particles Layer */}
      <div className="absolute inset-0 opacity-40">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
              scale: Math.random() * 0.5 + 0.5,
              opacity: Math.random() * 0.5 + 0.2,
            }}
            animate={{
              y: ["0%", "-30%", "0%"],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 8 + Math.random() * 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
            className="absolute w-1.5 h-1.5 bg-amber-400 rounded-full shadow-[0_0_10px_#ffd700]"
          />
        ))}
      </div>
    </div>
  );
};
