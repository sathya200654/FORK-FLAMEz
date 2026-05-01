import { useState } from "react";
import { motion } from "motion/react";
import { Users, ToggleLeft, ToggleRight, Check, X } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "../../context/AppContext";
import AdminNav from "../../components/AdminNav";

const tablesData = [
  { number: 1, seats: 2, status: "available" },
  { number: 2, seats: 4, status: "occupied" },
  { number: 3, seats: 2, status: "reserved" },
  { number: 4, seats: 6, status: "available" },
  { number: 5, seats: 4, status: "occupied" },
  { number: 6, seats: 2, status: "available" },
  { number: 7, seats: 8, status: "reserved" },
  { number: 8, seats: 4, status: "available" },
  { number: 9, seats: 2, status: "occupied" },
  { number: 10, seats: 6, status: "available" },
  { number: 11, seats: 4, status: "available" },
  { number: 12, seats: 2, status: "reserved" },
];

export default function TableManagement() {
  const { tableBookings, approveTableBooking, rejectTableBooking } = useApp();
  const [tables, setTables] = useState(tablesData);
  const [autoAssign, setAutoAssign] = useState(true);

  const updateStatus = (number: number, newStatus: string) => {
    setTables((prev) =>
      prev.map((table) =>
        table.number === number ? { ...table, status: newStatus } : table
      )
    );
    toast.success(`Table ${number} marked as ${newStatus}`);
  };

  const pendingBookings = tableBookings.filter(b => b.status === "pending");
  const approvedBookings = tableBookings.filter(b => b.status === "approved");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-[#10B981]/20 border-[#10B981]/50 text-[#10B981]";
      case "occupied":
        return "bg-[#DC2626]/20 border-[#DC2626]/50 text-[#DC2626]";
      case "reserved":
        return "bg-[#F59E0B]/20 border-[#F59E0B]/50 text-[#F59E0B]";
      default:
        return "bg-[#2A2A2A] border-[#A0A0A0]/50 text-[#A0A0A0]";
    }
  };

  const handleApprove = (id: string) => {
    approveTableBooking(id);
    toast.success("Booking approved!");
  };

  const handleReject = (id: string) => {
    rejectTableBooking(id);
    toast.error("Booking rejected");
  };

  return (
    <div className="flex min-h-screen bg-[#0D0D0D]">
      <AdminNav />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl text-[#F5F5F5] mb-2">Table Management</h1>
              <p className="text-[#A0A0A0]">Monitor and manage table status</p>
            </div>
            <button
              onClick={() => setAutoAssign(!autoAssign)}
              className={`px-6 py-3 rounded-xl flex items-center gap-2 transition-all ${
                autoAssign
                  ? "bg-[#10B981]/20 border border-[#10B981]/30 text-[#10B981]"
                  : "bg-[#2A2A2A] border border-[#D4AF37]/20 text-[#A0A0A0]"
              }`}
            >
              {autoAssign ? (
                <ToggleRight className="w-6 h-6" />
              ) : (
                <ToggleLeft className="w-6 h-6" />
              )}
              Auto-Assign
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
            {tables.map((table, index) => (
              <motion.div
                key={table.number}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`aspect-square rounded-2xl p-4 flex flex-col items-center justify-center gap-3 border-2 transition-all hover:scale-105 cursor-pointer ${getStatusColor(table.status)}`}
                onClick={() => {
                  const nextStatus = table.status === "available" ? "occupied" : table.status === "occupied" ? "reserved" : "available";
                  updateStatus(table.number, nextStatus);
                }}
              >
                <span className="text-3xl">T{table.number}</span>
                <div className="flex items-center gap-1">
                  <Users className="w-5 h-5" />
                  <span>{table.seats}</span>
                </div>
                <span className="text-xs uppercase tracking-wider">
                  {table.status}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#1A1A1A]/50 backdrop-blur-sm border border-[#10B981]/30 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl text-[#F5F5F5]">Available</h3>
                <div className="w-12 h-12 rounded-xl bg-[#10B981]/20 flex items-center justify-center">
                  <span className="text-2xl text-[#10B981]">
                    {tables.filter((t) => t.status === "available").length}
                  </span>
                </div>
              </div>
              <p className="text-[#A0A0A0]">Tables ready for guests</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#1A1A1A]/50 backdrop-blur-sm border border-[#DC2626]/30 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl text-[#F5F5F5]">Occupied</h3>
                <div className="w-12 h-12 rounded-xl bg-[#DC2626]/20 flex items-center justify-center">
                  <span className="text-2xl text-[#DC2626]">
                    {tables.filter((t) => t.status === "occupied").length}
                  </span>
                </div>
              </div>
              <p className="text-[#A0A0A0]">Currently serving</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#1A1A1A]/50 backdrop-blur-sm border border-[#F59E0B]/30 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl text-[#F5F5F5]">Pending Requests</h3>
                <div className="w-12 h-12 rounded-xl bg-[#F59E0B]/20 flex items-center justify-center">
                  <span className="text-2xl text-[#F59E0B]">{pendingBookings.length}</span>
                </div>
              </div>
              <p className="text-[#A0A0A0]">Awaiting approval</p>
            </motion.div>
          </div>

          {/* Pending Booking Requests */}
          {pendingBookings.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8 bg-[#1A1A1A]/50 backdrop-blur-sm border border-[#D4AF37]/20 rounded-2xl p-6"
            >
              <h2 className="text-2xl text-[#F5F5F5] mb-4">Booking Requests</h2>
              <div className="space-y-3">
                {pendingBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-[#0D0D0D]/50 border border-[#D4AF37]/30 rounded-xl p-4 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <p className="text-[#F5F5F5] font-semibold">
                        {booking.userName} - Table {booking.tableNumber}
                      </p>
                      <p className="text-[#A0A0A0] text-sm">
                        {booking.guestCount} guests • {booking.date} at {booking.time}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(booking.id)}
                        className="p-2 bg-[#10B981]/20 text-[#10B981] rounded-lg hover:bg-[#10B981]/30 transition-colors"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleReject(booking.id)}
                        className="p-2 bg-[#DC2626]/20 text-[#DC2626] rounded-lg hover:bg-[#DC2626]/30 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Approved Bookings */}
          {approvedBookings.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8 bg-[#1A1A1A]/50 backdrop-blur-sm border border-[#10B981]/20 rounded-2xl p-6"
            >
              <h2 className="text-2xl text-[#F5F5F5] mb-4">Approved Bookings</h2>
              <div className="space-y-3">
                {approvedBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-[#0D0D0D]/50 border border-[#10B981]/30 rounded-xl p-4 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <p className="text-[#F5F5F5] font-semibold">
                        {booking.userName} - Table {booking.tableNumber}
                      </p>
                      <p className="text-[#A0A0A0] text-sm">
                        {booking.guestCount} guests • {booking.date} at {booking.time}
                      </p>
                    </div>
                    <div className="bg-[#10B981]/20 text-[#10B981] px-3 py-1 rounded-full text-sm">
                      Confirmed
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-[#1A1A1A]/50 backdrop-blur-sm border border-[#D4AF37]/20 rounded-2xl p-6"
          >
            <h2 className="text-2xl text-[#F5F5F5] mb-4">Quick Actions</h2>
            <div className="grid md:grid-cols-3 gap-3">
              <button
                onClick={() => {
                  tables.forEach((t) => {
                    if (t.status === "occupied") updateStatus(t.number, "available");
                  });
                }}
                className="bg-[#10B981]/20 border border-[#10B981]/30 text-[#10B981] py-3 rounded-xl hover:bg-[#10B981]/30 transition-all"
              >
                Clear All Occupied
              </button>
              <button
                onClick={() => {
                  tables.forEach((t) => {
                    if (t.status === "reserved") updateStatus(t.number, "occupied");
                  });
                }}
                className="bg-[#F59E0B]/20 border border-[#F59E0B]/30 text-[#F59E0B] py-3 rounded-xl hover:bg-[#F59E0B]/30 transition-all"
              >
                Activate Reservations
              </button>
              <button
                onClick={() => {
                  tables.forEach((t) => updateStatus(t.number, "available"));
                }}
                className="bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] py-3 rounded-xl hover:bg-[#D4AF37]/30 transition-all"
              >
                Reset All Tables
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
