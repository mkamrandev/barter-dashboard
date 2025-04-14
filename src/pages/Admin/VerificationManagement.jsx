
import React from "react";
import VerificationList from "@/components/verification/VerificationList";
import VerificationManagementHeader from "@/components/verification/VerificationManagementHeader";

const VerificationManagement = () => {
  return (
    <div className="space-y-6">
      <VerificationManagementHeader />
      <VerificationList />
    </div>
  );
};

export default VerificationManagement;
