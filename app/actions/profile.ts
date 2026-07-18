"use server";

export async function uploadImageToImgBB(formData: FormData) {
  const image = formData.get("image") as File;
  if (!image) {
    throw new Error("No image provided");
  }

  if (image.size > 5 * 1024 * 1024) {
    throw new Error("Image size must be less than 5MB");
  }

  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API || process.env.IMGBB_API;
  if (!apiKey) {
    throw new Error("ImgBB API key is not configured");
  }

  // Read the file into an ArrayBuffer and encode to base64
  // This bypasses any Next.js File proxy stream issues when calling native fetch
  const arrayBuffer = await image.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64Image = buffer.toString('base64');
  
  const uploadData = new FormData();
  uploadData.append("image", base64Image);
  
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: uploadData,
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("ImgBB upload failed:", res.status, text);
    throw new Error(`ImgBB Upload Failed: ${text.substring(0, 50)}`);
  }

  const data = await res.json();
  return data.data.url as string;
}
