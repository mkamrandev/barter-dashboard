
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { submitVerification, reset } from "../../redux/slices/verificationSlice";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Upload, X, Check, Info } from "lucide-react";

const VerificationForm = () => {
  const dispatch = useDispatch();
  const { userVerification, isLoading, isSuccess } = useSelector((state) => state.verification);
  const { user } = useSelector((state) => state.auth);
  
  const [formDisabled, setFormDisabled] = useState(false);
  const [documents, setDocuments] = useState({
    profile_picture: null,
    cnic_front: null,
    cnic_back: null,
  });

  useEffect(() => {
    // Disable form if user already has verification documents submitted
    if (userVerification && userVerification.status) {
      setFormDisabled(true);
    }
    
    return () => {
      dispatch(reset());
    };
  }, [dispatch, userVerification]);

  const handleFileChange = (field, e) => {
    const file = e.target.files[0];
    if (file) {
      setDocuments((prev) => ({
        ...prev,
        [field]: {
          file,
          name: file.name,
          preview: URL.createObjectURL(file),
        },
      }));
    }
  };

  const removeFile = (field) => {
    setDocuments((prev) => ({
      ...prev,
      [field]: null,
    }));
    
    // Reset the file input
    const fileInput = document.getElementById(field);
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!documents.profile_picture || !documents.cnic_front || !documents.cnic_back) {
      return;
    }
    
    const formData = new FormData();
    
    // Append user_id if available
    if (user && user.id) {
      formData.append("user_id", user.id);
    }
    
    // Append files
    if (documents.profile_picture && documents.profile_picture.file) {
      formData.append("profile_picture", documents.profile_picture.file);
    }
    
    if (documents.cnic_front && documents.cnic_front.file) {
      formData.append("cnic_front", documents.cnic_front.file);
    }
    
    if (documents.cnic_back && documents.cnic_back.file) {
      formData.append("cnic_back", documents.cnic_back.file);
    }
    
    dispatch(submitVerification(formData));
  };

  // Helper to check if all documents are uploaded
  const isFormComplete = () => {
    return documents.profile_picture && documents.cnic_front && documents.cnic_back;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Verification</CardTitle>
        <CardDescription>
          Submit your ID documents for verification to gain full access to the platform.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {userVerification && userVerification.status && (
          <div className="mb-6 p-4 rounded-md border">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-5 w-5 text-blue-500" />
              <h3 className="font-medium">Verification Status</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex h-2 w-2 rounded-full ${
                userVerification.status === 'approved' 
                  ? 'bg-green-500' 
                  : userVerification.status === 'rejected' 
                    ? 'bg-red-500' 
                    : 'bg-amber-500'
              }`}></span>
              <span className="capitalize font-medium">{userVerification.status}</span>
            </div>
            {userVerification.status === 'rejected' && (
              <p className="mt-2 text-sm text-red-500">
                Your verification was rejected. Please submit new documents.
              </p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="profile_picture" className="block mb-2">
                Profile Picture
              </Label>
              {documents.profile_picture ? (
                <div className="relative border rounded-md p-3 flex items-center">
                  <img 
                    src={documents.profile_picture.preview} 
                    alt="Profile preview" 
                    className="h-16 w-16 object-cover rounded-md mr-3" 
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{documents.profile_picture.name}</p>
                    <p className="text-xs text-gray-500">Uploaded successfully</p>
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeFile("profile_picture")}
                    disabled={formDisabled}
                    className="absolute top-2 right-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border border-dashed rounded-md p-8 text-center">
                  <Input
                    id="profile_picture"
                    type="file"
                    accept="image/*"
                    disabled={formDisabled}
                    onChange={(e) => handleFileChange("profile_picture", e)}
                    className="hidden"
                  />
                  <Label
                    htmlFor="profile_picture"
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm font-medium mb-1">
                      Upload your profile picture
                    </span>
                    <span className="text-xs text-gray-500">
                      Supports JPG, PNG (max 5MB)
                    </span>
                  </Label>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="cnic_front" className="block mb-2">
                ID Card / CNIC (Front)
              </Label>
              {documents.cnic_front ? (
                <div className="relative border rounded-md p-3 flex items-center">
                  <img 
                    src={documents.cnic_front.preview} 
                    alt="CNIC front preview" 
                    className="h-16 w-24 object-cover rounded-md mr-3" 
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{documents.cnic_front.name}</p>
                    <p className="text-xs text-gray-500">Uploaded successfully</p>
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeFile("cnic_front")}
                    disabled={formDisabled}
                    className="absolute top-2 right-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border border-dashed rounded-md p-8 text-center">
                  <Input
                    id="cnic_front"
                    type="file"
                    accept="image/*"
                    disabled={formDisabled}
                    onChange={(e) => handleFileChange("cnic_front", e)}
                    className="hidden"
                  />
                  <Label
                    htmlFor="cnic_front"
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm font-medium mb-1">
                      Upload ID Card front
                    </span>
                    <span className="text-xs text-gray-500">
                      Supports JPG, PNG (max 5MB)
                    </span>
                  </Label>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="cnic_back" className="block mb-2">
                ID Card / CNIC (Back)
              </Label>
              {documents.cnic_back ? (
                <div className="relative border rounded-md p-3 flex items-center">
                  <img 
                    src={documents.cnic_back.preview} 
                    alt="CNIC back preview" 
                    className="h-16 w-24 object-cover rounded-md mr-3" 
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{documents.cnic_back.name}</p>
                    <p className="text-xs text-gray-500">Uploaded successfully</p>
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeFile("cnic_back")}
                    disabled={formDisabled}
                    className="absolute top-2 right-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border border-dashed rounded-md p-8 text-center">
                  <Input
                    id="cnic_back"
                    type="file"
                    accept="image/*"
                    disabled={formDisabled}
                    onChange={(e) => handleFileChange("cnic_back", e)}
                    className="hidden"
                  />
                  <Label
                    htmlFor="cnic_back"
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm font-medium mb-1">
                      Upload ID Card back
                    </span>
                    <span className="text-xs text-gray-500">
                      Supports JPG, PNG (max 5MB)
                    </span>
                  </Label>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-md border">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
              <div className="text-sm">
                <h4 className="font-medium mb-1">Verification Process</h4>
                <p className="text-gray-600">
                  Your documents will be reviewed by our team within 24-48 hours. You'll be notified once your verification is complete.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={formDisabled || isLoading || !isFormComplete()}
            >
              {isLoading ? "Submitting..." : "Submit for Verification"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default VerificationForm;
