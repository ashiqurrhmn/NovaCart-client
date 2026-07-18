"use client";

import { useState, useRef, useEffect, use } from "react";
import { Upload, Loader2, CheckCircle2, X, ImagePlus, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/app/lib/auth-client";

const CATEGORIES = [
  "men's clothing",
  "women's clothing",
  "kids' clothing",
];

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Unwrapping params in React 19 / Next.js 15
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

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
  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Fetch the existing product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`);
        if (!res.ok) {
          if (res.status === 404) throw new Error("Product not found");
          throw new Error("Failed to fetch product");
        }
        
        const data = await res.json();
        setFormData({
          title: data.title || data.name || "",
          price: data.price ? data.price.toString() : "",
          description: data.description || "",
          category: data.category || CATEGORIES[0],
        });
        setImagePreview(data.image || data.imageUrl || "");
      } catch (err: any) {
        setError(err.message || "Failed to load product details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

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

    if (!imagePreview && !imageFile) {
      setError("Please provide a product image.");
      return;
    }

    setIsSubmitting(true);

    try {
      let finalImageUrl = imagePreview;

      // Only upload a new image if the user selected a new file
      if (imageFile) {
        setIsUploading(true);
        finalImageUrl = await uploadToImgBB(imageFile);
        setIsUploading(false);
      }

      // 2. Send updated product to server
      const product = {
        title: formData.title.trim(),
        price,
        description: formData.description.trim(),
        category: formData.category,
        image: finalImageUrl,
      };
      
      const { data: tokenData } = await authClient.token();
      const jwtToken = tokenData?.token;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwtToken}`
        },
        body: JSON.stringify(product),
      });

      if (!res.ok) throw new Error("Failed to update product");

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/dashboard/products");
      }, 2000);
    } catch (err) {
      setError("Failed to update product. Please try again.");
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="pt-4 w-full animate-pulse">
        <div className="w-24 h-4 bg-neutral-200 dark:bg-neutral-800 rounded mb-4"></div>
        <div className="w-48 h-8 bg-neutral-200 dark:bg-neutral-800 rounded mb-2"></div>
        <div className="w-64 h-4 bg-neutral-200 dark:bg-neutral-800 rounded mb-8"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-5">
            <div>
              <div className="w-32 h-4 bg-neutral-200 dark:bg-neutral-800 rounded mb-2"></div>
              <div className="w-full h-12 bg-neutral-200 dark:bg-neutral-800 rounded-xl"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <div className="w-20 h-4 bg-neutral-200 dark:bg-neutral-800 rounded mb-2"></div>
                <div className="w-full h-12 bg-neutral-200 dark:bg-neutral-800 rounded-xl"></div>
              </div>
              <div>
                <div className="w-20 h-4 bg-neutral-200 dark:bg-neutral-800 rounded mb-2"></div>
                <div className="w-full h-12 bg-neutral-200 dark:bg-neutral-800 rounded-xl"></div>
              </div>
            </div>
            <div>
              <div className="w-24 h-4 bg-neutral-200 dark:bg-neutral-800 rounded mb-2"></div>
              <div className="w-full h-32 bg-neutral-200 dark:bg-neutral-800 rounded-xl"></div>
            </div>
          </div>
          <div>
            <div className="w-32 h-4 bg-neutral-200 dark:bg-neutral-800 rounded mb-2"></div>
            <div className="w-full h-[260px] lg:h-[300px] bg-neutral-200 dark:bg-neutral-800 rounded-2xl"></div>
          </div>
        </div>
        <div className="pt-8">
          <div className="w-full sm:w-40 h-12 bg-neutral-200 dark:bg-neutral-800 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-4 w-full">
      <Link 
        href="/admin/dashboard/products" 
        className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-[#1a1a1a] dark:hover:text-white transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Products
      </Link>
      
      <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-1">
        Edit Product
      </h1>
      <p className="text-sm text-neutral-500 mb-8">
        Make changes to the product details.
      </p>

      {/* Success */}
      {success && (
        <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 px-4 py-3 rounded-xl mb-6 text-sm font-medium">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          Product updated successfully! Redirecting...
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
              <label
                htmlFor="description"
                className="block text-xs font-semibold tracking-wide uppercase text-neutral-500 dark:text-neutral-400 mb-2"
              >
                Description <span className="text-red-500">*</span>
              </label>
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
                    Click to upload new image
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
                {isUploading ? "Uploading Image..." : "Saving Changes..."}
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
