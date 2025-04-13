
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DataTable from "../../components/common/DataTable";
import UserCard from "../../components/common/UserCard";
import { useToast } from "@/hooks/use-toast";
import { usersData } from "../../data/mockData";
import { Filter, Plus, MoreHorizontal, UserCheck, UserX, Trash, PencilLine } from "lucide-react";

const UserManagement = () => {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState("grid");
  const [editUser, setEditUser] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("active");

  const filteredUsers = usersData.filter(
    (user) => (activeTab === "active" && user.status === "active") || 
             (activeTab === "inactive" && user.status === "inactive")
  );

  const handleEdit = (user) => {
    setEditUser(user);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (user) => {
    toast({
      title: "User Deleted",
      description: `${user.name} has been deleted successfully.`,
    });
  };

  const handleActivate = (user) => {
    toast({
      title: "User Activated",
      description: `${user.name} has been activated successfully.`,
    });
  };

  const handleDeactivate = (user) => {
    toast({
      title: "User Deactivated",
      description: `${user.name} has been deactivated successfully.`,
    });
  };

  const columns = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "joinDate",
      header: "Join Date",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className="flex items-center">
          <span
            className={`h-2 w-2 rounded-full mr-2 ${
              row.getValue("status") === "active" ? "bg-green-500" : "bg-gray-500"
            }`}
          />
          <span className="capitalize">{row.getValue("status")}</span>
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(user)}>
                <PencilLine className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              {user.status === "active" ? (
                <DropdownMenuItem onClick={() => handleDeactivate(user)}>
                  <UserX className="mr-2 h-4 w-4" />
                  Deactivate
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => handleActivate(user)}>
                  <UserCheck className="mr-2 h-4 w-4" />
                  Activate
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                className="text-red-500 focus:text-red-500"
                onClick={() => handleDelete(user)}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-gray-500">Manage users of the barter exchange platform.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <Tabs
          defaultValue="active"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full sm:w-auto"
        >
          <TabsList>
            <TabsTrigger value="active">Active Users</TabsTrigger>
            <TabsTrigger value="inactive">Inactive Users</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            Grid
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("table")}
          >
            Table
          </Button>
          <Button className="ml-auto" size="sm" asChild>
            <a href="/admin/users/create">
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </a>
          </Button>
        </div>
      </div>

      <div>
        {viewMode === "grid" ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onActivate={handleActivate}
                onDeactivate={handleDeactivate}
              />
            ))}
            {filteredUsers.length === 0 && (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No users found.</p>
              </div>
            )}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6">
              <DataTable columns={columns} data={filteredUsers} />
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and settings.
            </DialogDescription>
          </DialogHeader>
          {editUser && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  defaultValue={editUser.name}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  defaultValue={editUser.email}
                  type="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  defaultValue={editUser.role}
                  disabled
                />
              </div>
            </div>
          )}
          <DialogFooter className="sm:justify-between">
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast({
                  title: "User Updated",
                  description: "User information has been updated successfully.",
                });
                setIsEditDialogOpen(false);
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
