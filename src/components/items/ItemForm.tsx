
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { getCategories } from '@/redux/slices/categorySlice';
import { Item } from '@/redux/slices/itemSlice';
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
import { X, Upload, ImagePlus, Trash2 } from 'lucide-react';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
  title: z.string().min(5, {
    message: 'Title must be at least 5 characters.',
  }).max(100, {
    message: 'Title must be less than 100 characters.',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }).max(1000, {
    message: 'Description must be less than 1000 characters.',
  }),
  category_id: z.string({
    required_error: "Please select a category.",
  }),
  location: z.string().min(3, {
    message: 'Location must be at least 3 characters.',
  }).max(100, {
    message: 'Location must be less than 100 characters.',
  }),
  price_estimate: z.coerce.number().min(0, {
    message: 'Price estimate must be a positive number.',
  }),
  status: z.string().default("available"),
  // Images will be handled separately in the component
});

type FormValues = z.infer<typeof formSchema>;

interface ItemFormProps {
  onSubmit: (data: FormValues, images: File[]) => void;
  item?: Item | null;
  onClose?: () => void;
}

const ItemForm: React.FC<ItemFormProps> = ({ 
  onSubmit, 
  item = null,
  onClose
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const categoriesState = useSelector((state: RootState) => state.categories);
  // Ensure categories is always an array
  const categories = Array.isArray(categoriesState.categories) ? categoriesState.categories : [];
  
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(item?.images || []);
  const [imageError, setImageError] = useState<string | null>(null);

  const form = useForm<FormValues>({
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const newImages: File[] = [];
    const newPreviews: string[] = [];
    setImageError(null);
    
    Array.from(files).forEach(file => {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        setImageError(`${file.name} is too large. Max size is 5MB.`);
        return;
      }
      
      // Check file type
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        setImageError(`${file.name} has unsupported format. Only JPEG, JPG, PNG and WebP are supported.`);
        return;
      }
      
      newImages.push(file);
      newPreviews.push(URL.createObjectURL(file));
    });
    
    setSelectedImages([...selectedImages, ...newImages]);
    setPreviewImages([...previewImages, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    const newImages = [...selectedImages];
    const newPreviews = [...previewImages];
    
    URL.revokeObjectURL(newPreviews[index]);
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setSelectedImages(newImages);
    setPreviewImages(newPreviews);
  };

  const removeExistingImage = (index: number) => {
    const newExistingImages = [...existingImages];
    newExistingImages.splice(index, 1);
    setExistingImages(newExistingImages);
  };

  const handleFormSubmit = (data: FormValues) => {
    onSubmit(data, selectedImages);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        {onClose && (
          <div className="flex justify-end">
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        
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
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter item description" 
                  {...field} 
                  rows={5}
                />
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
                <FormLabel>Price Estimate ($)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Enter price estimate" 
                    {...field} 
                  />
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
        
        <div className="space-y-4">
          <FormLabel>Images</FormLabel>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
            <label className="cursor-pointer flex flex-col items-center">
              <ImagePlus className="h-8 w-8 mb-2 text-gray-500" />
              <span className="text-sm font-medium mb-1">Drop images here or click to upload</span>
              <span className="text-xs text-gray-500 mb-3">Support: JPG, JPEG, PNG, WebP (up to 5MB)</span>
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
          
          {imageError && (
            <p className="text-destructive text-sm">{imageError}</p>
          )}
          
          {/* Preview of new images */}
          {previewImages.length > 0 && (
            <div className="mt-4 space-y-2">
              <h3 className="text-sm font-medium">New Images:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {previewImages.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="h-24 w-24 object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Existing images for edit mode */}
          {item && existingImages.length > 0 && (
            <div className="mt-4 space-y-2">
              <h3 className="text-sm font-medium">Current Images:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {existingImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Item image ${index + 1}`}
                      className="h-24 w-24 object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6"
                      onClick={() => removeExistingImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
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
