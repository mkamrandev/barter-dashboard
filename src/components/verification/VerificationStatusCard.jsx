
import React from "react";
import { useSelector } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const VerificationStatusCard = () => {
  const { userVerification } = useSelector((state) => state.verification);

  // If no verification data, show verification prompt
  if (!userVerification) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-blue-500" />
              <div>
                <h3 className="font-medium text-sm">Account Verification</h3>
                <p className="text-xs text-gray-500">Verify your account to unlock all features</p>
              </div>
            </div>
            <Button size="sm" variant="outline" asChild>
              <Link to="/user/verification">Verify Now</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Status badge and icon based on verification status
  const statusConfig = {
    pending: {
      icon: <Clock className="h-5 w-5 text-amber-500" />,
      badge: <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">Pending</Badge>,
      message: "Your verification is being reviewed",
    },
    approved: {
      icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
      badge: <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">Verified</Badge>,
      message: "Your account is fully verified",
    },
    rejected: {
      icon: <XCircle className="h-5 w-5 text-red-500" />,
      badge: <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">Rejected</Badge>,
      message: "Your verification was rejected",
    },
  };

  const status = userVerification.status || "pending";
  const { icon, badge, message } = statusConfig[status];

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {icon}
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-medium text-sm">Verification Status</h3>
                {badge}
              </div>
              <p className="text-xs text-gray-500">{message}</p>
            </div>
          </div>
          
          {status === "rejected" && (
            <Button size="sm" variant="outline" asChild>
              <Link to="/user/verification">Resubmit</Link>
            </Button>
          )}
          
          {status === "pending" && (
            <Button size="sm" variant="outline" asChild>
              <Link to="/user/verification">View Status</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VerificationStatusCard;
