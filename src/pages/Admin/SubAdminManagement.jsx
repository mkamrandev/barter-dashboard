
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { subadminsData } from "../../data/mockData";
import { Plus, Mail, Key } from "lucide-react";

const SubAdminManagement = () => {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState("grid");
  const [activeTab, setActiveTab] = useState("active");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSubadminData, setNewSubadminData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    permissions: "view_only",
  });

  const filteredSubadmins = subadminsData.filter(
    (subadmin) => (activeTab === "active" && subadmin.status === "active") || 
                  (activeTab === "inactive" && subadmin.status === "inactive")
  );

  const handleEdit = (subadmin) => {
    toast({
      title: "Edit Subadmin",
      description: `Editing ${subadmin.name}'s information.`,
    });
  };

  const handleDelete = (subadmin) => {
    toast({
      title: "Subadmin Deleted",
      description: `${subadmin.name} has been deleted successfully.`,
    });
  };

  const handleActivate = (subadmin) => {
    toast({
      title: "Subadmin Activated",
      description: `${subadmin.name} has been activated successfully.`,
    });
  };

  const handleDeactivate = (subadmin) => {
    toast({
      title: "Subadmin Deactivated",
      description: `${subadmin.name} has been deactivated successfully.`,
    });
  };

  const handleAddSubadmin = () => {
    const fullName = `${newSubadminData.firstName} ${newSubadminData.lastName}`;
    toast({
      title: "Subadmin Added",
      description: `${fullName} has been added as a subadmin.`,
    });
    setIsAddDialogOpen(false);
    setNewSubadminData({
      firstName: "",
      lastName: "",
      email: "",
      permissions: "view_only",
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
            {subadmin.status === "active" ? (
              <Button variant="outline" size="sm" onClick={() => handleDeactivate(subadmin)}>
                Deactivate
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={() => handleActivate(subadmin)}>
                Activate
              </Button>
            )}
          </div>
        );
      },
    },
  ];

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
          onValueChange={setActiveTab}
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
                  <Label htmlFor="password">Temporary Password</Label>
                  <div className="flex items-center">
                    <Key className="w-4 h-4 mr-2 text-gray-500" />
                    <Input
                      id="password"
                      type="text"
                      value="tempPassword123"
                      readOnly
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    A temporary password will be generated and sent to the subadmin's email.
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddSubadmin}>Add Subadmin</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div>
        {viewMode === "grid" ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredSubadmins.map((subadmin) => (
              <UserCard
                key={subadmin.id}
                user={subadmin}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onActivate={handleActivate}
                onDeactivate={handleDeactivate}
              />
            ))}
            {filteredSubadmins.length === 0 && (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No subadmins found.</p>
              </div>
            )}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6">
              <DataTable columns={columns} data={filteredSubadmins} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SubAdminManagement;
