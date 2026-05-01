import { motion, AnimatePresence } from "motion/react";
import { X, MapPin, Edit, Save, ShoppingBag, Calendar, User as UserIcon } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router";
import { useState } from "react";
import { toast } from "sonner";

interface UserProfilePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface EditFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  preferredDining: "dine-in" | "takeaway";
}

// Sample order data with items
const orderHistory = [
  { 
    id: "ORD-001", 
    items: "Butter Chicken x2, Paneer Tikka x1", 
    itemsList: [
      { id: 1, name: "Butter Chicken", quantity: 2, price: 450, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=200" },
      { id: 4, name: "Paneer Tikka", quantity: 1, price: 380, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=200" }
    ],
    total: 980, 
    date: "Apr 20, 2026" 
  },
  { 
    id: "ORD-002", 
    items: "Paneer Tikka x1", 
    itemsList: [
      { id: 2, name: "Paneer Tikka", quantity: 1, price: 380, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=200" }
    ],
    total: 380, 
    date: "Apr 18, 2026" 
  },
  { 
    id: "ORD-003", 
    items: "Biryani x2", 
    itemsList: [
      { id: 3, name: "Biryani", quantity: 2, price: 420, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200" }
    ],
    total: 840, 
    date: "Apr 15, 2026" 
  },
];

const bookingHistory = [
  { id: "BK-001", table: 5, seats: 4, date: "Apr 22, 2026", time: "19:00" },
  { id: "BK-002", table: 3, seats: 2, date: "Apr 10, 2026", time: "20:30" },
];

export default function UserProfilePanel({ isOpen, onClose }: UserProfilePanelProps) {
  const { user, setUser, addToCart } = useApp();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<EditFormData>({
    name: user?.name || "Guest User",
    email: user?.email || "guest@forkandflame.com",
    phone: user?.phone || "+1 234 567 8900",
    address: user?.address || "123 Royal Street, Downtown",
    preferredDining: (user?.preferredDining as "dine-in" | "takeaway") || "dine-in",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = () => {
    if (setUser && user) {
      setUser({
        ...user,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        preferredDining: formData.preferredDining,
      });
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    }
  };

  const handleReorder = (items: any[]) => {
    items.forEach(item => {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      });
    });
    onClose();
    navigate("/customer/cart");
    toast.success("Items added to cart!");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0D0D0D]/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-[#1A1A1A] border-l border-[#D4AF37]/30 z-50 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] bg-clip-text text-transparent">
                  Profile
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-[#D4AF37]/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-[#D4AF37]" />
                </button>
              </div>

              <div className="bg-[#0D0D0D]/50 border border-[#D4AF37]/20 rounded-2xl p-6 mb-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8960F] flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.3)] flex-shrink-0">
                    <UserIcon className="w-12 h-12 text-[#0D0D0D]" />
                  </div>
                  <div className="flex-1">
                    {!isEditing ? (
                      <>
                        <h3 className="text-2xl text-[#F5F5F5] mb-1">
                          {formData.name}
                        </h3>
                        <p className="text-[#A0A0A0] mb-3">{formData.email}</p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setIsEditing(true)}
                          className="px-4 py-2 bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] rounded-lg hover:bg-[#D4AF37]/30 transition-all flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Edit Profile
                        </motion.button>
                      </>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSaveProfile}
                        className="px-4 py-2 bg-[#10B981]/20 border border-[#10B981]/30 text-[#10B981] rounded-lg hover:bg-[#10B981]/30 transition-all flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Save Changes
                      </motion.button>
                    )}
                  </div>
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[#A0A0A0] text-sm mb-2">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-lg px-4 py-2 text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[#A0A0A0] text-sm mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-lg px-4 py-2 text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[#A0A0A0] text-sm mb-2">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-lg px-4 py-2 text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[#A0A0A0] text-sm mb-2">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-lg px-4 py-2 text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[#A0A0A0] text-sm mb-2">Preferred Dining</label>
                      <select
                        name="preferredDining"
                        value={formData.preferredDining}
                        onChange={handleInputChange}
                        className="w-full bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-lg px-4 py-2 text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none transition-colors"
                      >
                        <option value="dine-in">Dine-In</option>
                        <option value="takeaway">Takeaway</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-[#1A1A1A] rounded-xl">
                      <div className="text-[#D4AF37]">📱</div>
                      <div>
                        <p className="text-[#A0A0A0] text-sm">Phone</p>
                        <p className="text-[#F5F5F5]">{formData.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-[#1A1A1A] rounded-xl">
                      <MapPin className="w-5 h-5 text-[#D4AF37]" />
                      <div>
                        <p className="text-[#A0A0A0] text-sm">Address</p>
                        <p className="text-[#F5F5F5]">{formData.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-[#1A1A1A] rounded-xl">
                      <div className="text-[#D4AF37]">🍽️</div>
                      <div>
                        <p className="text-[#A0A0A0] text-sm">Preferred Dining</p>
                        <p className="text-[#F5F5F5] capitalize">
                          {formData.preferredDining.replace("-", " ")}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
                  <h3 className="text-xl text-[#F5F5F5]">Order History</h3>
                </div>
                <div className="space-y-3">
                  {orderHistory.map((order) => (
                    <div
                      key={order.id}
                      className="bg-[#0D0D0D]/50 border border-[#D4AF37]/10 rounded-xl p-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-[#F5F5F5] mb-1">{order.id}</p>
                          <p className="text-[#A0A0A0] text-sm">{order.items}</p>
                        </div>
                        <p className="text-[#D4AF37]">₹{order.total}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-[#A0A0A0] text-xs">{order.date}</p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleReorder(order.itemsList)}
                          className="px-3 py-1 bg-[#D4AF37]/20 text-[#D4AF37] rounded-lg text-sm hover:bg-[#D4AF37]/30 transition-all"
                        >
                          Reorder
                        </motion.button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-[#D4AF37]" />
                  <h3 className="text-xl text-[#F5F5F5]">Booking History</h3>
                </div>
                <div className="space-y-3">
                  {bookingHistory.map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-[#0D0D0D]/50 border border-[#D4AF37]/10 rounded-xl p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[#F5F5F5]">{booking.id}</p>
                        <p className="text-[#D4AF37]">Table {booking.table}</p>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <p className="text-[#A0A0A0]">{booking.seats} guests</p>
                        <p className="text-[#A0A0A0]">
                          {booking.date} • {booking.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
