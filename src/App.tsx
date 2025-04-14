
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import PrivateRoute from "./components/auth/PrivateRoute";
import RoleRoute from "./components/auth/RoleRoute";

// Layouts
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
import CategoryManagement from "./pages/Admin/CategoryManagement";
import ItemManagement from "./pages/Admin/ItemManagement";
import VerificationManagement from "./pages/Admin/VerificationManagement";

// Subadmin Pages
import SubAdminDashboard from "./pages/SubAdmin/Dashboard";

// User Pages
import UserDashboard from "./pages/User/Dashboard";
import ItemForm from "./pages/User/ItemForm";
import Verification from "./pages/User/Verification";
import MyItems from "./pages/User/MyItems";

// Common Pages
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Redirect root based on authentication */}
              <Route
                path="/"
                element={
                  localStorage.getItem('access_token') ? (
                    <Navigate
                      to={`/${localStorage.getItem('userRole')?.toLowerCase() || 'user'}/dashboard`}
                      replace
                    />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Admin Routes */}
              <Route
                path="/admin/*"
                element={
                  <PrivateRoute>
                    <RoleRoute allowedRoles={["admin"]}>
                      <AdminLayout />
                    </RoleRoute>
                  </PrivateRoute>
                }
              >
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="subadmins" element={<SubAdminManagement />} />
                <Route path="categories" element={<CategoryManagement />} />
                <Route path="items" element={<ItemManagement />} />
                <Route path="verifications" element={<VerificationManagement />} />
                <Route path="profile" element={<div className="p-4">Admin Profile Page (Coming Soon)</div>} />
                <Route path="settings" element={<div className="p-4">Settings Page (Coming Soon)</div>} />
                <Route path="help" element={<div className="p-4">Help & Support (Coming Soon)</div>} />
                <Route index element={<Navigate to="dashboard" replace />} />
              </Route>
              
              {/* Subadmin Routes */}
              <Route
                path="/subadmin/*"
                element={
                  <PrivateRoute>
                    <RoleRoute allowedRoles={["subadmin"]}>
                      <SubAdminLayout />
                    </RoleRoute>
                  </PrivateRoute>
                }
              >
                <Route path="dashboard" element={<SubAdminDashboard />} />
                <Route path="verifications" element={<VerificationManagement />} />
                <Route path="profile" element={<div className="p-4">Subadmin Profile Page (Coming Soon)</div>} />
                <Route path="settings" element={<div className="p-4">Settings Page (Coming Soon)</div>} />
                <Route path="help" element={<div className="p-4">Help & Support (Coming Soon)</div>} />
                <Route index element={<Navigate to="dashboard" replace />} />
              </Route>
              
              {/* User Routes */}
              <Route
                path="/user/*"
                element={
                  <PrivateRoute>
                    <RoleRoute allowedRoles={["user"]}>
                      <UserLayout />
                    </RoleRoute>
                  </PrivateRoute>
                }
              >
                <Route path="dashboard" element={<UserDashboard />} />
                <Route path="items/new" element={<ItemForm />} />
                <Route path="items" element={<MyItems />} />
                <Route path="verification" element={<Verification />} />
                <Route path="profile" element={<div className="p-4">User Profile Page (Coming Soon)</div>} />
                <Route path="settings" element={<div className="p-4">Settings Page (Coming Soon)</div>} />
                <Route path="help" element={<div className="p-4">Help & Support (Coming Soon)</div>} />
                <Route index element={<Navigate to="dashboard" replace />} />
              </Route>
              
              {/* 404 Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
