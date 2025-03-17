
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserCircle, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AccountButton = () => {
  const { isLoggedIn, userEmail, userName, logout } = useAuth();

  if (!isLoggedIn) {
    return (
      <Button variant="outline" size="sm" asChild>
        <Link to="/login">
          <UserCircle className="mr-2 h-4 w-4" /> 
          Login
        </Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <UserCircle className="mr-2 h-4 w-4" />
          {userName || userEmail}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AccountButton;
