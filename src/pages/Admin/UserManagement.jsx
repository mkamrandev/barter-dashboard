
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import DataTable from "../../components/common/DataTable";
import UserCard from "../../components/common/UserCard";
import { toast } from "sonner";
import { Plus, MoreHorizontal, UserCheck, UserX, Trash, PencilLine, Loader2, Grid, List } from "lucide-react";
import {
  getAllUsers,
  getInactiveUsers,
  updateUser,
  deleteUser,
  permanentlyDeleteUser,
  restoreUser,
} from "../../redux/slices/userSlice";
import { useForm } from "react-hook-form";

const UserManagement = () => {
  const dispatch = useDispatch();
  const [viewMode, setViewMode] = useState("grid");
  const [editUser, setEditUser] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("active");

  const { users, inactiveUsers, isLoading } = useSelector((state) => state.users);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
    }
  });

  // Fetch users on component mount
  useEffect(() => {
    if (activeTab === "active") {
      dispatch(getAllUsers());
    } else {
      dispatch(getInactiveUsers());
    }
  }, [dispatch, activeTab]);

  // Update tab content when switching tabs
  const handleTabChange = (value) => {
    setActiveTab(value);
    if (value === "active") {
      dispatch(getAllUsers());
    } else {
      dispatch(getInactiveUsers());
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    form.reset({
      name: user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim(),
      email: user.email,
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = (data) => {
    dispatch(updateUser({
      id: editUser.id,
      ...data
    }))
      .unwrap()
      .then(() => {
        setIsEditDialogOpen(false);
        form.reset();
        toast.success("User updated successfully");
      })
      .catch((error) => {
        toast.error("Failed to update user: " + (error?.message || "Unknown error"));
      });
  };

  const handleDelete = (user) => {
    if (activeTab === "active") {
      dispatch(deleteUser(user.id))
        .unwrap()
        .then(() => {
          toast.success("User deactivated successfully");
        })
        .catch((error) => {
          toast.error("Failed to deactivate user: " + error);
        });
    } else {
      dispatch(permanentlyDeleteUser(user.id))
        .unwrap()
        .then(() => {
          toast.success("User permanently deleted");
        })
        .catch((error) => {
          toast.error("Failed to delete user: " + error);
        });
    }
  };

  const handleActivate = (user) => {
    dispatch(restoreUser(user.id))
      .unwrap()
      .then(() => {
        toast.success("User restored successfully");
      })
      .catch((error) => {
        toast.error("Failed to restore user: " + error);
      });
  };

  const handleDeactivate = (user) => {
    dispatch(deleteUser(user.id))
      .unwrap()
      .then(() => {
        toast.success("User deactivated successfully");
      })
      .catch((error) => {
        toast.error("Failed to deactivate user: " + error);
      });
  };

  const columns = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div className="font-medium">{row.getValue("name") || `${row.original.first_name || ''} ${row.original.last_name || ''}`.trim() || 'Unknown'}</div>,
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "created_at",
      header: "Join Date",
      cell: ({ row }) => <div>{row.original.created_at ? new Date(row.original.created_at).toLocaleDateString() : "Unknown"}</div>,
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
          <span className="capitalize">{row.getValue("status") || "active"}</span>
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
              {activeTab === "active" ? (
                <DropdownMenuItem onClick={() => handleDeactivate(user)}>
                  <UserX className="mr-2 h-4 w-4" />
                  Deactivate
                </DropdownMenuItem>
              ) : (
                <>
                  <DropdownMenuItem onClick={() => handleActivate(user)}>
                    <UserCheck className="mr-2 h-4 w-4" />
                    Restore
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-red-500 focus:text-red-500"
                    onClick={() => handleDelete(user)}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Permanently Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // Get the right data based on active tab and ensure it's an array
  const displayedUsers = activeTab === "active" ? 
    (Array.isArray(users) ? users : []) : 
    (Array.isArray(inactiveUsers) ? inactiveUsers : []);

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
          onValueChange={handleTabChange}
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
            <Grid className="h-4 w-4 mr-1" />
            Grid
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("table")}
          >
            <List className="h-4 w-4 mr-1" />
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

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div>
          {viewMode === "grid" ? (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {displayedUsers && displayedUsers.length > 0 ? (
                displayedUsers.map((user) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onActivate={handleActivate}
                    onDeactivate={handleDeactivate}
                    isPermanentDelete={activeTab === "inactive"}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">No users found.</p>
                </div>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6">
                <DataTable columns={columns} data={displayedUsers || []} />
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and settings.
            </DialogDescription>
          </DialogHeader>
          {editUser && (
            <Form {...form} onSubmit={form.handleSubmit(handleSaveEdit)}>
              <div className="space-y-4 py-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-2">
                  <FormLabel>Role</FormLabel>
                  <Input
                    value={editUser.role || 'user'}
                    disabled
                  />
                </div>
              </div>
              <DialogFooter className="mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                  type="button"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
