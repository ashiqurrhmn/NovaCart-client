"use client";

import { useState, useRef, useEffect } from "react";
import { useSession, updateUser } from "@/app/lib/auth-client";
import { uploadImageToImgBB } from "@/app/actions/profile";
import { Camera, Save, Loader2, User } from "lucide-react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  
  const [name, setName] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize name when session loads
  useEffect(() => {
    if (user?.name && !name) {
      setName(user.name);
    }
  }, [user, name]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    
    setIsSaving(true);
    try {
      let imageUrl = user?.image;

      // 1. Upload image to ImgBB if changed
      if (selectedImage) {
        const formData = new FormData();
        formData.append("image", selectedImage);
        
        toast.loading("Uploading image...", { id: "upload" });
        imageUrl = await uploadImageToImgBB(formData);
        toast.dismiss("upload");
      }

      // 2. Update user via better-auth
      toast.loading("Updating profile...", { id: "update" });
      const { data, error } = await updateUser({
        name,
        image: imageUrl || undefined,
      });

      if (error) {
        throw new Error(error.message || "Failed to update profile");
      }

      toast.dismiss("update");
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.dismiss();
      toast.error(err.message || "An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  if (isPending) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-neutral-400" /></div>;
  }

  const currentDisplayImage = previewUrl || user?.image;

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl pt-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] dark:text-white tracking-tight transition-colors">
          Manage Profile
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 transition-colors">
          Update your account details and profile picture
        </p>
      </div>

      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 sm:p-8 transition-colors mt-2">
        <div className="flex flex-col gap-8">
          {/* Avatar Upload */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative group shrink-0">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-neutral-100 dark:bg-neutral-800 border-4 border-white dark:border-[#1a1a1a] shadow-sm flex items-center justify-center">
                {currentDisplayImage ? (
                  <img src={currentDisplayImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-neutral-400" />
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 bg-[#1a1a1a] dark:bg-white text-white dark:text-[#1a1a1a] rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer"
              >
                <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                onChange={handleImageSelect}
                className="hidden" 
              />
            </div>
            <div>
              <h3 className="text-[13px] font-semibold tracking-[0.08em] uppercase text-[#1a1a1a] dark:text-white mb-1">
                Profile Picture
              </h3>
              <p className="text-[13px] text-neutral-500 dark:text-neutral-400 mb-4 max-w-sm">
                Upload a new avatar. Large images will be resized automatically.
              </p>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="text-[12px] font-medium px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-[#1a1a1a] dark:text-white rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
              >
                Choose Image
              </button>
            </div>
          </div>

          <hr className="border-neutral-100 dark:border-neutral-800 transition-colors" />

          {/* Name Input */}
          <div>
            <label className="block text-[11px] font-semibold tracking-[0.1em] uppercase text-neutral-500 dark:text-neutral-400 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-[14px] text-[#1a1a1a] dark:text-white outline-none focus:border-[#1a1a1a] dark:focus:border-white transition-colors"
            />
          </div>

          {/* Email (Readonly) */}
          <div>
            <label className="block text-[11px] font-semibold tracking-[0.1em] uppercase text-neutral-500 dark:text-neutral-400 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={user?.email || ""}
              readOnly
              className="w-full px-4 py-3 bg-neutral-100 dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-xl text-[14px] text-neutral-500 dark:text-neutral-500 cursor-not-allowed outline-none transition-colors"
            />
            <p className="text-[11px] text-neutral-500 dark:text-neutral-500 mt-2">
              Email address cannot be changed.
            </p>
          </div>

          <hr className="border-neutral-100 dark:border-neutral-800 transition-colors" />

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 bg-[#1a1a1a] dark:bg-white text-white dark:text-[#1a1a1a] rounded-xl text-[13px] font-semibold tracking-[0.05em] uppercase hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
