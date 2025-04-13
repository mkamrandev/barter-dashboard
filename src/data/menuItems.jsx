
import {
  Home,
  Users,
  UserCog,
  ShoppingBag,
  Settings,
  Bell,
  Layers,
  FileCheck,
  PlusCircle,
  BarChart3,
  User,
  Tag,
  Bookmark,
} from "lucide-react";

// Admin Menu Items
export const adminMenuItems = [
  {
    title: "Dashboard",
    path: "/admin/dashboard",
    icon: Home,
  },
  {
    type: "group",
    title: "Management",
    children: [
      {
        title: "User Management",
        path: "/admin/users",
        icon: Users,
      },
      {
        title: "Subadmin Management",
        path: "/admin/subadmins",
        icon: UserCog,
      },
      {
        title: "Item Management",
        path: "/admin/items",
        icon: ShoppingBag,
      },
      {
        title: "Categories",
        path: "/admin/categories",
        icon: Tag,
      },
    ],
  },
  {
    type: "group",
    title: "System",
    children: [
      {
        title: "Settings",
        path: "/admin/settings",
        icon: Settings,
      },
      {
        title: "Reports",
        path: "/admin/reports",
        icon: BarChart3,
      },
    ],
  },
];

// Subadmin Menu Items
export const subadminMenuItems = [
  {
    title: "Dashboard",
    path: "/subadmin/dashboard",
    icon: Home,
  },
  {
    type: "group",
    title: "Management",
    children: [
      {
        title: "User Management",
        path: "/subadmin/users",
        icon: Users,
      },
      {
        title: "Categories",
        path: "/subadmin/categories",
        icon: Tag,
      },
      {
        title: "Items",
        path: "/subadmin/items",
        icon: ShoppingBag,
      },
    ],
  },
  {
    title: "Notifications",
    path: "/subadmin/notifications",
    icon: Bell,
  },
];

// User Menu Items
export const userMenuItems = [
  {
    title: "Dashboard",
    path: "/user/dashboard",
    icon: Home,
  },
  {
    type: "group",
    title: "Barter",
    children: [
      {
        title: "My Items",
        path: "/user/items",
        icon: ShoppingBag,
      },
      {
        title: "Add New Item",
        path: "/user/items/new",
        icon: PlusCircle,
      },
      {
        title: "Browse Items",
        path: "/user/browse",
        icon: Layers,
      },
      {
        title: "Saved Items",
        path: "/user/saved",
        icon: Bookmark,
      },
    ],
  },
  {
    type: "group",
    title: "Account",
    children: [
      {
        title: "Profile",
        path: "/user/profile",
        icon: User,
      },
      {
        title: "Verification",
        path: "/user/verification",
        icon: FileCheck,
      },
      {
        title: "Notifications",
        path: "/user/notifications",
        icon: Bell,
      },
    ],
  },
];

