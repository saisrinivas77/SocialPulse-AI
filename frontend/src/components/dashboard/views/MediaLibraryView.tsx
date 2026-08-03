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
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <ImageIcon className="w-8 h-8 text-amber-400" /> Media Asset Library
          </h1>
          <p className="text-xs text-gray-400 mt-1">Pinterest-style masonry grid for brand graphics, videos & AI renders</p>
        </div>

        <button
          onClick={() => toast.success("Upload modal active")}
          className="btn-magnetic btn-gold px-5 py-2.5 text-xs font-bold flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Media Asset</span>
        </button>
      </div>

      {/* Folder Tabs Filter */}
      <div className="flex items-center gap-2 border-b border-amber-500/15 pb-4">
        {["All", "Branding", "Campaigns", "Product"].map((folder) => (
          <button
            key={folder}
            onClick={() => setSelectedFolder(folder)}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
              selectedFolder === folder
                ? "bg-amber-500 text-black shadow"
                : "bg-white/5 text-gray-400 hover:text-white"
            }`}
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
            className="glass-card p-3 border-amber-500/20 hover:border-amber-500/50 group cursor-pointer space-y-3 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="relative overflow-hidden rounded-xl h-48">
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="bg-amber-500 text-black text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> Quick View
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-xs font-bold text-white truncate">{item.title}</h3>
              <div className="flex justify-between text-[10px] text-gray-400">
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
          <div className="w-full max-w-2xl glass-card border-amber-500/30 p-6 space-y-4 animate-rise-in">
            <div className="flex items-center justify-between border-b border-amber-500/15 pb-3">
              <h2 className="text-base font-bold text-white">{activePreview.title}</h2>
              <button onClick={() => setActivePreview(null)} className="text-gray-400 hover:text-white text-xs font-bold">Close ✕</button>
            </div>
            <img src={activePreview.url} alt={activePreview.title} className="w-full h-80 object-cover rounded-2xl" />
            <div className="flex justify-between items-center text-xs text-gray-300">
              <span>Folder: <strong>{activePreview.folder}</strong></span>
              <span>Size: <strong>{activePreview.size}</strong></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
