  import React, { useEffect, useState } from 'react';
  import { useForm } from 'react-hook-form';
  import { zodResolver } from '@hookform/resolvers/zod';
  import * as z from 'zod';
  import { useDispatch, useSelector } from 'react-redux';
  import { getCategories } from '@/redux/slices/categorySlice';
  import { Button } from '@/components/ui/button';
  import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from '@/components/ui/form';
  import { Input } from '@/components/ui/input';
  import { Textarea } from '@/components/ui/textarea';
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select';
  import { X, Upload, ImagePlus } from 'lucide-react';

  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  const formSchema = z.object({
    title: z.string().min(5).max(100),
    description: z.string().min(10).max(1000),
    category_id: z.string(),
    location: z.string().min(3).max(100),
    price_estimate: z.coerce.number().min(0),
    status: z.string().default("available"),
  });

  const ItemForm = ({ onSubmit, item, onClose }) => {
    const dispatch = useDispatch();
    const categoriesState = useSelector((state) => state.categories);
    const categories = Array.isArray(categoriesState.categories) ? categoriesState.categories : [];

    const [selectedImages, setSelectedImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [existingImages, setExistingImages] = useState(item?.images || []);
    const [imageError, setImageError] = useState(null);

    const form = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: {
        title: item?.title || '',
        description: item?.description || '',
        category_id: item?.category_id || '',
        location: item?.location || '',
        price_estimate: item?.price_estimate || 0,
        status: item?.status || 'available',
      },
    });

    useEffect(() => {
      dispatch(getCategories());
    }, [dispatch]);

    

    const handleImageChange = (e) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const newImages = [];
      const newPreviews = [];
      setImageError(null);

      Array.from(files).forEach((file) => {
        if (file.size > MAX_FILE_SIZE) {
          setImageError(`${file.name} is too large. Max size is 5MB.`);
          return;
        }

        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
          setImageError(`${file.name} has unsupported format.`);
          return;
        }

        newImages.push(file);
        newPreviews.push(URL.createObjectURL(file));
      });

      setSelectedImages((prev) => [...prev, ...newImages]);
      setPreviewImages((prev) => [...prev, ...newPreviews]);
    };

    const removeImage = (index) => {
      const newImages = [...selectedImages];
      const newPreviews = [...previewImages];

      URL.revokeObjectURL(newPreviews[index]);
      newImages.splice(index, 1);
      newPreviews.splice(index, 1);

      setSelectedImages(newImages);
      setPreviewImages(newPreviews);
    };

    const removeExistingImage = (index) => {
      const updated = [...existingImages];
      updated.splice(index, 1);
      setExistingImages(updated);
    };

   const handleFormSubmit = (data) => {
  const formData = new FormData();

  // Add form fields
  for (const key in data) {
    formData.append(key, data[key]);
  }

  // Add newly selected images
  selectedImages.forEach((file) => {
    formData.append("images", file);
  });

  // Add existing images (to keep them)
  existingImages.forEach((url) => {
    formData.append("existingImages", url);
  });

  onSubmit(formData); // Pass FormData to parent
};

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-2">
          {onClose && (
            <div className="flex justify-end">
              <Button type="button" variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter item title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter description" rows={5} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price_estimate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price Estimate</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter estimate" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="traded">Traded</SelectItem>
                    <SelectItem value="unavailable">Unavailable</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <FormLabel>Images</FormLabel>
            <div className="border-2 border-dashed p-2 text-center rounded-lg">
              <label className="cursor-pointer flex flex-col items-center">
                <ImagePlus className="h-8 w-8 mb-2 text-gray-500" />
                <span className="text-sm mb-1">Drop images or click to upload</span>
                <Input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  multiple
                  className="hidden"
                  onChange={handleImageChange}
                />
                <Button type="button" variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" /> Select Files
                </Button>
              </label>
            </div>

            {imageError && <p className="text-red-500 text-sm">{imageError}</p>}

            {previewImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                {previewImages.map((img, i) => (
                  <div key={i} className="relative">
                    <img src={img} className="h-24 w-24 object-cover rounded-md" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6"
                      onClick={() => removeImage(i)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {item && existingImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                {existingImages.map((img, i) => (
                  <div key={i} className="relative">
                    <img src={img} className="h-24 w-24 object-cover rounded-md" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6"
                      onClick={() => removeExistingImage(i)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button type="submit" className="w-full">
            {item ? 'Update Item' : 'Create Item'}
          </Button>
        </form>
      </Form>
    );
  };

  export default ItemForm;
