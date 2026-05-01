import { motion, AnimatePresence } from "motion/react";
import { X, CheckCircle, Calendar, Tag, AlertTriangle, Info } from "lucide-react";
import { useApp } from "../context/AppContext";
import { formatDistanceToNow } from "date-fns";

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filterTypes?: string[];
}

export default function NotificationPanel({ isOpen, onClose, filterTypes }: NotificationPanelProps) {
  const { notifications, markAsRead, clearAllNotifications } = useApp();

  // Filter notifications based on filterTypes if provided
  const filteredNotifications = filterTypes 
    ? notifications.filter(n => filterTypes.includes(n.type))
    : notifications;

  const getIcon = (type: string) => {
    switch (type) {
      case "order":
        return <CheckCircle className="w-5 h-5" />;
      case "booking":
        return <Calendar className="w-5 h-5" />;
      case "offer":
        return <Tag className="w-5 h-5" />;
      case "inventory":
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case "order":
        return "text-[#10B981]";
      case "booking":
        return "text-[#D4AF37]";
      case "offer":
        return "text-[#F59E0B]";
      case "inventory":
        return "text-[#DC2626]";
      default:
        return "text-[#A0A0A0]";
    }
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
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[#1A1A1A] border-l border-[#D4AF37]/30 z-50 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] bg-clip-text text-transparent">
                  Notifications
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-[#D4AF37]/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-[#D4AF37]" />
                </button>
              </div>

              {notifications.length > 0 && (
                <button
                  onClick={clearAllNotifications}
                  className="w-full mb-4 px-4 py-2 bg-[#DC2626]/20 border border-[#DC2626]/30 text-[#DC2626] rounded-xl hover:bg-[#DC2626]/30 transition-all"
                >
                  Clear All
                </button>
              )}

              {filteredNotifications.length === 0 ? (
                <div className="text-center py-12">
                  <Info className="w-12 h-12 text-[#A0A0A0] mx-auto mb-3" />
                  <p className="text-[#A0A0A0]">No notifications</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredNotifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => !notification.read && markAsRead(notification.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        notification.read
                          ? "bg-[#0D0D0D]/30 border-[#D4AF37]/10"
                          : "bg-[#D4AF37]/5 border-[#D4AF37]/30 shadow-[0_0_20px_rgba(212,175,55,0.1)]"
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className={`${getIconColor(notification.type)} mt-1`}>
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-1">
                            <h3 className="text-[#F5F5F5]">{notification.title}</h3>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse" />
                            )}
                          </div>
                          <p className="text-[#A0A0A0] text-sm mb-2">
                            {notification.message}
                          </p>
                          <p className="text-[#A0A0A0] text-xs">
                            {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
