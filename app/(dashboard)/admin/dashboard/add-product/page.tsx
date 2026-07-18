"use client";

import { useState, useRef } from "react";
import { useSession } from "@/app/lib/auth-client";
import { Upload, Loader2, CheckCircle2, X, ImagePlus, Sparkles } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

const CATEGORIES = [
  "men's clothing",
  "women's clothing",
  "kids' clothing",
];

export default function AddProductPage() {
  const { data: session } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    category: CATEGORIES[0],
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);

  const generateDescription = async () => {
    if (!formData.title.trim()) {
      setError("Please enter a product title first to generate a description.");
      return;
    }
    
    setIsGeneratingDesc(true);
    setError("");

    try {
      const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: "You are an expert e-commerce copywriter. Write a compelling, concise product description for the given product. Only return the description text, no introductory phrases. Keep it under 2 short paragraphs." },
            { role: "user", content: `Product Title: ${formData.title}\nCategory: ${formData.category}` }
          ],
          max_tokens: 300,
          temperature: 0.7,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate description");
      const data = await response.json();
      const text = data?.choices?.[0]?.message?.content || "";
      
      setFormData(prev => ({ ...prev, description: text.trim() }));
      toast.success("Description generated!");
    } catch (err) {
      console.error(err);
      setError("Failed to generate description with AI.");
    } finally {
      setIsGeneratingDesc(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const uploadToImgBB = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API}`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) throw new Error("Image upload failed");

    const data = await res.json();
    return data.data.display_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validation
    if (!formData.title.trim() || !formData.price || !formData.description.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      setError("Please enter a valid price.");
      return;
    }

    if (!imageFile) {
      setError("Please upload a product image.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload image to ImgBB
      setIsUploading(true);
      const imageUrl = await uploadToImgBB(imageFile);
      setIsUploading(false);

      // 2. Send product to server
      const product = {
        title: formData.title.trim(),
        price,
        description: formData.description.trim(),
        category: formData.category,
        image: imageUrl,
        user_email: session?.user?.email || "",
        rating: { rate: 0, count: 0 },
      };

      const res = await fetch("http://localhost:5000/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (!res.ok) throw new Error("Failed to add product");

      setSuccess(true);
      setFormData({
        title: "",
        price: "",
        description: "",
        category: CATEGORIES[0],
      });
      removeImage();

      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError("Failed to add product. Please try again.");
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  return (
    <div className="pt-4 w-full">
      <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-1">
        Add Product
      </h1>
      <p className="text-sm text-neutral-500 mb-8">
        Add a new product to the NovaCart catalog.
      </p>

      {/* Success */}
      {success && (
        <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 px-4 py-3 rounded-xl mb-6 text-sm font-medium">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          Product added successfully!
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl mb-6 text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left column — form fields */}
          <div className="space-y-5">
            {/* Product Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-xs font-semibold tracking-wide uppercase text-neutral-500 dark:text-neutral-400 mb-2"
              >
                Product Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Classic Cotton Crew Neck T-Shirt"
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#1a1a1a] border border-[#e0dbd5] dark:border-[#333] text-[#1a1a1a] dark:text-white text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-600 outline-none focus:ring-2 focus:ring-[#1a1a1a] dark:focus:ring-white/20 transition-shadow"
              />
            </div>

            {/* Price + Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="price"
                  className="block text-xs font-semibold tracking-wide uppercase text-neutral-500 dark:text-neutral-400 mb-2"
                >
                  Price ($) <span className="text-red-500">*</span>
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="29.99"
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#1a1a1a] border border-[#e0dbd5] dark:border-[#333] text-[#1a1a1a] dark:text-white text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-600 outline-none focus:ring-2 focus:ring-[#1a1a1a] dark:focus:ring-white/20 transition-shadow"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-xs font-semibold tracking-wide uppercase text-neutral-500 dark:text-neutral-400 mb-2"
                >
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#1a1a1a] border border-[#e0dbd5] dark:border-[#333] text-[#1a1a1a] dark:text-white text-sm outline-none focus:ring-2 focus:ring-[#1a1a1a] dark:focus:ring-white/20 transition-shadow appearance-none cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="description"
                  className="block text-xs font-semibold tracking-wide uppercase text-neutral-500 dark:text-neutral-400"
                >
                  Description <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={generateDescription}
                  disabled={isGeneratingDesc || !formData.title.trim()}
                  className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#1a1a1a] dark:text-white hover:opacity-70 disabled:opacity-50 transition-opacity bg-neutral-100 dark:bg-[#252525] px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-[#333]"
                >
                  {isGeneratingDesc ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  AI Generate
                </button>
              </div>
              <textarea
                id="description"
                name="description"
                required
                rows={5}
                value={formData.description}
                onChange={handleChange}
                placeholder="Write a short description of the product..."
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#1a1a1a] border border-[#e0dbd5] dark:border-[#333] text-[#1a1a1a] dark:text-white text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-600 outline-none focus:ring-2 focus:ring-[#1a1a1a] dark:focus:ring-white/20 transition-shadow resize-none"
              />
            </div>
          </div>

          {/* Right column — image upload */}
          <div>
            <label className="block text-xs font-semibold tracking-wide uppercase text-neutral-500 dark:text-neutral-400 mb-2">
              Product Image <span className="text-red-500">*</span>
            </label>

            {imagePreview ? (
              <div className="relative w-full h-[260px] lg:h-[300px] rounded-2xl overflow-hidden border border-[#e0dbd5] dark:border-[#333] bg-white dark:bg-[#1a1a1a]">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-3 right-3 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-[260px] lg:h-[300px] rounded-2xl border-2 border-dashed border-[#d0cbc5] dark:border-[#333] bg-white dark:bg-[#1a1a1a] flex flex-col items-center justify-center gap-3 hover:border-[#1a1a1a] dark:hover:border-[#555] transition-colors cursor-pointer group"
              >
                <div className="w-14 h-14 rounded-xl bg-[#f0ebe5] dark:bg-[#252525] flex items-center justify-center group-hover:bg-[#e0dbd5] dark:group-hover:bg-[#333] transition-colors">
                  <ImagePlus className="w-7 h-7 text-neutral-400" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-[#1a1a1a] dark:text-white">
                    Click to upload image
                  </p>
                  <p className="text-xs text-neutral-400 mt-1">
                    PNG, JPG, WEBP up to 10MB
                  </p>
                </div>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-10 py-3.5 bg-[#1a1a1a] dark:bg-white text-white dark:text-[#1a1a1a] text-sm font-semibold rounded-xl hover:bg-[#333] dark:hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {isUploading ? "Uploading Image..." : "Adding Product..."}
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Add Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
