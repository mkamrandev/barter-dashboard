
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleVerification } from "../../redux/slices/verificationSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { CheckCircle2, XCircle, UserIcon, AlertTriangle } from "lucide-react";

const VerificationModal = ({ verification, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.verification);
  
  const handleAction = (action) => {
    dispatch(handleVerification({ id: verification.id, action }))
      .unwrap()
      .then(() => {
        onClose();
      })
      .catch(() => {
        // Error is already handled by the thunk
      });
  };
  
  // Default image to show if document is missing
  const defaultImage = "https://placehold.co/400x250/e2e8f0/64748b?text=No+Document";
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>User Verification Details</span>
            <Badge
              variant="outline"
              className={
                verification.status === "approved"
                  ? "bg-green-100 text-green-700 border-green-200"
                  : verification.status === "rejected"
                  ? "bg-red-100 text-red-700 border-red-200"
                  : "bg-amber-100 text-amber-700 border-amber-200"
              }
            >
              {verification.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            <div className="flex flex-col space-y-1 mt-2">
              <div className="flex items-center">
                <UserIcon className="h-4 w-4 mr-2 text-gray-500" />
                <span className="font-medium">
                  {verification.user_name || verification.user_id}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                Submitted on: {verification.created_at && 
                  format(new Date(verification.created_at), "MMMM dd, yyyy")}
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="profile">Profile Picture</TabsTrigger>
            <TabsTrigger value="cnic_front">ID Front</TabsTrigger>
            <TabsTrigger value="cnic_back">ID Back</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="border rounded-md overflow-hidden">
            <img 
              src={verification.profile_picture || defaultImage} 
              alt="Profile Picture" 
              className="w-full h-auto max-h-[400px] object-contain bg-gray-100" 
            />
          </TabsContent>
          
          <TabsContent value="cnic_front" className="border rounded-md overflow-hidden">
            <img 
              src={verification.cnic_front || defaultImage} 
              alt="ID Front" 
              className="w-full h-auto max-h-[400px] object-contain bg-gray-100" 
            />
          </TabsContent>
          
          <TabsContent value="cnic_back" className="border rounded-md overflow-hidden">
            <img 
              src={verification.cnic_back || defaultImage} 
              alt="ID Back" 
              className="w-full h-auto max-h-[400px] object-contain bg-gray-100" 
            />
          </TabsContent>
        </Tabs>
        
        {verification.status === "pending" && (
          <DialogFooter className="flex justify-end space-x-2 mt-6">
            <Button 
              variant="outline" 
              onClick={() => handleAction("reject")}
              disabled={isLoading}
              className="flex items-center gap-1"
            >
              <XCircle className="h-4 w-4 text-red-500" />
              Reject
            </Button>
            <Button 
              onClick={() => handleAction("approve")}
              disabled={isLoading}
              className="flex items-center gap-1"
            >
              <CheckCircle2 className="h-4 w-4" />
              Approve
            </Button>
          </DialogFooter>
        )}
        
        {verification.status !== "pending" && (
          <div className="mt-6 p-4 border rounded-md bg-gray-50">
            <div className="flex items-start">
              {verification.status === "approved" ? (
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
              )}
              <div>
                <h4 className="font-medium">
                  {verification.status === "approved" 
                    ? "Verification Approved" 
                    : "Verification Rejected"}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {verification.status === "approved"
                    ? "This user has been verified and has full access to the platform."
                    : "This user's verification was rejected. They will need to resubmit their documents."}
                </p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VerificationModal;
