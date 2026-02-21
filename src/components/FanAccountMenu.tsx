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
  previewMode?: boolean;
};

const FanAccountMenu = ({ onOpenAuth, align = "end", previewMode = false }: FanAccountMenuProps) => {
  const { fan, logoutFan } = useFanAuth();
  const effectiveFan = previewMode ? null : fan;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="group flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full bg-transparent hover:bg-transparent transition-none text-sm font-medium"
        >
          {effectiveFan?.avatar ? (
            <Avatar className="h-5 w-5 border border-sky-400/50">
              <AvatarImage src={effectiveFan.avatar} alt={effectiveFan.displayName || effectiveFan.email} />
              <AvatarFallback className="bg-sky-500/25 text-sky-100">
                {(effectiveFan.displayName || effectiveFan.email || "F").slice(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ) : (
            <User className="h-4 w-4 text-sky-400 transition-colors group-hover:text-cyan-300 group-focus-visible:text-cyan-300" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-56 border-white/15 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
        {effectiveFan ? (
          <>
            <DropdownMenuLabel className="px-2 py-1.5 text-xs text-muted-foreground">
              {effectiveFan.displayName || effectiveFan.email}
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
          previewMode ? (
            <DropdownMenuItem
              className="group cursor-default hover:bg-sky-500/10 focus:bg-sky-500/10 data-[highlighted]:bg-sky-500/10"
              onSelect={(e) => e.preventDefault()}
            >
              <LogIn className="mr-2 h-4 w-4 text-sky-400 transition-colors group-hover:text-cyan-300 group-focus:text-cyan-300 group-data-[highlighted]:text-cyan-300" />
              <span className="bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent transition-all group-hover:from-sky-300 group-hover:to-cyan-300 group-focus:from-sky-300 group-focus:to-cyan-300 group-data-[highlighted]:from-sky-300 group-data-[highlighted]:to-cyan-300">
                Log in or Register (Demo)
              </span>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              className="group hover:bg-sky-500/10 focus:bg-sky-500/10 data-[highlighted]:bg-sky-500/10"
              onClick={onOpenAuth}
            >
              <LogIn className="mr-2 h-4 w-4 text-sky-400 transition-colors group-hover:text-cyan-300 group-focus:text-cyan-300 group-data-[highlighted]:text-cyan-300" />
              <span className="bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent transition-all group-hover:from-sky-300 group-hover:to-cyan-300 group-focus:from-sky-300 group-focus:to-cyan-300 group-data-[highlighted]:from-sky-300 group-data-[highlighted]:to-cyan-300">
                Log in or Register
              </span>
            </DropdownMenuItem>
          )
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FanAccountMenu;
