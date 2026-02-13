import { LogIn, LogOut, Shield, Unlock, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useFanAuth } from "@/contexts/FanAuthContext";

type FanAccountMenuProps = {
  onOpenAuth: () => void;
  align?: "start" | "end";
};

const FanAccountMenu = ({ onOpenAuth, align = "end" }: FanAccountMenuProps) => {
  const { fan, logoutFan } = useFanAuth();
  const roseColor = "#db2777";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-transparent hover:bg-rose-500/10 transition-colors duration-200 text-sm font-medium"
          style={{ color: roseColor }}
        >
          {fan?.avatar ? (
            <Avatar className="h-5 w-5 border border-rose-400/40">
              <AvatarImage src={fan.avatar} alt={fan.displayName || fan.email} />
              <AvatarFallback>
                {(fan.displayName || fan.email || "F").slice(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ) : (
            <User className="h-4 w-4" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-56 border-rose-500/20 bg-[#111826]">
        {fan ? (
          <>
            <DropdownMenuLabel className="px-2 py-1.5 text-xs text-muted-foreground">
              {fan.displayName || fan.email}
            </DropdownMenuLabel>
            <DropdownMenuItem className="hover:bg-rose-500/10 focus:bg-rose-500/10" onClick={() => (window.location.href = "/fan/unlocks")}>
              <Unlock className="mr-2 h-4 w-4" />
              Unlocked Content
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-rose-500/10 focus:bg-rose-500/10" onClick={() => (window.location.href = "/fan/account")}>
              <Shield className="mr-2 h-4 w-4" />
              Account Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="hover:bg-rose-500/10 focus:bg-rose-500/10 text-rose-300 focus:text-rose-200"
              onClick={() => {
                logoutFan();
                window.location.reload();
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem className="hover:bg-rose-500/10 focus:bg-rose-500/10" onClick={onOpenAuth}>
            <LogIn className="mr-2 h-4 w-4" />
            Log in or Register
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FanAccountMenu;
