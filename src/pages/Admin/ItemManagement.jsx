
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getItems, reset as resetItems } from "@/redux/slices/itemSlice";
import { getCategories, reset as resetCategories } from "@/redux/slices/categorySlice";
import ItemList from "@/components/items/ItemList";
import ItemForm from "@/components/items/ItemForm";
import { updateItem, createItem } from "@/redux/slices/itemSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ItemManagement = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.items);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formMode, setFormMode] = useState("create"); // create or edit
  
  useEffect(() => {
    dispatch(getItems());
    dispatch(getCategories());
    
    return () => {
      dispatch(resetItems());
      dispatch(resetCategories());
    };
  }, [dispatch]);
  
  const handleEdit = (item) => {
    setCurrentItem(item);
    setFormMode("edit");
    setIsFormOpen(true);
  };
  
  const handleSubmit = async (data, images) => {
    if (formMode === "create") {
      // For create, we need to add the current user's ID
      const { user } = await dispatch(createItem({ ...data, images })).unwrap();
    } else {
      // For update
      await dispatch(updateItem({ id: currentItem.id, itemData: { ...data, images } }));
    }
    
    setIsFormOpen(false);
    dispatch(resetItems());
  };
  
  const closeForm = () => {
    setIsFormOpen(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Item Management</h1>
      </div>
      
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Items</TabsTrigger>
          <TabsTrigger value="pending">Pending Approval</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <ItemList isAdmin={true} onEdit={handleEdit} />
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-4">
          <ItemList 
            isAdmin={true} 
            onEdit={handleEdit}
          />
        </TabsContent>
      </Tabs>
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {formMode === "create" ? "Add New Item" : "Edit Item"}
            </DialogTitle>
          </DialogHeader>
          <ItemForm
            onSubmit={handleSubmit}
            item={currentItem}
            onClose={closeForm}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ItemManagement;
