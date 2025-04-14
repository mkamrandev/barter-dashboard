
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllVerifications } from "../../redux/slices/verificationSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Search, UserCheck, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import VerificationModal from "./VerificationModal";

const VerificationList = () => {
  const dispatch = useDispatch();
  const { verifications, isLoading } = useSelector((state) => state.verification);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [filteredVerifications, setFilteredVerifications] = useState([]);
  const [filter, setFilter] = useState("all"); // all, pending, approved, rejected
  
  useEffect(() => {
    dispatch(getAllVerifications());
  }, [dispatch]);
  
  useEffect(() => {
    if (verifications) {
      if (filter === "all") {
        setFilteredVerifications(verifications);
      } else {
        setFilteredVerifications(verifications.filter(v => v.status === filter));
      }
    }
  }, [verifications, filter]);
  
  const handleView = (verification) => {
    setSelectedVerification(verification);
    setModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedVerification(null);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-xl font-semibold">User Verifications</h2>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={filter === "all" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button 
            variant={filter === "pending" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilter("pending")}
            className="flex items-center gap-1"
          >
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Pending
          </Button>
          <Button 
            variant={filter === "approved" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilter("approved")}
            className="flex items-center gap-1"
          >
            <UserCheck className="h-4 w-4 text-green-500" />
            Approved
          </Button>
          <Button 
            variant={filter === "rejected" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilter("rejected")}
            className="flex items-center gap-1"
          >
            <AlertTriangle className="h-4 w-4 text-red-500" />
            Rejected
          </Button>
        </div>
      </div>
      
      {filteredVerifications?.length === 0 ? (
        <div className="bg-gray-50 border rounded-md p-8 text-center">
          <Search className="h-10 w-10 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-1">No verification requests found</h3>
          <p className="text-gray-500">
            {filter !== "all" 
              ? `There are no verification requests with status: ${filter}` 
              : "No users have submitted verification documents yet"}
          </p>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Submitted Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVerifications.map((verification) => (
                <TableRow key={verification.id}>
                  <TableCell className="font-medium">
                    {verification.user_name || verification.user_id}
                  </TableCell>
                  <TableCell>
                    {verification.created_at && 
                      format(new Date(verification.created_at), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleView(verification)}
                    >
                      <Eye className="h-4 w-4 mr-1" /> View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      {modalOpen && selectedVerification && (
        <VerificationModal
          verification={selectedVerification}
          isOpen={modalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default VerificationList;
