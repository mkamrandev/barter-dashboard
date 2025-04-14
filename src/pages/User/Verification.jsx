
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserVerification } from "@/redux/slices/verificationSlice";
import VerificationForm from "@/components/verification/VerificationForm";

const Verification = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?.id) {
      dispatch(getUserVerification(user.id));
    }
  }, [dispatch, user]);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Account Verification</h1>
        <p className="text-gray-500">
          Complete your account verification by uploading the required documents.
        </p>
      </div>

      <VerificationForm />
    </div>
  );
};

export default Verification;
