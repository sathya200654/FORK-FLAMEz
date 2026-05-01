import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Users, Check } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "../../context/AppContext";

const tables = [
  { number: 1, seats: 2, status: "available" },
  { number: 2, seats: 4, status: "available" },
  { number: 3, seats: 2, status: "booked" },
  { number: 4, seats: 6, status: "available" },
  { number: 5, seats: 4, status: "booked" },
  { number: 6, seats: 2, status: "available" },
  { number: 7, seats: 8, status: "available" },
  { number: 8, seats: 4, status: "available" },
  { number: 9, seats: 2, status: "booked" },
  { number: 10, seats: 6, status: "available" },
];

export default function TableBooking() {
  const navigate = useNavigate();
  const { requestTableBooking } = useApp();
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guestCount, setGuestCount] = useState("");

  const handleBooking = () => {
    if (!selectedTable || !date || !time || !guestCount) {
      toast.error("Please fill in all fields");
      return;
    }

    const selectedTableData = tables.find(t => t.number === selectedTable);
    if (!selectedTableData) {
      toast.error("Invalid table selection");
      return;
    }

    requestTableBooking({
      userId: "guest-user",
      userName: "Guest User",
      tableNumber: selectedTable,
      seats: selectedTableData.seats,
      date,
      time,
      guestCount: parseInt(guestCount),
    });

    toast.success("Table booking request sent to admin!");
    setTimeout(() => navigate("/customer/home"), 2000);
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
            Book a Table
          </h1>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl text-[#F5F5F5] mb-6">
              Select Your Table
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {tables.map((table) => (
                <motion.button
                  key={table.number}
                  whileHover={
                    table.status === "available" ? { scale: 1.05 } : {}
                  }
                  whileTap={table.status === "available" ? { scale: 0.95 } : {}}
                  onClick={() =>
                    table.status === "available" &&
                    setSelectedTable(table.number)
                  }
                  disabled={table.status === "booked"}
                  className={`aspect-square rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${
                    table.status === "booked"
                      ? "bg-[#DC2626]/20 border-2 border-[#DC2626]/50 cursor-not-allowed"
                      : selectedTable === table.number
                        ? "bg-[#D4AF37] border-2 border-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.4)]"
                        : "bg-[#10B981]/20 border-2 border-[#10B981]/50 hover:border-[#10B981]"
                  }`}
                >
                  {selectedTable === table.number && (
                    <Check className="w-6 h-6 text-[#0D0D0D] absolute top-2 right-2" />
                  )}
                  <span
                    className={`text-2xl ${
                      table.status === "booked"
                        ? "text-[#DC2626]"
                        : selectedTable === table.number
                          ? "text-[#0D0D0D]"
                          : "text-[#10B981]"
                    }`}
                  >
                    {table.number}
                  </span>
                  <div
                    className={`flex items-center gap-1 ${
                      table.status === "booked"
                        ? "text-[#DC2626]"
                        : selectedTable === table.number
                          ? "text-[#0D0D0D]"
                          : "text-[#F5F5F5]"
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{table.seats}</span>
                  </div>
                  <span
                    className={`text-xs ${
                      table.status === "booked"
                        ? "text-[#DC2626]"
                        : selectedTable === table.number
                          ? "text-[#0D0D0D]"
                          : "text-[#A0A0A0]"
                    }`}
                  >
                    {table.status === "booked" ? "Booked" : "Available"}
                  </span>
                </motion.button>
              ))}
            </div>

            <div className="mt-6 flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#10B981]/20 border-2 border-[#10B981]/50 rounded" />
                <span className="text-[#A0A0A0]">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#DC2626]/20 border-2 border-[#DC2626]/50 rounded" />
                <span className="text-[#A0A0A0]">Booked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#D4AF37] border-2 border-[#D4AF37] rounded" />
                <span className="text-[#A0A0A0]">Selected</span>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#1A1A1A]/50 backdrop-blur-sm border border-[#D4AF37]/30 rounded-2xl p-6"
          >
            <h2 className="text-2xl text-[#F5F5F5] mb-6">Booking Details</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-[#A0A0A0] mb-2">
                  Selected Table
                </label>
                <div className="bg-[#0D0D0D]/50 border border-[#D4AF37]/20 rounded-xl p-3 text-[#F5F5F5]">
                  {selectedTable
                    ? `Table ${selectedTable} - ${tables.find((t) => t.number === selectedTable)?.seats} seats`
                    : "No table selected"}
                </div>
              </div>

              <div>
                <label className="block text-[#A0A0A0] mb-2">
                  Number of Guests
                </label>
                <input
                  type="number"
                  min="1"
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                  placeholder="How many guests?"
                  className="w-full bg-[#0D0D0D]/50 border border-[#D4AF37]/20 rounded-xl px-4 py-3 text-[#F5F5F5] placeholder:text-[#A0A0A0] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#A0A0A0] mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[#0D0D0D]/50 border border-[#D4AF37]/20 rounded-xl px-4 py-3 text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#A0A0A0] mb-2">
                  Time
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-[#0D0D0D]/50 border border-[#D4AF37]/20 rounded-xl px-4 py-3 text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBooking}
                className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-[#0D0D0D] py-3 rounded-xl hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all font-semibold mt-6"
              >
                Request Booking
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
