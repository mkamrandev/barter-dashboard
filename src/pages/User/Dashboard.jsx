
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, BarChart3, FileText, Plus, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const UserDashboard = () => {
  // Mock data for user items
  const userItems = [
    {
      id: 1,
      name: "Vintage Camera",
      category: "Electronics",
      status: "active",
      dateAdded: "2023-03-15",
    },
    {
      id: 2,
      name: "Antique Table",
      category: "Furniture",
      status: "pending",
      dateAdded: "2023-03-10",
    },
  ];

  // Mock data for user verification
  const verificationStatus = "pending"; // could be 'pending', 'verified', 'rejected'

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">My Dashboard</h1>
        <p className="text-gray-500">
          Welcome to your dashboard. Manage your items and verification status.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Items</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userItems.length}</div>
            <p className="text-xs text-muted-foreground">
              {userItems.filter(item => item.status === "active").length} active items
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful Barters</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Last barter: 2 weeks ago
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verification Status</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge
                className={
                  verificationStatus === "verified"
                    ? "bg-green-500"
                    : verificationStatus === "pending"
                    ? "bg-amber-500"
                    : "bg-red-500"
                }
              >
                {verificationStatus === "verified"
                  ? "Verified"
                  : verificationStatus === "pending"
                  ? "Pending"
                  : "Rejected"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {verificationStatus === "verified"
                ? "Your account is fully verified"
                : verificationStatus === "pending"
                ? "Verification in progress"
                : "Please resubmit documents"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <Button className="flex items-center" asChild>
          <Link to="/user/items/new">
            <Plus className="mr-2 h-4 w-4" /> Add New Item
          </Link>
        </Button>
        {verificationStatus !== "verified" && (
          <Button variant="outline" className="flex items-center" asChild>
            <Link to="/user/verification">
              <FileText className="mr-2 h-4 w-4" /> Complete Verification
            </Link>
          </Button>
        )}
      </div>

      <Tabs defaultValue="items" className="space-y-4">
        <TabsList>
          <TabsTrigger value="items" className="flex items-center">
            <ShoppingBag className="mr-2 h-4 w-4" />
            My Items
          </TabsTrigger>
          <TabsTrigger value="verification" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Verification
          </TabsTrigger>
        </TabsList>
        <TabsContent value="items" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Items</CardTitle>
              <CardDescription>
                Items you've added for barter.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userItems.length > 0 ? (
                <div className="space-y-4">
                  {userItems.map((item) => (
                    <div key={item.id} className="flex items-center">
                      <div className="w-12 h-12 rounded-md bg-gray-100 mr-3 flex items-center justify-center">
                        <ShoppingBag className="h-6 w-6 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-gray-500">{item.category}</p>
                          </div>
                          <div className="flex items-center">
                            <Badge
                              variant="outline"
                              className={
                                item.status === "active"
                                  ? "text-green-500 border-green-500"
                                  : "text-amber-500 border-amber-500"
                              }
                            >
                              {item.status}
                            </Badge>
                            <Button variant="ghost" size="icon" asChild>
                              <Link to={`/user/items/${item.id}`}>
                                <ArrowRight className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-4">You haven't added any items yet.</p>
                  <Button asChild>
                    <Link to="/user/items/new">
                      <Plus className="mr-2 h-4 w-4" /> Add Your First Item
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="verification" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Verification Status</CardTitle>
              <CardDescription>
                Your account verification status and documents.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                  <h3 className="font-medium mb-2">Account Verification</h3>
                  <div className="flex items-center mb-3">
                    <Badge
                      className={
                        verificationStatus === "verified"
                          ? "bg-green-500"
                          : verificationStatus === "pending"
                          ? "bg-amber-500"
                          : "bg-red-500"
                      }
                    >
                      {verificationStatus === "verified"
                        ? "Verified"
                        : verificationStatus === "pending"
                        ? "Pending"
                        : "Rejected"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {verificationStatus === "verified"
                      ? "Your account is fully verified. You can now use all features of the platform."
                      : verificationStatus === "pending"
                      ? "Your verification is being processed. This usually takes 1-2 business days."
                      : "Your verification was rejected. Please submit correct documents."}
                  </p>
                  {verificationStatus !== "verified" && (
                    <Button variant="outline" asChild>
                      <Link to="/user/verification">
                        {verificationStatus === "pending"
                          ? "Check Status"
                          : "Resubmit Documents"}
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDashboard;
