"use client";

import React, { useState } from "react";
import { Image as ImageIcon, Upload, Search, Filter, Eye, Folder, Trash2 } from "lucide-react";
import { toast } from "sonner";

const mediaItems = [
  { id: "m1", title: "Luxury Gold 3D Render", folder: "Branding", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80", size: "2.4 MB" },
  { id: "m2", title: "Social Analytics Infographic", folder: "Campaigns", url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80", size: "1.8 MB" },
  { id: "m3", title: "AI Neural Network Concept", folder: "Product", url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80", size: "3.1 MB" },
  { id: "m4", title: "Enterprise Executive Briefing", folder: "Branding", url: "https://images.unsplash.com/photo-1542744094-3a3172720449?auto=format&fit=crop&w=600&q=80", size: "4.2 MB" },
];

export const MediaLibraryView: React.FC = () => {
  const [selectedFolder, setSelectedFolder] = useState("All");
  const [activePreview, setActivePreview] = useState<typeof mediaItems[0] | null>(null);

  const filtered = mediaItems.filter(
    (item) => selectedFolder === "All" || item.folder === selectedFolder
  );

  return (
    <div className="space-y-8 pb-12 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6" style={{ borderBottom: '1px solid var(--card-border)' }}>
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <ImageIcon className="w-8 h-8" style={{ color: '#C8A14A' }} /> Media Asset Library
          </h1>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Masonry grid for brand graphics, videos & AI renders</p>
        </div>

        <button
          onClick={() => toast.success("Upload modal active")}
          className="px-5 py-2.5 text-xs font-bold text-white rounded-full shadow-md flex items-center gap-2 transition-all"
          style={{ background: 'linear-gradient(135deg, #C8A14A, #B8922E)' }}
        >
          <Upload className="w-4 h-4" />
          <span>Upload Media Asset</span>
        </button>
      </div>

      {/* Folder Tabs Filter */}
      <div className="flex items-center gap-2 pb-4" style={{ borderBottom: '1px solid var(--card-border)' }}>
        {["All", "Branding", "Campaigns", "Product"].map((folder) => (
          <button
            key={folder}
            onClick={() => setSelectedFolder(folder)}
            className="px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            style={{
              background: selectedFolder === folder ? '#C8A14A' : 'var(--bg-secondary)',
              color: selectedFolder === folder ? '#FFFFFF' : 'var(--text-secondary)',
              border: '1px solid var(--card-border)',
            }}
          >
            <Folder className="w-3.5 h-3.5" />
            <span>{folder}</span>
          </button>
        ))}
      </div>

      {/* Masonry Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => setActivePreview(item)}
            className="p-3 border rounded-[24px] group cursor-pointer space-y-3 transition-all duration-300 hover:-translate-y-1 shadow-xs"
            style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
          >
            <div className="relative overflow-hidden rounded-xl h-48">
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md" style={{ background: 'linear-gradient(135deg, #C8A14A, #B8922E)' }}>
                  <Eye className="w-3.5 h-3.5" /> Quick View
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-xs font-bold truncate" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
              <div className="flex justify-between text-[10px]" style={{ color: 'var(--text-muted)' }}>
                <span>{item.folder}</span>
                <span>{item.size}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Preview */}
      {activePreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl p-6 space-y-4 rounded-3xl shadow-2xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
            <div className="flex items-center justify-between pb-3" style={{ borderBottom: '1px solid var(--card-border)' }}>
              <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{activePreview.title}</h2>
              <button onClick={() => setActivePreview(null)} className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>Close ✕</button>
            </div>
            <img src={activePreview.url} alt={activePreview.title} className="w-full h-80 object-cover rounded-2xl" />
            <div className="flex justify-between items-center text-xs" style={{ color: 'var(--text-secondary)' }}>
              <span>Folder: <strong style={{ color: 'var(--text-primary)' }}>{activePreview.folder}</strong></span>
              <span>Size: <strong style={{ color: 'var(--text-primary)' }}>{activePreview.size}</strong></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
