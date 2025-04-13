
import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { getItems, filterUserItems } from '@/redux/slices/itemSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, BarChart3, FileText, Plus, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ItemCard from "@/components/items/ItemCard";

const UserDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items, userItems } = useSelector((state) => state.items);
  
  // Mock data for user verification
  const verificationStatus = "pending"; // could be 'pending', 'verified', 'rejected'
  
  useEffect(() => {
    dispatch(getItems());
  }, [dispatch]);
  
  useEffect(() => {
    if (user) {
      dispatch(filterUserItems(user.id));
    }
  }, [dispatch, user, items]);
  
  // Get only 3 recent items for the dashboard display
  const recentItems = [...userItems].sort((a, b) => {
    return new Date(b.created_at) - new Date(a.created_at);
  }).slice(0, 3);

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
              {userItems.filter(item => item.status === "available").length} active items
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
            <CardHeader className="flex justify-between items-center">
              <div>
                <CardTitle>Recent Items</CardTitle>
                <CardDescription>
                  Your recently added items for barter.
                </CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link to="/user/items">View All Items</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {recentItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recentItems.map((item) => (
                    <ItemCard 
                      key={item.id} 
                      item={item}
                      onView={() => {}} // Dashboard view doesn't need detailed view
                    />
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
