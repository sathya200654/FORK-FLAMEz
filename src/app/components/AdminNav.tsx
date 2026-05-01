import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  Users as UsersIcon,
  CalendarCheck,
  BarChart3,
  Table2,
  UserCog,
  Truck,
  Package,
  LogOut,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { toast } from "sonner";

const navItems = [
  { path: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/admin/menu", icon: UtensilsCrossed, label: "Menu" },
  { path: "/admin/orders", icon: ShoppingBag, label: "Orders" },
  { path: "/admin/tables", icon: Table2, label: "Tables" },
  { path: "/admin/bookings", icon: CalendarCheck, label: "Bookings" },
  { path: "/admin/customers", icon: UsersIcon, label: "Customers" },
  { path: "/admin/employees", icon: UserCog, label: "Employees" },
  { path: "/admin/vendors", icon: Truck, label: "Vendors" },
  { path: "/admin/inventory", icon: Package, label: "Inventory" },
  { path: "/admin/analytics", icon: BarChart3, label: "Analytics" },
];

export default function AdminNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useApp();

  const handleLogout = () => {
    setUser(null);
    toast.success("Logged out successfully!");
    navigate("/home");
  };

  return (
    <>
      <aside className="w-64 bg-[#1A1A1A]/80 backdrop-blur-xl border-r border-[#D4AF37]/20 min-h-screen sticky top-0">
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-serif bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] bg-clip-text text-transparent">
              Fork & Flame
            </h1>
          </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-[#D4AF37] text-[#0D0D0D] shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                    : "text-[#A0A0A0] hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="mt-6 pt-6 border-t border-[#D4AF37]/20">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </nav>
        </div>
      </aside>
    </>
  );
}
