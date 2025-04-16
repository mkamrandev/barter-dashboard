
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Upload } from "lucide-react";
import { registerUser, reset } from "@/redux/slices/authSlice";
import { toast } from "sonner";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading, isAuthenticated, error } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirm_password: "",
    first_name: "",
    last_name: "",
    profile_picture: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(`/${user.role.toLowerCase()}/dashboard`, { replace: true });
    }
    
    return () => {
      dispatch(reset());
    };
  }, [isAuthenticated, user, navigate, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear validation errors when the user types
    if (validationErrors[name]) {
      setValidationErrors(prev => ({...prev, [name]: null}));
    }
    
    // Clear password match error when either password field changes
    if (name === 'password' || name === 'confirm_password') {
      setValidationErrors(prev => ({...prev, passwordMatch: null}));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profile_picture: file }));
      
      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.first_name.trim()) {
      errors.first_name = "First name is required";
    }
    
    if (!formData.last_name.trim()) {
      errors.last_name = "Last name is required";
    }
    
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }
    
    if (!formData.username.trim()) {
      errors.username = "Username is required";
    }
    
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    
    if (!formData.confirm_password) {
      errors.confirm_password = "Please confirm your password";
    } else if (formData.password !== formData.confirm_password) {
      errors.passwordMatch = "Passwords do not match";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    dispatch(registerUser(formData))
      .unwrap()
      .then(() => {
        toast.success("Registration successful! Please log in.");
        navigate("/login");
      })
      .catch((error) => {
        // Error will be displayed by the toast in the action
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
      <div className="w-full max-w-2xl p-4">
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Create Your Account
            </CardTitle>
            <CardDescription className="text-center">
              Enter your details to create a new account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      required
                      value={formData.first_name}
                      onChange={handleChange}
                      className={validationErrors.first_name ? "border-red-500" : ""}
                    />
                    {validationErrors.first_name && (
                      <p className="text-sm text-red-500">{validationErrors.first_name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      name="last_name"
                      required
                      value={formData.last_name}
                      onChange={handleChange}
                      className={validationErrors.last_name ? "border-red-500" : ""}
                    />
                    {validationErrors.last_name && (
                      <p className="text-sm text-red-500">{validationErrors.last_name}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="email@example.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={validationErrors.email ? "border-red-500" : ""}
                  />
                  {validationErrors.email && (
                    <p className="text-sm text-red-500">{validationErrors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className={validationErrors.username ? "border-red-500" : ""}
                  />
                  {validationErrors.username && (
                    <p className="text-sm text-red-500">{validationErrors.username}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        className={`pr-10 ${
                          validationErrors.password ? "border-red-500" : ""
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {validationErrors.password && (
                      <p className="text-sm text-red-500">{validationErrors.password}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm_password">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirm_password"
                        name="confirm_password"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        value={formData.confirm_password}
                        onChange={handleChange}
                        className={`pr-10 ${
                          validationErrors.confirm_password || validationErrors.passwordMatch
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {validationErrors.confirm_password && (
                      <p className="text-sm text-red-500">{validationErrors.confirm_password}</p>
                    )}
                  </div>
                </div>
                
                {validationErrors.passwordMatch && (
                  <p className="text-sm text-red-500 -mt-2">{validationErrors.passwordMatch}</p>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="profile_picture">Profile Picture</Label>
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 rounded-full border flex items-center justify-center overflow-hidden bg-gray-100">
                      {previewImage ? (
                        <img 
                          src={previewImage} 
                          alt="Profile Preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Upload size={24} className="text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <Input
                        id="profile_picture"
                        name="profile_picture"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        JPG, PNG or GIF (Max. 2MB)
                      </p>
                    </div>
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <div className="text-sm text-center w-full">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:text-blue-800">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
