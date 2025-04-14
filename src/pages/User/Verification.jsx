
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserVerification } from "@/redux/slices/verificationSlice";
import VerificationForm from "@/components/verification/VerificationForm";
import VerificationPageHeader from "@/components/verification/VerificationPageHeader";

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
      <VerificationPageHeader />
      <VerificationForm />
    </div>
  );
};

export default Verification;
