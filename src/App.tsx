import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import CreatorDashboard from "./pages/CreatorDashboard";
import CreatorProfile from "./pages/CreatorProfile";
import PublicWebsitePreview from "./pages/PublicWebsitePreview";
import PublicWebsiteUnavailable from "./pages/PublicWebsiteUnavailable";
import Index from "./pages/Index";
import PostDetail from "./pages/PostDetail";
import PostDetailBlurred from "./pages/PostDetailBlurred";
import NotFound from "./pages/NotFound";
import Collections from "./pages/Collections";
import Collections1849929295832448 from "./pages/Collections1849929295832448";
import CheckoutPage from "./pages/CheckoutPage";
import TipCheckoutPage from "./pages/TipCheckoutPage";
import AuthCallback from "./pages/AuthCallback";
import Pricing from "./pages/Pricing";
import RecoverAccess from "./pages/RecoverAccess";
import FanAuthCallback from "./pages/FanAuthCallback";
import FanAccount from "./pages/FanAccount";
import FanUnlocks from "./pages/FanUnlocks";
import { FanAuthProvider } from "./contexts/FanAuthContext";
import RouteSeoManager from "./components/RouteSeoManager";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" enableSystem={false}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <FanAuthProvider>
          <BrowserRouter>
            <RouteSeoManager />
            <Routes>
            {/* Landing Page - must be first */}
            <Route path="/" element={<Landing />} />
            <Route path="/pricing" element={<Pricing />} />
            
            {/* Creator Platform Routes */}
            <Route path="/dashboard" element={<CreatorDashboard />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/preview/:username" element={<PublicWebsitePreview />} />
            <Route path="/public/:username" element={<CreatorProfile />} />
            <Route path="/public-unavailable" element={<PublicWebsiteUnavailable />} />
            
            {/* Post Routes */}
            {/* Blurred uses simple ID, full access uses secure 11-digit ID */}
            <Route path="/post-blurred/:id" element={<PostDetailBlurred />} />
            <Route path="/post/:secureId" element={<PostDetail />} />
            
            {/* Collections Routes */}
            {/* Public collections page */}
            <Route path="/collections" element={<Collections />} />
            {/* Secure collections page with 11-digit secure ID */}
            <Route path="/collections/:secureId" element={<Collections1849929295832448 />} />
            
            {/* Checkout Routes */}
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/tip-checkout" element={<TipCheckoutPage />} />
            <Route path="/recover-access" element={<RecoverAccess />} />
            <Route path="/fan/auth/callback" element={<FanAuthCallback />} />
            <Route path="/fan/account" element={<FanAccount />} />
            <Route path="/fan/unlocks" element={<FanUnlocks />} />
            
            {/* Legacy Index (for existing content) */}
            <Route path="/index" element={<Index />} />

            {/* Public Creator Profile Route - must come last to catch /username */}
            <Route path="/:username" element={<CreatorProfile />} />

            {/* Fallback route for 404 */}
            <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </FanAuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
