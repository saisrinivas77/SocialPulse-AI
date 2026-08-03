import React, { ReactNode } from 'react';

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({ children, className = '' }) => {
  return (
    <div className={`backdrop-blur-md bg-white/30 border border-white/20 rounded-2xl shadow-sm ${className}`}>
      {children}
    </div>
  );
};
