import { motion } from "motion/react";
import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  Table2,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useApp } from "../../context/AppContext";
import AdminNav from "../../components/AdminNav";

export default function AdminDashboard() {
  const { getDashboardStats, getWeeklyAnalytics } = useApp();
  const stats_data = getDashboardStats();
  const weeklyData = getWeeklyAnalytics();

  const stats = [
    {
      label: "Total Sales",
      value: `₹${stats_data.totalSales.toLocaleString()}`,
      change: "+12.5%",
      icon: DollarSign,
      color: "from-[#D4AF37] to-[#F4D03F]",
    },
    {
      label: "Orders Today",
      value: stats_data.ordersToday.toString(),
      change: "+8.2%",
      icon: ShoppingBag,
      color: "from-[#10B981] to-[#34D399]",
    },
    {
      label: "Active Tables",
      value: `${stats_data.activeTables}/20`,
      change: `${Math.round((stats_data.activeTables / 20) * 100)}%`,
      icon: Table2,
      color: "from-[#F59E0B] to-[#FBBF24]",
    },
    {
      label: "Total Customers",
      value: stats_data.totalCustomers.toLocaleString(),
      change: "+5.4%",
      icon: Users,
      color: "from-[#8B5CF6] to-[#A78BFA]",
    },
  ];

  const salesData = weeklyData.map(item => ({ name: item.date, sales: item.sales }));
  const revenueData = weeklyData.map(item => ({ name: item.date, revenue: item.sales }));
  return (
    <div className="flex min-h-screen bg-[#0D0D0D]">
      <AdminNav />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl text-[#F5F5F5] mb-2">Dashboard</h1>
            <p className="text-[#A0A0A0]">
              Welcome back! Here's your overview
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-[#1A1A1A]/50 backdrop-blur-sm border border-[#D4AF37]/20 rounded-2xl p-6 hover:border-[#D4AF37] hover:shadow-[0_0_30px_rgba(212,175,55,0.1)] transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                    >
                      <Icon className="w-6 h-6 text-[#0D0D0D]" />
                    </div>
                    <span className="text-[#10B981] text-sm">{stat.change}</span>
                  </div>
                  <h3 className="text-[#A0A0A0] mb-1">{stat.label}</h3>
                  <p className="text-3xl text-[#F5F5F5]">{stat.value}</p>
                </motion.div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-[#1A1A1A]/50 backdrop-blur-sm border border-[#D4AF37]/20 rounded-2xl p-6"
            >
              <h2 className="text-2xl text-[#F5F5F5] mb-6">Sales Trends</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                  <XAxis dataKey="name" stroke="#A0A0A0" />
                  <YAxis stroke="#A0A0A0" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1A1A1A",
                      border: "1px solid rgba(212, 175, 55, 0.3)",
                      borderRadius: "12px",
                      color: "#F5F5F5",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#D4AF37"
                    strokeWidth={3}
                    dot={{ fill: "#D4AF37", r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-[#1A1A1A]/50 backdrop-blur-sm border border-[#D4AF37]/20 rounded-2xl p-6"
            >
              <h2 className="text-2xl text-[#F5F5F5] mb-6">Revenue</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                  <XAxis dataKey="name" stroke="#A0A0A0" />
                  <YAxis stroke="#A0A0A0" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1A1A1A",
                      border: "1px solid rgba(212, 175, 55, 0.3)",
                      borderRadius: "12px",
                      color: "#F5F5F5",
                    }}
                  />
                  <Bar dataKey="revenue" fill="#D4AF37" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
