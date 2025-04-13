
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { FileText, Upload, X, FileCheck, Info, CheckCircle2 } from "lucide-react";

const Verification = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [documentsUploaded, setDocumentsUploaded] = useState({
    idCard: null,
    addressProof: null,
  });

  const handleFileUpload = (type, e) => {
    const file = e.target.files[0];
    if (file) {
      setDocumentsUploaded((prev) => ({
        ...prev,
        [type]: {
          file,
          name: file.name,
          preview: URL.createObjectURL(file),
        },
      }));
    }
  };

  const removeFile = (type) => {
    setDocumentsUploaded((prev) => ({
      ...prev,
      [type]: null,
    }));
  };

  const isFormComplete = () => {
    return documentsUploaded.idCard && documentsUploaded.addressProof;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormComplete()) {
      toast({
        title: "Incomplete Submission",
        description: "Please upload all required documents.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    // Mock API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Verification Submitted",
        description: "Your documents have been submitted for verification.",
      });
      navigate("/user/dashboard");
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Account Verification</h1>
        <p className="text-gray-500">
          Complete your account verification by uploading the required documents.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Info className="h-5 w-5 mr-2 text-blue-500" />
            Why Verify Your Account?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Verifying your account helps us ensure the security and trust of
              our barter exchange platform. Benefits include:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
              <li>Increased trust from other users</li>
              <li>Higher response rates on your barter offers</li>
              <li>Access to premium features and high-value barter options</li>
              <li>Protection against fraud</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upload Verification Documents</CardTitle>
          <CardDescription>
            Please provide clear, readable documents for faster verification.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="idCard" className="text-base font-medium">ID Card or Passport</Label>
                  <span className="text-sm text-red-500">Required</span>
                </div>

                {documentsUploaded.idCard ? (
                  <div className="border rounded-md p-4 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileCheck className="h-5 w-5 text-green-500 mr-2" />
                        <div>
                          <p className="text-sm font-medium">{documentsUploaded.idCard.name}</p>
                          <p className="text-xs text-gray-500">
                            Uploaded successfully
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile("idCard")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="border border-dashed rounded-md p-8 text-center">
                    <Input
                      id="idCard"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileUpload("idCard", e)}
                      className="hidden"
                    />
                    <Label
                      htmlFor="idCard"
                      className="flex flex-col items-center cursor-pointer"
                    >
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm font-medium mb-1">
                        Drag & drop or click to upload
                      </span>
                      <span className="text-xs text-gray-500">
                        Supports JPG, PNG or PDF (max 5MB)
                      </span>
                    </Label>
                  </div>
                )}
                <p className="text-xs text-gray-500">
                  Upload a clear photo of your government-issued ID card or passport. Make sure all details are visible.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="addressProof" className="text-base font-medium">Proof of Address</Label>
                  <span className="text-sm text-red-500">Required</span>
                </div>

                {documentsUploaded.addressProof ? (
                  <div className="border rounded-md p-4 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileCheck className="h-5 w-5 text-green-500 mr-2" />
                        <div>
                          <p className="text-sm font-medium">{documentsUploaded.addressProof.name}</p>
                          <p className="text-xs text-gray-500">
                            Uploaded successfully
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile("addressProof")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="border border-dashed rounded-md p-8 text-center">
                    <Input
                      id="addressProof"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileUpload("addressProof", e)}
                      className="hidden"
                    />
                    <Label
                      htmlFor="addressProof"
                      className="flex flex-col items-center cursor-pointer"
                    >
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm font-medium mb-1">
                        Drag & drop or click to upload
                      </span>
                      <span className="text-xs text-gray-500">
                        Supports JPG, PNG or PDF (max 5MB)
                      </span>
                    </Label>
                  </div>
                )}
                <p className="text-xs text-gray-500">
                  Provide a recent utility bill, bank statement, or any official document that shows your name and address.
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-md p-4 flex items-start">
              <FileText className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Verification Process</p>
                <p>
                  Once submitted, your documents will be reviewed within 1-2
                  business days. You'll receive an email notification once
                  verification is complete.
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading || !isFormComplete()}>
                {loading ? "Submitting..." : "Submit for Verification"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Verification;
