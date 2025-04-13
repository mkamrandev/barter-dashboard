
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { X } from 'lucide-react';
import { Category } from '@/redux/slices/categorySlice';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }).max(50, {
    message: 'Name must be less than 50 characters.',
  }),
  description: z.string().min(5, {
    message: 'Description must be at least 5 characters.',
  }).max(500, {
    message: 'Description must be less than 500 characters.',
  }),
});

interface CategoryFormProps {
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  category?: Category | null;
  onClose?: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ 
  onSubmit, 
  category = null,
  onClose
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name || '',
      description: category?.description || '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter category name" {...field} />
              </FormControl>
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
                  placeholder="Enter category description" 
                  {...field} 
                  rows={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full">
          {category ? 'Update Category' : 'Create Category'}
        </Button>
      </form>
    </Form>
  );
};

export default CategoryForm;
