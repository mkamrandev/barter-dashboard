
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Filter, Plus, MoreHorizontal, UserCheck, UserX, Trash, PencilLine, Loader2 } from "lucide-react";
import {
  getAllUsers,
  getInactiveUsers,
  updateUser,
  deleteUser,
  permanentlyDeleteUser,
  restoreUser,
} from "../../redux/slices/userSlice";

const UserManagement = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState("grid");
  const [editUser, setEditUser] = useState(null);
  const [editUserForm, setEditUserForm] = useState({
    name: "",
    email: "",
  });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("active");

  const { users, inactiveUsers, isLoading } = useSelector((state) => state.users);

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
    setEditUserForm({
      name: user.name,
      email: user.email,
    });
    setIsEditDialogOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditUserForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveEdit = () => {
    dispatch(updateUser({
      id: editUser.id,
      ...editUserForm
    })).then(() => {
      setIsEditDialogOpen(false);
    });
  };

  const handleDelete = (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      dispatch(deleteUser(user.id));
    }
  };

  const handlePermanentDelete = (user) => {
    if (window.confirm(`Are you sure you want to PERMANENTLY delete ${user.name}? This action cannot be undone.`)) {
      dispatch(permanentlyDeleteUser(user.id));
    }
  };

  const handleActivate = (user) => {
    if (window.confirm(`Are you sure you want to restore ${user.name}?`)) {
      dispatch(restoreUser(user.id));
    }
  };

  const handleDeactivate = (user) => {
    if (window.confirm(`Are you sure you want to deactivate ${user.name}?`)) {
      dispatch(deleteUser(user.id));
    }
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
                    onClick={() => handlePermanentDelete(user)}
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

  // Get the right data based on active tab
  const displayedUsers = activeTab === "active" ? users : inactiveUsers;

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
                    onDelete={activeTab === "active" ? handleDelete : handlePermanentDelete}
                    onActivate={handleActivate}
                    onDeactivate={handleDeactivate}
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
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={editUserForm.name}
                  onChange={handleEditChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  value={editUserForm.email}
                  onChange={handleEditChange}
                  type="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={editUser.role}
                  disabled
                />
              </div>
            </div>
          )}
          <DialogFooter className="sm:justify-between">
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
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
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
