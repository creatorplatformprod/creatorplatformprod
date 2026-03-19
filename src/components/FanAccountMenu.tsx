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
  darkTheme?: boolean;
};

const FanAccountMenu = ({ onOpenAuth, align = "end", previewMode = false, darkTheme = false }: FanAccountMenuProps) => {
  const { fan, logoutFan } = useFanAuth();
  const effectiveFan = previewMode ? null : fan;
  const menuFocusClass =
    "focus:bg-gradient-to-r focus:from-indigo-500 focus:to-sky-500 focus:text-white data-[highlighted]:bg-gradient-to-r data-[highlighted]:from-indigo-500 data-[highlighted]:to-sky-500 data-[highlighted]:text-white";
  const authIconClass = darkTheme
    ? "text-indigo-500 group-hover:text-indigo-400 group-focus-visible:text-indigo-400"
    : "text-indigo-500 group-hover:text-indigo-400 group-focus-visible:text-indigo-400";
  const authItemIconClass = darkTheme
    ? "text-indigo-500 group-hover:text-indigo-400 group-focus:text-indigo-400 group-data-[highlighted]:text-indigo-400"
    : "text-indigo-500 group-hover:text-indigo-400 group-focus:text-indigo-400 group-data-[highlighted]:text-indigo-400";
  const authTextClass = darkTheme
    ? "text-indigo-500 transition-all group-hover:text-indigo-400 group-focus:text-indigo-400 group-data-[highlighted]:text-indigo-400"
    : "text-indigo-500 transition-all group-hover:text-indigo-400 group-focus:text-indigo-400 group-data-[highlighted]:text-indigo-400";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`group w-9 h-9 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-200 border text-sm font-medium outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
            darkTheme
              ? "bg-slate-900/70 border-slate-700/70 hover:bg-indigo-500/15 hover:border-indigo-400/35"
              : "bg-secondary/70 border-border hover:bg-indigo-500/10 hover:border-indigo-400/30"
          }`}
        >
          {effectiveFan?.avatar ? (
            <Avatar className="w-8 h-8 border border-indigo-400/45">
              <AvatarImage src={effectiveFan.avatar} alt={effectiveFan.displayName || effectiveFan.email} />
              <AvatarFallback className="bg-indigo-500/25 text-indigo-100">
                {(effectiveFan.displayName || effectiveFan.email || "F").slice(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ) : (
            <User className={`h-4 w-4 transition-colors ${authIconClass}`} />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        className={
          darkTheme
            ? "w-56 border-slate-700/70 bg-slate-950/95 text-slate-100 backdrop-blur supports-[backdrop-filter]:bg-slate-950/85"
            : "w-56 border-white/15 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85"
        }
      >
        {effectiveFan ? (
          <>
            <DropdownMenuLabel className="px-2 py-1.5 text-xs text-muted-foreground">
              {effectiveFan.displayName || effectiveFan.email}
            </DropdownMenuLabel>
            <DropdownMenuItem className={menuFocusClass} onClick={() => (window.location.href = "/fan/unlocks")}>
              <Unlock className="mr-2 h-4 w-4" />
              Unlocked Content
            </DropdownMenuItem>
            <DropdownMenuItem className={menuFocusClass} onClick={() => (window.location.href = "/fan/account")}>
              <Shield className="mr-2 h-4 w-4" />
              Account Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className={menuFocusClass}
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
              className={
                darkTheme
                  ? "group cursor-default bg-transparent text-slate-200 hover:bg-indigo-500/15 focus:bg-indigo-500/15 data-[highlighted]:bg-indigo-500/15"
                  : "group cursor-default hover:bg-indigo-500/10 focus:bg-indigo-500/10 data-[highlighted]:bg-indigo-500/10"
              }
              onSelect={(e) => e.preventDefault()}
            >
              <LogIn className={`mr-2 h-4 w-4 transition-colors ${authItemIconClass}`} />
              <span className={authTextClass}>
                Log in or Register (Demo)
              </span>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              className={
                darkTheme
                  ? "group bg-transparent text-slate-200 hover:bg-indigo-500/15 focus:bg-indigo-500/15 data-[highlighted]:bg-indigo-500/15"
                  : "group hover:bg-indigo-500/10 focus:bg-indigo-500/10 data-[highlighted]:bg-indigo-500/10"
              }
              onClick={onOpenAuth}
            >
              <LogIn className={`mr-2 h-4 w-4 transition-colors ${authItemIconClass}`} />
              <span className={authTextClass}>
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
