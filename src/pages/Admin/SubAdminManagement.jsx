
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DataTable from "../../components/common/DataTable";
import UserCard from "../../components/common/UserCard";
import { useToast } from "@/hooks/use-toast";
import { Plus, Mail, Key, Loader2 } from "lucide-react";
import {
  createSubadmin,
  getAllSubadmins,
  getInactiveSubadmins,
  deleteSubadmin,
  permanentlyDeleteSubadmin,
  restoreSubadmin,
} from "../../redux/slices/subadminSlice";

const SubAdminManagement = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState("grid");
  const [activeTab, setActiveTab] = useState("active");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSubadminData, setNewSubadminData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    permissions: "view_only",
  });

  const { subadmins, inactiveSubadmins, isLoading } = useSelector((state) => state.subadmins);

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
      description: `Editing ${subadmin.name}'s information.`,
    });
    // In a real app, you would open a modal and implement edit functionality
  };

  const handleDelete = (subadmin) => {
    if (window.confirm(`Are you sure you want to delete ${subadmin.name}?`)) {
      dispatch(deleteSubadmin(subadmin.id));
    }
  };

  const handlePermanentDelete = (subadmin) => {
    if (window.confirm(`Are you sure you want to PERMANENTLY delete ${subadmin.name}? This action cannot be undone.`)) {
      dispatch(permanentlyDeleteSubadmin(subadmin.id));
    }
  };

  const handleActivate = (subadmin) => {
    if (window.confirm(`Are you sure you want to restore ${subadmin.name}?`)) {
      dispatch(restoreSubadmin(subadmin.id));
    }
  };

  const handleDeactivate = (subadmin) => {
    if (window.confirm(`Are you sure you want to deactivate ${subadmin.name}?`)) {
      dispatch(deleteSubadmin(subadmin.id));
    }
  };

  const handleAddSubadmin = () => {
    // Basic validation
    if (!newSubadminData.firstName || !newSubadminData.lastName || !newSubadminData.email || 
        !newSubadminData.username || !newSubadminData.password || !newSubadminData.confirmPassword) {
      toast.error("Please fill all required fields");
      return;
    }

    if (newSubadminData.password !== newSubadminData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    const subadminToAdd = {
      first_name: newSubadminData.firstName,
      last_name: newSubadminData.lastName,
      email: newSubadminData.email,
      username: newSubadminData.username,
      password: newSubadminData.password,
      password_confirmation: newSubadminData.confirmPassword,
      permissions: newSubadminData.permissions,
    };

    dispatch(createSubadmin(subadminToAdd))
      .unwrap()
      .then(() => {
        setIsAddDialogOpen(false);
        setNewSubadminData({
          firstName: "",
          lastName: "",
          email: "",
          username: "",
          password: "",
          confirmPassword: "",
          permissions: "view_only",
        });
      })
      .catch((error) => {
        // Toast will be handled in the thunk
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSubadminData(prev => ({
      ...prev,
      [name]: value
    }));
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
      accessorKey: "permissions",
      header: "Permissions",
      cell: ({ row }) => (
        <div className="capitalize">
          {row.original.permissions || "View Only"}
        </div>
      ),
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
                <Button variant="outline" size="sm" className="text-red-500" onClick={() => handlePermanentDelete(subadmin)}>
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
  const displayedSubadmins = activeTab === "active" ? subadmins : inactiveSubadmins;

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
            Grid
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("table")}
          >
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
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={newSubadminData.firstName}
                      onChange={handleInputChange}
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={newSubadminData.lastName}
                      onChange={handleInputChange}
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    value={newSubadminData.username}
                    onChange={handleInputChange}
                    placeholder="johndoe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-500" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={newSubadminData.email}
                      onChange={handleInputChange}
                      placeholder="john.doe@example.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="permissions">Permissions</Label>
                  <Select
                    name="permissions"
                    value={newSubadminData.permissions}
                    onValueChange={(value) => 
                      setNewSubadminData(prev => ({ ...prev, permissions: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select permissions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="view_only">View Only</SelectItem>
                      <SelectItem value="manage_users">Manage Users</SelectItem>
                      <SelectItem value="manage_items">Manage Items</SelectItem>
                      <SelectItem value="full_access">Full Access</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="flex items-center">
                    <Key className="w-4 h-4 mr-2 text-gray-500" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={newSubadminData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="flex items-center">
                    <Key className="w-4 h-4 mr-2 text-gray-500" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={newSubadminData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddSubadmin} disabled={isLoading}>
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
                    onDelete={activeTab === "active" ? handleDelete : handlePermanentDelete}
                    onActivate={handleActivate}
                    onDeactivate={handleDeactivate}
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
