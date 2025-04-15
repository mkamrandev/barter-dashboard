
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getItems, reset as resetItems, approveRejectItem } from "@/redux/slices/itemSlice";
import { getCategories, reset as resetCategories } from "@/redux/slices/categorySlice";
import ItemList from "@/components/items/ItemList";
import ItemForm from "@/components/items/ItemForm";
import { updateItem, createItem, deleteItem } from "@/redux/slices/itemSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

const ItemManagement = () => {
  const dispatch = useDispatch();
  const { items, isLoading } = useSelector((state) => state.items);
  const { user } = useSelector((state) => state.auth);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formMode, setFormMode] = useState("create"); // create or edit
  const [activeTab, setActiveTab] = useState("all");
  const [pendingItems, setPendingItems] = useState([]);
  
  // Load items and categories once on component mount
  useEffect(() => {
    dispatch(getItems());
    dispatch(getCategories());
    
    return () => {
      dispatch(resetItems());
      dispatch(resetCategories());
    };
  }, [dispatch]);
  
  // Update pendingItems when items change - with dependency array
  useEffect(() => {
    if (Array.isArray(items)) {
      const pending = items.filter(item => item.is_approved === null || item.is_approved === false);
      setPendingItems(pending);
    }
  }, [items]);
  
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
  
  const handleDelete = async (item) => {
    try {
      await dispatch(deleteItem(item.id)).unwrap();
      toast.success("Item deleted successfully");
      // No need to manually refresh items as the itemSlice reducer already updates the state
    } catch (error) {
      toast.error("Failed to delete item");
    }
  };
  
  const handleApprove = async (item) => {
    try {
      await dispatch(approveRejectItem({ id: item.id, isApproved: true })).unwrap();
      toast.success("Item approved successfully");
      // No need to manually refresh items as the itemSlice reducer already updates the state
    } catch (error) {
      toast.error("Failed to approve item");
    }
  };
  
  const handleReject = async (item) => {
    try {
      await dispatch(approveRejectItem({ id: item.id, isApproved: false })).unwrap();
      toast.success("Item rejected successfully");
      // No need to manually refresh items as the itemSlice reducer already updates the state
    } catch (error) {
      toast.error("Failed to reject item");
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
      // No need to manually refresh items as the itemSlice reducer already updates the state
    } catch (error) {
      toast.error("Error submitting item: " + (error.message || "Unknown error"));
    }
  };
  
  const closeForm = () => {
    setIsFormOpen(false);
  };
  
  // Check if user is admin or subadmin
  const isAdminOrSubadmin = user?.role === "admin" || user?.role === "subadmin";
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Item Management</h1>
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4 mr-2" /> Add New Item
        </Button>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Items</TabsTrigger>
          {isAdminOrSubadmin && <TabsTrigger value="pending">Pending Approval</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <ItemList 
              items={items} 
              isAdmin={isAdminOrSubadmin} 
              onEdit={handleEdit}
              onDelete={handleDelete}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          )}
        </TabsContent>
        
        {isAdminOrSubadmin && (
          <TabsContent value="pending" className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : pendingItems.length > 0 ? (
              <ItemList 
                items={pendingItems} 
                isAdmin={true} 
                onEdit={handleEdit}
                onDelete={handleDelete}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ) : (
              <div className="text-center py-12 border rounded-md">
                <p className="text-gray-500">No items pending approval</p>
              </div>
            )}
          </TabsContent>
        )}
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
