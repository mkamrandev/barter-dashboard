
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getItems, reset as resetItems, filterUserItems } from "@/redux/slices/itemSlice";
import { getCategories, reset as resetCategories } from "@/redux/slices/categorySlice";
import { getItemById } from "@/redux/slices/itemSlice";
import ItemList from "@/components/items/ItemList";
import ItemForm from "@/components/items/ItemForm";
import { updateItem, createItem, deleteItem } from "@/redux/slices/itemSlice";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MyItems = () => {
  const dispatch = useDispatch();
  const { userItems, isLoading, items } = useSelector((state) => state.items);
  console.log(userItems)
  const { user } = useSelector((state) => state.auth);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formMode, setFormMode] = useState("create"); // create or edit
  const [activeTab, setActiveTab] = useState("all");
  const [availableItems, setAvailableItems] = useState([]);
  const [pendingItems, setPendingItems] = useState([]);

  console.log("currentedit",currentItem)
  
  // Load items and categories once on component mount
  useEffect(() => {
    dispatch(getItems());
    dispatch(getCategories());
    
    return () => {
      dispatch(resetItems());
      dispatch(resetCategories());
    };
  }, [dispatch]);
  
  // Filter user's items when user or items change
  useEffect(() => {
    if (user && items.length > 0) {
      dispatch(filterUserItems(user.id));
    }
  }, [dispatch, user, items]); // Removed the items dependency to prevent potential issues
  
  // Update filtered items when userItems change
  useEffect(() => {
    if (Array.isArray(userItems)) {
      const available = userItems.filter(item => item.is_approved === true);
      const pending = userItems.filter(item => item.is_approved === null || item.is_approved === false);
      
      setAvailableItems(available);
      setPendingItems(pending);
    }
  }, [userItems]);
  
  const handleAddNew = () => {
    setCurrentItem(null);
    setFormMode("create");
    setIsFormOpen(true);
  };
  
  const handleEdit = async (item) => {
    try {
      const response = await dispatch(getItemById(item.id)).unwrap();
      setCurrentItem(response.data || response); // fallback in case .data is not available
      setFormMode("edit");
      setIsFormOpen(true);
    } catch (error) {
      toast.error("Failed to fetch item details.");
    }
  };

  const handleDelete = async (item) => {
    try {
      await dispatch(deleteItem(item.id)).unwrap();
      toast.success("Item deleted successfully");
      // No additional dispatch needed - reducer will update state
    } catch (error) {
      toast.error("Failed to delete item");
    }
  };
  
  const handleSubmit = async (data, images) => {
    try {
      if (formMode === "create") {
        // For create, we need to add the current user's ID
        await dispatch(createItem({ ...data, user_id: user?.id, images })).unwrap();
        toast.success("Item created successfully");
      } else {
        // For update
        await dispatch(updateItem({ id: currentItem.id, itemData: { ...data, images } })).unwrap();
        toast.success("Item updated successfully");
      }
      
      setIsFormOpen(false);
      // Redux state is already updated by the reducer
    } catch (error) {
      toast.error("Error submitting item: " + (error.message || "Unknown error"));
    }
  };
  
  const closeForm = () => {
    setIsFormOpen(false);
  };
  
  const getItemsForTab = () => {
    switch (activeTab) {
      case "available":
        return availableItems;
      case "pending":
        return pendingItems;
      case "all":
      default:
        return userItems;
    }
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
          <TabsTrigger value="available">Approved</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : getItemsForTab().length > 0 ? (
            <ItemList 
              items={getItemsForTab()}
              onEdit={handleEdit}
              onDelete={handleDelete}
              showStatus={true}
            />
          ) : (
            <div className="text-center py-12 border rounded-md">
              <p className="text-gray-500">No items found</p>
              <Button variant="outline" className="mt-4" onClick={handleAddNew}>
                <Plus className="h-4 w-4 mr-2" /> Add New Item
              </Button>
            </div>
          )}
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
