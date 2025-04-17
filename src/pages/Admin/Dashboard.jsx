
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, UserCog, ShoppingBag, BarChart3, Users2 } from "lucide-react";
import { usersData, subadminsData } from "../../data/mockData";
import ItemCard from "../../components/items/ItemCard";

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-gray-500">
          Welcome to your admin dashboard. Manage users, subadmins, and items.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usersData.length}</div>
            <p className="text-xs text-muted-foreground">
              +20% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subadmins</CardTitle>
            <UserCog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subadminsData.length}</div>
            <p className="text-xs text-muted-foreground">
              +5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Items</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">358</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful Barters</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground">
              +18% from last month
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
          <TabsTrigger value="subadmins" className="flex items-center">
            <UserCog className="mr-2 h-4 w-4" />
            Subadmins
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center">
            <BarChart3 className="mr-2 h-4 w-4" />
            Activity
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
        <TabsContent value="subadmins" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Subadmins</CardTitle>
              <CardDescription>
                Recently added subadmins to the platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subadminsData.slice(0, 5).map((subadmin) => (
                  <div key={subadmin.id} className="flex items-center">
                    <div className="w-9 h-9 rounded-full bg-purple-100 mr-3 flex items-center justify-center">
                      <UserCog className="h-5 w-5 text-purple-700" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm font-medium">{subadmin.name}</p>
                          <p className="text-xs text-gray-500">{subadmin.email}</p>
                        </div>
                        <div className="text-xs text-gray-500">
                          {subadmin.joinDate}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest activity on the platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Mock activity feed */}
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-9 h-9 rounded-full bg-green-100 mr-3 flex items-center justify-center">
                      <ShoppingBag className="h-5 w-5 text-green-700" />
                    </div>
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">John Doe</span> added new item for barter: <span className="font-medium">Vintage Camera</span>
                      </p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-9 h-9 rounded-full bg-blue-100 mr-3 flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-700" />
                    </div>
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">Jane Smith</span> registered as a new user
                      </p>
                      <p className="text-xs text-gray-500">5 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-9 h-9 rounded-full bg-amber-100 mr-3 flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-amber-700" />
                    </div>
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">Alex Wilson</span> and <span className="font-medium">Sam Taylor</span> completed a barter exchange
                      </p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
