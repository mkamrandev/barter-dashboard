
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getItems, reset as resetItems, filterUserItems } from "@/redux/slices/itemSlice";
import { getCategories, reset as resetCategories } from "@/redux/slices/categorySlice";
import ItemList from "@/components/items/ItemList";
import ItemForm from "@/components/items/ItemForm";
import { updateItem, createItem } from "@/redux/slices/itemSlice";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MyItems = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.items);
  const { user } = useSelector((state) => state.auth);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formMode, setFormMode] = useState("create"); // create or edit
  const [activeTab, setActiveTab] = useState("all");
  
  useEffect(() => {
    dispatch(getItems());
    dispatch(getCategories());
    
    return () => {
      dispatch(resetItems());
      dispatch(resetCategories());
    };
  }, [dispatch]);
  
  useEffect(() => {
    if (user) {
      dispatch(filterUserItems(user.id));
    }
  }, [dispatch, user]);
  
  const handleAddNew = () => {
    setCurrentItem(null);
    setFormMode("create");
    setIsFormOpen(true);
  };
  
  const handleEdit = (item) => {
    setCurrentItem(item);
    setFormMode("edit");
    setIsFormOpen(true);
  };
  
  const handleSubmit = async (data, images) => {
    try {
      if (formMode === "create") {
        // For create, we need to add the current user's ID
        await dispatch(createItem({ ...data, user_id: user?.id, images })).unwrap();
      } else {
        // For update
        await dispatch(updateItem({ id: currentItem.id, itemData: { ...data, images } })).unwrap();
      }
      
      setIsFormOpen(false);
      // Refresh items
      dispatch(getItems());
      if (user) {
        // Refresh user items
        setTimeout(() => {
          dispatch(filterUserItems(user.id));
        }, 300);
      }
    } catch (error) {
      console.error("Error submitting item:", error);
    }
  };
  
  const closeForm = () => {
    setIsFormOpen(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">My Items</h1>
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4 mr-2" /> Add New Item
        </Button>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Items</TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <ItemList 
            onAddNew={handleAddNew} 
            onEdit={handleEdit}
            userOnly={true}
          />
        </TabsContent>
        
        <TabsContent value="available" className="space-y-4">
          <ItemList 
            onAddNew={handleAddNew} 
            onEdit={handleEdit}
            userOnly={true}
          />
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-4">
          <ItemList 
            onAddNew={handleAddNew} 
            onEdit={handleEdit}
            userOnly={true}
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

export default MyItems;
