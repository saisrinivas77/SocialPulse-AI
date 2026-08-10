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
  { name: "Gold Enterprise", hex: "#C8A14A" },
  { name: "Emerald Pro", hex: "#22C55E" },
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
    avatar_color: "#C8A14A",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showCropperModal, setShowCropperModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await socialPulseApi.getProfile();
      if (data) {
        setProfile((prev: any) => ({
          ...prev,
          ...data,
          display_name: data.display_name || data.first_name || prev.display_name,
          profile_image: data.profile_image || data.avatar_url || prev.profile_image,
        }));
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (JPEG, PNG, WebP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file size must be less than 5MB.");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreviewUrl(reader.result as string);
      setShowCropperModal(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropAndUpload = async () => {
    if (!selectedFile) return;

    setUploadingAvatar(true);
    try {
      const uploadRes = await socialPulseApi.uploadAvatar(selectedFile);
      if (uploadRes?.profile_image) {
        setProfile((prev: any) => ({ ...prev, profile_image: uploadRes.profile_image }));
        if (typeof window !== "undefined") {
          localStorage.setItem("sp_user_avatar", uploadRes.profile_image);
        }
        toast.success("Avatar image updated!");
        setShowCropperModal(false);
      }
    } catch {
      toast.error("Failed to upload avatar.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await socialPulseApi.updateUserProfile({
        display_name: profile.display_name,
        username: profile.username,
        bio: profile.bio,
        job_title: profile.job_title,
        company: profile.company,
        location: profile.location,
        website: profile.website,
        phone: profile.phone,
        avatar_color: profile.avatar_color,
      });

      if (typeof window !== "undefined") {
        localStorage.setItem("sp_user_name", profile.display_name);
      }
      toast.success("Profile details saved!");
    } catch {
      toast.error("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (confirm("Are you sure you want to remove your profile picture?")) {
      try {
        await socialPulseApi.deleteAvatar();
        setProfile((prev: any) => ({
          ...prev,
          profile_image: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            profile.display_name
          )}&background=C8A14A&color=fff`,
        }));
        toast.success("Avatar removed.");
      } catch {
        toast.error("Failed to remove custom avatar.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#C8A14A' }} />
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6" style={{ borderBottom: '1px solid var(--card-border)' }}>
        <div>
          <div className="flex items-center gap-2">
            <User className="w-7 h-7" style={{ color: '#C8A14A' }} />
            <h1 className="text-3xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
              User Profile & Identity
            </h1>
          </div>
          <p className="text-[14px] mt-1" style={{ color: 'var(--text-secondary)' }}>
            Manage your personal profile, 512x512 avatar picture, organization role, and account settings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadProfile}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition"
            style={{ border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-secondary)' }}
          >
            <RefreshCw className="w-4 h-4" /> Refresh Profile
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Quick Info */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl shadow-xs text-center space-y-5 relative overflow-hidden" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
            {/* Avatar Container with Hover Camera Overlay */}
            <div className="relative w-32 h-32 mx-auto group">
              <img
                src={avatarSrc}
                alt={profile.display_name}
                className="w-32 h-32 rounded-full object-cover shadow-lg transition-transform duration-300 group-hover:scale-105"
                style={{ outline: `3px solid ${profile.avatar_color || "#C8A14A"}` }}
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
              <h2 className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>{profile.display_name}</h2>
              <p className="text-xs font-bold mt-0.5" style={{ color: '#C8A14A' }}>@{profile.username}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{profile.job_title} at {profile.company}</p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => document.getElementById("avatar-input")?.click()}
                className="px-3.5 py-1.5 rounded-xl text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                style={{ background: 'linear-gradient(135deg, #C8A14A, #B8922E)' }}
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
            <div className="pt-4 border-t space-y-2" style={{ borderColor: 'var(--card-border)' }}>
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Avatar Accent Color</span>
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
          <div className="p-6 rounded-3xl shadow-xs space-y-4" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
            <h3 className="text-sm font-extrabold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Award className="w-4 h-4 text-amber-500" /> Account Achievements
            </h3>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-2xl border text-xs font-bold" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}>
                <span className="text-lg block">🚀</span> Viral Maverick
              </div>
              <div className="p-3 rounded-2xl border text-xs font-bold" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}>
                <span className="text-lg block">✨</span> AI Creator
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Editable Profile Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSaveProfile} className="p-6 md:p-8 rounded-3xl shadow-xs space-y-6" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
            <h2 className="text-lg font-black pb-4" style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--card-border)' }}>
              Edit Personal Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  Display Name
                </label>
                <input
                  type="text"
                  required
                  value={profile.display_name || ""}
                  onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ border: '1px solid var(--card-border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#C8A14A'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'var(--card-border)'}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={profile.username || ""}
                  onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ border: '1px solid var(--card-border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#C8A14A'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'var(--card-border)'}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                  <Mail className="w-3.5 h-3.5" /> Email Address (Read Only)
                </label>
                <input
                  type="email"
                  disabled
                  value={profile.email || ""}
                  className="w-full px-4 py-2.5 rounded-xl border text-sm cursor-not-allowed font-semibold opacity-70"
                  style={{ borderColor: 'var(--card-border)', background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                  <Phone className="w-3.5 h-3.5" /> Phone Number
                </label>
                <input
                  type="text"
                  value={profile.phone || ""}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ border: '1px solid var(--card-border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                  placeholder="+1 (555) 000-0000"
                  onFocus={(e) => e.currentTarget.style.borderColor = '#C8A14A'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'var(--card-border)'}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                  <Briefcase className="w-3.5 h-3.5" /> Job Title
                </label>
                <input
                  type="text"
                  value={profile.job_title || ""}
                  onChange={(e) => setProfile({ ...profile, job_title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ border: '1px solid var(--card-border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#C8A14A'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'var(--card-border)'}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                  <Building className="w-3.5 h-3.5" /> Company / Organization
                </label>
                <input
                  type="text"
                  value={profile.company || ""}
                  onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ border: '1px solid var(--card-border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#C8A14A'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'var(--card-border)'}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                  <MapPin className="w-3.5 h-3.5" /> Location
                </label>
                <input
                  type="text"
                  value={profile.location || ""}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ border: '1px solid var(--card-border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#C8A14A'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'var(--card-border)'}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                  <Globe className="w-3.5 h-3.5" /> Personal Website
                </label>
                <input
                  type="url"
                  value={profile.website || ""}
                  onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ border: '1px solid var(--card-border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                  placeholder="https://yourwebsite.com"
                  onFocus={(e) => e.currentTarget.style.borderColor = '#C8A14A'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'var(--card-border)'}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Bio & Profile Summary
              </label>
              <textarea
                rows={3}
                value={profile.bio || ""}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                style={{ border: '1px solid var(--card-border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#C8A14A'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'var(--card-border)'}
              />
            </div>

            <div className="pt-4 border-t flex justify-end gap-3" style={{ borderColor: 'var(--card-border)' }}>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 text-white font-extrabold text-xs rounded-xl transition flex items-center gap-2 shadow-sm"
                style={{ background: 'linear-gradient(135deg, #C8A14A, #B8922E)' }}
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
              className="rounded-3xl p-6 max-w-lg w-full border shadow-2xl space-y-6"
              style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
            >
              <div className="flex items-center justify-between pb-4" style={{ borderBottom: '1px solid var(--card-border)' }}>
                <h3 className="text-lg font-black flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <Camera className="w-5 h-5" style={{ color: '#C8A14A' }} /> 512x512 Avatar Cropper
                </h3>
                <button
                  onClick={() => setShowCropperModal(false)}
                  className="p-1.5 rounded-full"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Circle Crop Preview Canvas */}
              <div className="relative w-64 h-64 mx-auto border-4 rounded-full overflow-hidden shadow-inner bg-black/10 flex items-center justify-center" style={{ borderColor: '#C8A14A' }}>
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
                  <span className="text-xs font-bold flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                    <ZoomIn className="w-4 h-4" /> Zoom Level ({zoom.toFixed(1)}x)
                  </span>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.1"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-40 cursor-pointer"
                    style={{ accentColor: '#C8A14A' }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                    <RotateCw className="w-4 h-4" /> Rotate Angle
                  </span>
                  <button
                    onClick={() => setRotation((r) => (r + 90) % 360)}
                    className="px-3 py-1.5 rounded-xl border text-xs font-bold"
                    style={{ borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}
                  >
                    Rotate 90° ({rotation}°)
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4" style={{ borderTop: '1px solid var(--card-border)' }}>
                <button
                  onClick={() => setShowCropperModal(false)}
                  className="px-4 py-2 text-xs font-bold rounded-xl"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCropAndUpload}
                  disabled={uploadingAvatar}
                  className="px-5 py-2.5 rounded-xl text-white text-xs font-black transition flex items-center gap-2 shadow-md"
                  style={{ background: 'linear-gradient(135deg, #C8A14A, #B8922E)' }}
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
