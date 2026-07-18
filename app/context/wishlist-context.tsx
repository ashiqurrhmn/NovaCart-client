"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import toast from "react-hot-toast";
import { useSession, authClient } from "@/app/lib/auth-client";

export interface WishlistItem {
  _id: string;
  name: string;
  price: number;
  image: string;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  toggleWishlist: (item: WishlistItem) => void;
  isInWishlist: (id: string) => boolean;
  totalItems: number;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const userRole = session?.user?.role;

  // Load from database on mount or when userId changes
  useEffect(() => {
    async function loadWishlist() {
      if (!userId || userRole === "admin") {
        setWishlistItems([]);
        return;
      }
      setIsLoading(true);
      try {
        const { data: tokenData } = await authClient.token();
        const jwtToken = tokenData?.token;

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishlist/${userId}`, {
          headers: { "Authorization": `Bearer ${jwtToken}` }
        });
        if (res.ok) {
          const data = await res.json();
          setWishlistItems(data.items || []);
        }
      } catch (error) {
        console.error("Failed to load wishlist from database", error);
        toast.error("Failed to load wishlist");
      } finally {
        setIsLoading(false);
      }
    }
    loadWishlist();
  }, [userId, userRole]);

  const addToWishlist = async (item: WishlistItem) => {
    if (!userId) {
      toast.error("Please login to add items to your wishlist");
      window.location.href = "/login";
      return;
    }
    
    if (userRole === "admin") {
      toast.error("Admins cannot use the wishlist");
      return;
    }

    const existingItem = wishlistItems.find((i) => i._id === item._id);
    if (existingItem) {
      return; // Already in wishlist
    }

    toast.success("Item added to wishlist");

    // Optimistic UI update
    setWishlistItems((prevItems) => [...prevItems, item]);

    try {
      const { data: tokenData } = await authClient.token();
      const jwtToken = tokenData?.token;

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishlist/${userId}/add`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwtToken}`
        },
        body: JSON.stringify(item),
      });
    } catch (error) {
      console.error("Error adding item to wishlist DB", error);
    }
  };

  const removeFromWishlist = async (id: string) => {
    if (!userId || userRole === "admin") return;
    
    // Optimistic UI update
    setWishlistItems((prevItems) => prevItems.filter((i) => i._id !== id));
    toast.success("Item removed from wishlist");

    try {
      const { data: tokenData } = await authClient.token();
      const jwtToken = tokenData?.token;

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishlist/${userId}/item/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${jwtToken}` }
      });
    } catch (error) {
      console.error("Error removing item from wishlist DB", error);
    }
  };

  const toggleWishlist = (item: WishlistItem) => {
    if (isInWishlist(item._id)) {
      removeFromWishlist(item._id);
    } else {
      addToWishlist(item);
    }
  };

  const isInWishlist = (id: string) => {
    return wishlistItems.some((item) => item._id === id);
  };

  const totalItems = wishlistItems.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        totalItems,
        isLoading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
