import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "./ui/dropdown-menu";
import Link from "next/link";
import React from "react";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { signOut } from "@/lib/actions/auth.action";
import GitHubIcon from "@mui/icons-material/GitHub";
import LogoutIcon from "@mui/icons-material/Logout";

const DropDownMenu = async () => {
  const user = await getCurrentUser();
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>My Account</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{user?.name || "User"}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link href="/profile">Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            GitHub repo
            <Link
              href="https://github.com/joyehuang/interview-prep"
              target="_blank"
              className="flex justify-end"
            >
              <GitHubIcon className="ml-auto" fontSize="small" />
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={signOut}>
            Logout
            <LogoutIcon className="ml-auto" fontSize="small" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DropDownMenu;
