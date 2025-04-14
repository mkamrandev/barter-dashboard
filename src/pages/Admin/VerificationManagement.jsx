
import React from "react";
import VerificationList from "@/components/verification/VerificationList";

const VerificationManagement = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Verification Management</h1>
        <p className="text-gray-500">
          Review and manage user verification requests.
        </p>
      </div>

      <VerificationList />
    </div>
  );
};

export default VerificationManagement;
