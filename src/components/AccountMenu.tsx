import { LayoutDashboard, LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface AccountMenuProps {
  currentUser?: {
    username?: string;
    displayName?: string;
    avatar?: string;
  } | null;
  align?: "start" | "end";
}

const AccountMenu = ({ currentUser, align = "end" }: AccountMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-9 h-9 rounded-full bg-secondary/70 hover:bg-secondary flex items-center justify-center transition-all duration-200 border border-border">
          {currentUser?.avatar ? (
            <Avatar className="w-8 h-8">
              <AvatarImage
                src={currentUser.avatar}
                alt={currentUser.displayName || currentUser.username || "User"}
              />
              <AvatarFallback>
                {(currentUser.displayName || currentUser.username || "U")
                  .slice(0, 1)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ) : (
            <User className="w-4 h-4 text-foreground" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-48">
        {currentUser ? (
          <>
            <DropdownMenuItem onClick={() => (window.location.href = "/dashboard")}>
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                (window.location.href = `/${currentUser.username || ""}`)
              }
            >
              <User className="w-4 h-4 mr-2" />
              Public Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/";
              }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem onClick={() => (window.location.href = "/")}>
            <User className="w-4 h-4 mr-2" />
            Creator Login
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AccountMenu;
