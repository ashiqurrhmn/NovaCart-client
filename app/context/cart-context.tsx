"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import toast from "react-hot-toast";
import { useSession, authClient } from "@/app/lib/auth-client";

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  // Load from database on mount or when userId changes
  useEffect(() => {
    async function loadCart() {
      if (!userId || session?.user?.role === "admin") {
        setCartItems([]);
        return;
      }
      setIsLoading(true);
      try {
        const { data: tokenData } = await authClient.token();
        const jwtToken = tokenData?.token;

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/${userId}`, {
          headers: { "Authorization": `Bearer ${jwtToken}` }
        });
        if (res.ok) {
          const data = await res.json();
          setCartItems(data.items || []);
        }
      } catch (error) {
        console.error("Failed to load cart from database", error);
        toast.error("Failed to load cart");
      } finally {
        setIsLoading(false);
      }
    }
    loadCart();
  }, [userId]);

  const addToCart = async (item: Omit<CartItem, "quantity">) => {
    if (!userId) {
      toast.error("Please login to add items to your cart");
      window.location.href = "/login";
      return;
    }
    
    if (session?.user?.role === "admin") {
      toast.error("Admins cannot buy items");
      return;
    }

    const existingItem = cartItems.find((i) => i._id === item._id);
    if (existingItem) {
      toast.success("Item quantity updated in cart");
    } else {
      toast.success("Item added to cart");
    }

    // Optimistic UI update
    setCartItems((prevItems) => {
      const exists = prevItems.find((i) => i._id === item._id);
      if (exists) {
        return prevItems.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });

    try {
      const { data: tokenData } = await authClient.token();
      const jwtToken = tokenData?.token;

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/${userId}/add`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwtToken}`
        },
        body: JSON.stringify(item),
      });
    } catch (error) {
      console.error("Error adding item to DB", error);
    }
  };

  const removeFromCart = async (id: string) => {
    if (!userId) return;
    
    // Optimistic UI update
    setCartItems((prevItems) => prevItems.filter((i) => i._id !== id));
    toast.success("Item removed from cart");

    try {
      const { data: tokenData } = await authClient.token();
      const jwtToken = tokenData?.token;

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/${userId}/item/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${jwtToken}` }
      });
    } catch (error) {
      console.error("Error removing item from DB", error);
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (!userId) return;

    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    // Optimistic update
    setCartItems((prevItems) =>
      prevItems.map((i) => (i._id === id ? { ...i, quantity } : i))
    );

    try {
      const { data: tokenData } = await authClient.token();
      const jwtToken = tokenData?.token;

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/${userId}/item/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwtToken}`
        },
        body: JSON.stringify({ quantity }),
      });
    } catch (error) {
      console.error("Error updating quantity in DB", error);
    }
  };

  const clearCart = async () => {
    if (!userId) return;

    setCartItems([]);
    toast.success("Cart cleared");

    try {
      const { data: tokenData } = await authClient.token();
      const jwtToken = tokenData?.token;

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/${userId}/clear`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${jwtToken}` }
      });
    } catch (error) {
      console.error("Error clearing cart in DB", error);
    }
  };

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
