
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./components/layouts/AdminLayout";
import SubAdminLayout from "./components/layouts/SubAdminLayout";
import UserLayout from "./components/layouts/UserLayout";

// Auth Pages
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";

// Admin Pages
import AdminDashboard from "./pages/Admin/Dashboard";
import UserManagement from "./pages/Admin/UserManagement";
import SubAdminManagement from "./pages/Admin/SubAdminManagement";

// Subadmin Pages
import SubAdminDashboard from "./pages/SubAdmin/Dashboard";

// User Pages
import UserDashboard from "./pages/User/Dashboard";
import ItemForm from "./pages/User/ItemForm";
import Verification from "./pages/User/Verification";

// Common Pages
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="subadmins" element={<SubAdminManagement />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>
          
          {/* Subadmin Routes */}
          <Route path="/subadmin" element={<SubAdminLayout />}>
            <Route path="dashboard" element={<SubAdminDashboard />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>
          
          {/* User Routes */}
          <Route path="/user" element={<UserLayout />}>
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="items/new" element={<ItemForm />} />
            <Route path="verification" element={<Verification />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>
          
          {/* 404 Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
