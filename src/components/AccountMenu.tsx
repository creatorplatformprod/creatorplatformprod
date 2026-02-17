import {
  BarChart3,
  Copy,
  Globe,
  Image,
  LayoutDashboard,
  Lock,
  LogOut,
  MessageSquare,
  Settings,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
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
  const publicPath = `/public/${currentUser?.username || ""}`;
  const previewPath = currentUser?.username
    ? `/preview/${currentUser.username}`
    : "/dashboard";
  const skyUserColor = "#6366f1";

  const copyPublicLink = async () => {
    if (!currentUser?.username || typeof window === "undefined") return;
    const url = `${window.location.origin}${publicPath}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // no-op
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="group w-9 h-9 rounded-full bg-secondary/70 hover:bg-indigo-500/10 flex items-center justify-center transition-all duration-200 border border-border hover:border-indigo-400/30">
          {currentUser?.avatar ? (
            <Avatar className="w-8 h-8 border border-indigo-400/45">
              <AvatarImage
                src={currentUser.avatar}
                alt={currentUser.displayName || currentUser.username || "User"}
              />
              <AvatarFallback className="bg-indigo-500/30 text-indigo-100">
                {(currentUser.displayName || currentUser.username || "U")
                  .slice(0, 1)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ) : (
            <User className="w-4 h-4 text-indigo-400 transition-colors group-hover:text-indigo-300 group-focus:text-indigo-300" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-60">
        {currentUser ? (
          <>
            <DropdownMenuLabel className="text-xs text-muted-foreground px-2 py-1.5">
              {currentUser.displayName || currentUser.username}
            </DropdownMenuLabel>
            <DropdownMenuItem onClick={() => (window.location.href = "/dashboard")}>
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => (window.location.href = `${previewPath}`)}>
              <User className="w-4 h-4 mr-2" />
              Preview Mode
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                (window.location.href = publicPath)
              }
            >
              <Globe className="w-4 h-4 mr-2" />
              Public Website
            </DropdownMenuItem>
            <DropdownMenuItem onClick={copyPublicLink}>
              <Copy className="w-4 h-4 mr-2" />
              Copy Public Link
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => (window.location.href = "/dashboard?tab=collections")}>
              <Image className="w-4 h-4 mr-2" />
              Collections
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => (window.location.href = "/dashboard?tab=status-cards")}>
              <MessageSquare className="w-4 h-4 mr-2" />
              Post Cards
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => (window.location.href = "/dashboard?tab=unlock")}>
              <Lock className="w-4 h-4 mr-2" />
              Unlock Everything
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => (window.location.href = "/dashboard?tab=analytics")}>
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => (window.location.href = "/dashboard?tab=profile")}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
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
