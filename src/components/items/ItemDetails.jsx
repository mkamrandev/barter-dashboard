import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, CheckCircle, XCircle, MapPin, DollarSign, CalendarClock, User } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from '@/components/ui/separator';

const ItemDetails = ({
  item,
  isOpen,
  onClose,
  onEdit,
  showAdminActions = false,
  onApprove,
  onReject,
}) => {
  // Helper function to get status badge
  const getStatusBadge = (status) => {
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
  const getApprovalBadge = (isApproved) => {
    if (isApproved === undefined) return <Badge className="bg-amber-500">Pending Approval</Badge>;
    return isApproved ? 
      <Badge className="bg-green-500">Approved</Badge> : 
      <Badge className="bg-red-500">Rejected</Badge>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>{item.title}</span>
            <div className="flex space-x-2">
              {getStatusBadge(item.status)}
              {getApprovalBadge(item.is_approved)}
            </div>
          </DialogTitle>
          <DialogDescription>
            {item.category?.name || 'Uncategorized'}
          </DialogDescription>
        </DialogHeader>

        {/* Image carousel */}
        {item.images && item.images.length > 0 ? (
          <Carousel className="w-full">
            <CarouselContent>
              {item.images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="aspect-[4/3] w-full p-1">
                    <img 
                      src={image} 
                      alt={`${item.title} image ${index + 1}`} 
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ) : (
          <div className="aspect-[4/3] w-full bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
            No Images Available
          </div>
        )}

        <div className="space-y-4">
          <div>
            <h3 className="text-base font-medium mb-2">Description</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {item.description}
            </p>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{item.location}</span>
              </div>
              <div className="flex items-center text-sm">
                <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Estimated Value: ${item.price_estimate}</span>
              </div>
            </div>
            <div className="space-y-2">
              {item.user && (
                <div className="flex items-center text-sm">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Owner: {item.user.name}</span>
                </div>
              )}
              {item.created_at && (
                <div className="flex items-center text-sm">
                  <CalendarClock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Added: {format(new Date(item.created_at), 'PP')} ({formatDistanceToNow(new Date(item.created_at), { addSuffix: true })})</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-wrap gap-2">
          {onEdit && (
            <Button onClick={() => onEdit(item)}>
              <Edit className="h-4 w-4 mr-2" /> Edit Item
            </Button>
          )}
          
          {showAdminActions && onApprove && onReject && (
            <>
              <Button 
                className="bg-green-600 hover:bg-green-700"
                onClick={onApprove}
                disabled={item.is_approved === true}
              >
                <CheckCircle className="h-4 w-4 mr-2" /> Approve
              </Button>
              
              <Button 
                variant="destructive"
                onClick={onReject}
                disabled={item.is_approved === false}
              >
                <XCircle className="h-4 w-4 mr-2" /> Reject
              </Button>
            </>
          )}
          
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ItemDetails;
