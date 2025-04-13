
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ItemForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [itemData, setItemData] = useState({
    name: "",
    category: "",
    condition: "",
    description: "",
    exchangeFor: "",
    images: [],
  });

  const categories = [
    "Electronics",
    "Furniture",
    "Clothing",
    "Books",
    "Sports",
    "Art",
    "Collectibles",
    "Gadgets",
    "Home",
    "Other",
  ];

  const conditions = ["New", "Like New", "Good", "Fair", "Poor"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItemData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setItemData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Create preview URLs for the selected images
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setItemData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages].slice(0, 5), // Limit to 5 images
    }));
  };

  const removeImage = (index) => {
    setItemData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Mock form submission
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Item Added Successfully",
        description: "Your item has been submitted for barter.",
      });
      navigate("/user/dashboard");
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Add Item for Barter</h1>
        <p className="text-gray-500">
          Fill in the details about the item you want to barter.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Item Details</CardTitle>
          <CardDescription>
            Provide accurate information to increase your chances of finding a
            barter match.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Item Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={itemData.name}
                  onChange={handleChange}
                  placeholder="Vintage Camera"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={itemData.category}
                    onValueChange={(value) =>
                      handleSelectChange("category", value)
                    }
                    required
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category.toLowerCase()}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition">Condition</Label>
                  <Select
                    value={itemData.condition}
                    onValueChange={(value) =>
                      handleSelectChange("condition", value)
                    }
                    required
                  >
                    <SelectTrigger id="condition">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map((condition) => (
                        <SelectItem key={condition} value={condition.toLowerCase()}>
                          {condition}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={itemData.description}
                  onChange={handleChange}
                  placeholder="Describe your item in detail..."
                  className="min-h-32"
                  required
                />
                <p className="text-xs text-gray-500">
                  Include the brand, model, age, any defects, and special features.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="exchangeFor">What Are You Looking For?</Label>
                <Textarea
                  id="exchangeFor"
                  name="exchangeFor"
                  value={itemData.exchangeFor}
                  onChange={handleChange}
                  placeholder="Describe what you'd like to exchange this item for..."
                  className="min-h-24"
                  required
                />
                <p className="text-xs text-gray-500">
                  Specify items or categories you're interested in bartering for.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Item Images</Label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {itemData.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative border rounded-md overflow-hidden h-24"
                    >
                      <img
                        src={image.preview}
                        alt={`Item preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {itemData.images.length < 5 && (
                    <div className="border border-dashed rounded-md flex items-center justify-center h-24 relative">
                      <input
                        type="file"
                        id="image-upload"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center text-gray-500">
                        <Plus className="h-6 w-6" />
                        <span className="text-xs">Add Image</span>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  Add up to 5 images. First image will be the main display.
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit Item"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ItemForm;
