
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Mock login authentication (replace with actual API call later)
    setTimeout(() => {
      setLoading(false);
      
      // Demo login credentials for testing
      if (formData.login === "admin@demo.com" && formData.password === "password") {
        toast({
          title: "Login successful",
          description: "Welcome back, Admin!",
        });
        localStorage.setItem("userRole", "admin");
        navigate("/admin/dashboard");
      } else if (formData.login === "subadmin@demo.com" && formData.password === "password") {
        toast({
          title: "Login successful",
          description: "Welcome back, Subadmin!",
        });
        localStorage.setItem("userRole", "subadmin");
        navigate("/subadmin/dashboard");
      } else if (formData.login === "user@demo.com" && formData.password === "password") {
        toast({
          title: "Login successful",
          description: "Welcome back, User!",
        });
        localStorage.setItem("userRole", "user");
        navigate("/user/dashboard");
      } else {
        toast({
          title: "Login failed",
          description: "Invalid credentials. Please try again.",
          variant: "destructive",
        });
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-4">
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Barter Exchange
            </CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login">Email or Username</Label>
                  <Input
                    id="login"
                    name="login"
                    placeholder="email@example.com"
                    required
                    value={formData.login}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-600 hover:text-blue-800">
                Sign up
              </Link>
            </div>
            <div className="text-xs text-center text-gray-500">
              <p>Demo Accounts:</p>
              <p>admin@demo.com / password</p>
              <p>subadmin@demo.com / password</p>
              <p>user@demo.com / password</p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
