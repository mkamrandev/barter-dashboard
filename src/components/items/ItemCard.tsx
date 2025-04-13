
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, CheckCircle, XCircle } from 'lucide-react';
import { Item } from '@/redux/slices/itemSlice';
import { formatDistanceToNow } from 'date-fns';

interface ItemCardProps {
  item: Item;
  onView: (item: Item) => void;
  onEdit?: (item: Item) => void;
  onDelete?: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  showAdminActions?: boolean;
}

const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onView,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  showAdminActions = false,
}) => {
  // Helper function to get status badge color
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return <Badge className="bg-green-500">Available</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500">Pending</Badge>;
      case 'traded':
        return <Badge className="bg-blue-500">Traded</Badge>;
      case 'unavailable':
        return <Badge className="bg-red-500">Unavailable</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };

  // Helper function to get approval badge
  const getApprovalBadge = (isApproved: boolean | undefined) => {
    if (isApproved === undefined) return null;
    return isApproved ? 
      <Badge className="bg-green-500">Approved</Badge> : 
      <Badge className="bg-red-500">Rejected</Badge>;
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="p-4 pb-2">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg line-clamp-1">{item.title}</h3>
            <div className="flex space-x-1">
              {getStatusBadge(item.status)}
              {getApprovalBadge(item.is_approved)}
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {item.category?.name || 'Uncategorized'}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-2 pb-2 flex-grow">
        <div className="aspect-[4/3] w-full mb-3 bg-gray-100 rounded-md overflow-hidden">
          {item.images && item.images.length > 0 ? (
            <img 
              src={item.images[0]} 
              alt={item.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>
        
        <div className="space-y-2 text-sm">
          <p className="line-clamp-3 text-muted-foreground">
            {item.description}
          </p>
          <div className="flex justify-between">
            <span>{item.location}</span>
            <span className="font-medium">${item.price_estimate}</span>
          </div>
          {item.created_at && (
            <div className="text-xs text-muted-foreground">
              Added {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-2 flex flex-wrap gap-2">
        <Button 
          variant="secondary" 
          size="sm" 
          className="flex-1"
          onClick={() => onView(item)}
        >
          <Eye className="h-4 w-4 mr-1" /> View
        </Button>
        
        {onEdit && (
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onEdit(item)}
          >
            <Edit className="h-4 w-4 mr-1" /> Edit
          </Button>
        )}
        
        {onDelete && (
          <Button 
            variant="destructive" 
            size="sm" 
            className="flex-1"
            onClick={() => onDelete(item.id)}
          >
            <Trash2 className="h-4 w-4 mr-1" /> Delete
          </Button>
        )}
        
        {showAdminActions && onApprove && onReject && (
          <div className="w-full flex gap-2 mt-2">
            <Button 
              variant="default" 
              size="sm" 
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={() => onApprove(item.id)}
              disabled={item.is_approved === true}
            >
              <CheckCircle className="h-4 w-4 mr-1" /> Approve
            </Button>
            
            <Button 
              variant="destructive" 
              size="sm" 
              className="flex-1"
              onClick={() => onReject(item.id)}
              disabled={item.is_approved === false}
            >
              <XCircle className="h-4 w-4 mr-1" /> Reject
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ItemCard;
