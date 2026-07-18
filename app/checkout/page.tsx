"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/cart-context";
import { useSession, authClient } from "@/app/lib/auth-client";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import toast from "react-hot-toast";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

export default function CheckoutPage() {
  const { cartItems, totalPrice, clearCart, isLoading: cartLoading } = useCart();
  const { data: session, isPending } = useSession();
  const router = useRouter();
  
  const [step, setStep] = useState<1 | 2>(1);
  const [clientSecret, setClientSecret] = useState("");
  
  // Delivery Address State
  const [address, setAddress] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
  });

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [isPending, session, router]);

  if (isPending || cartLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-neutral-200 border-t-neutral-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] p-4 text-center">
        <h1 className="text-2xl font-bold mb-4 text-[#1a1a1a] dark:text-white">Your cart is empty</h1>
        <button onClick={() => router.push("/shop")} className="text-blue-600 hover:underline">
          Go back to shopping
        </button>
      </div>
    );
  }

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.name || !address.street || !address.city || !address.state || !address.zip) {
      toast.error("Please fill in all required fields.");
      return;
    }
    
    const loadingToast = toast.loading("Preparing payment...");
    
    try {
      const { data: tokenData } = await authClient.token();
      const jwtToken = tokenData?.token;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/create-payment-intent`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwtToken}`
        },
        body: JSON.stringify({ items: cartItems }),
      });
      
      const data = await res.json();
      
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setStep(2);
        toast.dismiss(loadingToast);
      } else {
        throw new Error(data.error || data.message || "No client secret returned");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to initialize payment.");
      toast.dismiss(loadingToast);
    }
  };

  return (
    <div className="flex-1 w-full bg-background">
      <div className="max-w-[800px] mx-auto px-4 py-8 md:py-12">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1a1a1a] dark:text-white uppercase mb-8">
          Checkout
        </h1>

        <div className="bg-white dark:bg-[#1a1a1a] border border-[#e8e2db] dark:border-[#333] rounded-2xl p-6 md:p-8">
          {step === 1 && (
            <form onSubmit={handleAddressSubmit} className="space-y-6">
              <h2 className="text-xl font-bold text-[#1a1a1a] dark:text-white mb-4">Delivery Address</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#1a1a1a] dark:text-[#e0e0e0]">Full Name</label>
                  <input
                    required
                    type="text"
                    value={address.name}
                    onChange={(e) => setAddress({ ...address, name: e.target.value })}
                    className="w-full bg-[#f5f0eb] dark:bg-[#222222] text-[#1a1a1a] dark:text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#1a1a1a] dark:focus:ring-white transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#1a1a1a] dark:text-[#e0e0e0]">Phone Number</label>
                  <input
                    type="tel"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full bg-[#f5f0eb] dark:bg-[#222222] text-[#1a1a1a] dark:text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#1a1a1a] dark:focus:ring-white transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#1a1a1a] dark:text-[#e0e0e0]">Street Address</label>
                <input
                  required
                  type="text"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className="w-full bg-[#f5f0eb] dark:bg-[#222222] text-[#1a1a1a] dark:text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#1a1a1a] dark:focus:ring-white transition-all"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2 md:col-span-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#1a1a1a] dark:text-[#e0e0e0]">City</label>
                  <input
                    required
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full bg-[#f5f0eb] dark:bg-[#222222] text-[#1a1a1a] dark:text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#1a1a1a] dark:focus:ring-white transition-all"
                  />
                </div>
                <div className="space-y-2 md:col-span-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#1a1a1a] dark:text-[#e0e0e0]">State</label>
                  <input
                    required
                    type="text"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full bg-[#f5f0eb] dark:bg-[#222222] text-[#1a1a1a] dark:text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#1a1a1a] dark:focus:ring-white transition-all"
                  />
                </div>
                <div className="space-y-2 md:col-span-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#1a1a1a] dark:text-[#e0e0e0]">ZIP Code</label>
                  <input
                    required
                    type="text"
                    value={address.zip}
                    onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                    className="w-full bg-[#f5f0eb] dark:bg-[#222222] text-[#1a1a1a] dark:text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#1a1a1a] dark:focus:ring-white transition-all"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-[#e8e2db] dark:border-[#333]">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm font-bold text-[#1a1a1a] dark:text-[#e0e0e0] uppercase tracking-wider">Total to Pay</span>
                  <span className="text-xl font-bold text-[#1a1a1a] dark:text-white">${totalPrice.toFixed(2)}</span>
                </div>
                
                <button
                  type="submit"
                  className="w-full flex items-center justify-center bg-[#1a1a1a] dark:bg-white text-white dark:text-[#1a1a1a] py-4 rounded-xl font-bold uppercase tracking-wide text-sm hover:opacity-80 transition-opacity"
                >
                  Continue to Payment
                </button>
              </div>
            </form>
          )}

          {step === 2 && clientSecret && (
            <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
              <CheckoutForm 
                address={address} 
                cartItems={cartItems} 
                totalPrice={totalPrice} 
                userId={session?.user?.id as string} 
                user={session?.user}
                clearCart={clearCart}
                onBack={() => setStep(1)}
              />
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
}

function CheckoutForm({ address, cartItems, totalPrice, userId, user, clearCart, onBack }: any) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (error) {
      toast.error(error.message || "Payment failed");
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Save order to DB
      try {
        const { data: tokenData } = await authClient.token();
        const jwtToken = tokenData?.token;

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwtToken}`
          },
          body: JSON.stringify({
            userId,
            userName: user?.name,
            userEmail: user?.email,
            userImage: user?.image,
            items: cartItems,
            totalAmount: totalPrice,
            deliveryAddress: address,
            paymentIntentId: paymentIntent.id,
          }),
        });

        if (res.ok) {
          await clearCart();
          router.push("/checkout/success");
        } else {
          toast.error("Payment succeeded, but failed to save order details. Contact support.");
        }
      } catch (dbError) {
        toast.error("Database error. Contact support.");
      }
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#1a1a1a] dark:text-white">Payment Details</h2>
        <button type="button" onClick={onBack} className="text-sm font-semibold text-neutral-500 hover:text-[#1a1a1a] dark:hover:text-white transition-colors">
          Edit Address
        </button>
      </div>

      <div className="bg-[#f5f0eb] dark:bg-[#222222] p-4 rounded-xl mb-6">
        <p className="text-sm font-medium text-[#1a1a1a] dark:text-[#e0e0e0] mb-1">Delivering to:</p>
        <p className="text-xs text-neutral-600 dark:text-neutral-400">
          {address.name}<br/>
          {address.street}<br/>
          {address.city}, {address.state} {address.zip}
        </p>
      </div>
      
      <PaymentElement />
      
      <div className="pt-6 border-t border-[#e8e2db] dark:border-[#333]">
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="w-full flex items-center justify-center bg-[#1a1a1a] dark:bg-white text-white dark:text-[#1a1a1a] py-4 rounded-xl font-bold uppercase tracking-wide text-sm hover:opacity-80 transition-opacity disabled:opacity-50"
        >
          {isProcessing ? "Processing..." : `Pay $${totalPrice.toFixed(2)}`}
        </button>
      </div>
    </form>
  );
}
