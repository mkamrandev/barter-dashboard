
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, ShoppingBag, BarChart3, Users2, Bookmark } from "lucide-react";
import { usersData } from "../../data/mockData";

const SubAdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Subadmin Dashboard</h1>
        <p className="text-gray-500">
          Welcome to your subadmin dashboard. Monitor users and items.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {usersData.filter(user => user.status === "active").length}
            </div>
            <p className="text-xs text-muted-foreground">
              +10% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Items</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">285</div>
            <p className="text-xs text-muted-foreground">
              +8% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Bookmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              +2 new categories
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="items" className="flex items-center">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Items
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center">
            <Bookmark className="mr-2 h-4 w-4" />
            Categories
          </TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
              <CardDescription>
                Recently registered users on the platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {usersData.slice(0, 5).map((user) => (
                  <div key={user.id} className="flex items-center">
                    <div className="w-9 h-9 rounded-full bg-blue-100 mr-3 flex items-center justify-center">
                      <Users2 className="h-5 w-5 text-blue-700" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.joinDate}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="items" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Items</CardTitle>
              <CardDescription>
                Recently added items on the platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Mock items list */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-9 h-9 rounded-full bg-amber-100 mr-3 flex items-center justify-center">
                      <ShoppingBag className="h-5 w-5 text-amber-700" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm font-medium">Vintage Camera</p>
                          <p className="text-xs text-gray-500">Electronics</p>
                        </div>
                        <div className="text-xs text-gray-500">
                          2 hours ago
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-9 h-9 rounded-full bg-amber-100 mr-3 flex items-center justify-center">
                      <ShoppingBag className="h-5 w-5 text-amber-700" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm font-medium">Antique Table</p>
                          <p className="text-xs text-gray-500">Furniture</p>
                        </div>
                        <div className="text-xs text-gray-500">
                          5 hours ago
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
              <CardDescription>
                Available item categories on the platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {["Electronics", "Furniture", "Collectibles", "Clothing", "Books", "Art", "Gadgets", "Sports", "Home"].map((category) => (
                  <div key={category} className="rounded-lg bg-gray-100 p-3 text-center">
                    <p className="text-sm font-medium">{category}</p>
                    <p className="text-xs text-gray-500">42 items</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SubAdminDashboard;
