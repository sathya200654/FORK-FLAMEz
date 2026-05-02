import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Trash2, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "../../context/AppContext";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, updateCartQuantity, removeFromCart, clearCart } = useApp();

  const updateQuantity = (id: number, delta: number) => {
    const item = cartItems.find((i) => i.id === id);
    if (item) {
      const newQuantity = Math.max(1, item.quantity + delta);
      updateCartQuantity(id, newQuantity);
    }
  };

  const removeItem = (id: number) => {
    removeFromCart(id);
    toast.success("Item removed from cart");
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    
    const orderData = {
      items: cartItems,
      subtotal,
      tax,
      total,
    };
    
    navigate("/customer/payment", { state: { orderData } });
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <nav className="bg-[#1A1A1A]/80 backdrop-blur-xl border-b border-[#D4AF37]/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate("/customer/home")}
            className="p-2 hover:bg-[#D4AF37]/20 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-[#D4AF37]" />
          </button>
          <h1 className="text-2xl font-serif bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] bg-clip-text text-transparent">
            Your Cart
          </h1>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[#A0A0A0] text-xl mb-6">Your cart is empty</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/customer/home")}
              className="bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-[#0D0D0D] px-6 py-3 rounded-xl"
            >
              Continue Shopping
            </motion.button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#1A1A1A]/50 backdrop-blur-sm border border-[#D4AF37]/20 rounded-2xl p-4 hover:border-[#D4AF37] transition-all"
                >
                  <div className="flex gap-4">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-xl"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl text-[#F5F5F5] mb-2">
                        {item.name}
                      </h3>
                      <p className="text-[#D4AF37] text-lg mb-3">
                        ₹{item.price}
                      </p>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-2 bg-[#0D0D0D] border border-[#D4AF37]/20 rounded-lg hover:border-[#D4AF37] transition-colors"
                        >
                          <Minus className="w-4 h-4 text-[#D4AF37]" />
                        </button>
                        <span className="text-[#F5F5F5] w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-2 bg-[#0D0D0D] border border-[#D4AF37]/20 rounded-lg hover:border-[#D4AF37] transition-colors"
                        >
                          <Plus className="w-4 h-4 text-[#D4AF37]" />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 hover:bg-[#DC2626]/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5 text-[#DC2626]" />
                      </button>
                      <span className="text-[#D4AF37] text-xl">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#1A1A1A]/50 backdrop-blur-sm border border-[#D4AF37]/30 rounded-2xl p-6 h-fit sticky top-24"
            >
              <h2 className="text-2xl text-[#F5F5F5] mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-[#A0A0A0]">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-[#A0A0A0]">
                  <span>Tax (5%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="h-px bg-[#D4AF37]/20" />
                <div className="flex justify-between text-[#F5F5F5] text-xl">
                  <span>Total</span>
                  <span className="text-[#D4AF37]">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-[#0D0D0D] py-4 rounded-xl hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all"
              >
                Proceed to Checkout
              </motion.button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
