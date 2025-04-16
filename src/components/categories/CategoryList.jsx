
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCategories, deleteCategory, reset } from '@/redux/slices/categorySlice';
import DataTable from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import ConfirmationDialog from '@/components/ui/confirmation-dialog';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

function CategoryList({ onEdit }) {
  const dispatch = useDispatch();
  const { categories, isLoading } = useSelector((state) => state.categories);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    dispatch(getCategories());
    
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  const handleDelete = (id) => {
    setCategoryToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      dispatch(deleteCategory(categoryToDelete));
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  const columns = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => {
        const description = row.original.description;
        return (
          <div className="max-w-md">
            {description.length > 100 
              ? `${description.substring(0, 100)}...` 
              : description}
          </div>
        );
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Created',
      cell: ({ row }) => {
        const date = row.original.created_at;
        if (!date) return 'N/A';
        return formatDistanceToNow(new Date(date), { addSuffix: true });
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onEdit(row.original)}
            >
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => handleDelete(row.original.id)}
            >
              <Trash2 className="h-4 w-4 mr-1" /> Delete
            </Button>
          </div>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div>
      <DataTable columns={columns} data={categories} />
      
      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        isDestructive={true}
      />
    </div>
  );
}

export default CategoryList;
