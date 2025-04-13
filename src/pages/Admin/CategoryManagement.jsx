
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCategory, updateCategory, reset } from "@/redux/slices/categorySlice";
import CategoryList from "@/components/categories/CategoryList";
import CategoryForm from "@/components/categories/CategoryForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CategoryManagement = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.categories);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [formMode, setFormMode] = useState("create"); // create or edit
  
  const handleAddNew = () => {
    setCurrentCategory(null);
    setFormMode("create");
    setIsFormOpen(true);
  };
  
  const handleEdit = (category) => {
    setCurrentCategory(category);
    setFormMode("edit");
    setIsFormOpen(true);
  };
  
  const handleSubmit = async (data) => {
    if (formMode === "create") {
      await dispatch(createCategory(data));
    } else {
      await dispatch(updateCategory({ id: currentCategory.id, categoryData: data }));
    }
    
    setIsFormOpen(false);
    dispatch(reset());
  };
  
  const closeForm = () => {
    setIsFormOpen(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Category Management</h1>
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4 mr-2" /> Add Category
        </Button>
      </div>
      
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Categories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <CategoryList onEdit={handleEdit} />
        </TabsContent>
      </Tabs>
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {formMode === "create" ? "Add New Category" : "Edit Category"}
            </DialogTitle>
          </DialogHeader>
          <CategoryForm
            onSubmit={handleSubmit}
            category={currentCategory}
            onClose={closeForm}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryManagement;
