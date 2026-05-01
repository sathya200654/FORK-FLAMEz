import { createBrowserRouter } from "react-router";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import LoginSelection from "./pages/LoginSelection";
import CustomerLogin from "./pages/customer/CustomerLogin";
import CustomerHome from "./pages/customer/CustomerHome";
import SearchResults from "./pages/customer/SearchResults";
import FoodDetail from "./pages/customer/FoodDetail";
import TableBooking from "./pages/customer/TableBooking";
import Cart from "./pages/customer/Cart";
import Payment from "./pages/customer/Payment";
import OrderTracking from "./pages/customer/OrderTracking";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import MenuManagement from "./pages/admin/MenuManagement";
import OrderManagement from "./pages/admin/OrderManagement";
import TableManagement from "./pages/admin/TableManagement";
import BookingManagement from "./pages/admin/BookingManagement";
import CustomerManagement from "./pages/admin/CustomerManagement";
import Analytics from "./pages/admin/Analytics";
import EmployeeManagement from "./pages/admin/EmployeeManagement";
import VendorManagement from "./pages/admin/VendorManagement";
import InventoryManagement from "./pages/admin/InventoryManagement";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Landing,
  },
  {
    path: "/home",
    Component: Home,
  },
  {
    path: "/login-selection",
    Component: LoginSelection,
  },
  {
    path: "/customer/login",
    Component: CustomerLogin,
  },
  {
    path: "/customer/home",
    Component: CustomerHome,
  },
  {
    path: "/customer/search",
    Component: SearchResults,
  },
  {
    path: "/customer/food/:id",
    Component: FoodDetail,
  },
  {
    path: "/customer/table-booking",
    Component: TableBooking,
  },
  {
    path: "/customer/cart",
    Component: Cart,
  },
  {
    path: "/customer/payment",
    Component: Payment,
  },
  {
    path: "/customer/orders",
    Component: OrderTracking,
  },
  {
    path: "/admin/login",
    Component: AdminLogin,
  },
  {
    path: "/admin/dashboard",
    Component: AdminDashboard,
  },
  {
    path: "/admin/menu",
    Component: MenuManagement,
  },
  {
    path: "/admin/orders",
    Component: OrderManagement,
  },
  {
    path: "/admin/tables",
    Component: TableManagement,
  },
  {
    path: "/admin/bookings",
    Component: BookingManagement,
  },
  {
    path: "/admin/customers",
    Component: CustomerManagement,
  },
  {
    path: "/admin/analytics",
    Component: Analytics,
  },
  {
    path: "/admin/employees",
    Component: EmployeeManagement,
  },
  {
    path: "/admin/vendors",
    Component: VendorManagement,
  },
  {
    path: "/admin/inventory",
    Component: InventoryManagement,
  },
]);
