"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Camera,
  Upload,
  RotateCw,
  ZoomIn,
  Trash2,
  CheckCircle2,
  Globe,
  Briefcase,
  Building,
  MapPin,
  Mail,
  Phone,
  Clock,
  Sparkles,
  Award,
  Zap,
  Loader2,
  RefreshCw,
  X,
  Palette,
} from "lucide-react";
import { toast } from "sonner";
import { socialPulseApi } from "@/lib/api";

const ACCENT_COLORS = [
  { name: "Pulse Blue", hex: "#0866FF" },
  { name: "Emerald Pro", hex: "#10B981" },
  { name: "Violet Spark", hex: "#8B5CF6" },
  { name: "Amber Glow", hex: "#F59E0B" },
  { name: "Rose Crimson", hex: "#F43F5E" },
];

export const ProfileView: React.FC = () => {
  const [profile, setProfile] = useState<any>({
    display_name: "Alex Morgan",
    username: "alex_pulse",
    email: "alex.morgan@socialpulse.ai",
    profile_image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    bio: "Senior Social Growth Strategist & AI Content Creator.",
    job_title: "Marketing Lead",
    company: "SocialPulse Enterprise",
    location: "San Francisco, CA",
    website: "https://socialpulse.ai",
    phone: "+1 (555) 234-5678",
    timezone: "UTC",
    language: "en",
    theme: "dark",
    avatar_color: "#0866FF",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showCropperModal, setShowCropperModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  // Cropper Controls
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await socialPulseApi.getUserProfile();
      if (data) {
        setProfile(data);
        if (typeof window !== "undefined" && data.profile_image) {
          localStorage.setItem("sp_user_avatar", data.profile_image);
          localStorage.setItem("sp_user_name", data.display_name || data.username);
        }
      }
    } catch {
      toast.error("Failed to load profile details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await socialPulseApi.updateUserProfile(profile);
      if (updated) {
        setProfile(updated);
        if (typeof window !== "undefined") {
          localStorage.setItem("sp_user_name", updated.display_name || updated.username);
        }
        toast.success("Profile details updated successfully!");
      }
    } catch {
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.match("image/(png|jpeg|jpg|webp)")) {
      toast.error("Invalid file format. Please upload PNG, JPEG, JPG, or WEBP.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit.");
      return;
    }
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setImagePreviewUrl(url);
    setZoom(1);
    setRotation(0);
    setShowCropperModal(true);
  };

  const handleCropAndUpload = async () => {
    if (!selectedFile) return;
    setUploadingAvatar(true);
    try {
      const res = await socialPulseApi.uploadAvatar(selectedFile);
      if (res?.avatar_url) {
        setProfile((prev: any) => ({ ...prev, profile_image: res.avatar_url }));
        if (typeof window !== "undefined") {
          localStorage.setItem("sp_user_avatar", res.avatar_url);
        }
        toast.success("Profile picture updated successfully!");
        setShowCropperModal(false);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Avatar upload failed.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (confirm("Remove custom profile picture and restore default avatar?")) {
      try {
        const res = await socialPulseApi.deleteAvatar();
        if (res?.avatar_url) {
          setProfile((prev: any) => ({ ...prev, profile_image: res.avatar_url }));
          if (typeof window !== "undefined") {
            localStorage.setItem("sp_user_avatar", res.avatar_url);
          }
          toast.success("Restored default profile picture.");
        }
      } catch {
        toast.error("Failed to remove custom avatar.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[#0866FF] animate-spin" />
      </div>
    );
  }

  const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "http://localhost:8000";
  const avatarSrc = profile.profile_image?.startsWith("/uploads")
    ? `${apiBase}${profile.profile_image}`
    : profile.profile_image;

  return (
    <div className="space-y-8 font-sans pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black/5 dark:border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <User className="w-7 h-7 text-[#0866FF]" />
            <h1 className="text-3xl font-black text-[#050505] dark:text-[#E4E6EB] tracking-tight">
              User Profile & Identity
            </h1>
          </div>
          <p className="text-[14px] text-[#65676B] dark:text-[#B0B3B8] mt-1">
            Manage your personal profile, 512x512 avatar picture, organization role, and account settings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadProfile}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#65676B] dark:text-[#B0B3B8] bg-white dark:bg-[#242526] border border-black/5 dark:border-white/10 rounded-xl hover:bg-[#F0F2F5] transition"
          >
            <RefreshCw className="w-4 h-4" /> Refresh Profile
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Quick Info */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#242526] border border-black/5 dark:border-white/10 shadow-xs text-center space-y-5 relative overflow-hidden">
            {/* Avatar Container with Hover Camera Overlay */}
            <div className="relative w-32 h-32 mx-auto group">
              <img
                src={avatarSrc}
                alt={profile.display_name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-[#18181B] shadow-lg transition-transform duration-300 group-hover:scale-105"
                style={{ outline: `3px solid ${profile.avatar_color || "#0866FF"}` }}
              />

              <label
                htmlFor="avatar-input"
                className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-opacity duration-200"
              >
                <Camera className="w-6 h-6 mb-1 animate-bounce" />
                <span className="text-[10px] font-extrabold uppercase tracking-wider">Change Photo</span>
              </label>

              <input
                id="avatar-input"
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              />
            </div>

            <div>
              <h2 className="text-xl font-black text-[#050505] dark:text-[#E4E6EB]">{profile.display_name}</h2>
              <p className="text-xs font-bold text-[#0866FF] mt-0.5">@{profile.username}</p>
              <p className="text-xs text-[#65676B] dark:text-[#B0B3B8] mt-1">{profile.job_title} at {profile.company}</p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => document.getElementById("avatar-input")?.click()}
                className="px-3.5 py-1.5 rounded-xl bg-[#0866FF] text-white text-xs font-bold hover:bg-[#1877F2] transition flex items-center gap-1.5 shadow-xs"
              >
                <Upload className="w-3.5 h-3.5" /> Upload Photo
              </button>
              <button
                onClick={handleRemoveAvatar}
                className="px-3 py-1.5 rounded-xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 text-xs font-bold border border-red-200 dark:border-red-500/20 hover:bg-red-100 transition flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> Remove
              </button>
            </div>

            {/* Accent Avatar Border Color Picker */}
            <div className="pt-4 border-t border-black/5 dark:border-white/10 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#65676B]">Avatar Accent Color</span>
              <div className="flex items-center justify-center gap-2">
                {ACCENT_COLORS.map((col) => (
                  <button
                    key={col.hex}
                    onClick={() => setProfile((p: any) => ({ ...p, avatar_color: col.hex }))}
                    className={`w-6 h-6 rounded-full border-2 transition ${
                      profile.avatar_color === col.hex ? "scale-125 border-white shadow-md" : "border-transparent"
                    }`}
                    style={{ backgroundColor: col.hex }}
                    title={col.name}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Account Badges */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#242526] border border-black/5 dark:border-white/10 shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-[#050505] dark:text-[#E4E6EB] flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" /> Account Achievements
            </h3>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-[#FAFBFD] dark:bg-[#121316] border border-black/5 text-xs font-bold text-[#050505] dark:text-[#E4E6EB]">
                <span className="text-lg block">🚀</span> Viral Maverick
              </div>
              <div className="p-3 rounded-2xl bg-[#FAFBFD] dark:bg-[#121316] border border-black/5 text-xs font-bold text-[#050505] dark:text-[#E4E6EB]">
                <span className="text-lg block">✨</span> AI Creator
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Editable Profile Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSaveProfile} className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#242526] border border-black/5 dark:border-white/10 shadow-xs space-y-6">
            <h2 className="text-lg font-black text-[#050505] dark:text-[#E4E6EB] border-b border-black/5 dark:border-white/10 pb-4">
              Edit Personal Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#65676B] uppercase tracking-wider mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  required
                  value={profile.display_name || ""}
                  onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/15 bg-[#FAFBFD] dark:bg-[#121316] text-sm text-[#050505] dark:text-[#E4E6EB] focus:outline-none focus:border-[#0866FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#65676B] uppercase tracking-wider mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={profile.username || ""}
                  onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/15 bg-[#FAFBFD] dark:bg-[#121316] text-sm text-[#050505] dark:text-[#E4E6EB] focus:outline-none focus:border-[#0866FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#65676B] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" /> Email Address (Read Only)
                </label>
                <input
                  type="email"
                  disabled
                  value={profile.email || ""}
                  className="w-full px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/15 bg-gray-100 dark:bg-white/5 text-sm text-gray-500 cursor-not-allowed font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#65676B] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" /> Phone Number
                </label>
                <input
                  type="text"
                  value={profile.phone || ""}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/15 bg-[#FAFBFD] dark:bg-[#121316] text-sm text-[#050505] dark:text-[#E4E6EB] focus:outline-none focus:border-[#0866FF]"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#65676B] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5" /> Job Title
                </label>
                <input
                  type="text"
                  value={profile.job_title || ""}
                  onChange={(e) => setProfile({ ...profile, job_title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/15 bg-[#FAFBFD] dark:bg-[#121316] text-sm text-[#050505] dark:text-[#E4E6EB] focus:outline-none focus:border-[#0866FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#65676B] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Building className="w-3.5 h-3.5" /> Company / Organization
                </label>
                <input
                  type="text"
                  value={profile.company || ""}
                  onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/15 bg-[#FAFBFD] dark:bg-[#121316] text-sm text-[#050505] dark:text-[#E4E6EB] focus:outline-none focus:border-[#0866FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#65676B] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> Location
                </label>
                <input
                  type="text"
                  value={profile.location || ""}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/15 bg-[#FAFBFD] dark:bg-[#121316] text-sm text-[#050505] dark:text-[#E4E6EB] focus:outline-none focus:border-[#0866FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#65676B] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5" /> Personal Website
                </label>
                <input
                  type="url"
                  value={profile.website || ""}
                  onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/15 bg-[#FAFBFD] dark:bg-[#121316] text-sm text-[#050505] dark:text-[#E4E6EB] focus:outline-none focus:border-[#0866FF]"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#65676B] uppercase tracking-wider mb-1.5">
                Bio & Profile Summary
              </label>
              <textarea
                rows={3}
                value={profile.bio || ""}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/15 bg-[#FAFBFD] dark:bg-[#121316] text-sm text-[#050505] dark:text-[#E4E6EB] focus:outline-none focus:border-[#0866FF]"
              />
            </div>

            <div className="pt-4 border-t border-black/5 dark:border-white/10 flex justify-end gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-[#0866FF] hover:bg-[#1877F2] text-white font-extrabold text-xs rounded-xl transition flex items-center gap-2 shadow-sm"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Interactive 512x512 Image Cropper Modal */}
      <AnimatePresence>
        {showCropperModal && imagePreviewUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#18181B] rounded-3xl p-6 max-w-lg w-full border border-black/10 dark:border-white/15 shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-4">
                <h3 className="text-lg font-black text-[#050505] dark:text-[#E4E6EB] flex items-center gap-2">
                  <Camera className="w-5 h-5 text-[#0866FF]" /> 512x512 Avatar Cropper
                </h3>
                <button
                  onClick={() => setShowCropperModal(false)}
                  className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Circle Crop Preview Canvas */}
              <div className="relative w-64 h-64 mx-auto border-4 border-[#0866FF] rounded-full overflow-hidden shadow-inner bg-black/10 flex items-center justify-center">
                <img
                  ref={imageRef}
                  src={imagePreviewUrl}
                  alt="Crop Preview"
                  className="max-w-none transition-transform duration-100"
                  style={{
                    transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  }}
                />
                <div className="absolute inset-0 rounded-full border-2 border-white/50 pointer-events-none" />
              </div>

              {/* Controls */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-bold text-[#65676B] flex items-center gap-1">
                    <ZoomIn className="w-4 h-4" /> Zoom Level ({zoom.toFixed(1)}x)
                  </span>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.1"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-40 accent-[#0866FF]"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#65676B] flex items-center gap-1">
                    <RotateCw className="w-4 h-4" /> Rotate Angle
                  </span>
                  <button
                    onClick={() => setRotation((r) => (r + 90) % 360)}
                    className="px-3 py-1.5 rounded-xl border border-black/10 dark:border-white/15 text-xs font-bold hover:bg-black/5"
                  >
                    Rotate 90° ({rotation}°)
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/5 dark:border-white/10">
                <button
                  onClick={() => setShowCropperModal(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-black/5 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCropAndUpload}
                  disabled={uploadingAvatar}
                  className="px-5 py-2.5 rounded-xl bg-[#0866FF] hover:bg-[#1877F2] text-white text-xs font-black transition flex items-center gap-2 shadow-md"
                >
                  {uploadingAvatar ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  Crop & Save Avatar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
