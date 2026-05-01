import { motion } from "motion/react";
import {
  TrendingUp,
  Users,
  ShoppingBag,
  DollarSign,
  Table2,
  ChefHat,
  Download,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../../context/AppContext";
import AdminNav from "../../components/AdminNav";

const COLORS = ["#D4AF37", "#F4D03F", "#B8960F", "#FFD700"];

export default function Analytics() {
  const { getWeeklyAnalytics } = useApp();
  const [isDownloading, setIsDownloading] = useState(false);

  const weeklyData = getWeeklyAnalytics();
  
  const salesTrend = weeklyData.map(item => ({
    month: item.date,
    sales: item.sales,
    orders: item.orders,
  }));

  const categoryData = [
    { name: "Main Course", value: 45 },
    { name: "Appetizers", value: 25 },
    { name: "Desserts", value: 15 },
    { name: "Beverages", value: 15 },
  ];

  const occupancyData = weeklyData.map(item => ({
    day: item.date,
    rate: Math.floor(Math.random() * 40) + 55,
  }));

  const handleDownloadReport = async () => {
    setIsDownloading(true);
    try {
      // Create a script tag to load html2pdf if not already loaded
      if (!(window as any).html2pdf) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      }

      const element = document.createElement('div');
      element.innerHTML = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h1 style="color: #D4AF37; text-align: center; margin-bottom: 30px;">Weekly Analytics Report</h1>
          
          <div style="background: #f9f9f9; padding: 15px; margin-bottom: 20px; border-left: 4px solid #D4AF37;">
            <h2 style="color: #D4AF37; margin: 0;">Report Summary</h2>
            <p style="margin: 10px 0;">Generated: ${new Date().toLocaleDateString()}</p>
            <p style="margin: 10px 0;">Week: ${salesTrend[0].month} - ${salesTrend[salesTrend.length - 1].month}</p>
          </div>

          <h3 style="color: #D4AF37; margin-top: 30px;">Weekly Sales & Orders</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
            <thead>
              <tr style="background: #D4AF37; color: #fff;">
                <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Day</th>
                <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Sales (₹)</th>
                <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Orders</th>
                <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Avg Order Value</th>
              </tr>
            </thead>
            <tbody>
              ${salesTrend.map(item => `
                <tr style="border: 1px solid #ddd;">
                  <td style="padding: 12px; border: 1px solid #ddd;">${item.month}</td>
                  <td style="padding: 12px; border: 1px solid #ddd;">₹${item.sales.toLocaleString()}</td>
                  <td style="padding: 12px; border: 1px solid #ddd;">${item.orders}</td>
                  <td style="padding: 12px; border: 1px solid #ddd;">₹${Math.round(item.sales / item.orders).toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div style="background: #f9f9f9; padding: 15px; margin: 20px 0; border-left: 4px solid #D4AF37;">
            <h3 style="color: #D4AF37; margin: 0 0 10px 0;">Key Metrics</h3>
            <p style="margin: 8px 0;"><strong>Total Weekly Sales:</strong> ₹${salesTrend.reduce((sum, item) => sum + item.sales, 0).toLocaleString()}</p>
            <p style="margin: 8px 0;"><strong>Total Orders:</strong> ${salesTrend.reduce((sum, item) => sum + item.orders, 0)}</p>
            <p style="margin: 8px 0;"><strong>Average Daily Sales:</strong> ₹${Math.round(salesTrend.reduce((sum, item) => sum + item.sales, 0) / salesTrend.length).toLocaleString()}</p>
            <p style="margin: 8px 0;"><strong>Average Order Value:</strong> ₹${Math.round(salesTrend.reduce((sum, item) => sum + item.sales, 0) / salesTrend.reduce((sum, item) => sum + item.orders, 0)).toLocaleString()}</p>
            <p style="margin: 8px 0;"><strong>Peak Day:</strong> ${salesTrend.reduce((max, item) => item.sales > max.sales ? item : max).month} (₹${Math.max(...salesTrend.map(i => i.sales)).toLocaleString()})</p>
          </div>

          <h3 style="color: #D4AF37; margin-top: 30px;">Category Distribution</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #D4AF37; color: #fff;">
                <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Category</th>
                <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Percentage</th>
              </tr>
            </thead>
            <tbody>
              ${categoryData.map(item => `
                <tr style="border: 1px solid #ddd;">
                  <td style="padding: 12px; border: 1px solid #ddd;">${item.name}</td>
                  <td style="padding: 12px; border: 1px solid #ddd;">${item.value}%</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div style="margin-top: 30px; padding: 15px; background: #f9f9f9; border-left: 4px solid #D4AF37;">
            <p style="margin: 0; color: #666; font-size: 12px;">
              This report was automatically generated by Fork & Flame Management System.
              For detailed analysis and further insights, please contact the administration team.
            </p>
          </div>
        </div>
      `;

      const opt = {
        margin: 10,
        filename: `weekly-analytics-${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
      };

      await (window as any).html2pdf().set(opt).from(element).save();
      toast.success("Analytics report downloaded successfully!");
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error("Failed to generate report. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };
  return (
    <div className="flex min-h-screen bg-[#0D0D0D]">
      <AdminNav />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl text-[#F5F5F5] mb-2">Analytics</h1>
              <p className="text-[#A0A0A0]">
                Detailed insights and performance metrics
              </p>
            </div>
            <button
              onClick={handleDownloadReport}
              disabled={isDownloading}
              className="flex items-center gap-2 bg-[#D4AF37] text-[#0D0D0D] px-6 py-3 rounded-xl font-semibold hover:bg-[#F4D03F] disabled:opacity-50 transition-all"
            >
              <Download className="w-5 h-5" />
              {isDownloading ? "Generating..." : "Download Report"}
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[
              {
                label: "Avg Order Value",
                value: `₹${Math.round(salesTrend.reduce((sum, item) => sum + item.sales, 0) / salesTrend.reduce((sum, item) => sum + item.orders, 0)).toLocaleString()}`,
                icon: DollarSign,
                color: "from-[#D4AF37] to-[#F4D03F]",
              },
              {
                label: "Total Revenue",
                value: `₹${salesTrend.reduce((sum, item) => sum + item.sales, 0).toLocaleString()}`,
                icon: ShoppingBag,
                color: "from-[#10B981] to-[#34D399]",
              },
              {
                label: "Total Orders",
                value: salesTrend.reduce((sum, item) => sum + item.orders, 0).toString(),
                icon: ChefHat,
                color: "from-[#F59E0B] to-[#FBBF24]",
              },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-[#1A1A1A]/50 backdrop-blur-sm border border-[#D4AF37]/20 rounded-2xl p-6"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}
                  >
                    <Icon className="w-6 h-6 text-[#0D0D0D]" />
                  </div>
                  <h3 className="text-[#A0A0A0] mb-1">{stat.label}</h3>
                  <p className="text-3xl text-[#F5F5F5]">{stat.value}</p>
                </motion.div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#1A1A1A]/50 backdrop-blur-sm border border-[#D4AF37]/20 rounded-2xl p-6"
            >
              <h2 className="text-2xl text-[#F5F5F5] mb-6">
                Sales & Orders Trend
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                  <XAxis dataKey="month" stroke="#A0A0A0" />
                  <YAxis yAxisId="left" stroke="#A0A0A0" />
                  <YAxis yAxisId="right" orientation="right" stroke="#A0A0A0" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1A1A1A",
                      border: "1px solid rgba(212, 175, 55, 0.3)",
                      borderRadius: "12px",
                    }}
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="sales"
                    stroke="#D4AF37"
                    strokeWidth={3}
                    name="Sales (₹)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="orders"
                    stroke="#10B981"
                    strokeWidth={3}
                    name="Orders"
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-[#1A1A1A]/50 backdrop-blur-sm border border-[#D4AF37]/20 rounded-2xl p-6"
            >
              <h2 className="text-2xl text-[#F5F5F5] mb-6">
                Category Distribution
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1A1A1A",
                      border: "1px solid rgba(212, 175, 55, 0.3)",
                      borderRadius: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-[#1A1A1A]/50 backdrop-blur-sm border border-[#D4AF37]/20 rounded-2xl p-6"
          >
            <h2 className="text-2xl text-[#F5F5F5] mb-6">
              Table Occupancy Rate
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={occupancyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                <XAxis dataKey="day" stroke="#A0A0A0" />
                <YAxis stroke="#A0A0A0" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1A1A1A",
                    border: "1px solid rgba(212, 175, 55, 0.3)",
                    borderRadius: "12px",
                  }}
                />
                <Bar
                  dataKey="rate"
                  fill="#D4AF37"
                  radius={[8, 8, 0, 0]}
                  name="Occupancy %"
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
