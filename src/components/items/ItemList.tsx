
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Item } from '@/redux/slices/itemSlice';
import ItemCard from './ItemCard';
import ItemDetails from './ItemDetails';
import ConfirmationDialog from '@/components/ui/confirmation-dialog';
import { Button } from '@/components/ui/button';
import { Plus, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

interface ItemListProps {
  items?: Item[];
  isAdmin?: boolean;
  onAddNew?: () => void;
  onEdit?: (item: Item) => void;
  onDelete?: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  userOnly?: boolean;
  showStatus?: boolean;
}

const ItemList: React.FC<ItemListProps> = ({ 
  items = [], 
  isAdmin = false, 
  onAddNew, 
  onEdit,
  onDelete,
  onApprove,
  onReject,
  userOnly = false,
  showStatus = false
}) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { categories = [] } = useSelector((state: RootState) => state.categories);
  
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [approvalFilter, setApprovalFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Make sure items is always an array before filtering
  const itemsArray = Array.isArray(items) ? items : [];
  
  const filteredItems = itemsArray.filter((item) => {
    // Filter by user if userOnly is true
    if (userOnly && user && item.user_id !== user.id) {
      return false;
    }
    
    // Filter by category
    if (categoryFilter !== 'all' && item.category_id !== categoryFilter) {
      return false;
    }
    
    // Filter by status
    if (statusFilter !== 'all' && item.status !== statusFilter) {
      return false;
    }
    
    // Filter by approval status
    if (approvalFilter === 'approved' && item.is_approved !== true) {
      return false;
    } else if (approvalFilter === 'rejected' && item.is_approved !== false) {
      return false;
    } else if (approvalFilter === 'pending' && item.is_approved !== undefined) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && item.title && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (itemToDelete && onDelete) {
      onDelete(itemToDelete);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };
  
  const handleView = (item: Item) => {
    setSelectedItem(item);
    setShowDetails(true);
  };
  
  const handleClose = () => {
    setShowDetails(false);
    setSelectedItem(null);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center">
            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm mr-2">Filters:</span>
          </div>
          
          <Select 
            value={categoryFilter} 
            onValueChange={setCategoryFilter}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select 
            value={statusFilter} 
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="traded">Traded</SelectItem>
              <SelectItem value="unavailable">Unavailable</SelectItem>
            </SelectContent>
          </Select>
          
          {isAdmin && (
            <Select 
              value={approvalFilter} 
              onValueChange={setApprovalFilter}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Approval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          )}
          
          {onAddNew && (
            <Button onClick={onAddNew}>
              <Plus className="h-4 w-4 mr-2" /> Add New
            </Button>
          )}
        </div>
      </div>
      
      {filteredItems.length === 0 ? (
        <div className="text-center p-10 border rounded-lg bg-muted/20">
          <p className="text-muted-foreground mb-4">No items found</p>
          {onAddNew && (
            <Button onClick={onAddNew}>
              <Plus className="h-4 w-4 mr-2" /> Add New Item
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onView={handleView}
              onEdit={onEdit}
              onDelete={onDelete ? () => handleDeleteClick(item.id) : undefined}
              onApprove={onApprove ? () => onApprove(item.id) : undefined}
              onReject={onReject ? () => onReject(item.id) : undefined}
              showAdminActions={isAdmin}
            />
          ))}
        </div>
      )}
      
      {selectedItem && (
        <ItemDetails
          item={selectedItem}
          isOpen={showDetails}
          onClose={handleClose}
          onEdit={onEdit}
          showAdminActions={isAdmin}
          onApprove={onApprove ? () => onApprove(selectedItem.id) : undefined}
          onReject={onReject ? () => onReject(selectedItem.id) : undefined}
        />
      )}
      
      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Item"
        description="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        isDestructive={true}
      />
    </div>
  );
};

export default ItemList;
