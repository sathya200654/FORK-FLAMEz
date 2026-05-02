import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  Search,
  ShoppingCart,
  User,
  Star,
  ChefHat,
  Bell,
  CalendarCheck,
  LogOut,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import NotificationPanel from "../../components/NotificationPanel";
import UserProfilePanel from "../../components/UserProfilePanel";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { toast } from "sonner";

export default function CustomerHome() {
  const navigate = useNavigate();
  const { unreadCount, setUser, cartItems, menuItems } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/customer/search?q=${searchQuery}`);
    }
  };

  const handleLogout = () => {
    setUser(null);
    toast.success("Logged out successfully!");
    navigate("/home");
  };

  // Convert menu items to display format with rating
  const displayDishes = menuItems.map((item, index) => ({
    ...item,
    rating: 4.5 + ((index % 5) * 0.1),
  }));

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <nav className="bg-[#1A1A1A]/80 backdrop-blur-xl border-b border-[#D4AF37]/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-serif bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] bg-clip-text text-transparent">
            Fork & Flame
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/customer/table-booking")}
              className="p-2 hover:bg-[#D4AF37]/20 rounded-lg transition-colors"
            >
              <CalendarCheck className="w-6 h-6 text-[#D4AF37]" />
            </button>
            <button
              onClick={() => setShowNotifications(true)}
              className="p-2 hover:bg-[#D4AF37]/20 rounded-lg transition-colors relative"
            >
              <Bell className="w-6 h-6 text-[#D4AF37]" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#DC2626] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => navigate("/customer/cart")}
              className="p-2 hover:bg-[#D4AF37]/20 rounded-lg transition-colors relative"
            >
              <ShoppingCart className="w-6 h-6 text-[#D4AF37]" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-[#0D0D0D] text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setShowProfile(true)}
              className="p-2 hover:bg-[#D4AF37]/20 rounded-lg transition-colors"
            >
              <User className="w-6 h-6 text-[#D4AF37]" />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-6 h-6 text-red-500" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-[#D4AF37]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for dishes, cuisines..."
              className="w-full bg-[#1A1A1A]/50 border border-[#D4AF37]/30 rounded-2xl pl-16 pr-6 py-5 text-[#F5F5F5] placeholder:text-[#A0A0A0] focus:border-[#D4AF37] focus:outline-none focus:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all text-lg"
            />
          </form>
        </motion.div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <ChefHat className="w-8 h-8 text-[#D4AF37]" />
            <h2 className="text-3xl text-[#F5F5F5]">Most Popular Dishes</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {displayDishes.map((dish, index) => (
              <motion.div
                key={dish.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                onClick={() => navigate(`/customer/food/${dish.id}`)}
                className="cursor-pointer bg-[#1A1A1A]/50 backdrop-blur-sm border border-[#D4AF37]/20 rounded-2xl overflow-hidden hover:border-[#D4AF37] hover:shadow-[0_0_30px_rgba(212,175,55,0.2)] transition-all group"
              >
                <div className="relative h-48 overflow-hidden">
                  <ImageWithFallback
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 px-3 py-1 bg-[#0D0D0D]/80 backdrop-blur-sm rounded-full border border-[#D4AF37]/30">
                    <span
                      className={`text-sm ${dish.veg ? "text-[#10B981]" : "text-[#DC2626]"}`}
                    >
                      {dish.veg ? "VEG" : "NON-VEG"}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg text-[#F5F5F5] mb-2">{dish.name}</h3>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[#D4AF37] text-xl">₹{dish.price}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
                      <span className="text-[#F5F5F5]">{dish.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-[#0D0D0D] py-2 rounded-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all"
                  >
                    Order Now
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <NotificationPanel isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
      <UserProfilePanel isOpen={showProfile} onClose={() => setShowProfile(false)} />
    </div>
  );
}
