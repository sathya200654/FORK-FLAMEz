import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Star,
  Plus,
  Minus,
  ShoppingCart,
  Home,
  Package,
} from "lucide-react";
import { toast } from "sonner";
import { useApp } from "../../context/AppContext";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

export default function FoodDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToCart, menuItems } = useApp();
  const [quantity, setQuantity] = useState(1);
  
  const dishId = parseInt(id || "1");
  const dish = menuItems.find(item => item.id === dishId);

  if (!dish) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl text-[#F5F5F5] mb-4">Dish Not Found</h1>
          <button
            onClick={() => navigate("/customer/home")}
            className="bg-[#D4AF37] text-[#0D0D0D] px-6 py-3 rounded-xl hover:bg-[#F4D03F] transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!dish.available) {
      toast.error(`${dish.name} is currently not available. Please check back later!`);
      return;
    }
    
    addToCart({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      quantity,
      image: dish.image,
    });
    toast.success(`${dish.name} added to cart!`);
    setQuantity(1);
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <nav className="bg-[#1A1A1A]/80 backdrop-blur-xl border-b border-[#D4AF37]/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-[#D4AF37]/20 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-[#D4AF37]" />
          </button>
          <h1 className="text-2xl font-serif bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] bg-clip-text text-transparent">
            {dish.name}
          </h1>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative h-96 md:h-full rounded-2xl overflow-hidden border border-[#D4AF37]/30"
          >
            <ImageWithFallback
              src={dish.image}
              alt={dish.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 px-4 py-2 bg-[#0D0D0D]/80 backdrop-blur-sm rounded-full border border-[#D4AF37]/30">
              <span
                className={`${dish.veg ? "text-[#10B981]" : "text-[#DC2626]"}`}
              >
                {dish.veg ? "VEG" : "NON-VEG"}
              </span>
            </div>
            {!dish.available && (
              <div className="absolute inset-0 bg-[#0D0D0D]/70 flex items-center justify-center">
                <span className="text-2xl text-red-500 font-semibold">OUT OF STOCK</span>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-4xl text-[#F5F5F5] mb-3">{dish.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl text-[#D4AF37]">₹{dish.price}</span>
                <div className="flex items-center gap-2 bg-[#1A1A1A] px-3 py-1 rounded-lg">
                  <Star className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37]" />
                  <span className="text-[#F5F5F5]">4.5</span>
                  <span className="text-[#A0A0A0]">(250+ reviews)</span>
                </div>
              </div>
              <p className="text-[#A0A0A0] leading-relaxed">
                {dish.description || "Delicious and expertly prepared dish."}
              </p>
              {!dish.available && (
                <div className="mt-4 p-3 bg-red-500/20 border border-red-500 rounded-lg">
                  <p className="text-red-400">This dish is currently unavailable.</p>
                </div>
              )}
            </div>

            {dish.available && (
              <>
                <div>
                  <h3 className="text-xl text-[#F5F5F5] mb-3">Quantity</h3>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-lg hover:border-[#D4AF37] transition-colors"
                    >
                      <Minus className="w-5 h-5 text-[#D4AF37]" />
                    </button>
                    <span className="text-2xl text-[#F5F5F5] w-12 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-lg hover:border-[#D4AF37] transition-colors"
                    >
                      <Plus className="w-5 h-5 text-[#D4AF37]" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-[#0D0D0D] py-4 rounded-xl hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart - ₹{dish.price * quantity}
                  </motion.button>

                  <div className="grid grid-cols-2 gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-[#1A1A1A] border border-[#D4AF37]/30 text-[#D4AF37] py-3 rounded-xl hover:border-[#D4AF37] hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all flex items-center justify-center gap-2"
                    >
                      <Home className="w-5 h-5" />
                      Dine-In
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-[#1A1A1A] border border-[#D4AF37]/30 text-[#D4AF37] py-3 rounded-xl hover:border-[#D4AF37] hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all flex items-center justify-center gap-2"
                    >
                      <Package className="w-5 h-5" />
                      Takeaway
                    </motion.button>
                  </div>
                </div>
              </>
            )}

            {!dish.available && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled
                className="w-full bg-[#666] text-[#999] py-4 rounded-xl cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5 inline mr-2" />
                Unavailable
              </motion.button>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
