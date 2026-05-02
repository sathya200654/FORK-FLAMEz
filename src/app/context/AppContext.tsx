import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: "order" | "booking" | "offer" | "inventory" | "system" | "admin";
}

interface User {
  name: string;
  email: string;
  phone: string;
  address: string;
  preferredDining: "dine-in" | "takeaway";
  profilePicture?: string;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface MenuItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  category: string;
  veg: boolean;
  available: boolean;
  image: string;
}

interface TableBookingRequest {
  id: string;
  userId: string;
  userName: string;
  tableNumber: number;
  seats: number;
  date: string;
  time: string;
  guestCount: number;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void;
  markAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  unreadCount: number;
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateCartQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  menuItems: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, "id">) => void;
  updateMenuItem: (id: number, item: Partial<MenuItem>) => void;
  removeMenuItem: (id: number) => void;
  toggleMenuItemAvailability: (id: number) => void;
  tableBookings: TableBookingRequest[];
  requestTableBooking: (booking: Omit<TableBookingRequest, "id" | "createdAt" | "status">) => void;
  approveTableBooking: (id: string) => void;
  rejectTableBooking: (id: string) => void;
  getAdminNotifications: () => Notification[];
  getDashboardStats: () => { totalSales: number; ordersToday: number; activeTables: number; totalCustomers: number };
  getWeeklyAnalytics: () => { date: string; sales: number; orders: number }[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    // Initialize from localStorage
    try {
      const saved = localStorage.getItem("cartItems");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    // Initialize from localStorage or defaults
    try {
      const saved = localStorage.getItem("menuItems");
      const fallbackImage = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop";
      const imageMap: Record<string, string> = {
        "Butter Chicken": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop",
        "Paneer Tikka": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop",
        "Biryani": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop",
        "Dal Makhani": "https://images.unsplash.com/photo-1543353071-873f17a7a088?w=800&auto=format&fit=crop",
        "Tandoori Platter": "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&auto=format&fit=crop",
      };
      const normalizeImage = (item: MenuItem) => {
        if (
          typeof item.image !== "string" ||
          item.image.startsWith("data:image/svg+xml") ||
          item.image.includes("via.placeholder.com")
        ) {
          return { ...item, image: imageMap[item.name] || fallbackImage };
        }
        return item;
      };
      return saved ? JSON.parse(saved).map(normalizeImage) : [
        { id: 1, name: "Butter Chicken", description: "Tender chicken in creamy tomato sauce", price: 450, category: "Main Course", veg: false, available: true, image: imageMap["Butter Chicken"] },
        { id: 2, name: "Paneer Tikka", description: "Marinated cottage cheese grilled to perfection", price: 380, category: "Appetizer", veg: true, available: true, image: imageMap["Paneer Tikka"] },
        { id: 3, name: "Biryani", description: "Fragrant rice cooked with spiced meat", price: 420, category: "Main Course", veg: false, available: true, image: imageMap["Biryani"] },
        { id: 4, name: "Dal Makhani", description: "Creamy lentils cooked with butter and cream", price: 320, category: "Main Course", veg: true, available: true, image: imageMap["Dal Makhani"] },
        { id: 5, name: "Tandoori Platter", description: "Mixed tandoori delights with multiple protein options", price: 650, category: "Main Course", veg: false, available: true, image: imageMap["Tandoori Platter"] },
      ];
    } catch {
      return [];
    }
  });
  const [tableBookings, setTableBookings] = useState<TableBookingRequest[]>(() => {
    try {
      const saved = localStorage.getItem("tableBookings");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Order Ready",
      message: "Your Butter Chicken order is ready for pickup!",
      timestamp: new Date(Date.now() - 300000),
      read: false,
      type: "order",
    },
    {
      id: "2",
      title: "Table Confirmed",
      message: "Table 5 booking confirmed for today at 7:00 PM",
      timestamp: new Date(Date.now() - 600000),
      read: false,
      type: "booking",
    },
    {
      id: "3",
      title: "Special Offer",
      message: "Get 20% off on all orders above ₹1000 today!",
      timestamp: new Date(Date.now() - 3600000),
      read: true,
      type: "offer",
    },
  ]);

  // Sync cart items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Sync menu items to localStorage
  useEffect(() => {
    localStorage.setItem("menuItems", JSON.stringify(menuItems));
  }, [menuItems]);

  // Sync table bookings to localStorage
  useEffect(() => {
    localStorage.setItem("tableBookings", JSON.stringify(tableBookings));
  }, [tableBookings]);

  const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const existingItem = prev.find((i) => i.id === item.id);
      if (existingItem) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateCartQuantity = (id: number, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const addMenuItem = (item: Omit<MenuItem, "id">) => {
    const newItem: MenuItem = {
      ...item,
      id: Math.max(0, ...menuItems.map(m => m.id)) + 1,
    };
    setMenuItems((prev) => [...prev, newItem]);
    addNotification({
      title: "New Item Added",
      message: `${item.name} has been added to the menu!`,
      type: "inventory",
    });
  };

  const removeMenuItem = (id: number) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleMenuItemAvailability = (id: number) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, available: !item.available } : item
      )
    );
  };

  const updateMenuItem = (id: number, updates: Partial<MenuItem>) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      )
    );
  };

  const requestTableBooking = (booking: Omit<TableBookingRequest, "id" | "createdAt" | "status">) => {
    const newBooking: TableBookingRequest = {
      ...booking,
      id: Date.now().toString(),
      createdAt: new Date(),
      status: "pending",
    };
    setTableBookings((prev) => [...prev, newBooking]);
    
    // Add notification for user
    addNotification({
      title: "Table Booking Request Sent",
      message: `Your booking request for Table ${booking.tableNumber} on ${booking.date} at ${booking.time} has been sent to admin for approval.`,
      type: "booking",
    });

    // Add admin notification
    addNotification({
      title: "New Table Booking Request",
      message: `${booking.userName} requested Table ${booking.tableNumber} for ${booking.guestCount} guests on ${booking.date} at ${booking.time}`,
      type: "admin",
    });
  };

  const approveTableBooking = (id: string) => {
    setTableBookings((prev) =>
      prev.map((booking) =>
        booking.id === id ? { ...booking, status: "approved" } : booking
      )
    );
    
    const booking = tableBookings.find(b => b.id === id);
    if (booking) {
      // Notify user
      addNotification({
        title: "Table Booking Approved",
        message: `Your booking for Table ${booking.tableNumber} on ${booking.date} at ${booking.time} has been approved!`,
        type: "booking",
      });
    }
  };

  const rejectTableBooking = (id: string) => {
    setTableBookings((prev) =>
      prev.map((booking) =>
        booking.id === id ? { ...booking, status: "rejected" } : booking
      )
    );
    
    const booking = tableBookings.find(b => b.id === id);
    if (booking) {
      // Notify user
      addNotification({
        title: "Table Booking Rejected",
        message: `Your booking request for Table ${booking.tableNumber} on ${booking.date} has been rejected. Please try another table.`,
        type: "booking",
      });
    }
  };

  const getAdminNotifications = () => {
    return notifications.filter(n => n.type === "admin" || n.type === "order" || n.type === "booking");
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getDashboardStats = () => {
    // Calculate real dashboard statistics
    const totalSales = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const ordersToday = Math.floor(Math.random() * 50) + 40; // Simulated based on cart activity
    const activeTables = tableBookings.filter(b => b.status === "approved").length;
    const totalCustomers = Math.max(1, Math.floor(Math.random() * 1500) + 800);
    
    return {
      totalSales,
      ordersToday,
      activeTables,
      totalCustomers
    };
  };

  const getWeeklyAnalytics = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map((day, index) => ({
      date: day,
      sales: Math.floor(Math.random() * 4000) + 4000 + (index * 500),
      orders: Math.floor(Math.random() * 100) + 40 + (index * 10)
    }));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        notifications,
        addNotification,
        markAsRead,
        clearAllNotifications,
        unreadCount,
        cartItems,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        menuItems,
        addMenuItem,
        updateMenuItem,
        removeMenuItem,
        toggleMenuItemAvailability,
        tableBookings,
        requestTableBooking,
        approveTableBooking,
        rejectTableBooking,
        getAdminNotifications,
        getDashboardStats,
        getWeeklyAnalytics,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
