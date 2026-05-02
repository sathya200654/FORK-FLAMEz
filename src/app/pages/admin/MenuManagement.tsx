import { useState } from "react";
import { motion } from "motion/react";
import { Plus, Edit, Trash2, Upload, ToggleLeft, ToggleRight } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "../../context/AppContext";
import AdminNav from "../../components/AdminNav";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

export default function MenuManagement() {
  const { menuItems, addMenuItem, updateMenuItem, removeMenuItem, toggleMenuItemAvailability } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Appetizer",
    veg: false,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&auto=format&fit=crop",
  });

  const handleOpenModal = (itemId?: number) => {
    if (itemId) {
      const item = menuItems.find(m => m.id === itemId);
      if (item) {
        setEditingId(itemId);
        setFormData({
          name: item.name,
          description: item.description || "",
          price: item.price.toString(),
          category: item.category,
          veg: item.veg,
          image: item.image,
        });
      }
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "Appetizer",
        veg: false,
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&auto=format&fit=crop",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (editingId) {
      updateMenuItem(editingId, {
        name: formData.name,
        description: formData.description,
        price: parseInt(formData.price),
        category: formData.category,
        veg: formData.veg,
        image: formData.image,
      });
      toast.success(`${formData.name} updated successfully!`);
    } else {
      addMenuItem({
        name: formData.name,
        description: formData.description,
        price: parseInt(formData.price),
        category: formData.category,
        veg: formData.veg,
        available: true,
        image: formData.image,
      });
      toast.success(`${formData.name} added to menu!`);
    }

    handleCloseModal();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <div className="flex min-h-screen bg-[#0D0D0D]">
      <AdminNav />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl text-[#F5F5F5] mb-2">Menu Management</h1>
              <p className="text-[#A0A0A0]">Add and manage your menu items</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleOpenModal()}
              className="bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-[#0D0D0D] px-6 py-3 rounded-xl hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Item
            </motion.button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#1A1A1A]/50 backdrop-blur-sm border border-[#D4AF37]/20 rounded-2xl overflow-hidden hover:border-[#D4AF37] transition-all"
              >
                <div className="relative h-48">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 px-3 py-1 bg-[#0D0D0D]/80 backdrop-blur-sm rounded-full">
                    <span
                      className={`text-sm ${item.veg ? "text-[#10B981]" : "text-[#DC2626]"}`}
                    >
                      {item.veg ? "VEG" : "NON-VEG"}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg text-[#F5F5F5] mb-1">
                        {item.name}
                      </h3>
                      <p className="text-[#A0A0A0] text-sm">{item.category}</p>
                    </div>
                    <span className="text-[#D4AF37] text-xl">₹{item.price}</span>
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <button
                      onClick={() => toggleMenuItemAvailability(item.id)}
                      className={`flex-1 px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                        item.available
                          ? "bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30"
                          : "bg-[#DC2626]/20 text-[#DC2626] border border-[#DC2626]/30"
                      }`}
                    >
                      {item.available ? (
                        <ToggleRight className="w-5 h-5" />
                      ) : (
                        <ToggleLeft className="w-5 h-5" />
                      )}
                      {item.available ? "Available" : "Unavailable"}
                    </button>
                    <button 
                      onClick={() => handleOpenModal(item.id)}
                      className="p-2 bg-[#D4AF37]/20 text-[#D4AF37] rounded-lg hover:bg-[#D4AF37]/30 transition-colors">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        removeMenuItem(item.id);
                        toast.success(`${item.name} removed from menu`);
                      }}
                      className="p-2 bg-[#DC2626]/20 text-[#DC2626] rounded-lg hover:bg-[#DC2626]/30 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-[#0D0D0D]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={handleCloseModal}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1A1A1A] border border-[#D4AF37]/30 rounded-2xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl text-[#F5F5F5] mb-6">
              {editingId ? "Edit Item" : "Add New Item"}
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Item Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-[#0D0D0D]/50 border border-[#D4AF37]/20 rounded-xl px-4 py-3 text-[#F5F5F5] placeholder:text-[#A0A0A0] focus:border-[#D4AF37] focus:outline-none"
              />
              <textarea
                name="description"
                placeholder="Item Description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full bg-[#0D0D0D]/50 border border-[#D4AF37]/20 rounded-xl px-4 py-3 text-[#F5F5F5] placeholder:text-[#A0A0A0] focus:border-[#D4AF37] focus:outline-none"
              />
              <input
                type="number"
                name="price"
                placeholder="Price (₹)"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full bg-[#0D0D0D]/50 border border-[#D4AF37]/20 rounded-xl px-4 py-3 text-[#F5F5F5] placeholder:text-[#A0A0A0] focus:border-[#D4AF37] focus:outline-none"
              />
              <input
                type="text"
                name="image"
                placeholder="Image URL"
                value={formData.image}
                onChange={handleInputChange}
                className="w-full bg-[#0D0D0D]/50 border border-[#D4AF37]/20 rounded-xl px-4 py-3 text-[#F5F5F5] placeholder:text-[#A0A0A0] focus:border-[#D4AF37] focus:outline-none text-sm"
              />
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full bg-[#0D0D0D]/50 border border-[#D4AF37]/20 rounded-xl px-4 py-3 text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
              >
                <option>Appetizer</option>
                <option>Main Course</option>
                <option>Dessert</option>
                <option>Beverages</option>
              </select>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-[#F5F5F5] cursor-pointer">
                  <input
                    type="checkbox"
                    name="veg"
                    checked={formData.veg}
                    onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  Vegetarian
                </label>
              </div>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-[#0D0D0D] py-3 rounded-xl hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all"
                >
                  {editingId ? "Update Item" : "Add Item"}
                </motion.button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 bg-[#2A2A2A] text-[#F5F5F5] py-3 rounded-xl hover:bg-[#333] transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
