import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, CheckCircle, Download, Home } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "../../context/AppContext";

interface OrderData {
  items: Array<{ name: string; quantity: number; price: number }>;
  subtotal: number;
  tax: number;
  total: number;
}

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useApp();
  const [showInvoice, setShowInvoice] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const orderData: OrderData = location.state?.orderData || {
    items: [
      { name: "Butter Chicken", quantity: 2, price: 450 },
      { name: "Paneer Tikka", quantity: 1, price: 380 },
    ],
    subtotal: 1280,
    tax: 64,
    total: 1344,
  };

  const orderId = `ORD-${Date.now().toString().slice(-6)}`;
  const qrCode = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" + encodeURIComponent(`Order ID: ${orderId}, Amount: ₹${orderData.total}`);

  const handlePaymentDone = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      clearCart();
      setShowInvoice(true);
      toast.success("Payment successful!");
    }, 1500);
  };

  const handleDownloadInvoice = async () => {
    try {
      setIsDownloading(true);

      // Check if jsPDF is loaded
      if (!(window as any).jsPDF) {
        // Load jsPDF from CDN
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
        script.async = true;
        
        script.onload = () => {
          try {
            generateSimpleInvoice();
          } catch (error) {
            console.error("Invoice generation error:", error);
            toast.error("Failed to generate invoice");
            setIsDownloading(false);
          }
        };

        script.onerror = () => {
          toast.error("Failed to load PDF library");
          setIsDownloading(false);
        };

        document.head.appendChild(script);
      } else {
        generateSimpleInvoice();
      }
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download invoice");
      setIsDownloading(false);
    }
  };

  const generateSimpleInvoice = () => {
    try {
      // Access jsPDF correctly from window
      const jsPDFLib = (window as any).jspdf;
      const { jsPDF } = jsPDFLib || {};
      
      if (!jsPDF) {
        throw new Error("jsPDF library not loaded properly");
      }
      
      const doc = new jsPDF();
      
      let yPos = 20;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      // Title
      doc.setFontSize(24);
      doc.text("INVOICE", pageWidth / 2, yPos, { align: "center" });
      
      yPos += 15;
      
      // Restaurant name
      doc.setFontSize(14);
      doc.text("Fork & Flame", pageWidth / 2, yPos, { align: "center" });
      
      yPos += 10;
      
      // Order details
      doc.setFontSize(10);
      doc.text(`Order ID: ${orderId}`, 20, yPos);
      yPos += 7;
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, yPos);
      yPos += 7;
      doc.text(`Time: ${new Date().toLocaleTimeString()}`, 20, yPos);
      
      yPos += 15;
      
      // Items header
      doc.setFontSize(11);
      doc.setFont(undefined, "bold");
      doc.text("Item", 20, yPos);
      doc.text("Qty", 100, yPos);
      doc.text("Price", 130, yPos);
      doc.text("Total", 160, yPos);
      
      yPos += 7;
      doc.setDrawColor(200, 200, 200);
      doc.line(20, yPos, 190, yPos);
      
      yPos += 5;
      
      // Items
      doc.setFont(undefined, "normal");
      doc.setFontSize(10);
      orderData.items.forEach((item) => {
        doc.text(item.name, 20, yPos);
        doc.text(item.quantity.toString(), 100, yPos);
        doc.text(`₹${item.price}`, 130, yPos);
        doc.text(`₹${item.price * item.quantity}`, 160, yPos);
        yPos += 7;
      });
      
      yPos += 3;
      doc.line(20, yPos, 190, yPos);
      yPos += 7;
      
      // Totals
      doc.setFont(undefined, "bold");
      doc.text("Subtotal:", 130, yPos);
      doc.setFont(undefined, "normal");
      doc.text(`₹${orderData.subtotal}`, 160, yPos);
      
      yPos += 7;
      doc.setFont(undefined, "bold");
      doc.text("Tax (5%):", 130, yPos);
      doc.setFont(undefined, "normal");
      doc.text(`₹${orderData.tax.toFixed(2)}`, 160, yPos);
      
      yPos += 10;
      doc.setFontSize(12);
      doc.setFont(undefined, "bold");
      doc.text("TOTAL:", 130, yPos);
      doc.setTextColor(212, 175, 55); // Gold color
      doc.text(`₹${orderData.total.toFixed(2)}`, 160, yPos);
      
      yPos += 20;
      
      // Thank you message
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text("Thank you for your order!", pageWidth / 2, yPos, { align: "center" });
      
      yPos += 7;
      doc.setFontSize(9);
      doc.text("Enjoy your meal and visit us again!", pageWidth / 2, yPos, { align: "center" });
      
      // Save the PDF
      doc.save(`Invoice-${orderId}.pdf`);
      
      toast.success("Invoice downloaded successfully!");
      setIsDownloading(false);
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate invoice");
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <nav className="bg-[#1A1A1A]/80 backdrop-blur-xl border-b border-[#D4AF37]/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate("/customer/cart")}
            className="p-2 hover:bg-[#D4AF37]/20 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-[#D4AF37]" />
          </button>
          <h1 className="text-2xl font-serif bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] bg-clip-text text-transparent">
            {showInvoice ? "Invoice" : "Payment"}
          </h1>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {!showInvoice ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1A1A1A]/50 backdrop-blur-sm border border-[#D4AF37]/30 rounded-2xl p-8 space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl text-[#F5F5F5] mb-4">Order Summary</h2>
              <p className="text-[#A0A0A0]">Review your order before completing payment</p>
            </div>

            <div className="bg-[#0D0D0D]/50 rounded-xl p-6 space-y-4">
              {orderData.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <div>
                    <p className="text-[#F5F5F5]">{item.name}</p>
                    <p className="text-[#A0A0A0] text-sm">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-[#D4AF37] text-lg">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-[#D4AF37]/20 pt-4 space-y-3">
              <div className="flex justify-between text-[#A0A0A0]">
                <span>Subtotal</span>
                <span>₹{orderData.subtotal}</span>
              </div>
              <div className="flex justify-between text-[#A0A0A0]">
                <span>Tax (5%)</span>
                <span>₹{orderData.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#F5F5F5] text-xl font-bold">
                <span>Total Amount</span>
                <span className="text-[#D4AF37]">₹{orderData.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-xl p-6 space-y-4">
              <h3 className="text-[#D4AF37] font-semibold">Payment Methods</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="payment" defaultChecked className="w-4 h-4" />
                  <span className="text-[#F5F5F5]">Credit/Debit Card</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="payment" className="w-4 h-4" />
                  <span className="text-[#F5F5F5]">UPI</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="payment" className="w-4 h-4" />
                  <span className="text-[#F5F5F5]">Digital Wallet</span>
                </label>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePaymentDone}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-[#0D0D0D] py-4 rounded-xl font-semibold hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all disabled:opacity-50"
            >
              {isProcessing ? "Processing..." : "Complete Payment"}
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            id="invoice"
            className="bg-[#1A1A1A]/50 backdrop-blur-sm border border-[#D4AF37]/30 rounded-2xl p-8 space-y-6"
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-block mb-4"
              >
                <CheckCircle className="w-16 h-16 text-[#10B981]" />
              </motion.div>
              <h2 className="text-3xl text-[#F5F5F5] mb-2">Payment Successful!</h2>
              <p className="text-[#A0A0A0] mb-4">Thank you for your order</p>
              <div className="bg-[#0D0D0D]/50 rounded-lg p-4 inline-block">
                <p className="text-[#D4AF37] font-semibold text-lg">{orderId}</p>
              </div>
            </div>

            <div className="border-t border-[#D4AF37]/20 pt-6">
              <h3 className="text-[#F5F5F5] font-semibold mb-4">Order Details</h3>
              <div className="bg-[#0D0D0D]/50 rounded-xl p-4 space-y-3 mb-6">
                {orderData.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span className="text-[#F5F5F5]">{item.name} x {item.quantity}</span>
                    <span className="text-[#D4AF37]">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-[#A0A0A0]">
                  <span>Subtotal:</span>
                  <span>₹{orderData.subtotal}</span>
                </div>
                <div className="flex justify-between text-[#A0A0A0]">
                  <span>Tax:</span>
                  <span>₹{orderData.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#F5F5F5] text-lg font-bold border-t border-[#D4AF37]/20 pt-2">
                  <span>Total:</span>
                  <span className="text-[#D4AF37]">₹{orderData.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="bg-[#F5F5F5] p-2 rounded-lg">
                <img src={qrCode} alt="QR Code" width={200} height={200} />
              </div>
            </div>

            <p className="text-center text-[#A0A0A0] text-sm">
              Scan the QR code above to view your order details
            </p>

            <div className="flex gap-3 pt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDownloadInvoice}
                disabled={isDownloading}
                className="flex-1 bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] py-3 rounded-xl hover:bg-[#D4AF37]/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-5 h-5" />
                {isDownloading ? "Downloading..." : "Download Invoice"}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/customer/orders")}
                className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-[#0D0D0D] py-3 rounded-xl hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                Track Order
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
