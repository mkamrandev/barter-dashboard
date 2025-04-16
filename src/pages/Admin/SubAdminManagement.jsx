
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import DataTable from "../../components/common/DataTable";
import UserCard from "../../components/common/UserCard";
import { toast } from "sonner";
import { Plus, Mail, Key, Loader2, Grid, List } from "lucide-react";
import {
  createSubadmin,
  getAllSubadmins,
  getInactiveSubadmins,
  deleteSubadmin,
  permanentlyDeleteSubadmin,
  restoreSubadmin,
} from "../../redux/slices/subadminSlice";
import { useForm } from "react-hook-form";

const SubAdminManagement = () => {
  const dispatch = useDispatch();
  const [viewMode, setViewMode] = useState("grid");
  const [activeTab, setActiveTab] = useState("active");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { subadmins, inactiveSubadmins, isLoading } = useSelector((state) => state.subadmins);

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      permissions: "view_only",
    }
  });

  // Fetch subadmins on component mount
  useEffect(() => {
    if (activeTab === "active") {
      dispatch(getAllSubadmins());
    } else {
      dispatch(getInactiveSubadmins());
    }
  }, [dispatch, activeTab]);

  // Update tab content when switching tabs
  const handleTabChange = (value) => {
    setActiveTab(value);
    if (value === "active") {
      dispatch(getAllSubadmins());
    } else {
      dispatch(getInactiveSubadmins());
    }
  };

  const handleEdit = (subadmin) => {
    toast({
      title: "Edit Subadmin",
      description: `Editing ${subadmin.name || `${subadmin.first_name} ${subadmin.last_name}`}'s information.`,
    });
    // In a real app, you would open a modal and implement edit functionality
  };

  const handleDelete = (subadmin) => {
    if (activeTab === "active") {
      dispatch(deleteSubadmin(subadmin.id))
        .unwrap()
        .then(() => {
          toast.success("Subadmin deactivated successfully");
        })
        .catch((error) => {
          toast.error("Failed to deactivate subadmin: " + error);
        });
    } else {
      dispatch(permanentlyDeleteSubadmin(subadmin.id))
        .unwrap()
        .then(() => {
          toast.success("Subadmin permanently deleted");
        })
        .catch((error) => {
          toast.error("Failed to delete subadmin: " + error);
        });
    }
  };

  const handleActivate = (subadmin) => {
    dispatch(restoreSubadmin(subadmin.id))
      .unwrap()
      .then(() => {
        toast.success("Subadmin restored successfully");
      })
      .catch((error) => {
        toast.error("Failed to restore subadmin: " + error);
      });
  };

  const handleDeactivate = (subadmin) => {
    dispatch(deleteSubadmin(subadmin.id))
      .unwrap()
      .then(() => {
        toast.success("Subadmin deactivated successfully");
      })
      .catch((error) => {
        toast.error("Failed to deactivate subadmin: " + error);
      });
  };

  const handleAddSubadmin = (data) => {
    // Basic validation
    if (data.password !== data.confirmPassword) {
      form.setError("confirmPassword", { 
        type: "validate", 
        message: "Passwords don't match" 
      });
      return;
    }

    const subadminToAdd = {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      username: data.username,
      password: data.password,
      confirmPassword: data.confirmPassword,
      permissions: data.permissions,
      role: "subadmin" // Ensure role is set
    };

    dispatch(createSubadmin(subadminToAdd))
      .unwrap()
      .then(() => {
        setIsAddDialogOpen(false);
        form.reset();
        toast.success("Subadmin created successfully");
      })
      .catch((error) => {
        toast.error("Failed to create subadmin: " + (error?.message || "Unknown error"));
      });
  };

  const columns = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const name = row.getValue("name") || 
          `${row.original.first_name || ''} ${row.original.last_name || ''}`.trim();
        return <div className="font-medium">{name || "Unknown"}</div>;
      },
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "permissions",
      header: "Permissions",
      cell: ({ row }) => (
        <div className="capitalize">
          {row.original.permissions || "View Only"}
        </div>
      ),
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
          <span className="capitalize">{row.getValue("status") || "Unknown"}</span>
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const subadmin = row.original;
        return (
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => handleEdit(subadmin)}>
              Edit
            </Button>
            {activeTab === "active" ? (
              <Button variant="outline" size="sm" onClick={() => handleDeactivate(subadmin)}>
                Deactivate
              </Button>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={() => handleActivate(subadmin)}>
                  Restore
                </Button>
                <Button variant="outline" size="sm" className="text-red-500" onClick={() => handleDelete(subadmin)}>
                  Delete
                </Button>
              </>
            )}
          </div>
        );
      },
    },
  ];

  // Get the right data based on active tab
  const displayedSubadmins = activeTab === "active" ? 
    (Array.isArray(subadmins) ? subadmins : []) : 
    (Array.isArray(inactiveSubadmins) ? inactiveSubadmins : []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Subadmin Management</h1>
        <p className="text-gray-500">Manage subadmins of the barter exchange platform.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <Tabs
          defaultValue="active"
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full sm:w-auto"
        >
          <TabsList>
            <TabsTrigger value="active">Active Subadmins</TabsTrigger>
            <TabsTrigger value="inactive">Inactive Subadmins</TabsTrigger>
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
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="ml-auto" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Subadmin
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Subadmin</DialogTitle>
                <DialogDescription>
                  Create a new subadmin account with specific permissions.
                </DialogDescription>
              </DialogHeader>
              <Form {...form} onSubmit={form.handleSubmit(handleAddSubadmin)}>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="John" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Doe" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="johndoe" />
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
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-2 text-gray-500" />
                            <Input {...field} type="email" placeholder="john.doe@example.com" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="permissions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Permissions</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select permissions" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="view_only">View Only</SelectItem>
                            <SelectItem value="manage_users">Manage Users</SelectItem>
                            <SelectItem value="manage_items">Manage Items</SelectItem>
                            <SelectItem value="full_access">Full Access</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <Key className="w-4 h-4 mr-2 text-gray-500" />
                            <Input {...field} type="password" placeholder="••••••••" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <Key className="w-4 h-4 mr-2 text-gray-500" />
                            <Input {...field} type="password" placeholder="••••••••" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} type="button">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      'Add Subadmin'
                    )}
                  </Button>
                </DialogFooter>
              </Form>
            </DialogContent>
          </Dialog>
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
              {displayedSubadmins && displayedSubadmins.length > 0 ? (
                displayedSubadmins.map((subadmin) => (
                  <UserCard
                    key={subadmin.id}
                    user={subadmin}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onActivate={handleActivate}
                    onDeactivate={handleDeactivate}
                    isPermanentDelete={activeTab === "inactive"}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">No subadmins found.</p>
                </div>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6">
                <DataTable columns={columns} data={displayedSubadmins || []} />
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default SubAdminManagement;
