
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Edit, Trash, UserCheck, UserX, Mail } from "lucide-react";

const UserCard = ({ user, onEdit, onDelete, onActivate, onDeactivate, isPermanentDelete = false }) => {
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  const isActive = user.status === "active";
  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2 relative">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(user)}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            {isActive ? (
              <DropdownMenuItem onClick={() => onDeactivate(user)}>
                <UserX className="mr-2 h-4 w-4" />
                <span>Deactivate</span>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => onActivate(user)}>
                <UserCheck className="mr-2 h-4 w-4" />
                <span>Activate</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-500 focus:text-red-500"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash className="mr-2 h-4 w-4" />
              <span>{isPermanentDelete ? "Permanently Delete" : "Delete"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex flex-col items-center">
          <Avatar className="h-20 w-20 mb-2">
            <AvatarImage src={user.profile_picture || user.avatar} alt={user.name || `${user.first_name} ${user.last_name}`} />
            <AvatarFallback>{getInitials(user.name || `${user.first_name} ${user.last_name}`)}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h3 className="text-lg font-semibold">{user.name || `${user.first_name} ${user.last_name}`}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 pb-2 text-center">
        <div className="flex justify-center space-x-2 mb-2">
          <Badge
            variant={isActive ? "default" : "secondary"}
            className={
              isActive ? "bg-green-500" : "bg-gray-500"
            }
          >
            {isActive ? "Active" : "Inactive"}
          </Badge>
          <Badge variant="outline">{user.role}</Badge>
          {user.permissions && (
            <Badge variant="outline" className="bg-blue-50">{user.permissions}</Badge>
          )}
        </div>
        <div className="text-sm text-gray-500">
          <p>Last login: {user.last_login || "Never"}</p>
          <p>Joined: {user.created_at || "Unknown"}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center space-x-2 pt-0">
        <Button variant="outline" size="sm" onClick={() => onEdit(user)}>
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <Button 
          variant={isActive ? "outline" : "default"} 
          size="sm"
          onClick={() => isActive ? onDeactivate(user) : onActivate(user)}
        >
          {isActive ? (
            <>
              <UserX className="h-4 w-4 mr-1" />
              Deactivate
            </>
          ) : (
            <>
              <UserCheck className="h-4 w-4 mr-1" />
              Activate
            </>
          )}
        </Button>
      </CardFooter>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {isPermanentDelete 
                ? "This action cannot be undone. This will permanently delete the account and remove the data from our servers." 
                : "This will deactivate the account. You can restore it later."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => {
                onDelete(user);
                setShowDeleteDialog(false);
              }}
            >
              {isPermanentDelete ? "Permanently Delete" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default UserCard;
